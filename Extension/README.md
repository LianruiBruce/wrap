# Wrap - Legal Document Detection and Reporting Extension

## Overview
**Wrap** is a Chrome extension that automatically detects legal documents, such as Terms and Conditions, Privacy Policies, Contract Agreements, and Cookie Policies on web pages. It generates reports summarizing key legal details and saves them directly into the database. Users must log in before using the extension. The extension also supports manual document uploads and issue reporting.

---

## Features

### 1. Automatic Detection and Reporting
- **Automatic Legal Document Detection:**
  - Detects legal documents on web pages using DOM keywords.
  - Activate by visiting or refreshing a webpage after enabling the extension.
- **Automatic Report Generation:**
  - Once a legal document is detected, a report is generated and saved automatically.
  - Notifications include the company name, document type, document date, and a button to view the full report.
- **Supported Document Types:**
  - Terms and Conditions
  - Privacy Policies
  - Contract Agreements
  - Cookie Policies
  - All of the above

### 2. Manual Scanning and Uploads
- **Manual Page Scan:** Click the “Scan” button to search the current webpage for legal documents.
- **Manual Document Upload:** Upload files from your computer for analysis and report generation.

### 3. Status Indicators
The extension uses border colors to indicate its status:
- **Gray:** Normal operation.
- **Yellow:** Generating a report.
- **Red:** Not logged in or an error occurred.

### 4. Customizable Settings
Users can configure the extension’s behavior via the Settings menu (gear icon in the top left):
- Enable or disable the following features:
  - Automatically save reports to the library
  - Automatically detect legal documents
  - Automatically generate reports
  - Show notifications
- Select specific document categories for detection:
  - Terms and Conditions
  - Privacy Policy
  - Contract Agreement
  - Cookie Policy
  - All of the above

### 5. Issue Reporting
- Users can report issues using the “Report Issue” button:
  - Provide a detailed description of the issue.
  - Attach a file (optional).
  - Enter an email address for follow-up.
  - Upon successful submission, a confirmation email will be sent to the user.

---

## How to Use

### 1. Scan a Web Page
1. Log in to Wrap.
2. Enable the extension, then:
   - Visit or refresh a webpage to initiate automatic scanning, or
   - Click the “Scan” button for a manual scan.
3. If a legal document is detected:
   - Receive a notification with the report summary.
   - Click the notification button to view the full report.
4. If no legal document is found, a message stating “No Document Detected” will appear.

### 2. Manually Upload a Document
1. Click the “Manual Upload” button.
2. Select a file from your computer.
3. Wait for processing and review the generated report.

### 3. Report an Issue
1. Click the “Report Issue” button.
2. Fill in the issue description and optionally attach a file.
3. Enter your email address and submit the form.
4. A confirmation email will be sent upon successful submission.

---

## Installation
1. Download and install the Wrap extension from the Chrome Web Store.
2. Go to wrapcapstone.com webpage to download the zip file and install it

---

## License
MIT License

Copyright (c) 2024 Wrap(team)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---
