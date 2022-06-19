import { ref, watchEffect } from "vue";
import cult from "../abis/cult.json";
import dcult from "../abis/dcult.json";
import lp from "../abis/lp.json";
import { ethers } from "ethers";
import useWallet from "./wallet";

const addressCult = "0x8425C28e0f3fadcA56E2C31D81C2987642D7dA32";
const addressDcult = "0x149988cD83d11b35209e4b211CaCeDf8956d8Ee2";
const addressLp = "0x257edcdc224a073555a1738f3ea8e638dd2d8a84";
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
