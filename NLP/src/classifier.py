import json
from src import stats
import torch
from datetime import datetime
from src import parseDocument
import torch.nn.functional as F

def is_legal_document(title, headers, tokenizer, model, device):
    labels = ["a Terms and Conditions", "a Privacy Policy", "a Contract Agreement", "a Cookie Policy", "not a Legal Document"]
    
    try:
        entailment_scores = []
        for label in labels:
            pair = [[title + headers, f"This text is {label}."]]
            inputs = tokenizer(pair, padding=True, return_tensors="pt", truncation=True, max_length=512)
            inputs = {k: v.to(device) for k, v in inputs.items()}

            with torch.no_grad():
                outputs = model(**inputs)
                predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

                entailment_score = predictions[:, 2]
                entailment_scores.append(entailment_score.item())
        
        if not entailment_scores:
            return None

        predicted_category_index = torch.tensor(entailment_scores, device=device).argmax().item()
        predicted_category = labels[predicted_category_index]

        if predicted_category not in labels:
            return None

        return predicted_category[2:]

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def validate_company_name(name):
    if not name or not isinstance(name, str) or not name.strip():
        return False
    
    name = name.strip()
    name_tokens = name.split()

    if len(name_tokens) < 1:
        return False

    # Company names should not be over 5 tokens
    if len(name_tokens) > 5:
        return False
    
    return True

def get_company_from_webpage(content, title, footer, tokenizer, model, device):
    try:
        footer = stats.process_footer(footer)  # Assuming stats.process_footer exists
        question = "What is the company this document referred to?"
        valid_answer = False
        final_answer = None
        
        # Tokenize the content into manageable chunks
        chunks = parseDocument.chunk_text(content, tokenizer, 256)
        
        for chunk in chunks:
            # Convert token chunk back to string
            if title and footer:
                context = f"{title}\n{footer}\n{chunk}"
            elif title:
                context = f"{title}\n{chunk}"
            elif footer:
                context = f"{footer}\n{chunk}"
            else:
                context = chunk
            
            # Construct the prompt
            prompt = f"""### Analyze the following document and answer: {question}\n\n### Document:\n{context}\n\n"""
            
            # Prepare the inputs for the model
            inputs = tokenizer(prompt, return_tensors="pt").to(device)
            
            # Generate the output
            outputs = model.generate(
                inputs["input_ids"], 
                return_dict_in_generate=True, 
                output_scores=True
            )
            
            # Decode the generated output
            decoded_output = tokenizer.decode(outputs.sequences[0], skip_special_tokens=True)
            
            # Calculate confidence scores for the output
            scores = outputs.scores
            token_probs = [F.softmax(score, dim=-1) for score in scores]
            output_tokens = outputs.sequences[0]
            
            confidences = []
            for i, token in enumerate(output_tokens[1:]):  # Skip the initial <pad> token
                token_id = token.item()
                confidence = token_probs[i][0, token_id].item()
                confidences.append(confidence)
            
            # Average confidence
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
            
            # Validate the answer
            if validate_company_name(decoded_output) and avg_confidence > 0.7:  # Threshold for confidence
                final_answer = decoded_output.title().strip()
                valid_answer = True
                break  # Stop once we have a valid answer
        
        if not valid_answer:
            return None
        
        return final_answer
    
    except Exception as e:
        print(f"Error occurred in get_company_from_webpage: {e}")
        return None

def get_effective_date(text, tokenizer, model, device):
    dates = stats.find_all_dates(text)

    if not dates or len(dates) == 0:
        return "N/A"

    dates = [datetime.strptime(date, '%Y-%m-%d') for date in dates]

    entailment_scores = []
    
    for date in dates:

        pair = [[text, f"The effective date for this terms is {date}."]]
        inputs = tokenizer(pair, padding=True, return_tensors="pt", truncation=True, max_length=512)
        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

            entailment_score = predictions[:, 2] 
            entailment_scores.append(entailment_score.item())
    
    effective_date_index = torch.tensor(entailment_scores, device=device).argmax().item()
    effective_date = dates[effective_date_index]

    formatted_date = effective_date.strftime('%B %d, %Y')
    return formatted_date

def chunk_text(text, tokenizer, max_seq_len=512, doc_stride=256):
    inputs = tokenizer(text, return_offsets_mapping=True, max_length=max_seq_len, stride=doc_stride, truncation=True, padding=True, return_overflowing_tokens=True)
    chunks = []
    
    for i in range(len(inputs['input_ids'])):
        chunks.append({
            'input_ids': inputs['input_ids'][i],
            'attention_mask': inputs['attention_mask'][i],
            'offset_mapping': inputs['offset_mapping'][i]
        })
    
    return chunks

def document_QA(text, question, tokenizer, model, device, threshold=0.7, batch_size=1):
    try:
        # Parse and combine the text content
        text = json.loads(text)
        content_list = [t['content'] for t in text]
        full_text = '\n'.join(content_list)
        
        # Split the text into chunks manageable by the model
        chunks = parseDocument.chunk_text(full_text, tokenizer, 512)
        
        best_answer = "None"
        best_confidence = 0
        
        # Batch processing
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i + batch_size]
            
            # Prepare the batch of prompts
            prompts = [
                f"""### Analyze the document and answer: \n\n {question}, if no answer found return "None". \n\n### Document:\n{chunk}\n\n"""
                for chunk in batch
            ]
            
            # Tokenize the batch of prompts
            inputs = tokenizer(prompts, return_tensors="pt", padding=True, truncation=True).to(device)
            
            # Generate outputs for the batch
            outputs = model.generate(
                inputs["input_ids"], 
                return_dict_in_generate=True, 
                output_scores=True
            )
            
            # Process each output in the batch
            for idx, sequence in enumerate(outputs.sequences):
                # Decode the generated answer
                decoded_output = tokenizer.decode(sequence, skip_special_tokens=True)
                
                # Calculate confidence scores
                scores = outputs.scores
                token_probs = [F.softmax(score, dim=-1) for score in scores]
                output_tokens = sequence
                
                confidences = []
                for i, token_id in enumerate(output_tokens[1:]):  # Skip the initial <pad> token
                    if i < len(scores):  # Ensure alignment
                        confidence = token_probs[i][0, token_id].item()
                        confidences.append(confidence)
                
                avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
                
                # Update the best answer if confidence is higher and meets the threshold
                if avg_confidence > best_confidence and avg_confidence >= threshold and decoded_output.strip() and "None" not in decoded_output:
                    best_answer = decoded_output.strip()
                    best_confidence = avg_confidence
        
        # If no valid answer was found, return "No Answer Found"
        if best_answer == "None":
            return "No Answer Found"
        
        return best_answer

    except Exception as e:
        print(f"Error in document_QA: {e}")
        return "No Answer Found"
