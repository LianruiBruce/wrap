import torch
import json
import re
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from src.parseDocument import chunk_text

def custom_sentence_tokenize(text):
    sentences = re.split(r'(?<=[.!?])\s+|\n', text)
    sentences = [
        (sentence[0].upper() + sentence[1:]) if sentence else sentence
        for sentence in sentences
    ]
    return sentences

def summarize_with_legalprobert(text, model, tokenizer, device, summary_ratio=0.2, score_threshold=0.3):
    sentences = custom_sentence_tokenize(text)

    batch_size = 12 
    embeddings = []

    with torch.no_grad():
        for i in range(0, len(sentences), batch_size):
            batch_sentences = sentences[i:i + batch_size]
            
            inputs = tokenizer(batch_sentences, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)
            
            with torch.amp.autocast(device_type='cuda'):
                outputs = model(**inputs)
            
            sentence_embeddings = outputs.last_hidden_state.mean(dim=1).cpu().numpy()
            embeddings.append(sentence_embeddings)

    embeddings = np.vstack(embeddings)

    similarity_matrix = cosine_similarity(embeddings, embeddings)
    scores = similarity_matrix.mean(axis=1)

    target_length = int(len(sentences) * summary_ratio)
    if target_length < 1:
        target_length = 1  # Ensure at least one sentence is selected

    high_score_indices = np.where(scores > score_threshold * scores.max())[0]

    if len(high_score_indices) < target_length:
        high_score_indices = np.argsort(scores)[-target_length:]

    selected_indices = sorted(high_score_indices[:target_length])
    summary_sentences = [sentences[idx] for idx in selected_indices]

    summary = ' '.join(summary_sentences)

    return summary

def transformers_summary(text, model, tokenizer, device):
    chunks = chunk_text(text, tokenizer, 512)
    combined_summary=""
    
    for chunk in chunks:
        combined_summary += summarize_with_legalprobert(chunk, model, tokenizer, device, summary_ratio=0.5, score_threshold=0.5)

    return combined_summary

# ------------------------------------------------------------------------------------
def select_most_relevant_sentences(text, tokenizer, model, device, max_tokens=512):
    """Extract the most relevant sentences using BERT embeddings."""
    sentences = custom_sentence_tokenize(text)  # Split content into sentences
    embeddings = []

    with torch.no_grad():
        for i in range(0, len(sentences), 12):  # Process in batches of 12
            batch = sentences[i:i + 12]
            inputs = tokenizer(batch, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)
            outputs = model(**inputs)
            embeddings.append(outputs.last_hidden_state.mean(dim=1).cpu().numpy())

    embeddings = np.vstack(embeddings)
    similarity_matrix = cosine_similarity(embeddings, embeddings)
    scores = similarity_matrix.mean(axis=1)  # Compute relevance scores
    sorted_indices = np.argsort(-scores)  # Sort by relevance in descending order

    selected_sentences = []
    total_tokens = 0

    # Select the most relevant sentences that fit within the token limit
    for idx in sorted_indices:
        sentence = sentences[idx]
        num_tokens = len(tokenizer(sentence, return_tensors="pt").input_ids[0])
        if total_tokens + num_tokens > max_tokens:
            break
        selected_sentences.append(sentence)
        total_tokens += num_tokens

    return ' '.join(selected_sentences)

def preprocess_section(content, bart_tokenizer, bert_model, bert_tokenizer, device, chunk_size=512):
    """Preprocess section: Return only summarized or empty content."""
    if not content.strip():  # If content is empty, return empty string
        return ""

    num_words = len(content.split())  # Count words

    # If content is too short, return an empty string
    if num_words < 100:
        return ""

    num_tokens = len(bart_tokenizer(content, return_tensors="pt", truncation=True).input_ids[0])

    # If small enough for BART, return content as-is for summarization
    if num_tokens <= chunk_size:
        return content

    # If too large, filter with BERT and return relevant sentences
    return select_most_relevant_sentences(content, bert_tokenizer, bert_model, device, max_tokens=chunk_size)

def summarize_batch(batch_texts, bart_model, bart_tokenizer, device, max_length=96, min_length=32):
    """Summarize a batch using BART."""
    inputs = bart_tokenizer(batch_texts, return_tensors='pt', truncation=True, padding=True).to(device)

    with torch.no_grad():
        with torch.amp.autocast(device_type='cuda'):
            summary_ids = bart_model.generate(
                inputs['input_ids'], num_beams=4, max_length=max_length, 
                min_length=min_length, early_stopping=True
            )

    return [bart_tokenizer.decode(s_id, skip_special_tokens=True) for s_id in summary_ids]

def section_summary(sections, bart_model, bart_tokenizer, bert_model, bert_tokenizer, 
                    device, chunk_size=512, batch_size=12, max_length=96, min_length=32):
    """Summarize sections: Only keep summaries, otherwise use empty strings."""
    #sections = json.loads(sections)  # Load JSON input
    preprocessed_sections = []

    # Preprocess each section's content
    for section in sections:
        content = section['content']
        if content and len(content.split()) >= 100:  # Process only if content is large enough
            preprocessed_content = preprocess_section(content, bart_tokenizer, bert_model, bert_tokenizer, device, chunk_size)
            preprocessed_sections.append(preprocessed_content)
        else:
            section['content'] = ""  # Set content to empty if not processed

    # Summarize in batches if necessary
    all_summaries = []
    for i in range(0, len(preprocessed_sections), batch_size):
        batch = preprocessed_sections[i:i + batch_size]
        all_summaries.extend(summarize_batch(batch, bart_model, bart_tokenizer, device, max_length, min_length))

    # Replace original content with summaries where applicable
    summary_index = 0
    for section in sections:
        if section['content']:  # Only replace if it was processed
            section['content'] = all_summaries[summary_index]
            summary_index += 1

    return sections
