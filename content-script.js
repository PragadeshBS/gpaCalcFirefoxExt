(function () {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  function getActiveTab() {
    return browser.tabs.query({ active: true, currentWindow: true });
  }

  function calculateGPA() {
    const regulation = document.querySelector("#regulation").value;
    const branch = document.querySelector("#branch").value;
    const semester = document.querySelector("#semester").value;
    const subjects = document.querySelector("#subjects").children;
    let grades = [];
    for (const subject of subjects) {
      const cells = subject.children;
      const subCode = cells[1].textContent;
      const grade = cells[cells.length - 1].textContent;
      grades.push({subCode, grade});
    }
    browser.runtime.sendMessage({
      command: "update-ui",
      grades,
      sem: semester,
      branch: branch,
      reg: regulation,
    });
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "calculateGPA") {
      calculateGPA();
    }
  });
})();
