# WRAP Frontend

This is the frontend application for the WRAP (Web-based Resource for Analyzing Papers) project, built with React and Material-UI.

## 🚀 Features

- Interactive UI for document analysis
- Real-time updates using Socket.IO
- PDF generation and handling
- Data visualization with Chart.js and Recharts
- Responsive Material-UI design
- Fuzzy search functionality

## 🛠️ Technologies

- React 18.2.0
- Material-UI (MUI) 5.15.15
- Chart.js & React-Chartjs-2
- Socket.IO Client
- Axios for API calls
- JSPdf & HTML2Canvas for PDF operations
- Fuse.js for fuzzy searching

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
```bash
cd website_frontend
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📝 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## 🔗 Proxy Configuration

The frontend is configured to proxy requests to `http://localhost:3001` for development.

## 📦 Dependencies

### Main Dependencies
- @mui/material & @mui/icons-material - Material UI components
- @fontsource/quicksand - Custom font
- react-router-dom - Routing
- socket.io-client - Real-time communication
- chart.js & react-chartjs-2 - Data visualization
- axios - HTTP client
- fuse.js - Fuzzy search

### Development Dependencies
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event

## 🎨 Styling

The project uses Material-UI's styling solution along with the Quicksand font family for a modern, clean look.

## 🔧 Configuration

The project includes configurations for:
- ESLint
- Browserslist
- Proxy settings
- Environment variables

## 📚 Learn More

For more information about the tools and libraries used:
- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [Create React App Documentation](https://create-react-app.dev/)
