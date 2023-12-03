import { useState, useEffect } from "preact/hooks";
import storeInExtensionLocalStorage from "./scripts/storeInExtensionLocalStorage";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Popup from "./Popup";
import Tab from "../tab/Tab";

function App() {
  const [loading, setLoading] = useState(true);
  const [onGradesPage, setOnGradesPage] = useState(false);

  function initScripts() {
    function getActiveTab() {
      return browser.tabs.query({ active: true, currentWindow: true });
    }

    function sendCalcGpaMsg(tabs) {
      browser.tabs
        .sendMessage(tabs[0].id, { command: "calculateGPA" })
        .catch((err) => {
          setLoading(false);
          console.log("Error sending message", err);
        });
    }

    getActiveTab().then(sendCalcGpaMsg);

    browser.runtime.onMessage.addListener((message) => {
      if (message.command === "storeSemData") {
        storeInExtensionLocalStorage(message.data);
        setOnGradesPage(true);
      } else if (message.command === "showErr") {
        console.log("An error occured", message.err);
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    browser.tabs
      .executeScript({ file: "/src/entries/injected/main.js" })
      .then(initScripts)
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const router = createHashRouter([
    {
      path: "/",
      element: <Popup onGradesPage={onGradesPage} />,
    },
    {
      path: "/tab",
      element: <Tab />,
    },
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return <RouterProvider router={router} />;
}

export default App;
