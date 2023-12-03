import { createContext } from "preact";
import { useContext, useReducer } from "preact/hooks";
import { appConstants } from "~/constants";

const ConfigContext = createContext(null);
const ConfigDispatchContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, dispatch] = useReducer(configReducer, {});

  return (
    <ConfigContext.Provider value={config}>
      <ConfigDispatchContext.Provider value={dispatch}>
        {children}
      </ConfigDispatchContext.Provider>
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}

export function useConfigDispatch() {
  const context = useContext(ConfigDispatchContext);
  if (context === undefined) {
    throw new Error("useConfigDispatch must be used within a ConfigProvider");
  }
  return context;
}

function configReducer(state, action) {
  switch (action.type) {
    case "SET_NAAN_MUDHALVAN_CREDITS": {
      return {
        ...state,
        [appConstants.NAAN_MUDHALVAN_CONFIG_KEY]: action.naanMudhalvanCredits,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
