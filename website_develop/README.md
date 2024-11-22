# WRAP (Web-based Resource for Analyzing Legal Documents)

<div align="center">

![GitHub contributors](https://img.shields.io/github/contributors/LianruiBruce/wrap)
![GitHub stars](https://img.shields.io/github/stars/LianruiBruce/wrap)
![GitHub forks](https://img.shields.io/github/forks/LianruiBruce/wrap)
![GitHub issues](https://img.shields.io/github/issues/LianruiBruce/wrap)
![MIT License](https://img.shields.io/badge/license-MIT-blue)

</div>

## 🎯 About The Project

WRAP is our capstone project developed at the University of Utah in fall semester, 2024. It utilizes NLP and AI APIs to help users understand legal documents on websites.

### 🌟 Key Features

- Natural Language Processing for document analysis
- Real-time document processing
- Interactive user interface
- PDF generation and handling
- Socket-based real-time updates
- Secure authentication system

## 🏗️ Technology Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT for authentication
- PDF processing tools (pdf-parse, pdfkit)
- Multer for file uploads

### Frontend
- React.js
- Material-UI
- Chart.js & Recharts for visualizations
- Socket.IO Client
- Axios for API calls

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version)
- MongoDB
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/LianruiBruce/wrap.git
cd wrap
```

2. Install backend dependencies
```bash
npm install
```

3. Install frontend dependencies
```bash
cd website_frontend
npm install
```

4. Create a `.env` file in the root directory and add your environment variables
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
BREVO_API_KEY = ...
ANTHROPIC_API_KEY = ...

```

5. Start the development servers

For backend:
```bash
npm start
```

For frontend (in a new terminal):
```bash
cd website_frontend
npm start
```

## 📝 Available Scripts

### Backend
- `npm start` - Builds frontend and starts the server
- `npm run build` - Builds the frontend application
- `npm test` - Runs backend tests

### Frontend
See the [Frontend README](./website_frontend/README.md) for frontend-specific scripts.

## 📦 Dependencies

### Backend Dependencies
- express - Web framework
- mongoose - MongoDB ODM
- socket.io - Real-time communication
- jsonwebtoken - Authentication
- bcryptjs - Password hashing
- multer - File uploads
- pdf-parse & pdfkit - PDF processing
- axios - HTTP client
- cors - Cross-origin resource sharing

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- CORS configuration
- Secure file upload handling

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Contributors

- [Lianrui Geng](https://github.com/LianruiBruce)
- [XinyangSally](https://github.com/XinyangSally)

## 📞 Contact

Project Link: [https://wrapcapstone.com](https://wrapcapstone.com)

## 🙏 Acknowledgments

- University of Utah
- Our project advisors and mentors
