function getCredit(subCode) {
  return dataStore.credits[subCode];
}

function gradePoint(grade) {
  switch (grade) {
    case "O":
      return 10;
    case "A+":
      return 9;
    case "A":
      return 8;
    case "B+":
      return 7;
    case "B":
      return 6;
    case "RA":
      return 0;
    default:
      return 0;
  }
}
