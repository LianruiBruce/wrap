
# Wrap - Node.js and React Setup

This project is a full-stack web application built with Node.js for the backend and React for the frontend. The project is organized into separate folders to maintain a clear structure and improve manageability.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.x or later
- **npm**: v10.x or later (comes with Node.js)
- **MongoDB**: A running MongoDB instance. This setup is currently using MongoDB - Lianrui Geng's instance.

### Installation

To get a copy of the project up and running on your local machine, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd <project-directory>
   ```

3. **Install the necessary dependencies:**

   ```bash
   npm install
   ```

### Running the Application

#### Backend (Node.js)

1. **Build the frontend:**

   Before starting the server, ensure that the frontend has been built. Navigate to the frontend directory (usually `client` or `website_frontend`) and run:

   ```bash
   npm run build
   ```

2. **Start the Node.js server:**

   In the root of your project, start the backend server:

   ```bash
   npm start
   ```

   Or, alternatively, you can directly run the server file:

   ```bash
   node server.js
   ```

#### Frontend (React)

1. **If in development mode:**

   Navigate to the frontend directory:

   ```bash
   cd client
   ```

2. **Start the React development server:**

   ```bash
   npm start
   ```

   The development server usually runs on `wrapcapstone.com


### Useful Commands

- **Start the backend server**:

  ```bash
  npm start
  ```

- **Build the frontend for production**:

  ```bash
  npm run build
  ```

### Troubleshooting

If you encounter issues, ensure that:

- All dependencies are installed (`npm install`).
- MongoDB is running and accessible with the configured URI.
- Environment variables are correctly set in your `.env` file.
