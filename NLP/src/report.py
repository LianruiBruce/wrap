from src import summarize
import re
import json
import anthropic
import os

def make_request(model, system, content):
    client = anthropic.Anthropic(api_key = os.environ.get("ANTHROPIC_API_KEY"))
    
    message = client.messages.create(
        model= model,
        max_tokens=2000,
        temperature=0.0,
        system=system,
        messages=[
            {
                "role": "user",
                "content": content
            }
            ]
    )   
    return message.content[0].text

def transformers_summary(text, model, tokenizer, device):
    return summarize.transformers_summary(text, model, tokenizer, device)

def sections_summary(sections, bart_model, bart_tokenizer, bert_model, bert_tokenizer, device):
    return summarize.section_summary(sections, bart_model, bart_tokenizer, bert_model, bert_tokenizer, device)

def tokens_count(input):
    client = anthropic.Client()
    token_count = client.count_tokens(input)
    return token_count

def general_summary(input, num_words=150):
    response = make_request(
        "claude-3-5-sonnet-20240620",
        "Provide concise, clear, and legally accurate summaries.",
        f"""
        Please generate a concise and clear summary of this legal document, focusing on the most critical information for a user comprehension. Keep it at around {num_words} words.
        Format your answer as following:

        "Summary": "..."

        Document:
        {input}
        """
        )

    match = re.search(r'(?:\"[Ss]ummary\"|[Ss]ummary)\s*:\s*(?:"([^"]*)"|([^\n]+))', response, re.DOTALL)
    if match:
        return match.group(1) if match.group(1) else match.group(2).strip()
    
    return response

def section_summary(input, num_sections):
    response = make_request(
        "claude-3-5-sonnet-20240620",
        "Provide concise, clear, and legally accurate responses.",
        f"""
        Select the {num_sections} main points in this legal document, focusing specifically on key dates, relevant data, financial information, and significant legal details. Provide a short description of each point that highlights these crucial aspects for user comprehension.
        Format your answer as a JSON object as follows:
        [
            {{
                "$YOUR_SECTION_NAME_HERE": 
                {{
                    "Description": "$YOUR_DESCRIPTION_HERE"
                }}
            }},
            ...
        ]

        Document:
        {input}
        """
    )
    
    match = re.search(r'(\[.*\])', response, re.DOTALL)
    if match:
        return json.loads(match.group(1))
    
    return response

def risk_assessment(input):
    response = make_request(
        "claude-3-5-sonnet-20240620",
        "Provide concise, clear, and legally accurate responses.",
        f"""
        Analyze the following legal document for a user and solely based on the document:
        Assess and rate the Financial, Data, and Legal risks on a scale from 0 to 5, where 0 is safe (no risk) and 5 is high risk (significant risk). For each category: Financial, Data, and Legal, provide a brief explanation of the rating.
        Format your answer as a JSON object as following:
        [
            {{
                "Legal": 
                {{
                    "Score": "$YOUR_LEGAL_SCORE_ANSWER_HERE",
                    "Explanation": "$YOUR_LEGAL_EXPLANATION_HERE"
                }}
            }},
            ...
        ]
        
        Document:
        {input}
        """
    )

    match = re.search(r'(\[.*\])', response, re.DOTALL)
    if match:
        json_risk = json.loads(match.group(1))

        legal_score = float(json_risk[0]["Legal"]["Score"])
        financial_score = float(json_risk[1]["Financial"]["Score"])
        data_score = float(json_risk[2]["Data"]["Score"])

        overall_risk = ((financial_score**2 + data_score**2 + legal_score**2) / 3) ** 0.5
        overall_risk = (overall_risk * 0.7 + max(financial_score, data_score, legal_score) * 0.3)

        overall_risk_data = {
            "Overall": {
                "Score": round(overall_risk, 2),
                "Explanation": ""
            }
        }

        json_risk.append(overall_risk_data)

        return json_risk
    
    return response

def pdf_info(input):
    response = make_request(
        "claude-3-5-sonnet-20240620",
        "Provide concise, clear and direct responses.",
        f"""
        I this a 'Terms and Conditions', 'Privacy Policy', 'Contract Agreement' or a 'Cookie Policy'? Yes/No
        If Yes:
        What is the category, 'Terms and Conditions', 'Privacy Policy', 'Contract Agreement' or a 'Cookie Policy'?
        What is the name of the company referred to?  
        What is the effective Date of this document?
        
        Answer with this format:
        
        Category: ...
        Company name: ...
        Effective Date: ...
            
        {input}
        """
        )
    
    return response

