# 📌 About the Project

Nerd Extension is a Chrome extension that helps developers quickly understand code from platforms like GitHub, LeetCode, and GeeksforGeeks.
Users can select a code snippet and, with a single click, open a dedicated interface that provides clear explanations, contextual insights, and an interactive chat experience.

## Key Features

- Instant explanations for selected code
- AI-powered chat for follow-up questions
- Suggestions for related and similar problems

## Architecture

The project follows a modular structure:

- Frontend – User interface
- Backend – APIs and core logic
- Machine Learning Model – Code vs text classification
- SDK – Reusable chatbot services
- Chrome Extension – User interaction layer

## ⚙️ Backend

Runtime: Node.js

### Functionality

- Sends selected text to a Python ML service for classification (code vs text) using child_process
- Returns structured JSON responses to the frontend
- Handles explanation, similar questions, and chatbot APIs
- Integrates DeepSeek AI
- Uses MySQL for data storage

### Setup

```bash
npm install
npm run start
```

Create a .env file using values from sample.env before running.

## 🎨 Frontend

Framework: Next.js

### Functionality

- Captures selected code from supported platforms
- Communicates with backend APIs
- Provides chat interface and suggestions

### Setup

```bash
npm install
npm run build
npm run start
```

## 🤖 Machine Learning

Language: Python
Libraries: Pandas, Scikit-learn, Joblib

### Model Details

- Logistic Regression
- TF-IDF vectorization (character n-grams: 3–5)
- Scikit-learn pipeline (TF-IDF + classifier)
- Outputs prediction with confidence score (predict_proba)

### Usage

```bash
cd src
python3 train.py   # Train model (generates .pkl file)
python3 ../main.py # Run prediction
```

## 💬 Chatbot SDK

Framework: React + Vite

### Integration

```html
<script src="http://localhost:3005/chatbot-sdk.umd.js" strategy="beforeInteractive"></script>
<link rel="stylesheet" href="http://localhost:3005/chatbot-sdk.css">
```

### Functionality

- Pluggable chatbot for any website
- Uses conversation history for contextual responses
- Communicates with chatbot APIs

### Setup

```bash
npm install
npm run build
npm run serve
```

## 🧩 Chrome Extension

The extension enables direct interaction with code on supported websites.

### Functionality

- Detects selected code snippets
- Displays a popup action button
- Redirects users to the frontend for detailed analysis

### Setup

1. Run backend, frontend, and chatbot SDK
2. Open chrome://extensions/
3. Enable Developer Mode
4. Click Load unpacked and select the extension folder
5. Reload the extension after any changes