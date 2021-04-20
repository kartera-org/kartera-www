import GovAlpha from "constants/abi/GovernorAlpha.json";
import { ethers } from 'ethers';
import * as utils from "utils/index";
import { GovAddress } from "constants/tokenAddresses";

const ProposalState = [
    {val:'Pending'},
    {val:'Active'},
    {val:'Canceled'},
    {val:'Defeated'},
    {val:'Succeeded'},
    {val:'Queued'},
    {val:'Expired'},
    {val:'Executed'},
];

export const GovContract = (provider: any) => {
    return new ethers.Contract(GovAddress, GovAlpha.abi, provider);
}

export const GetProposalsCount = async (provider: any)=>{
    const govContract = GovContract(provider);
    try{
        let n = govContract.proposalCount();
        return n;
    }catch(e){
        throw(e);
    }
}

export const GetProposals = async (provider: any)=>{
    const govContract = GovContract(provider);
    try{
        let count = await govContract.proposalCount();
        let proposals = new Array();
        let eventFilter = govContract.filters.ProposalCreated()
        let events = await govContract.queryFilter(eventFilter);
        for(let i=0; i<events.length; i++){
            let id = events[i].args?.id.toString();
            let description = events[i].args?.description;
            let proposer = events[i].args?.proposer;
            let proposal = await govContract.proposals(id.toString());
            let proposalinfo = await govContract.getActions(id.toString());
            let target = proposalinfo[0][0];
            let state = await govContract.state(id.toString());
            let stateName = ProposalState[state].val;
            let data = DecodeProposalData(proposalinfo[2][0], proposalinfo[3][0]);
            let item = { id:id, description:description, signature:proposalinfo[2][0], proposer:proposer, targets:proposalinfo[0], stateName:stateName, inputData:data, forVotes: proposal.forVotes, againstVotes:proposal.againstVotes}
            proposals = [item, ...proposals];
        }
        return proposals;
    }catch(e){
        throw (e);
    }
}

export const Vote = async (provider: any, id:any, support:boolean)=>{
    const govContract = GovContract(provider);
    let signer = await provider.getSigner(0);
    try {
        govContract.connect(signer).castVote(id, support);
    } catch ( e ) {
        throw (e);
    }

}

export const DecodeProposalData = (signature:string, data:string) => {
    let inputs = signature.toString().split('(');
    inputs = inputs[1].split(')');
    inputs = inputs[0].split(',');
    let info = ethers.utils.defaultAbiCoder.decode( inputs, data);
    return info;
}
