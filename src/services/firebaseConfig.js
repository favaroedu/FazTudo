import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtPPrfCXPElgMM6n0-8aTn1u80x3-bv1M",
  authDomain: "faztudoapp-18df8.firebaseapp.com",
  projectId: "faztudoapp-18df8",
  storageBucket: "faztudoapp-18df8.firebasestorage.app",
  messagingSenderId: "1013595704590",
  appId: "1:1013595704590:web:de15660a28a9b92081db5f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);