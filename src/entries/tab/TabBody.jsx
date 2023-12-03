import { useEffect } from "preact/hooks";
import GpaSection from "~/components/body/tab/gpa/GpaSection";
import CgpaTable from "~/components/body/tab/tables/CgpaTable";
import { appConstants } from "~/constants";
import { useConfigDispatch } from "~/context/ConfigContext";
import { useGradesDispatch } from "~/context/GradesContext";
import "./TabBody.css";

const TabBody = () => {
  const gradesDispatch = useGradesDispatch();
  const configDispatch = useConfigDispatch();

  function fetchLocalState() {
    let grades = {},
      naanMudhalvanCredits = 0;
    browser.storage.local.get().then((localStorage) => {
      naanMudhalvanCredits =
        parseInt(localStorage[appConstants.NAAN_MUDHALVAN_LOCAL_STORAGE_KEY]) ||
        0;
      for (let i = 1; i <= 8; i++) {
        if (!localStorage[i + "-grades"]) {
          continue;
        }
        grades[i] = localStorage[i + "-grades"];
      }
      gradesDispatch({ type: "SET_GRADES", grades });
      configDispatch({
        type: "SET_NAAN_MUDHALVAN_CREDITS",
        naanMudhalvanCredits,
      });
    });
  }

  useEffect(() => {
    fetchLocalState();
  }, []);

  return (
    <div className="flex flex-col md:flex-row py-5 px-2 tab-body">
      <GpaSection />
      <CgpaTable />
    </div>
  );
};

export default TabBody;
