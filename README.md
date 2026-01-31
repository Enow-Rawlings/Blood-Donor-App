# BloodConnect - Every Drop Matters 🩸

BloodConnect is a Progressive Web Application (PWA) designed to bridge the gap between blood donors and recipients. Built with React and Firebase, it provides real-time location-matching and instant coordination.

## 🚀 How to Run Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Setup
Clone the project and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Firebase credentials:
```bash
cp .env.example .env
```
*(Fill in the values from your Firebase Console)*

### 4. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🔥 Firebase Setup Instructions

To make the application fully functional, follow these steps in the [Firebase Console](https://console.firebase.google.com/):

### 1. Create a Project
Create a new Firebase project named "BloodConnect".

### 2. Enable Authentication
- Go to **Authentication** > **Sign-in method**.
- Enable **Email/Password**.

### 3. Create Firestore Database
- Go to **Firestore Database** > **Create database**.
- Start in **Test Mode** (or Production with secure rules).
- Create a `users` collection.

### 4. Setup Storage
- Go to **Storage** > **Get Started**.
- This is used for storing donor medical reports and recipient prescriptions.

### 5. Register Web App
- Click the **Web icon** (</>) to register a new app.
- Copy the `firebaseConfig` values into your `.env` file.

### 6. Firestore Security Rules (Recommended)
Add these rules to your Firestore to protect user data:
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /messages/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📱 PWA Features
- **Offline Support**: Cached assets via Service Workers.
- **Installable**: Add to home screen on iOS and Android.
- **Real-time**: Instant matching and messaging.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Framer Motion, React Router
- **Backend**: Firebase Auth, Firestore, Cloud Storage
- **Mapping**: Geolocation API, Leaflet.js
