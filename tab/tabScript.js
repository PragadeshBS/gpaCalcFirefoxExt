let semestersWithData = [];

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
    semesters = [],
    cgpas = [],
    gpas = [];

  await browser.storage.local.get().then((localStorage) => {
    // update the cgpa table
    for (let i = 1; i <= 8; i++) {
      if (!localStorage[i + "-pointsCredits"]) {
        continue;
      }
      const thisSemGpa = localStorage[i + "-pointsCredits"];
      if (thisSemGpa["totalCredits"] == 0 || thisSemGpa["totalPoints"] == 0) {
        continue;
      }

      // add a new row to cgpa table
      const cgpaTableBody = document.getElementById("cgpa-table-body");
      const newTr = document.createElement("tr");

      // semester
      const semesterTd = document.createElement("td");
      semesterTd.textContent = i;
      newTr.appendChild(semesterTd);

      // grade points
      const gradePointsTd = document.createElement("td");
      gradePointsTd.textContent = thisSemGpa["totalPoints"];
      newTr.appendChild(gradePointsTd);

      // credits
      const creditsTd = document.createElement("td");
      creditsTd.textContent = thisSemGpa["totalCredits"];
      newTr.appendChild(creditsTd);

      // append row to table
      cgpaTableBody.appendChild(newTr);

      semesters.push(i);
      cgpaPointsSum += thisSemGpa["totalPoints"];
      cgpaCreditsSum += thisSemGpa["totalCredits"];
      gpas.push(thisSemGpa["totalPoints"] / thisSemGpa["totalCredits"]);
      cgpas.push(cgpaPointsSum / cgpaCreditsSum);
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
  plotGraph(semesters, cgpas, gpas);
}

function plotGraph(semesters, cgpas, gpas) {
  const trace1 = {
      x: semesters,
      y: cgpas,
      mode: "lines+markers",
      marker: {
        color: "orangered",
        size: 8,
      },
      line: {
        color: "orangered",
        width: 1,
      },
      name: "CGPA",
    },
    trace2 = {
      x: semesters,
      y: gpas,
      mode: "lines+markers",
      marker: {
        color: "#1d3557",
        size: 8,
      },
      line: {
        color: "#1d3557",
        width: 1,
      },
      name: "GPA",
    };
  const layout = {
    title: "CGPA Over Semesters",
    xaxis: {
      title: "Semester",
      showgrid: false,
      zeroline: false,
    },
    yaxis: {
      title: "Points",
      showline: false,
    },
  };
  Plotly.newPlot("plot", [trace1, trace2], layout);
}

function fillGpaTable(semester) {
  browser.storage.local.get().then((localStorage) => {
    const tableContent = document.getElementById("gradesTable");
    const gpaCalc = document.getElementById("gpaCalc");
    const gpa = document.getElementById("gpa");

    const thisSemGpa = localStorage[semester + "-pointsCredits"];
    const thisSemGrades = localStorage[semester + "-grades"];

    gpaCalc.textContent = `${thisSemGpa["totalPoints"]}/${thisSemGpa["totalCredits"]}`;
    gpa.textContent = (
      thisSemGpa["totalPoints"] / thisSemGpa["totalCredits"]
    ).toFixed(3);

    for (const subject of thisSemGrades) {
      const credit = getCredit(subject.subCode);
      const points = credit * gradePoint(subject.grade);
      const newTr = document.createElement("tr");

      // subcode
      const subCodeTd = document.createElement("td");
      subCodeTd.textContent = subject.subCode;
      newTr.appendChild(subCodeTd);

      // grade
      const gradeTd = document.createElement("td");
      gradeTd.textContent = subject.grade;
      newTr.appendChild(gradeTd);

      // credit
      const creditTd = document.createElement("td");
      creditTd.textContent = credit;
      newTr.appendChild(creditTd);

      // point
      const pointTd = document.createElement("td");
      pointTd.textContent = points;
      newTr.appendChild(pointTd);

      // append row to table
      tableContent.appendChild(newTr);
    }
  });
}

function getSemestersWithData() {
  browser.storage.local.get().then((localStorage) => {
    const semestersWithDataSelect = document.getElementById("gpa-cur-sem");
    const semestersWithData = localStorage.semesters;
    semestersWithData.sort();
    for (let i = 0; i < semestersWithData.length; i++) {
      const newOption = document.createElement("option");
      newOption.textContent = semestersWithData[i];
      newOption.value = semestersWithData[i];
      semestersWithDataSelect.appendChild(newOption);
    }
    semestersWithDataSelect.value = semestersWithData[0];
    fillGpaTable(semestersWithData[0]);
  });
}

function showAddonVersion() {
  const manifestData = browser.runtime.getManifest();
  const version = document.getElementById("version");
  version.textContent = manifestData.version;
}

(function updateUI() {
  showAddonVersion();
  calculateCGPA();
  getSemestersWithData();
  // update gpa table on semester change
  const semestersWithDataSelect = document.getElementById("gpa-cur-sem");
  semestersWithDataSelect.addEventListener("change", (e) => {
    const tableContent = document.getElementById("gradesTable");
    tableContent.innerHTML = "";
    fillGpaTable(e.target.value);
  });
})();
