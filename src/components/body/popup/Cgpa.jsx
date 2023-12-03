import "./Cgpa.css";

const Cgpa = ({ storedCgpa, dataAvailableSemesters }) => {
  return (
    <div className="text-center">
      <div className="rounded-full mx-auto w-fit p-8 cgpa-display">
        <div>Your CGPA </div>
        <div className="text-4xl py-2 text-rose-700 dark:text-lime-100 font-bold">
          {storedCgpa}
        </div>
      </div>
      <div className="pt-3">
        Based on data from semester{dataAvailableSemesters.length > 1 && "s"}{" "}
        <span>{dataAvailableSemesters.join(", ")}</span>
      </div>
    </div>
  );
};

export default Cgpa;
