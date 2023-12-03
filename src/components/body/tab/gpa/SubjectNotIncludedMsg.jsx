const SubjectNotIncludedMsg = () => {
  return (
    <div className="text-xs py-3 text-red-600 dark:text-red-300">
      <div>
        * Subject NOT included in calculation as it does not have any credits or
        has not been assigned a valid grade yet
      </div>
    </div>
  );
};

export default SubjectNotIncludedMsg;
