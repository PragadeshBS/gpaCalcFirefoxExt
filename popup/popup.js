async function showErr(err) {
  console.log(err);
  const curViewSemesterInfoDiv = document.getElementById(
    "cur-view-semester-info"
  );
  curViewSemesterInfoDiv.classList.add("d-none");
  await calculateCGPA();
}

async function calculateCGPA() {
  // calculate cgpa
  let cgpaPointsSum = 0,
    cgpaCreditsSum = 0,
    dataAvailableSemesters = [];

  await browser.storage.local.get().then((localStorage) => {
    // update the cgpa table
    const semesters = localStorage.semesters;
    if (semesters && semesters.length > 0) {
      semesters.sort();
      dataAvailableSemesters = semesters;
    } else {
      return;
    }
    for (let i = 1; i <= 8; i++) {
      if (!localStorage[i + "-pointsCredits"]) {
        continue;
      }
      const thisSemGpa = localStorage[i + "-pointsCredits"];
      if (thisSemGpa["totalCredits"] == 0 || thisSemGpa["totalPoints"] == 0) {
        continue;
      }
      cgpaPointsSum += thisSemGpa["totalPoints"];
      cgpaCreditsSum += thisSemGpa["totalCredits"];
    }
  });

  // show cgpa
  const dataDiv = document.getElementById("data");
  const noDataDiv = document.getElementById("no-data");
  if (cgpaCreditsSum == 0 || cgpaPointsSum == 0) {
    noDataDiv.classList.remove("d-none");
    dataDiv.classList.add("d-none");
    return;
  } else {
    noDataDiv.classList.add("d-none");
    dataDiv.classList.remove("d-none");
  }

  const cgpa = document.getElementById("cgpa-val");
  const dataAvailableSemestersDiv = document.getElementById(
    "data-available-semesters"
  );
  if (dataAvailableSemesters.length > 0) {
    dataAvailableSemestersDiv.textContent = dataAvailableSemesters.join(", ");
  }
  cgpa.textContent = (cgpaPointsSum / cgpaCreditsSum).toFixed(3);
}

// add event listeners for detailed view
const detailedViewBtn = document.getElementById("detailed-view-btn");
detailedViewBtn.addEventListener("click", async () => {
  browser.tabs.create({ active: true, url: "../tab/index.html" });
  const tabs = await browser.tabs.query({});
  console.log(tabs);
  // getActiveTab().then(showDetailedView).catch(showErr);
});

function initScripts() {
  function calc(tabs) {
    browser.tabs
      .sendMessage(tabs[0].id, { command: "calculateGPA" })
      .catch(showErr);
  }

  function getActiveTab() {
    return browser.tabs.query({ active: true, currentWindow: true });
  }

  async function storeSemData(data) {
    console.log("data", data);
    // get dom elements
    const noSemsDiv = document.getElementById("no-sems");
    const dataDiv = document.getElementById("data");
    const noDataDiv = document.getElementById("no-data");
    const curViewSem = document.getElementById("cur-view-semester");

    noSemsDiv.classList.add("d-none");
    noDataDiv.classList.add("d-none");
    dataDiv.classList.remove("d-none");
    curViewSem.textContent = data.sem;

    let pointsSum = 0,
      creditsSum = 0;

    for (const grade of data.grades) {
      // skip if grade is not available
      if (!grade.grade) {
        continue;
      }
      let credits = 0;
      if (grade.courseName.toUpperCase().includes("NAAN MUDHALVAN")) {
        // naan mudhalvan is a 2 credit course
        credits = 2;
      } else {
        credits = getCredit(grade.subCode);
      }
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

    await calculateCGPA();
  }

  getActiveTab().then(calc).catch(showErr);

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "storeSemData") {
      storeSemData(message);
    } else if (message.command === "showErr") {
      showErr(message.errMessage);
    }
  });
}

browser.tabs
  .executeScript({ file: "/content-script.js" })
  .then(initScripts)
  .catch(showErr);
