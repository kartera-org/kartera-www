import { useContext } from "react";

import { KarteraContext } from "contexts/Kartera";

const useKartera = () => {
  return {
    ...useContext(KarteraContext),
  };
};

export default useKartera;
