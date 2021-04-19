import BigNumber from "bignumber.js";

export interface Proposal {
  gov?: string;
  description?: string;
  stateName?: string;
  id: number;
  targets: string[];
  signatures: string[];
  signature: string;
  inputs: string[][];
  forVotes: number;
  againstVotes: number;
  start?: number;
  end?: number;
  hash: string;
  more?: string;
}

export interface ProposalVotingPower {
  hash: string;
  power: number;
  voted: boolean;
  side: boolean;
}

export interface ContextValues {
  proposals?: Proposal[];
  isDelegated: boolean;
  onVote: (proposal: number, side: boolean) => void;
}
