import { appConstants } from "~/constants";
import { getCredit, gradePoint } from "./utils/util";

function noGradesAssignedForSem(grades) {
  for (const grade of grades) {
    if (grade.grade) {
      return false;
    }
  }
  return true;
}

export default function calculateCgpaFromLocalData() {
  return new Promise(async (resolve, reject) => {
    let totalCredits = 0,
      totalPoints = 0,
      dataAvailableSemesters = [];

    await browser.storage.local.get().then((localStorage) => {
      const naanMudhalvanCourseCredits =
        parseInt(localStorage[appConstants.NAAN_MUDHALVAN_LOCAL_STORAGE_KEY]) ||
        0;
      const semesters = localStorage.semesters;
      if (semesters && semesters.length > 0) {
        semesters.sort();
        for (const sem of semesters) {
          if (!localStorage[sem + "-grades"]) {
            continue;
          }
          const thisSemGrades = localStorage[sem + "-grades"];
          if (noGradesAssignedForSem(thisSemGrades)) {
            continue;
          }
          dataAvailableSemesters.push(sem);
          Object.keys(thisSemGrades).forEach((course) => {
            const subjectName = thisSemGrades[course].courseName;
            const isNaanMudhalvanCourse =
              appConstants.NAAN_MUDHALVAN_REGEX.test(subjectName);
            const grade = thisSemGrades[course].grade;
            const credit = isNaanMudhalvanCourse
              ? naanMudhalvanCourseCredits
              : getCredit(thisSemGrades[course].subCode);
            if (!grade || credit === 0) {
              return;
            }
            totalPoints += gradePoint(grade) * credit;
            totalCredits += credit;
          });
        }
      } else {
        reject("No data available");
      }
    });
    resolve({
      dataAvailableSemesters,
      cgpa: (totalPoints / totalCredits).toFixed(3),
    });
  });
}
