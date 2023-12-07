import { GradesProvider } from "~/context/GradesContext";
import TabBody from "./TabBody";
import { ConfigProvider } from "~/context/ConfigContext";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { useEffect } from "preact/hooks";

const Tab = () => {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  useEffect(() => {
    const logToFirebase = async () => {
      await addDoc(collection(db, "logs"), {
        version: browser.runtime.getManifest().version,
        time: new Date(),
        ua: navigator.userAgent,
      });
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    logToFirebase();
  }, []);

  return (
    <GradesProvider>
      <ConfigProvider>
        <TabBody />
      </ConfigProvider>
    </GradesProvider>
  );
};

export default Tab;
