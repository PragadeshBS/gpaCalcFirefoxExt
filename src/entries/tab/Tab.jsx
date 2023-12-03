import { GradesProvider } from "~/context/GradesContext";
import TabBody from "./TabBody";
import { ConfigProvider } from "~/context/ConfigContext";

const Tab = () => {
  return (
    <GradesProvider>
      <ConfigProvider>
        <TabBody />
      </ConfigProvider>
    </GradesProvider>
  );
};

export default Tab;
