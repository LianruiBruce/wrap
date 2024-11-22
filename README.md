# 🔍 WRAP - Web-based Resource for Analyzing Papers
### Legal Document Analysis & Management System

<div align="center">

![GitHub contributors](https://img.shields.io/github/contributors/LianruiBruce/wrap)
![GitHub stars](https://img.shields.io/github/stars/LianruiBruce/wrap)
![GitHub forks](https://img.shields.io/github/forks/LianruiBruce/wrap)
![MIT License](https://img.shields.io/badge/license-MIT-blue)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fwrapcapstone.com)](https://wrapcapstone.com)

</div>

## 📋 Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Components](#components)
  - [Chrome Extension](#chrome-extension)
  - [Web Application](#web-application)
  - [NLP Backend](#nlp-backend)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview
WRAP is a comprehensive legal document analysis system developed as a capstone project at the University of Utah. It combines a Chrome extension, web application, and NLP backend to automatically detect, analyze, and manage legal documents such as Terms and Conditions, Privacy Policies, and Contract Agreements.

## 🏗️ System Architecture
The system consists of three main components:
1. **Chrome Extension**: Detects and captures legal documents from websites
2. **Web Application**: Manages user interactions and document viewing
3. **NLP Backend**: Processes and analyzes legal documents using advanced NLP techniques

## ✨ Key Features

### Chrome Extension
- 🔄 Automatic legal document detection
- 📊 Immediate document analysis and reporting
- 💾 Automatic saving to database
- 📤 Manual document upload option
- ⚙️ Customizable detection settings

### Web Application
- 📱 Responsive Material-UI design
- 📊 Interactive data visualization
- 🔄 Real-time updates using Socket.IO
- 📄 PDF generation and handling
- 🔍 Advanced search functionality

### NLP Backend
- 🤖 CUDA-accelerated document processing
- 📝 Automatic report generation
- 🎯 Legal document classification
- 📊 Key information extraction
- 🔄 Real-time processing capabilities

## 💻 Technology Stack

### Frontend
- React.js with Material-UI
- Chart.js & Recharts
- Socket.IO Client
- Axios

### Backend
- Node.js & Express
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- PDF Processing Tools

### NLP Stack
- Python with CUDA support
- PyTorch
- Flask API
- NVIDIA GPU Requirements

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- Python 3.8+
- NVIDIA GPU with CUDA support
- MongoDB
- Chrome browser (for extension)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/LianruiBruce/wrap.git
cd wrap
```

2. **Set up the main backend**
```bash
npm install
cp .env.example .env  # Configure your environment variables
npm start
```

3. **Set up the frontend**
```bash
cd website_frontend
npm install
npm start
```

4. **Set up the NLP environment**
```bash
cd NLP
python -m venv nlp-env
source nlp-env/bin/activate  # On Windows: nlp-env\Scripts\activate
pip install -r requirements.txt
```

5. **Start the Flask server**
```bash
export FLASK_APP=src/app.py  # On Windows: $env:FLASK_APP = "src/app.py"
flask run --host=0.0.0.0 --port=5000
```

## 🎮 Usage

### Chrome Extension
1. Open the extension before visiting a webpage
2. Navigate to a page with legal documents
3. The extension will automatically detect and analyze the document
4. View generated reports directly in the extension

### Web Application
1. Access the web interface at [wrapcapstone.com](https://wrapcapstone.com)
2. Log in to your account
3. View detected documents and generated reports
4. Use the search functionality to find specific documents
5. Generate and download PDF reports

## 🤝 Contributing
We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Contributors
- [Lianrui Geng](https://github.com/LianruiBruce)
- [XinyangSally](https://github.com/XinyangSally)
- [Daniel Coimbra](https://github.com/DaniCoimbra)
- [Joey Cai](https://github.com/Joeic)

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact
- Project Website: [wrapcapstone.com](https://wrapcapstone.com)
- Project Link: [GitHub Repository](https://github.com/LianruiBruce/wrap)

## 🙏 Acknowledgments
- University of Utah
- Our project advisors and mentors
- All contributors who helped with the project
