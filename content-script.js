(function () {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  async function calculateGPA() {
    // do not run if not on the grades page
    if (window.location.href.indexOf("acoe.annauniv.edu") == -1) {
      browser.runtime.sendMessage({
        command: "showErr",
        errMessage: "Not on the grades page",
      });
      return;
    }
    const regulation = document.querySelector("#regulation").value;
    const branch = document.querySelector("#branch").value;
    const semester = document.querySelector("#semester").value;
    const subjects = document.querySelector("#subjects").children;

    // do not run if there are no subjects in the table (occurs while loading the page)
    if (subjects.length == 0) {
      browser.runtime.sendMessage({
        command: "showErr",
        errMessage: "No subjects found",
      });
      return;
    }

    let grades = [];
    for (const subject of subjects) {
      const cells = subject.children;
      const subCode = cells[1].textContent;
      const grade = cells[cells.length - 1].textContent;
      grades.push({ subCode, grade });
    }

    // get data of stored semesters from local storage and add the current semester if not present
    const storedData = await browser.storage.local.get();
    let semesters = storedData.semesters;
    if (semesters == undefined) {
      semesters = [parseInt(semester)];
    } else {
      const semestersSet = new Set(semesters);
      semestersSet.add(parseInt(semester));
      semesters = [...semestersSet];
    }
    await browser.storage.local.set({ semesters });

    // store the grades in the local storage
    const obj = {
      [`${semester}-grades`]: grades,
    };
    await browser.storage.local.set(obj);

    // send the grades to popup script
    browser.runtime.sendMessage({
      command: "storeSemData",
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
