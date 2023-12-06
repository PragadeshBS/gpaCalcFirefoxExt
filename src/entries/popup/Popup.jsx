import Cgpa from "~/components/body/popup/Cgpa";
import ViewInstructionsMsg from "~/components/body/popup/ViewInstructionsMsg";
import PopupHeader from "~/components/templates/PopupHeader";
import { useState, useEffect } from "preact/hooks";
import calculateCgpaFromLocalData from "~/entries/popup/scripts/calculateLocalCgpa";
import { FaAnglesRight } from "react-icons/fa6";
import "./Popup.css";

const Popup = ({ onGradesPage }) => {
  const [storedCgpa, setStoredCgpa] = useState(0);
  const [dataAvailableSemesters, setDataAvailableSemesters] = useState([]);
  const [localDataPresent, setLocalDataPresent] = useState(false);

  async function OpenTabView() {
    browser.tabs.create({
      active: true,
      url: "/src/entries/popup/index.html#tab",
    });
  }

  useEffect(() => {
    calculateCgpaFromLocalData()
      .then((data) => {
        setStoredCgpa(data.cgpa);
        setDataAvailableSemesters(data.dataAvailableSemesters);
        setLocalDataPresent(true);
      })
      .catch((err) => {
        console.log("err", err);
        setLocalDataPresent(false);
      });
  }, []);

  return (
    <div className="popup-body py-3">
      <PopupHeader />
      {localDataPresent ? (
        <Cgpa
          storedCgpa={storedCgpa}
          dataAvailableSemesters={dataAvailableSemesters}
        />
      ) : (
        <div className="text-center">No data available yet 💤</div>
      )}
      {!onGradesPage && <ViewInstructionsMsg />}
      {localDataPresent && (
        <div className="text-center mt-3 pb-2 px-20">
          <button onClick={OpenTabView}>
            📈 View calculations and perfomance over time
            <FaAnglesRight className="inline-block ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Popup;
