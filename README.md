# Dating Game 💘

A Tinder-style dating app with a twist: when you swipe right, you must answer the other person's custom multiple-choice question correctly. If both users answer each other's questions correctly, it's a match!

## Architecture

- **Frontend:** React Native (Expo)
- **Backend:** Node.js + Express + Socket.io
- **Database:** MongoDB with Mongoose
- **Auth:** JWT

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI
- Expo CLI (`npm install -g expo-cli`)

### Backend

```bash
cd server
npm install
cp .env.example .env   # edit with your values
npm run dev
```

The server runs on `http://localhost:3000` by default.

### Frontend

```bash
cd app
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` for iOS simulator / `a` for Android emulator.

### Environment Variables (server/.env)

| Variable | Description | Default |
|---|---|---|
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/dating-game |
| JWT_SECRET | Secret for signing tokens | (required) |
| MAX_DISTANCE_KM | Default discovery radius | 50 |

## How It Works

1. **Sign up** and create your profile with photos, a bio, and a custom multiple-choice question.
2. **Discover** nearby users by swiping through profiles.
3. **Swipe right** on someone you like — you'll be shown their question. Answer correctly to proceed.
4. If they also swipe right on you AND answer your question correctly, **it's a match!**
5. Matched users can **chat in real-time** via Socket.io.
