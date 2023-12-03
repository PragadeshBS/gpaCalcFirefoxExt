import { useGrades } from "~/context/GradesContext";

const SemsterSelect = ({ curSemester, setCurSemester }) => {
  const grades = useGrades();
  return (
    <div className="text-center py-3">
      <label className="mb-2 pe-3 text-sm font-medium text-gray-900 dark:text-white">
        Semester
      </label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={curSemester}
        onChange={(e) => setCurSemester(e.target.value)}
      >
        {Object.keys(grades).map((sem, index) => {
          return <option key={index}>{sem}</option>;
        })}
      </select>
    </div>
  );
};

export default SemsterSelect;
