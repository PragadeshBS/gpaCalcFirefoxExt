import { createContext } from "preact";
import { useContext, useReducer } from "preact/hooks";

const GradesContext = createContext(null);
const GradesDispatchContext = createContext(null);

export function GradesProvider({ children }) {
  const [grades, dispatch] = useReducer(gradesReducer, {});

  return (
    <GradesContext.Provider value={grades}>
      <GradesDispatchContext.Provider value={dispatch}>
        {children}
      </GradesDispatchContext.Provider>
    </GradesContext.Provider>
  );
}

export function useGrades() {
  const context = useContext(GradesContext);
  if (context === undefined) {
    throw new Error("useGrades must be used within a GradesProvider");
  }
  return context;
}

export function useGradesDispatch() {
  const context = useContext(GradesDispatchContext);
  if (context === undefined) {
    throw new Error("useGradesDispatch must be used within a GradesProvider");
  }
  return context;
}

function gradesReducer(state, action) {
  switch (action.type) {
    case "SET_GRADES": {
      return action.grades;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
