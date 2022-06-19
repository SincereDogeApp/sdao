<template>
  <div class="delegate">
    <div class="box" @click="handleClick('/propsals')"></div>
    <div class="container">
      <p class="f20">Delegate Vote</p>
      <div class="f16 alignleft">
        Before you can vote, you must assign your voting rights to either
        yourself, or you can assign it to a third party.
      </div>
      <div class="f16 alignleft mt10">
        Enter the BNB address of wallet to receive the voting rights.
      </div>
      <el-input v-model="address" />
      <el-button
        @click="handleDelegate"
        :loading="loading"
        :disabled="address === ''"
        >Delegate</el-button
      >
      <p class="f14 alignleft mt10">
        By delegating your voting rights, you allow the recipient user to vote
        any decision on a proposal without your consent, however you can take
        back your rights by entering your address above and delegating back to
        yourself. The recipient does not take any ownership of your dSDAO
        tokens.
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import useStake from "../hooks/stake";
import useWallet from "../hooks/wallet";
import { ElNotification } from "element-plus";

export default defineComponent({
  setup() {
    const { contractDcult, signer } = useStake();
    const router = useRouter();
    const address = ref("");
    const loading = ref(false);
    const { contractCallback } = useWallet();

    const handleClick = (param: string) => {
      router.push(param);
    };
    const handleDelegate = async () => {
      loading.value = true;
      try {
        const result = await contractDcult
          .connect(signer)
          .delegate(address.value);
        await contractCallback(result);
      } catch (e: any) {
        console.log(e);
        ElNotification({
          title: "",
          message: "Guardian cannot be delegated",
          type: "error",
        });
      }
      loading.value = false;
    };
    return {
      address,
      loading,
      handleClick,
      handleDelegate,
    };
  },
});
</script>
<style scoped>
.delegate {
  position: relative;
  width: 9rem;
  height: 74vh;
  margin: 0 auto;
  padding-top: 6vh;
  text-align: center;
  background-color: #fddfa0;
}
.el-input {
  margin-top: 0.5rem;
}
.el-button {
  width: 3rem;
  margin-top: 0.5rem;
}
.f20 {
  font-size: 0.6rem;
}
.f16 {
  font-size: 0.5rem;
}
.f14 {
  font-size: 0.4rem;
}
.alignleft {
  text-align: left;
}
.mt10 {
  margin-top: 0.5rem;
}
.container {
  width: 8rem;
  height: 68vh;
  margin: 0 auto;
  overflow: scroll;
}
.box {
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  width: 0.3rem;
  height: 0.3rem;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
  transform: rotate(45deg);
  cursor: pointer;
}
@media screen and (min-width: 900px) {
  .delegate {
    width: 18rem;
  }
  .container {
    width: 80%;
  }
}
</style>
