import { ref, watchEffect } from "vue";
import cult from "../abis/cult.json";
import dcult from "../abis/dcult.json";
import lp from "../abis/lp.json";
import { ethers } from "ethers";
import useWallet from "./wallet";

const addressCult = "0x0edF75489041a0eFE404E81b149Cfd8CEFAe4Fa0";
const addressDcult = "0x441B5C322Ee8733326C37271142e4155066aAa7f";
const addressLp = "0xAb5A63758bBbcbf5cAfb8F6ee4c5E12150d99880";
const addressBNBLp = "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16";
export default function useCult() {
  const cultBalance = ref("0");
  const dcultBalance = ref("0");
  const claimBalance = ref("0");
  const marketCap = ref(0);
  const { account } = useWallet();
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  const contractDcult = new ethers.Contract(addressDcult, dcult, provider);
  const contractCult = new ethers.Contract(addressCult, cult, provider);
  const contractLp = new ethers.Contract(addressLp, lp, provider); //bnb/eth
  const contractBNBLp = new ethers.Contract(addressBNBLp, lp, provider);

  const toNonExponential = (num: any) => {
    const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    const cal = num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
    return Number(cal).toFixed(14);
  };
  const getSdaoPrice = async () => {
    const sdaoBnb = await contractLp.getReserves();
    const bnbBusdt = await contractBNBLp.getReserves();
    const a = sdaoBnb[1] / sdaoBnb[0];
    const b = bnbBusdt[1] / bnbBusdt[0];
    return toNonExponential(a * b);
  };

  const getBalance = async () => {
    if (account.value) {
      try {
        cultBalance.value = ethers.utils.formatEther(
          await contractCult.balanceOf(account.value)
        );
        dcultBalance.value = ethers.utils.formatEther(
          await contractDcult.balanceOf(account.value)
        );
        claimBalance.value = ethers.utils.formatEther(
          await contractDcult.pendingCULT(0, account.value)
        );
        // const result = await contractLp.getReserves();

        // console.log("价格", result);
        // console.log("价格", result[0] / result[1]);
      } catch (e) {
        console.log(e);
      }
    }
  };
  // (async () => {
  //   const number = Number(
  //     ethers.utils.formatEther(await contractCult.totalSupply())
  //   );
  //   marketCap.value = math.multiplication(number, 1, 4);
  // })();
  watchEffect(async () => {
    getBalance();
  });

  return {
    cultBalance,
    dcultBalance,
    claimBalance,
    contractDcult,
    contractCult,
    marketCap,
    // contractLp,
    signer,
    addressCult,
    addressDcult,
    getBalance,
    getSdaoPrice,
  };
}
