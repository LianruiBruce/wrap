# Wrap - Legal Document Detection and Reporting Extension
## Overview
    Wrap is a Chrome extension designed to automatically detect legal documents, such as Terms and Conditions, Privacy Policies, 
    Contract Agreements, and Cookie Policies on web pages. It generates reports summarizing the key legal details and saves them 
    directly into the database. Users can manually upload documents or scan web pages for legal content.

## Features
### Automatic Save to Database: 
    Automatically saves detected legal documents to the database.
### Automatic Legal Document Detection: 
    Refreshn or open the webpage after open extension to automatically scans web pages for legal documents using DOM keywords.
### Automatic Report Generation: 
    After refresh the webpage and a document is detected, a report is generated and saved. (should login first)
### Detect Specific Legal Documents: Supports detection of:
    Terms and Conditions
    Privacy Policies
    Contract Agreements
    Cookie Policies
### Manual Upload Option: 
    Users can upload their own documents for analysis and reporting.
### Issue Reporting: 
    Easily report issues or bugs encountered during use, with an option to attach files and provide descriptions.

## How to Use
### 1. Scan a Web Page for Legal Documents
    1) Automatically scan webpage and detect legal document
        Open the extension before visit webpage
        Open a legal document webpage and extension will auto-scan the page and detect
        Or refresh the webpage after open the extension
    2) Mamualk scan webpage
        Upon visiting a webpage, open the Wrap extension.
        Click the Scan Page button to search for legal documents on the page.

    If no document is found, you'll see a message saying No Document Detected.
    If a legal document is found, a notification popup and you'll see a summary report, including:
        Company name
        Document category (e.g., Terms and Conditions)
        Date of the document
        A button to view the full report.
### 2. Manually Upload a Document
    Click the Manual Upload button to upload a document from your computer.
    The uploaded document will be processed, and a report will be generated.
### 3. Report an Issue
    If you encounter a problem, click the Report an Issue button.
    A form will appear where you can:
        Provide a detailed description of the issue.
        Attach a file to showcase the problem (optional).
        Enter your email address for follow-up.
        Click Submit to send your issue report.
### 4. Settings
    You can customize Wrap's behavior by accessing the Settings menu (gear icon in the top left). Available options include:
        Toggle automatic saving of detected documents.
        Enable or disable the detection of specific document types (e.g., Privacy Policies, Terms and Conditions).

## Installation

## License


