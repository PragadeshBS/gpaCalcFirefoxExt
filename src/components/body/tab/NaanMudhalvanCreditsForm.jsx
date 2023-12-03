import { useEffect, useState } from "preact/hooks";
import { appConstants } from "~/constants";
import { useConfig, useConfigDispatch } from "~/context/ConfigContext";
import NmUpdateSuccessToast from "./NmUpdateSuccessToast";

const NaanMudhalvanCreditsForm = () => {
  const [naanMudhalvanCredits, setNaanMudhalvanCredits] = useState(0);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const config = useConfig();
  const configDispatch = useConfigDispatch();

  function updateNaanMudhalvanCredits() {
    return new Promise((resolve) => {
      browser.storage.local
        .set({
          [appConstants.NAAN_MUDHALVAN_LOCAL_STORAGE_KEY]:
            naanMudhalvanCredits || 0,
        })
        .then(() => {
          configDispatch({
            type: "SET_NAAN_MUDHALVAN_CREDITS",
            naanMudhalvanCredits: parseInt(naanMudhalvanCredits) || 0,
          });
          setShowUpdateSuccess(true);
          setTimeout(() => {
            setShowUpdateSuccess(false);
          }, 2000);
          resolve();
        });
    });
  }

  useEffect(() => {
    setNaanMudhalvanCredits(
      config[appConstants.NAAN_MUDHALVAN_CONFIG_KEY] || 0
    );
  }, [config]);

  return (
    <div className="block max-w-md px-6 py-2 text-center mx-auto bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h6 class="text-lg font-bold dark:text-white my-3">
        Update Naan Mudhalvan Credits
      </h6>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateNaanMudhalvanCredits();
        }}
      >
        <div>
          <label className="mb-2 text-sm font-medium pe-2 text-gray-900 dark:text-white">
            Credits for Naan Mudhalvan courses:{" "}
          </label>
          <input
            type="number"
            min={0}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={naanMudhalvanCredits}
            onChange={(e) => setNaanMudhalvanCredits(e.target.value)}
          />
        </div>
        {showUpdateSuccess && <NmUpdateSuccessToast />}
        <div className="text-center my-3">
          <button
            type="submit"
            className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default NaanMudhalvanCreditsForm;
