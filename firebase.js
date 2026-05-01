import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQ_OlkvDnQnoRMfb98z6k-FQBR75wVcIc",
  authDomain: "docs-clone-a0c35.firebaseapp.com",
  projectId: "docs-clone-a0c35",
  storageBucket: "docs-clone-a0c35.firebasestorage.app",
  messagingSenderId: "786848835896",
  appId: "1:786848835896:web:3393858079c6d6d4b9f9cd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
