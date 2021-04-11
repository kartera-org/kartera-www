import React, { useCallback, useState, useEffect, useMemo } from "react";

import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";

import numeral from "numeral";
import { Button, Modal, CardContent, CardHeader, Card } from "@material-ui/core";

// import FancyValue from "components/FancyValue";
// import Split from "components/Split";

// import useBalances from "hooks/useBalances";
// import useVesting from "hooks/useVesting";
interface ModalProps {
  isOpen:boolean;
  onDismiss?:any;
}
const WalletModal: React.FC<ModalProps> = ({ isOpen, onDismiss }) => {
  const [walletModalIsOpen, setWalletModalIsOpen] = useState(false);
  const { reset } = useWallet();
  const getDisplayBalance = useCallback((value?: BigNumber) => {
    if (value) {
      return numeral(value).format("0.00a");
    } else {
      return "--";
    }
  }, []);

  
  // const ClaimButton = useMemo(() => {
  //   const hasVestedYams = vestedBalance && vestedBalance.toNumber() > 0;
  //   if (isClaiming) {
  //     return <Button disabled full text="Claiming..." variant="secondary" />;
  //   }
  //   if (hasVestedYams) {
  //     return <Button full onClick={onClaim} text="Claim YAMs" />;
  //   }
  //   return <Button disabled full text="Claim" variant="secondary" />;
  // }, [isClaiming, onClaim, vestedBalance]);


  const handleSignOut = useCallback(() => {
    localStorage.removeItem("account");
    localStorage.removeItem("walletProvider");
    setWalletModalIsOpen(false);
    reset();
    if (onDismiss) {
      onDismiss();
    }
  }, [reset]);

  useEffect(() => {
    isOpen = !isOpen;
  }, [setWalletModalIsOpen]);

  return (
    <Modal open={isOpen} onClose={onDismiss}>
      <>
      <Card>
      <CardHeader text="My Wallet" />
      <CardContent>

      </CardContent>

          <Button onClick={onDismiss} variant="contained" >Cancel</Button>

          <Button onClick={handleSignOut}>Sign Out</Button>

      </Card>
      </>
    </Modal>
  );
};

export default WalletModal;
