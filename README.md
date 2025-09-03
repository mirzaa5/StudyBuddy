# StudyBuddy - AI Learning Assistant

An Ionic/Angular app that uses OpenAI GPT to help with learning through chat, text summarization, and quiz generation.

## Features

- **AI Chat**: Ask questions and get intelligent responses
- **Text Summarizer**: Condense long texts into summaries
- **Quiz Generator**: Create multiple-choice quizzes from any topic
- <img width="328" height="710" alt="image" src="https://github.com/user-attachments/assets/fdee9dda-fbaa-4fc7-b09b-233fb39c379f" />
- <img width="327" height="705" alt="image" src="https://github.com/user-attachments/assets/ed2f2c7b-79ac-4249-9cbe-87d8a5af3c7a" />
- <img width="322" height="702" alt="image" src="https://github.com/user-attachments/assets/1347f725-fb15-473c-b800-5c1d05e259af" />






## Prerequisites

- Node.js (v18+)
- Ionic CLI: `npm install -g @ionic/cli`

## Quick Start

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd StudyBuddy
   npm install
   ```

2. **Run the app**
   ```bash
   ionic serve
   ```

That's it! The app is ready to use with pre-configured Firebase Cloud Functions.

## How It Works

- **Backend**: Firebase Cloud Functions are already deployed and configured
- **API Key**: OpenAI API key is securely stored in Firebase Secret Manager
- **No Setup Required**: The functions are live and ready to use immediately

## API Endpoints (Already Deployed)

### Chat
- **URL**: `https://us-central1-prompt-backend-2025-v1.cloudfunctions.net/askGPT`
- **Body**: `{"prompt": "Your question"}`

### Summarize
- **URL**: `https://us-central1-prompt-backend-2025-v1.cloudfunctions.net/summarizeNotes`
- **Body**: `{"text": "Text to summarize"}`

### Quiz
- **URL**: `https://us-central1-prompt-backend-2025-v1.cloudfunctions.net/generateQuiz`
- **Body**: `{"input": "Topic for quiz"}`

## Build for Production

```bash
# Android
ionic capacitor build android

# iOS  
ionic capacitor build ios

# Web
ionic build --prod
```

## For Developers

If you want to deploy your own Firebase functions:

1. **Firebase setup**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use <your-project-id>
   ```

2. **Set your own OpenAI API key**
   ```bash
   firebase functions:secrets:set OPENAI_API_KEY
   # Enter your OpenAI API key when prompted
   ```

3. **Deploy functions**
   ```bash
   cd functions && npm install && cd ..
   firebase deploy --only functions
   ```

4. **Update API URLs** in your app to point to your deployed functions

## Architecture

- **Frontend**: Ionic/Angular with TypeScript
- **Backend**: Firebase Cloud Functions with OpenAI GPT-3.5-turbo
- **Security**: API keys stored in Firebase Secret Manager
- **CORS**: Enabled for cross-origin requests 
