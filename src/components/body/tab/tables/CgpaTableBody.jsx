const CgpaTableBody = ({ pointsCredits, calculateGpa }) => {
  return (
    <tbody>
      {Object.keys(pointsCredits).map((sem, index) => {
        return (
          <tr
            key={index}
            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
          >
            <td className="px-6 py-4">{sem}</td>
            <td className="px-6 py-4">{pointsCredits[sem].totalPoints}</td>
            <td className="px-6 py-4">{pointsCredits[sem].totalCredits}</td>
            <td className="px-6 py-4">
              {calculateGpa(
                pointsCredits[sem].totalPoints,
                pointsCredits[sem].totalCredits
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default CgpaTableBody;
