import React, { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useWeb3React } from '@web3-react/core';

import {
  GetProposals,
  Vote,
  // getVotingPowers,
  // getCurrentVotingPower,
  // delegate,
  // delegateStaked,
  // delegatedTo,
} from "./governance";

import Context from "./Context";

import { Proposal, ProposalVotingPower } from "./types";

const emptyDelegation = '0x0000000000000000000000000000000000000000';

const Provider: React.FC = ({ children }) => {

  const [confirmTxModalIsOpen, setConfirmTxModalIsOpen] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isDelegated, setIsDelegated] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>();
  const [votingPowers, setVotingPowers] = useState<ProposalVotingPower[]>();
  const [currentPower, setCurrentPower] = useState<number>();
  const [isRegistered, setIsRegistered] = useState<boolean>();
  const [isRegistering, setIsRegistering] = useState<boolean>();

  const web3context = useWeb3React();
  const { account, library } = web3context;

  const fetchProposals = useCallback(
    async (provider:any) => {
      try{
        let proposals = await GetProposals(provider);
        setProposals(proposals);
      } catch ( e ) {
        // console.log('error fetching proposals: ', e.message );
      }

  }, [setProposals, library]);


  const handleVote = useCallback(
    async (proposalid: number, support: boolean) => {
      await Vote(library, proposalid, support);
        setConfirmTxModalIsOpen(false);
        setIsVoting(true);
    },
    [account, setConfirmTxModalIsOpen, setIsVoting]
  );
  
  useEffect(() => {
    if (account && library) {
      fetchProposals(library);
    }
  }, [library, fetchProposals]);

  useEffect(() => {
      fetchProposals(library);
      let refreshInterval = setInterval(fetchProposals, 100000);
      return () => clearInterval(refreshInterval);
  }, [library, fetchProposals]);

  return (
    <Context.Provider
      value={{
        proposals,
        isDelegated,
        onVote: handleVote
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
