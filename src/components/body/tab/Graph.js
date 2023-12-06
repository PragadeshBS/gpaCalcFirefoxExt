import Plotly from "plotly.js-basic-dist";
import { useEffect, useState } from "preact/hooks";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

const Graph = ({ pointsCredits }) => {
  const semesters = Object.keys(pointsCredits);
  const [cgpaYValues, setCgpaYValues] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const handleDarkModeChange = (event) => {
      setIsDarkMode(event.matches);
    };
    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);
    setIsDarkMode(darkModeMediaQuery.matches);
    return () => {
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
    };
  }, []);

  useEffect(() => {
    function populateCgpaYValues() {
      let temp = [],
        creditsSum = 0,
        pointsSum = 0;
      for (let i = 0; i < semesters.length; i++) {
        const semester = semesters[i];
        pointsSum += pointsCredits[semester]["totalPoints"];
        creditsSum += pointsCredits[semester]["totalCredits"];
        temp.push(pointsSum / creditsSum);
      }
      setCgpaYValues(temp);
    }
    populateCgpaYValues();
  }, [pointsCredits]);

  return (
    <div className="my-3 w-fit mx-auto overflow-auto">
      <Plot
        data={[
          {
            x: semesters,
            y: Object.keys(pointsCredits).map(
              (key) =>
                pointsCredits[key]["totalPoints"] /
                pointsCredits[key]["totalCredits"]
            ),
            type: "scatter",
            mode: "lines+markers",
            marker: { color: isDarkMode ? "#ffff00" : "#ff0000" },
            name: "GPA",
          },
          {
            x: semesters,
            y: cgpaYValues,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: isDarkMode ? "#00ffff" : "#0000ff" },
            name: "CGPA",
          },
        ]}
        layout={{
          width: 600,
          height: 450,
          title: "CGPA & GPA over the semesters",
          plot_bgcolor: isDarkMode ? "#374151" : "#FFF",
          paper_bgcolor: isDarkMode ? "#1f2937" : "#FFF",
          font: {
            color: isDarkMode ? "white" : "black",
          },
          xaxis: {
            gridcolor: isDarkMode ? "#4a5568" : "#ddd",
          },
          yaxis: {
            gridcolor: isDarkMode ? "#4a5568" : "#ddd",
          },
        }}
      />
    </div>
  );
};

export default Graph;
