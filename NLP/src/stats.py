from datetime import datetime
import re
from dateutil.parser import parse
from readability import Readability


legal_terms = [
    "terms",
    "privacy",
    "policy",
    "agreement",
    "contract",
    "disclaimer",
    "license",
    "statement",
    "disclaimer",
    "notice",
    "compliance",
   "obligations",
    "indemnification"
]

legal_document_categories = [
    "Terms of Service",
    "Privacy Policy",
    "Cookie Policy",
    "End User License Agreement (EULA)",
    "Copyright Notice",
    # "Data Protection and Compliance Documents",
    "Contract Agreement",
]


def contains_legal_terms(text):
    for term in legal_terms:
        if term.lower() in text.lower():
            return True
    return False

def process_footer(footer):
    #substitute © with 'Company: '
    footer = re.sub(r'©', 'Company: ', footer)

    #remove all years
    footer = re.sub(r'\b(19|20)\d{2}\b', '', footer)

    return footer

def find_all_dates(text):
    date_pattern = r'\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4})|' \
                   r'(?:\d{2,4}[-/]\d{1,2}[-/]\d{1,2})|' \
                   r'(?:[A-Za-z]+ \d{1,2}, \d{4})|' \
                   r'(?:\d{1,2} [A-Za-z]+, \d{4})|' \
                   r'(?:\d{1,2} [A-Za-z]+ \d{4})\b'
    
    matches = re.findall(date_pattern, text)
    
    valid_dates = []
    for date_str in matches:
        try:
            date_obj = parse(date_str, fuzzy=True)
            valid_dates.append(date_obj.strftime('%Y-%m-%d'))
        except ValueError:
            continue
    
    return valid_dates

def split_into_chunks(text, max_words=300):
    lines = text.split('\n')
    chunks = []
    current_chunk = []
    current_word_count = 0

    for line in lines:
        sentences = re.split(r'(?<=[.!?])\s+', line)
        for sentence in sentences:
            if len(sentence.split()) < 5:
                continue

            sentence_word_count = len(sentence.split())

            if current_word_count + sentence_word_count > max_words:
                if current_chunk:
                    chunks.append(' '.join(current_chunk))
                current_chunk = [sentence]
                current_word_count = sentence_word_count
            else:
                current_chunk.append(sentence)
                current_word_count += sentence_word_count

    if current_chunk:
        chunks.append(' '.join(current_chunk))

    return chunks

def readability_score(text):
    scores = {
        "Flesch Kincaid": [],
        "Gunning": [],
        "Coleman": [],
        "Dale": [],
    }

    chunks = split_into_chunks(text)

    for chunk in chunks:
        r = Readability(chunk)
        try:
            scores["Flesch Kincaid"].append(r.flesch_kincaid().score)
        except:
            pass
        try:
            scores["Gunning"].append(r.gunning_fog().score)
        except:
            pass
        try:
            scores["Coleman"].append(r.coleman_liau().score)
        except:
            pass
        try:
            scores["Dale"].append(r.dale_chall().score)
        except:
            pass
        try:
            scores["SMOG"].append(r.smog().score)
        except:
            pass

    avg_scores = {
        "Flesch Kincaid": sum(scores["Flesch Kincaid"]) / len(scores["Flesch Kincaid"]) if scores["Flesch Kincaid"] else 0,
        "Gunning": sum(scores["Gunning"]) / len(scores["Gunning"]) if scores["Gunning"] else 0,
        "Coleman": sum(scores["Coleman"]) / len(scores["Coleman"]) if scores["Coleman"] else 0,
        "Dale": sum(scores["Dale"]) / len(scores["Dale"]) if scores["Dale"] else 0,
    }

    overall_score = sum(avg_scores.values()) / len(avg_scores)
    return overall_score

def restore_case(original_text, predicted_name):
    lower_text = original_text.lower()

    escaped_name = re.escape(predicted_name.lower())

    match = re.search(escaped_name, lower_text)

    if match:
        start, end = match.start(), match.end()
        return original_text[start:end]
    else:
        return predicted_name.title()
    
def pdf_parse(text):
    category_match = re.search(r"Category:\s*(.+)", text)
    company_match = re.search(r"Company name:\s*(.+)", text)
    date_match = re.search(r"Effective Date:\s*(.+)", text)

    category = category_match.group(1) if category_match else None
    company = company_match.group(1) if company_match else None
    date_str = date_match.group(1) if date_match else None

    # Process Company Name

    if company:
        company = company.lower()
        company = re.sub(r'\b(?:inc|ltd|llc|corp)\b', '', company, flags=re.IGNORECASE)
        company = re.sub(r'^\W+|\W+$', '', company)
        company = re.sub(' +', ' ', company)

    # Convert the date to datetime
    date = None
    if date_str:
        try:
            date_obj = datetime.strptime(date_str, "%B %d, %Y")
            date = date_obj.strftime("%B %d, %Y")
        except ValueError:
            date = date_str

    return category, company.title(), date