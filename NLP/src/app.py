# Flask application
from flask import Flask, request, jsonify
import torch
import time
from src import report
from src import stats
from src import classifier
from src import models

# Start the Flask application
app = Flask(__name__)
print("running")

# Test the GPU availability
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Current device: {device}")

if torch.cuda.is_available():
    # Get GPU name and other details
    for i in range(torch.cuda.device_count()):
        print(f"Device {i}: {torch.cuda.get_device_name(i)}")
        print(f"  Memory Allocated: {torch.cuda.memory_allocated(i)} bytes")
        print(f"  Memory Cached: {torch.cuda.memory_reserved(i)} bytes")

classification_tokenizer, classification_model = models.load_classification_model(device)
QA_tokenizer, QA_model = models.load_QA_model(device)
bart_tokenizer, bart_model = models.load_bart_model(device)
legal_bert_tokenizer, legal_bert_model = models.load_legal_bert_model(device)

print("Models loadeded")

@app.route('/process-url', methods=['POST'])
def process_text():
    print("Request received")

    data = request.json['data']
    text = data['text']
    url = data['url']
    headers = data['headers']
    title = data['title']
    footer = data['footer']

    category = classifier.is_legal_document(title, headers, classification_tokenizer, classification_model, device)

    if category == "Other" or not category:
        return jsonify({"success": False, "company": None, "date": None, "category": None, "text": None})
        
    company = classifier.get_company_from_webpage(text, title, footer, QA_tokenizer, QA_model, device)
    
    date = classifier.get_effective_date(text, classification_tokenizer, classification_model, device)

    if company != None:
        company = stats.restore_case(title+" "+footer+" "+text, company)

    readability_score = stats.readability_score(text)

    print(f"Process Complete for:\n Company: {company}\n Date: {date}\n Category: {category}\n Readability: {readability_score}")

    return jsonify({"success":True, "company": company, "date": date, "category": category, "readability": readability_score})

@app.route('/generate-report', methods=['POST'])
def generate_report():
    print("Request received for generate-report")
    data = request.json['data']

    text = data['text']
    summary_length = data['userSettings']['summaryLength']
    num_sections = data['userSettings']['numberOfSections']

    start_time = time.time()

    transformers_summary = report.transformers_summary(text, legal_bert_model, legal_bert_tokenizer, device)

    print(f"Duration for transformers summary: {time.time()-start_time}")

    if report.tokens_count(transformers_summary) > 20000:
        return jsonify({
        "success":False, 
        "original_document": text, 
        "general_summary": None, 
        "section_summary": None,
        "risk_assessment": None,
        })
        
    start_time = time.time()

    # general_summary = report.general_summary(transformers_summary, summary_length)

    # section_summary = report.section_summary(transformers_summary, num_sections)

    # risk_assessment = report.risk_assessment(transformers_summary)
    
    response = report.consolidated_report(transformers_summary, summary_length, num_sections)
    
    rep = report.parse_response(response)
    
    print(f"Duration for API: {time.time()-start_time}")

    print("Done with generate report")

    return jsonify({
        "success":True, 
        "original_document": text, 
        # "general_summary": general_summary, 
        # "section_summary": section_summary,
        # "risk_assessment": risk_assessment,
        "general_summary": rep["general_summary"], 
        "section_summary": rep["section_summary"],
        "risk_assessment": rep["risk_assessment"],
        })

@app.route('/generate-sections', methods=['POST'])
def generate_sections():
    print("Request received for generate-sections")
    data = request.json['data']

    text = data['text']
    sections = data['sections']

    start_time = time.time()

    sections = report.sections_summary(sections, bart_model, bart_tokenizer, legal_bert_model, legal_bert_tokenizer, device)

    print(f"Duration for section summary: {time.time()-start_time}")

    return jsonify({
        "success":True, 
        "sections": sections
        })

@app.route('/get-QA', methods=['POST'])
def getQA():
    print("NLP received request for QA")
    data = request.json
    # data = request.json['data']
    text = data['text']
    question = data['question']

    start_qa = time.time()
    answer, score = classifier.document_QA(text, question, QA_tokenizer, QA_model, device)
    print("Qa time: ", time.time()-start_qa)

    return jsonify({
        "success":True, 
        "answer": answer,
        })

@app.route('/get-PDF-info', methods=['POST'])
def getPDFInfo():
    print("NLP received request for get-PDF-info")
    data = request.json
    text = data['text']

    info = report.pdf_info(text)

    category, company, date = stats.pdf_parse(info)
    readability_score = stats.readability_score(text)

    return jsonify({"success":True, "date":date, "company":company, "category":category, "readability": readability_score})


@app.route('/generate-reportByPDF', methods=['POST'])
def generate_reportByPDF():
    print("NLP Request received for generate-reportByPDF")
    data = request.json
    text = data.get('text')
    summary_length = data['userSettings']['summaryLength']
    num_sections = data['userSettings']['numberOfSections']
    report_speed = data['userSettings']['reportSpeed']

    transformers_summary = report.transformers_summary(text, legal_bert_model, legal_bert_tokenizer, device)
    
    if report.tokens_count(transformers_summary) > 20000:
        return jsonify({
        "success":False, 
        "original_document": text, 
        "general_summary": None,
        "section_summary": None,
        "risk_assessment": None,
        "sections": None
        })

    general_summary = report.general_summary(transformers_summary, summary_length)

    section_summary = report.section_summary(transformers_summary, num_sections)

    risk_assessment = report.risk_assessment(transformers_summary)

    print("NLP Done with generate reportByPDF")
    print("general_summary: ", general_summary)
    print("section_summary: ", section_summary)
    print("risk_assessment: ", risk_assessment)
    return jsonify({
        "success":True, 
        "original_document": text, 
        "general_summary": general_summary, 
        "section_summary": section_summary,
        "risk_assessment": risk_assessment,
        "sections": None
        })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
