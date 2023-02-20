async function showErr() {
  const succDiv = document.querySelector("#data-success");
  const gpaSection = document.querySelector("#gpa-div");
  const cgpaSection = document.querySelector("#cgpa-div");
  succDiv.classList.remove("hidden");
  gpaSection.classList.add("hidden");
  cgpaSection.classList.remove("col-3");
  cgpaSection.classList.remove("col-12");
  await calculateCGPA();
}

async function calculateCGPA() {
  // calculate cgpa
  let cgpaPointsSum = 0,
    cgpaCreditsSum = 0,
    xValues = [],
    yValues = [];

  await browser.storage.local.get().then((gpaWithCredits) => {
    // update the cgpa table
    for (let i = 1; i <= 8; i++) {
      const gpaCell = document.getElementById("gpa" + i);
      const creditsCell = document.getElementById("credits" + i);
      if (!gpaWithCredits[i]) {
        gpaCell.textContent = "-";
        creditsCell.textContent = "-";
        continue;
      }
      const thisSemGpa = JSON.parse(gpaWithCredits[i]);
      if (thisSemGpa["totalCredits"] == 0 || thisSemGpa["totalPoints"] == 0) {
        gpaCell.textContent = "-";
        creditsCell.textContent = "-";
        continue;
      }
      xValues.push(i);
      gpaCell.textContent = thisSemGpa["totalPoints"];
      cgpaPointsSum += thisSemGpa["totalPoints"];
      creditsCell.textContent = thisSemGpa["totalCredits"];
      cgpaCreditsSum += thisSemGpa["totalCredits"];
      yValues.push(cgpaPointsSum / cgpaCreditsSum);
    }
  });

  // show cgpa
  const cgpa = document.getElementById("cgpa");
  const cgpaCalc = document.getElementById("cgpaCalc");
  if (cgpaCreditsSum == 0 && cgpaPointsSum == 0) {
    cgpa.textContent = "No data available";
    return;
  }
  cgpaCalc.textContent = `${cgpaPointsSum}/${cgpaCreditsSum}`;
  cgpa.textContent = (cgpaPointsSum / cgpaCreditsSum).toFixed(3);

  // plot cgpa graph
  plotGraph(xValues, yValues);
}

function plotGraph(x, y) {
  const trace1 = {
    x,
    y,
    mode: "lines+markers",
    marker: {
      color: "darkslateblue",
      size: 8,
    },
    line: {
      color: "darkslateblue",
      width: 1,
    },
  };
  const layout = {
    title: "CGPA Over Semesters",
    xaxis: {
      title: "Semester",
      showgrid: false,
      zeroline: false,
    },
    yaxis: {
      title: "CGPA",
      showline: false,
    },
  };
  Plotly.newPlot("plot", [trace1], layout);
}

function initScripts() {
  function calc(tabs) {
    browser.tabs.sendMessage(tabs[0].id, { command: "calculateGPA" });
  }

  function getActiveTab() {
    return browser.tabs.query({ active: true, currentWindow: true });
  }

  async function updateUI(data) {
    // get dom elements
    const dataSuccess = document.getElementById("data-success");
    const sem = document.getElementById("sem");
    const tableContent = document.getElementById("gradesTable");
    const gpaCalc = document.getElementById("gpaCalc");
    const gpa = document.getElementById("gpa");
    const dataError = document.getElementById("data-error");
    const gpaSection = document.querySelector("#gpa-div");

    // grades not found
    if (!data || !data.grades || data.grades.length == 0) {
      dataError.textContent =
        "Could not find your grades, try a different sem 👻";
      dataError.classList.remove("hidden");
      return;
    }

    // success
    dataError.classList.add("hidden");
    dataSuccess.classList.remove("hidden");
    gpaSection.classList.remove("hidden");
    sem.textContent = data.sem;
    let pointsSum = 0,
      creditsSum = 0;
    for (const grade of data.grades) {
      const credit = getCredit(grade.subCode);
      const points = credit * gradePoint(grade.grade);
      pointsSum += points;
      creditsSum += credit;
      const newTr = document.createElement("tr");

      // subcode
      const subCodeTd = document.createElement("td");
      subCodeTd.textContent = grade.subCode;
      newTr.appendChild(subCodeTd);

      // grade
      const gradeTd = document.createElement("td");
      gradeTd.textContent = grade.grade;
      newTr.appendChild(gradeTd);

      // credit
      const creditTd = document.createElement("td");
      creditTd.textContent = credit;
      newTr.appendChild(creditTd);

      // point
      const pointTd = document.createElement("td");
      pointTd.textContent = points;
      newTr.appendChild(pointTd);

      // add row to table
      tableContent.appendChild(newTr);
    }
    // final row for total of credits & points

    // heading
    const newTr = document.createElement("tr");
    const totalHeadTh = document.createElement("th");
    totalHeadTh.setAttribute("scope", "row");
    totalHeadTh.textContent = "Total";
    newTr.appendChild(totalHeadTh);

    // none for grade
    const gradeTotalTd = document.createElement("td");
    gradeTotalTd.textContent = "-";
    newTr.appendChild(gradeTotalTd);

    // credit total
    const totalCreditTd = document.createElement("td");
    totalCreditTd.textContent = creditsSum;
    newTr.appendChild(totalCreditTd);

    // points total
    const totalPointsTd = document.createElement("td");
    totalPointsTd.textContent = pointsSum;
    newTr.appendChild(totalPointsTd);
    tableContent.appendChild(newTr);

    // gpa
    gpaCalc.textContent = `${pointsSum}/${creditsSum} = `;
    const finalGpa = pointsSum / creditsSum;
    gpa.textContent = finalGpa.toFixed(3);

    // store this semester's points and credits
    const contentToStore = {};
    contentToStore[data.sem] = JSON.stringify({
      totalPoints: pointsSum,
      totalCredits: creditsSum,
    });
    browser.storage.local.set(contentToStore);
    await calculateCGPA();
  }

  getActiveTab().then(calc).catch(showErr);

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "update-ui") {
      updateUI(message);
    }
  });
}

browser.tabs
  .executeScript({ file: "/content-script.js" })
  .then(initScripts)
  .catch(showErr);