def consolidated_report(input, num_words=150, num_sections=3):
    response = make_request(
        "claude-3-5-sonnet-20240620",
        "Provide concise, clear, and legally accurate responses.",
        f"""
        Please, analyze the following legal document to generate a report for a user, focusing on essential information from the end-user's perspective. 
        Provide the following outputs with the precise formatting as requested.

        1. **General Summary**:
        - Summarize the overall purpose, themes, and key points of the document.
        - Include critical information about user obligations, financial terms, privacy policies, and risks.
        - Use bullet points for clarity and limit the summary to approximately {num_words} words.
        - Avoid unnecessary technical language while preserving legal accuracy.
       
        - Strict response format:
          <<GENERAL_SUMMARY>>
          {{
            "Summary": "<Insert concise summary here>"
          }}
          <<END_GENERAL_SUMMARY>>

        2. **Section Summary**:
        - Extract and summarize the document’s main sections/clauses, focusing on:
            - Key Dates and Deadlines
            - Data Usage and Privacy
            - Financial Terms, Payments and Penalties Details
            - Significant Legal Clauses
        - Use clear, user-friendly descriptions for each point to ensure comprehension.
     
        - Strict response format (ensure proper JSON formatting):
          <<SECTION_SUMMARY>>
          [
              {{
                  "<Section Title 1>": 
                  {{
                      "Description": "<Brief description of Section 1>"
                  }}
              }},
              {{
                  "<Section Title 2>": 
                  {{
                      "Description": "<Brief description of Section 2>"
                  }}
              }},
              ...
          ]
          <<END_SECTION_SUMMARY>>

        3. **Risk Assessment**:
        - Assess the document's risks in the following categories:
            - Legal Risk
            - Financial Risk
            - Data Risk
        - Use a scale from 0 to 5 for each category (0 = no risk, 5 = high risk) and provide a clear, accurate explanation for each score.
        
        - Strict response format (ensure proper JSON formatting):
          <<RISK_ASSESSMENT>>
          [
              {{
                  "Legal": 
                  {{
                      "Score": "<Legal risk score (0-5)>",
                      "Explanation": "<Explanation of the legal risk>"
                  }}
              }},
              {{
                  "Financial": 
                  {{
                      "Score": "<Financial risk score (0-5)>",
                      "Explanation": "<Explanation of the financial risk>"
                  }}
              }},
              {{
                  "Data": 
                  {{
                      "Score": "<Data risk score (0-5)>",
                      "Explanation": "<Explanation of the data risk>"
                  }}
              }},
          ]
          <<END_RISK_ASSESSMENT>>

        Document:
        {input}
        """
    )
    
    return response 

def parse_response(response):
    # Parse the response using regex patterns
    general_summary_match = re.search(r'<<GENERAL_SUMMARY>>(.*?)<<END_GENERAL_SUMMARY>>', response, re.DOTALL).group(1).strip()
    section_summary_match = re.search(r'<<SECTION_SUMMARY>>(.*?)<<END_SECTION_SUMMARY>>', response, re.DOTALL).group(1).strip()
    risk_assessment_match = re.search(r'<<RISK_ASSESSMENT>>(.*?)<<END_RISK_ASSESSMENT>>', response, re.DOTALL).group(1).strip()
    
    # general summary
    general_summary = None
    general_summary_match = re.search(r'(?:\"[Ss]ummary\"|[Ss]ummary)\s*:\s*(?:"([^"]*)"|([^\n]+))', general_summary_match, re.DOTALL)
    if general_summary_match:
        general_summary = general_summary_match.group(1) if general_summary_match.group(1) else general_summary_match.group(2).strip()
    
    # section summary
    section_summary = None
    section_summary_match = re.search(r'(\[.*\])', section_summary_match, re.DOTALL)
    if section_summary_match:
        section_summary = json.loads(section_summary_match.group(1))

    # risk assessment
    risk_assessment = None
    risk_assessment = re.search(r'(\[.*\])', risk_assessment_match, re.DOTALL)
    # Calculate overall risk based on individual scores
    if risk_assessment:
        json_risk = json.loads(risk_assessment.group(1))

        legal_score = float(json_risk[0]["Legal"]["Score"])
        financial_score = float(json_risk[1]["Financial"]["Score"])
        data_score = float(json_risk[2]["Data"]["Score"])

        overall_risk = ((financial_score**2 + data_score**2 + legal_score**2) / 3) ** 0.5
        overall_risk = (overall_risk * 0.7 + max(financial_score, data_score, legal_score) * 0.3)

        overall_risk_data = {
            "Overall": {
                "Score": round(overall_risk, 2),
                "Explanation": ""
            }
        }

        json_risk.append(overall_risk_data)

    return {
        "general_summary": general_summary,
        "section_summary": section_summary,
        "risk_assessment": json_risk
    }