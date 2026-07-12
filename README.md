# Lumina — AI Chat Application

Lumina is a full-stack conversational AI chat application with a clean, modern interface inspired by Gemini/ChatGPT. It features real-time typing animations, voice input, persistent chat history, and a responsive dark-themed UI.

🔗 **Live Demo:** https://lumina-self-psi.vercel.app/

> Note: The backend is hosted on Render's free tier, which spins down after inactivity. The first message may take 30-50 seconds to respond while it wakes up.

## Features

- 💬 Real-time chat interface with smooth slide-up/fade-in animations
- 🎙️ Voice input using the Web Speech API
- 🧵 Persistent thread history with create/switch/delete functionality
- ✨ Typing animation for AI responses
- 🎨 Dynamic centered-to-bottom input transition on new chat
- 📱 Responsive sidebar with collapse/expand states
- 🌙 Dark theme with ambient glow effects

## Tech Stack

**Frontend:** React, Vite, CSS3  
**Backend:** Node.js, Express  
**Database:** MongoDB (Mongoose)  
**Deployment:** Vercel (frontend), Render (backend)

## Project Structure

```
Lumina/
├── Frontend/     # React + Vite application
└── Backend/      # Express API server
```

## Running Locally

### Backend
```bash
cd Backend
npm install
# create a .env file with MONGODB_URI and any API keys
npm start
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables

Backend requires a `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=8080
```

## Author

**Garv Bansal**  
[GitHub](https://github.com/GarvBansal-2006)
