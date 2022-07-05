import { ethers } from "ethers";
import abi from "@/abis/Governance.json";

const address = "0x7a587969b25CEd1364f3Be3a84eBb285e482777E";

//0x0831172B9b136813b0B35e7cc898B1398bB4d7e7
export default function usePropsal() {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  const contractPropsal = new ethers.Contract(address, abi, provider);

  const encodeParameters = (types: string[], values: any[]) => {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
  };
  const formatSeconds = (value: number) => {
    if (value < 0) return "00:00:00";
    let theTime = parseFloat(value.toString()); // 秒
    let theTime1 = 0; // 分
    let theTime2 = 0; // 小时
    if (theTime > 60) {
      theTime1 = parseInt((theTime / 60).toString());
      theTime = parseInt((theTime % 60).toString());
      if (theTime1 > 60) {
        theTime2 = parseInt((theTime1 / 60).toString());
        theTime1 = parseInt((theTime1 % 60).toString());
      }
    }
    let result =
      parseInt(theTime.toString()) >= 10
        ? parseInt(theTime.toString())
        : `0${parseInt(theTime.toString())}`;
    if (theTime1 > 0) {
      result =
        "" +
        (parseInt(theTime1.toString()) >= 10
          ? parseInt(theTime1.toString())
          : `0${parseInt(theTime1.toString())}`) +
        ":" +
        result;
    }
    if (theTime2 > 0) {
      result =
        "" +
        (parseInt(theTime2.toString()) >= 10
          ? parseInt(theTime2.toString())
          : `0${parseInt(theTime2.toString())}`) +
        ":" +
        result;
    }
    return result;
  };
  return {
    contractPropsal,
    signer,
    address,
    provider,
    formatSeconds,
    encodeParameters,
  };
}
