import { reactive, ref, watchEffect } from "vue";
import { ElNotification } from "element-plus";
import detectEthereumProvider from "@metamask/detect-provider";

const account = ref("");
export default function useWallet() {
  const init = async () => {
    const provider: any = await detectEthereumProvider();
    console.log(provider.isConnected());
    console.log(window);
    if (provider) {
      if (provider.isConnected()) {
        const chainId = await getChainId();

        if (chainId !== "0x38") {
          await changeNetwork(provider);
        } else {
          account.value = await getAccount(provider);
        }
      } else {
        account.value = await getAccount(provider);
      }
    } else {
      ElNotification({
        title: "Warning",
        message: "pelase install Metamask",
        type: "warning",
      });
    }
  };
  const getChainId = async () => {
    const chainId = await (window as any).ethereum.request({
      method: "eth_chainId",
    });
    return chainId;
  };
  const getAccount = async (provider: any) => {
    const arr = await provider.request({
      method: "eth_requestAccounts",
    });
    provider.on("disconnect", () => {
      account.value = "";
      window.location.reload();
    });
    provider.on("accountsChanged", (arr: any) => {
      account.value = arr[0];
    });
    provider.on("chainChanged", (chainId: string) => {
      if (chainId !== "0x38") changeNetwork(provider);
      window.location.reload();
    });
    return arr[0];
  };
  const changeNetwork = async (provider: any) => {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }],
    });
  };
  //合约回调处理
  const contractCallback = async (callback: any) => {
    console.log("进入回调");
    try {
      const res = await callback.wait();
      console.log("最终结果");
      console.log(res);
      if (res.status === 1) {
        ElNotification({
          title: "",
          message: "Transaction successful",
          type: "success",
        });
      } else {
        if (res.reason === "repriced") {
          ElNotification({
            title: "",
            message: "Transaction successful",
            type: "success",
          });
          return;
        }
        if (res.reason === "cancelled") {
          ElNotification({
            title: "",
            message: "Transaction cancel",
            type: "warning",
          });
          return;
        }
      }
    } catch (e: any) {
      ElNotification({
        title: "",
        message: e.message,
        type: "error",
      });
    }
  };

  return {
    init,
    contractCallback,
    account,
  };
}
