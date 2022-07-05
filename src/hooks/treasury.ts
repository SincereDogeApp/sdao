import { ref } from "vue";
import treasury from "../abis/Treasury.json";
import { ethers } from "ethers";
import useWallet from "./wallet";

export default function useTreasury() {
  //     Timelock Token  0xd788104F8f3C3FfD331512EAcda2aD38FEF60657
  // Governance Token  0x55fB886F828fB1DB0f76FC98E834bc1504d58f52
  const treasuryBalance = ref("0");
  const { init } = useWallet();
  const address = "0x021143495164a586fE19F6e1a9C0B8C4120620bF";
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  const contractTreasury = new ethers.Contract(address, treasury, provider);
  const getBalance = async () => {
    try {
      treasuryBalance.value = Number(
        ethers.utils.formatEther(await provider.getBalance(address))
      ).toFixed(4);
    } catch (e) {
      console.log(e);
    }
  };
  getBalance();
  return {
    treasuryBalance,
    contractTreasury,
  };
}
