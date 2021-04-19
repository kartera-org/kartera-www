import { useContext } from "react";

import { FarmContext } from "contexts/Farm";

const useFarm = () => {
  return {
    ...useContext(FarmContext),
  };
};

export default useFarm;
