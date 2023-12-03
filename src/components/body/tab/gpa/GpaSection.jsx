import { useEffect, useState } from "preact/hooks";
import NaanMudhalvanCreditsForm from "../NaanMudhalvanCreditsForm";
import GpaTable from "../tables/GpaTable";
import SubjectNotIncludedMsg from "./SubjectNotIncludedMsg";
import SemsterSelect from "./SemesterSelect";
import GpaDisplay from "./GpaDisplay";

const GpaSection = () => {
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [includesNonCalcSub, setIncludesNonCalcSub] = useState(false);
  const [includesNannMudhalvanCourse, setIncludesNannMudhalvanCourse] =
    useState(false);
  const [curSemester, setCurSemester] = useState(1);

  return (
    <div className="md:w-1/2 px-3">
      <h3 class="text-3xl text-center font-bold dark:text-white">
        GPA Calculation
      </h3>
      <hr className="w-7/12 mx-auto mt-2 mb-5" />
      <SemsterSelect
        curSemester={curSemester}
        setCurSemester={setCurSemester}
      />
      <GpaTable
        curSemester={curSemester}
        setTotalCredits={setTotalCredits}
        setTotalPoints={setTotalPoints}
        setIncludesNonCalcSub={setIncludesNonCalcSub}
        setIncludesNannMudhalvanCourse={setIncludesNannMudhalvanCourse}
      />
      <GpaDisplay totalPoints={totalPoints} totalCredits={totalCredits} />
      {includesNonCalcSub && <SubjectNotIncludedMsg />}
      {includesNannMudhalvanCourse && <NaanMudhalvanCreditsForm />}
    </div>
  );
};

export default GpaSection;
