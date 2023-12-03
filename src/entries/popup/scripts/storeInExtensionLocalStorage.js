import { getCredit, gradePoint } from "./utils/util";

function storeInExtensionLocalStorage(data) {
  return new Promise(async (resolve) => {
    let pointsSum = 0,
      creditsSum = 0;

    for (const grade of data.grades) {
      // skip if grade is not available
      if (!grade.grade) {
        continue;
      }
      let credits = getCredit(grade.subCode);
      const points = credits * gradePoint(grade.grade);
      pointsSum += points;
      creditsSum += credits;
    }

    // store this semester's points and credits in local storage
    const contentToStore = {
      [`${data.sem}-pointsCredits`]: {
        totalPoints: pointsSum,
        totalCredits: creditsSum,
      },
    };
    await browser.storage.local.set(contentToStore);
    resolve();
  });
}

export default storeInExtensionLocalStorage;
