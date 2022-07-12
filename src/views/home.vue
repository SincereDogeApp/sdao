<template>
  <div class="home">
    <img src="../assets/logo2.gif" />
    <div class="flex">
      <div class="wrap">
        <p>SDAO Price</p>
        <p>${{ price }}</p>
      </div>
      <div class="wrap">
        <p>Treasury Balance</p>
        <p>{{ treasuryBalance }} BNB</p>
      </div>
    </div>
    <div class="flex">
      <div class="wrap">
        <p>Marketcap</p>
        <p>${{ marketCap }}</p>
      </div>
      <div class="wrap">
        <p>Total Funds Sent</p>
        <p>{{ totalStake }} BNB</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import useTreasury from "../hooks/treasury";
import usePropsal from "../hooks/propsal";
import useStake from "../hooks/stake";
import { ethers } from "ethers";
import math from "@/utils/math";

export default defineComponent({
  setup() {
    const { treasuryBalance } = useTreasury();
    const { contractPropsal } = usePropsal();
    const { marketCap, getSdaoPrice, contractCult } = useStake();
    const totalStake = ref(0);
    const price = ref("0");
    const init = async () => {
      totalStake.value = (await contractPropsal.nextInvesteeFund()) * 80 - 40;
      if(totalStake.value<0){
        totalStake.value=0;
      }
      price.value = await getSdaoPrice();
      const number = Number(
        ethers.utils.formatEther(await contractCult.totalSupply())
      );
      marketCap.value = math.multiplication(number, price.value, 4);
    };

    init();
    return {
      treasuryBalance,
      marketCap,
      totalStake,
      price,
    };
  },
});
</script>
<style scoped>
.home {
  width: 80%;
  min-height: 80vh;
  margin: 0 auto;
}
img {
  position: absolute;
  left: 50%;
  top: 5rem;
  width: 4.6rem;
  margin-left: -2.3rem;
  z-index: 1;
}
/* p {
  font-weight: bolder;
} */
.flex {
  padding-top: 3rem;
}
.flex {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.wrap {
  display: flex;
  width: 4.2rem;
  height: 1.6rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #fddfa0;
  box-shadow: 0px 0.04rem 0px 0px #dbb055;
  border-radius: 0.2rem;
  z-index: 2;
}
p:nth-of-type(1) {
  margin-bottom: 0.1rem;
  font-size: 0.4rem;
  color: #000;
}
p:nth-of-type(2) {
  font-size: 0.4rem;
  color: #000;
}
@media screen and (min-width: 900px) {
  .wrap {
    width: 6rem;
  }
}
@media screen and (max-width: 900px) {
  .home {
    width: 90%;
  }
  .flex:nth-of-type(1) {
    padding-top: 1.5rem;
  }
  .flex:nth-of-type(2) {
    padding-top: 5.5rem;
  }
}
</style>
