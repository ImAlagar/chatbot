// src/test-firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsTKr0qqmsU2gZc74Ehtez8cjW_FEjBhg",
  authDomain: "chatbot-6e3fb.firebaseapp.com",
  projectId: "chatbot-6e3fb",
  storageBucket: "chatbot-6e3fb.firebasestorage.app",
  messagingSenderId: "521718058614",
  appId: "1:521718058614:web:ddf330cce2386f4d5b1957",
  measurementId: "G-8WPXR7MPJL"
};

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  console.log("✅ Firebase initialized successfully!");
  console.log("Project ID:", firebaseConfig.projectId);
  console.log("Auth Domain:", firebaseConfig.authDomain);
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
}