<template>
  <div class="home">
    <img src="../assets/vote.png" />
    <div class="flex">
      <div class="wrap" @click="handleClick('/pending')">
        <p>Pending</p>
        <p>Proposals</p>
      </div>
      <div class="wrap" @click="handleClick('/submit')">
        <p>Submit</p>
        <p>Proposals</p>
      </div>
    </div>
    <div class="flex">
      <div class="wrap" @click="handleClick('/close')">
        <p>Closed</p>
        <p>Proposals</p>
      </div>
      <div class="wrap" @click="handleClick('/delegate')">
        <p>Delegate Votes</p>
        <p>{{ degateNum === "0.0" ? "0" : degateNum }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import usePropsal from "../hooks/propsal";
import useStake from "../hooks/stake";
import useWallet from "../hooks/wallet";
import { ethers } from "ethers";

export default defineComponent({
  setup() {
    const router = useRouter();
    const { signer, contractPropsal } = usePropsal();
    const { contractDcult } = useStake();
    const { account } = useWallet();
    const degateNum = ref("0");
    const handleClick = (param: string) => {
      router.push(param);
    };
    const init = async () => {
      degateNum.value = ethers.utils.formatEther(
        await contractDcult.getVotes(account.value)
      );
    };
    onMounted(() => {
      setTimeout(() => {
        init();
      }, 500);
    });
    watch(account, (newVal) => {
      init();
    });
    return {
      handleClick,
      degateNum,
      signer,
      contractPropsal,
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
  top: 5rem;
  left: 50%;
  width: 4.6rem;
  margin-left: -2.3rem;
  z-index: 1;
}
.flex {
  padding-top: 3rem;
}
.flex {
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
  cursor: pointer;
  background: #fddfa0;
  box-shadow: 0px 0.04rem 0px 0px #dbb055;
  border-radius: 0.2rem;
  z-index: 2;
}
.wrap:hover {
  background-color: rgba(242, 172, 118, 0.6);
}
p:nth-of-type(1) {
  margin-bottom: 10px;
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
