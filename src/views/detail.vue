<template>
  <div class="pending">
    <div class="box" @click="handleClick('/propsals')"></div>
    <p class="f26">Proposal</p>
    <div class="container">
      <div>
        <span class="underline">Proposal:</span>
        <span class="f20">{{ detail.projectName }}</span>
      </div>
      <div>
        <p class="underline">Guardian Information:</p>
        <p class="f24">Guardian Name -</p>
        <p class="f20">{{ detail.guardianProposal }}</p>
        <p class="f24">Guardian Social Handle -</p>
        <p class="f20">{{ detail.guardianDiscord }}</p>
        <p class="f24">Guardian Wallet -</p>
        <p class="f20">{{ detail.guardianAddress }}</p>
      </div>
      <div>
        <p class="underline">Project Summary</p>
        <p class="f20">{{ detail.shortDescription }}</p>
      </div>
      <div>
        <p class="underline">Project Docs</p>
        <p class="f24">Lite/Whitepaper -</p>
        <p class="f20">{{ detail.file }}</p>
      </div>
      <div>
        <p class="f24">Social Docs -</p>
        <p class="f20">{{ detail.socialChannel }}</p>
        <p class="f24">Audits -</p>
        <p class="f20">{{ detail.checkbox1 ? "none" : detail.links }}</p>
      </div>
      <!-- <div>
        <p class="underline">SDAO Reward Allocation</p>
        <p class="f20">{{ detail.rate }}% of Total Supply</p>
      </div> -->
      <!-- <div>
        <p class="underline">Reward Distribution Terms</p>
        <p class="f20">{{ detail.perNumber }} Per {{ detail.time }}</p>
      </div> -->
      <div>
        <p class="underline">Investment BNB Wallet</p>
        <p class="f20">0x4784b255BA0d77e7C54686DcD74c2E2a2d72fe8D</p>
      </div>
      <div v-if="detail.checkbox1">
        <p class="underline">Tips:</p>
        <p class="f20 red">
          Whether this project passes KYC/Audit or not. Always DYOR.
        </p>
      </div>
      <div class="flex mt-10">
        <el-button
          v-if="res.propsalState < 2"
          @click="handleApprove(1)"
          :loading="loading1"
          :disabled="loading2 || !hasVotes"
          >Approve</el-button
        >
        <el-button
          v-if="res.propsalState < 2"
          @click="handleApprove(0)"
          :loading="loading2"
          :disabled="loading1 || !hasVotes"
          >Reject</el-button
        >
        <el-button
          v-if="executeVisible"
          @click="handleExecute"
          :loading="loading5"
          :disabled="loading3"
          >Execute</el-button
        >
        <el-button
          v-if="queueVisible"
          @click="handleQueue"
          :loading="loading4"
          :disabled="loading3"
          >Queue</el-button
        >
        <el-button
          v-if="cancelVisible"
          :disabled="loading4 || loading5"
          @click="handleCancel"
          :loading="loading3"
          >Cancel</el-button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import usePropsal from "../hooks/propsal";
import useWallet from "../hooks/wallet";
import useStake from "../hooks/stake";
import { ElNotification } from "element-plus";
import { ethers } from "ethers";

