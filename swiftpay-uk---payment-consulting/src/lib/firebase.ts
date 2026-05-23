import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);

const dbId =
  firebaseConfig.firestoreDatabaseId &&
  firebaseConfig.firestoreDatabaseId !== "(default)" &&
  firebaseConfig.firestoreDatabaseId !== ""
    ? firebaseConfig.firestoreDatabaseId
    : "(default)";

export const db = getFirestore(app, dbId);
export const auth = getAuth(app);

async function testConnection() {
  try {
    const testDoc = await getDocFromServer(doc(db, "test", "connection"));
    console.log("Firestore connection test completed.");
  } catch (error: any) {
    if (error.message && error.message.includes("offline")) {
      console.error("Firestore offline configuration issue.");
    } else {
      console.error("Firestore connection check failed:", error.message);
    }
  }
}
// Because our newly updated firestore.rules script enforces a strict default lockdown on all directories outside of /leads/, that startup check line in firebase.ts will explicitly trigger a Missing or insufficient permissions error in your browser console every single time the page loads.
//testConnection();
