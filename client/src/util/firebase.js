import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBdxqVz6asyIhiuTyji7TzjCbelBGqqTIc",
  authDomain: "application-tracker-df0ea.firebaseapp.com",
  projectId: "application-tracker-df0ea",
  storageBucket: "application-tracker-df0ea.firebasestorage.app",
  messagingSenderId: "455050912168",
  appId: "1:455050912168:web:fc2ee93bc12cf26f36bd9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;

