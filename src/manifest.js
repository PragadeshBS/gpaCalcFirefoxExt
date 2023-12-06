import pkg from "../package.json";

const manifest = {
  name: "CGPA Calculator - CEG & MIT, AU",
  version: "3.1",
  description: "CGPA calculator for CEG & MIT, Anna University.",
  browser_action: {
    default_icon: "icons/ico-32.png",
    default_popup: "src/entries/popup/index.html",
  },
  icons: {
    48: "icons/ico-48.png",
    96: "icons/ico-96.png",
  },
  permissions: ["*://acoe.annauniv.edu/sems/student/mark/*", "storage"],
};

export function getManifest() {
  return {
    author: pkg.author,
    manifest_version: 2,
    ...manifest,
  };
}