interface detail {
  projectName?: string;
  ids?: number;
  propsalState?: number;
  proposer?: string;
  description?: string;
  shortDescription?: string;
  wallet?: string;
  file?: string;
  rate?: number;
  socialChannel?: string;
  links?: string;
  guardianDiscord?: string;
  guardianAddress?: string;
  guardianProposal?: string;
  perNumber?: number;
  time?: string;
  startBlockNumber?: number;
  etas?: number;
  checkbox1?: boolean;
}
export default defineComponent({
  setup() {
    const hasVotes = ref(false);
    const loading1 = ref(false);
    const loading2 = ref(false);
    const loading3 = ref(false);
    const loading4 = ref(false);
    const loading5 = ref(false);
    const executeVisible = ref(false);
    const cancelVisible = ref(false);
    const queueVisible = ref(false);
    const { account, contractCallback } = useWallet();
    const { contractPropsal, signer } = usePropsal();
    const { contractDcult } = useStake();

    let detail = reactive<detail>({});
    let res = reactive<detail>({});
    res = JSON.parse(localStorage.getItem("detail")!);
    detail = JSON.parse(res.description!);
    const init = async () => {
      //获取提案状态
      const propsalState = await contractPropsal.state(res.ids);
      const propsalDetail = await contractPropsal.proposals(res.ids);

      const timelock = new Date().getTime() / 1000 > Number(propsalDetail.eta);
      console.log("适口执行", timelock);
      cancelVisible.value =
        account.value === res.proposer!.toLowerCase() &&
        ![2, 7].includes(propsalState!);

      executeVisible.value = propsalState === 5 && timelock;
      queueVisible.value = propsalState === 4;
      //查是否有票&已投
      console.log(res.startBlockNumber, "区块高度");
      console.log(account.value, "钱包地址");
      console.log(res);
      const response = await contractDcult.getPastVotes(
        account.value,
        res.startBlockNumber
      );
      const responseReceipt = await contractPropsal.getReceipt(
        res.ids,
        account.value
      );
      console.log("是否已投", responseReceipt.hasVoted);
      console.log(Number(response), "是否有票");
      hasVotes.value =
        Number(response) === 0 || responseReceipt.hasVoted ? false : true;
    };

    const handleApprove = async (type: number) => {
      if (type === 1) loading1.value = true;
      else loading2.value = true;
      try {
        const result = await contractPropsal
          .connect(signer)
          .castVote(res.ids, type, { gasLimit: "0x7a120" });
        await contractCallback(result);
        init();
      } catch (e: any) {
        console.log(e);
      }
      if (type === 1) loading1.value = false;
      else loading2.value = false;
    };
    const handleExecute = async () => {
      loading5.value = true;
      try {
        const result = await contractPropsal
          .connect(signer)
          .execute(res.ids, { gasLimit: "0x7a120" });
        await contractCallback(result);
        init();
      } catch (e: any) {
        console.log(e);
      }
      loading5.value = false;
    };
    const handleQueue = async () => {
      loading4.value = true;
      try {
        const result = await contractPropsal
          .connect(signer)
          .queue(res.ids, { gasLimit: "0x7a120" });
        console.log(result);
        const response = await result.wait();
        //合约完全成功后刷新页面
        console.log(response);
        await contractCallback(result);
        init();
      } catch (e: any) {
        console.log(e);
        ElNotification({
          title: "",
          message: e.message,
          type: "error",
        });
      }
      loading4.value = false;
    };
    const handleCancel = async () => {
      console.log("djnkdjn");
      loading3.value = true;
      try {
        const result = await contractPropsal
          .connect(signer)
          .cancel(res.ids, { gasLimit: "0x7a120" });
        console.log(result);
        await contractCallback(result);
        loading3.value = false;
        init();
      } catch (e) {
        console.log(e);
      }
    };
    watch(account, (newVal) => {
      init();
    });
    init();
    return {
      res,
      detail,
      loading1,
      loading2,
      loading3,
      loading4,
      loading5,
      hasVotes,
      queueVisible,
      cancelVisible,
      executeVisible,
      handleQueue,
      handleExecute,
      handleCancel,
      handleApprove,
    };
  },
  methods: {
    handleClick(param: string) {
      this.$router.go(-1);
    },
  },
});
</script>

<style scoped>
.red {
  color: red;
}
.mt-10 {
  margin-top: 0.5rem;
}
.pending {
  position: relative;
  width: 80%;
  height: 75vh;
  margin: 0 auto;
  padding: 5vh 0 0 0;
  background-color: #fddfa0;
}
.container {
  width: 90%;
  margin: 0 auto;
  height: 69vh;
  overflow: scroll;
}
.container div {
  text-align: left;
}
.f24 {
  width: 100%;
  margin-top: 0.2rem;
  font-size: 0.35rem;
  font-weight: 700;
  word-wrap: break-word;
}
.f20 {
  width: 100%;
  margin-top: 0.2rem;
  font-size: 0.35rem;
  word-wrap: break-word;
}
.underline {
  margin-top: 0.5rem;
  font-size: 0.4rem;
  text-decoration: underline;
}
.f26 {
  font-size: 0.5rem;
  font-weight: 700;
}
.flex {
  display: flex;
  justify-content: space-around;
}
.box {
  position: absolute;
  top: 0.5rem;
  width: 0.3rem;
  height: 0.3rem;
  margin: 0 0 0 0.5rem;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
  transform: rotate(45deg);
  cursor: pointer;
}
.el-button {
  width: 2.5rem;
}
</style>
