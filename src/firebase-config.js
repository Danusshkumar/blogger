import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADiwZhBnVxNVjyCEYCvKuiiehk0MgVGoc",
  authDomain: "blog-app-b3f4e.firebaseapp.com",
  projectId: "blog-app-b3f4e",
  storageBucket: "blog-app-b3f4e.appspot.com",
  messagingSenderId: "802234347088",
  appId: "1:802234347088:web:d2c3acb30be6b7f3b7eb55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
