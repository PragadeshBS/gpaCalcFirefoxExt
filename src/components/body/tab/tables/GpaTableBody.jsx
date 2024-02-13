import { useGrades } from "~/context/GradesContext";
import { getCredit, gradePoint } from "~/entries/popup/scripts/utils/util";
import { useEffect, useState } from "preact/hooks";
import { useConfig } from "~/context/ConfigContext";
import { appConstants } from "~/constants";

const GpaTableBody = ({
  curSemester,
  setTotalCredits,
  setTotalPoints,
  setIncludesNonCalcSub,
  setIncludesNannMudhalvanCourse,
}) => {
  const [loading, setLoading] = useState(true);
  const grades = useGrades();
  const config = useConfig();

  useEffect(() => {
    if (grades && grades[curSemester]) {
      setLoading(false);
    }
  }, [grades]);

  if (loading) return <div>Just a sec...</div>;

  return Object.keys(grades[curSemester]).map((sub, index) => {
    const subjectCode = grades[curSemester][sub].subCode;
    const subjectName = grades[curSemester][sub].courseName;
    const isNaanMudhalvanCourse =
      appConstants.NAAN_MUDHALVAN_REGEX.test(subjectCode);
    console.log(sub, "isNaanMudhalvanCourse", isNaanMudhalvanCourse);
    const truncatedName = subjectName.substring(0, 10) + "...";
    const grade = grades[curSemester][sub].grade;
    const credit = isNaanMudhalvanCourse
      ? config[appConstants.NAAN_MUDHALVAN_CONFIG_KEY]
      : getCredit(subjectCode);
    const points = credit * gradePoint(grade);

    setTotalCredits((tc) => (index === 0 ? credit : tc + credit));
    setTotalPoints((tp) => (index === 0 ? points : tp + points));
    setIncludesNonCalcSub((inc) =>
      !grade || credit === 0 ? true : index === 0 ? false : inc
    );
    setIncludesNannMudhalvanCourse((inc) => {
      return isNaanMudhalvanCourse ? true : index === 0 ? false : inc;
    });

    return (
      <tr
        key={index}
        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
      >
        <td className="px-6 py-4">
          {subjectCode}
          {(!grade || credit === 0) && "*"}
        </td>
        <td className="px-6 py-4" title={subjectName}>
          {truncatedName}
        </td>
        <td className="px-6 py-4">{grade ? grade : "-"}</td>
        <td className="px-6 py-4">{credit}</td>
        <td className="px-6 py-4">{points}</td>
      </tr>
    );
  });
};

export default GpaTableBody;
