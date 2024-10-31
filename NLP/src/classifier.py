import json
from src import stats
import torch
from datetime import datetime
from transformers import pipeline

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
        footer = stats.process_footer(footer)
        question = "What Company is this document referred to?"

        valid_answer = False

        # Tokenize the text to get tokens
        tokens = tokenizer.tokenize(content)
        token_chunks = [tokens[i:i + 256] for i in range(0, len(tokens), 256)]

        for token_chunk in token_chunks:
            # Decode the chunk back to string format
            text_chunk = tokenizer.convert_tokens_to_string(token_chunk)
            if title and footer:
                context = f"Title: {title}\nFooter: {footer}\nContent: {text_chunk}"
            elif title:
                context = f"Title: {title}\nContent: {text_chunk}"
            elif footer:
                context = f"Footer: {footer}\nContent: {text_chunk}"
            else:
                context = f"{text_chunk}"

            nlp = pipeline('question-answering', model=model, tokenizer=tokenizer, device=device)
            QA_input = {
                'question': question,
                'context': f"{context}"
            }
            res = nlp(QA_input)
            answer = res['answer']
            
            if validate_company_name(answer):
                valid_answer = True
                break
        
        if not valid_answer:
            return None

        return answer.title().strip()
    
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

def document_QA(text, question, tokenizer, model, device, threshold=0.1):
    text = json.loads(text)
    content_list = [t['content'] for t in text]
    text = '\n'.join(content_list)

    pipe = pipeline("question-answering", model=model, tokenizer=tokenizer, device=device)

    chunks = chunk_text(text, tokenizer)

    best_answer = None
    best_score = 0
    
    for chunk in chunks:
        c = tokenizer.decode(chunk['input_ids'], skip_special_tokens=True)
        
        result = pipe(question=question, context=c)
        
        # print(f"{result['answer']}: {result["score"]}")
              
        if result['score'] > best_score and result['score'] > threshold and result['answer']:
            best_answer = result['answer']
            best_score = result['score']

    if best_answer:
        return best_answer, best_score
    else:
        return "No answer found", 0