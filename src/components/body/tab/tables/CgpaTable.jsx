import { useMemo } from "preact/hooks";
import { appConstants } from "~/constants";
import { useConfig } from "~/context/ConfigContext";
import { useGrades } from "~/context/GradesContext";
import { getCredit, gradePoint } from "~/entries/popup/scripts/utils/util";
import CgpaTableBody from "./CgpaTableBody";
import Graph from "../Graph";

const CgpaTable = () => {
  const grades = useGrades();
  const config = useConfig();

  function calculatePointsCredits() {
    const pointsCredits = {};
    let totalCredits = 0,
      totalPoints = 0;
    for (let i = 1; i <= 8; i++) {
      if (!grades[i]) continue;
      let semTotalPoints = 0;
      let semTotalCredits = 0;
      Object.keys(grades[i]).forEach((sub) => {
        const subjectName = grades[i][sub].courseName;
        const isNaanMudhalvanCourse =
          appConstants.NAAN_MUDHALVAN_REGEX.test(subjectName);
        const grade = grades[i][sub].grade;
        const credit = isNaanMudhalvanCourse
          ? config[appConstants.NAAN_MUDHALVAN_CONFIG_KEY]
          : getCredit(grades[i][sub].subCode);
        if (!grade || credit === 0) return;
        semTotalPoints += gradePoint(grade) * credit;
        semTotalCredits += credit;
      });
      if (semTotalCredits === 0 || semTotalPoints === 0) continue;
      pointsCredits[i] = {
        totalPoints: semTotalPoints,
        totalCredits: semTotalCredits,
      };
      totalPoints += semTotalPoints;
      totalCredits += semTotalCredits;
    }
    return { pointsCredits, totalCredits, totalPoints };
  }

  const { pointsCredits, totalCredits, totalPoints } = useMemo(
    calculatePointsCredits,
    [grades, config]
  );
  const calculateGpa = (points, credits) => {
    return (points / credits).toFixed(3);
  };
  const tableCols = ["Sem", "Points", "Credits", "GPA"];

  return (
    <div className="md:w-1/2 px-3">
      <h3 class="text-3xl text-center font-bold dark:text-white">
        CGPA Calculation
      </h3>
      <hr className="w-7/12 mx-auto mt-2 mb-5" />
      <div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {tableCols.map((row, index) => {
                  return (
                    <th key={index} scope="col" className="px-6 py-3">
                      {row}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <CgpaTableBody
              pointsCredits={pointsCredits}
              calculateGpa={calculateGpa}
            />
          </table>
        </div>
        <div className="text-center mt-3">
          <div>
            CGPA ={" "}
            <span>
              {totalPoints} / {totalCredits}
            </span>
          </div>
          <span className="text-4xl font-bold py-2 text-rose-700 dark:text-lime-100">
            {calculateGpa(totalPoints, totalCredits)}
          </span>
        </div>
        <Graph pointsCredits={pointsCredits} />
      </div>
    </div>
  );
};

export default CgpaTable;
