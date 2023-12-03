const GpaDisplay = ({ totalPoints, totalCredits }) => {
  return (
    <div className="text-center mt-3">
      <div>
        GPA ={" "}
        <span>
          {totalPoints} / {totalCredits}
        </span>
      </div>
      <span className="text-2xl font-semibold py-2">
        {totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(3)}
      </span>
    </div>
  );
};

export default GpaDisplay;
