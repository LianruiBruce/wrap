from transformers import AutoModelForQuestionAnswering, BartForConditionalGeneration, AutoModelForSequenceClassification
from transformers import AutoModel, AutoTokenizer

def load_classification_model(device):
    bart_tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-mnli")
    bart_model = AutoModelForSequenceClassification.from_pretrained("facebook/bart-large-mnli").to(device)
    bart_model.eval()  
    bart_model.to(device)

    return bart_tokenizer, bart_model

def load_QA_model(device):
    tokenizer = AutoTokenizer.from_pretrained("deepset/roberta-base-squad2")
    model = AutoModelForQuestionAnswering.from_pretrained("deepset/roberta-base-squad2")
    model.eval()
    model.to(device)

    return tokenizer, model

def load_bart_model(device):
    tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
    model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
    model.eval()  
    model.to(device)

    return tokenizer, model

def load_legal_bert_model(device):
    tokenizer = AutoTokenizer.from_pretrained("AmitTewari/LegalPro-BERT-base")
    model = AutoModel.from_pretrained("AmitTewari/LegalPro-BERT-base")
    model.eval()  
    model.to(device)

    return tokenizer, model

# https://deepinfra.com/nlpaueb/legal-bert-base-uncased
# https://aclanthology.org/2021.findings-emnlp.164/
# https://www.atticusprojectai.org/cuad