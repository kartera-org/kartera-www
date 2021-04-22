import eth from "assets/images/eth.png";
import link from "assets/images/link.png";
import wbtc from "assets/images/wbtc.png";
import uni from "assets/images/uni.png";
import aave from "assets/images/aave.png";
import snx from "assets/images/snx.png";
import mkr from "assets/images/mkr.png";
const names = ['eth', 'link', 'wbtc', 'uni', 'aave', 'snx', 'mkr'];

const getIcon=(imgName:string|undefined)=> {
    imgName = imgName?imgName.toLowerCase():'';
    switch(imgName){
        case 'eth':
            return eth;
        case 'link':
            return link;
        case 'wbtc':
            return wbtc;
        case 'uni':
            return uni;
        case 'aave':
            return aave;
        case 'snx':
            return snx;
        case 'mkr':
                return mkr;
        case 'mmkr':
            return mkr;
        case 'mweth':
            return eth;
        case 'mwbtc':
            return wbtc;
        case 'muni':
            return uni;
        default:
            return eth;
    }
}

export default getIcon;