import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMyNrGbeXCI9taqGKSUzZk2Bt23b8icoM",
  authDomain: "client-chatbo.firebaseapp.com",
  projectId: "client-chatbo",
  storageBucket: "client-chatbo.appspot.com",
  messagingSenderId: "1004643441348",
  appId: "1:1004643441348:web:ef1f05899316ef0480c791",
};

const app = initializeApp(firebaseConfig);  

export const auth = getAuth(app);
export const db = getFirestore(app);
