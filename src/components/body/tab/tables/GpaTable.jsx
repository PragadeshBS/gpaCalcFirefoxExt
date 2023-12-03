import GpaTableBody from "./GpaTableBody";

const GpaTable = ({
  curSemester,
  setTotalCredits,
  setTotalPoints,
  setIncludesNonCalcSub,
  setIncludesNannMudhalvanCourse,
}) => {
  const tableCols = ["Code", "Name", "Grade", "Credits", "Points"];
  return (
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
        <tbody>
          <GpaTableBody
            curSemester={curSemester}
            setTotalCredits={setTotalCredits}
            setTotalPoints={setTotalPoints}
            setIncludesNonCalcSub={setIncludesNonCalcSub}
            setIncludesNannMudhalvanCourse={setIncludesNannMudhalvanCourse}
          />
        </tbody>
      </table>
    </div>
  );
};

export default GpaTable;
