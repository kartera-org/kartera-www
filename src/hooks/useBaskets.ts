import { useContext } from "react";

import { BasketContext } from "contexts/Basket";

const useBaskets = () => {
  return {
    ...useContext(BasketContext),
  };
};

export default useBaskets;
