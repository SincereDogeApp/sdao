<template>
  <div
    class="pending"
    v-loading="loading"
    element-loading-background="rgba(0,0,0,0)"
    :fullscreen="false"
    :locks="false"
  >
    <p class="f20 title">Pending Proposals</p>
    <div class="container">
      <p v-if="arr.length === 0 && !loading" class="mt1">No Propsal</p>
      <div v-if="arr.length > 0 && !loading">
        <div class="list f14" v-for="(item, key) in arr" :key="key">
          <p>
            <span
              class="c27272d underline cursor"
              @click="handleClick('/detail', item)"
              >Proposal({{ item.id }}):</span
            >{{ item.title }}
          </p>
          <div class="back">
            <p :style="{ width: `${item.forVote}%` }"></p>
            <span>Approved</span><span>{{ item.forVote }}%</span>
          </div>
          <div class="back">
            <p :style="{ width: `${item.againstVote}%` }"></p>
            <span>Reject</span><span>{{ item.againstVote }}%</span>
          </div>
          <p class="c27272d">You Voted:<span class="title">Pending</span></p>
          <p class="c27272d">
            Ends in:<span class="title">{{
              formatSeconds(item.count.count)
            }}</span>
          </p>
          <p class="c27272d mt20">
            Approved:<span class="title">{{ item.approve }}</span>
          </p>
          <p class="c27272d">
            Rejected:<span class="title">{{ item.again }}</span>
          </p>
          <p class="c27272d">
            Total Votes:<span class="title">{{ item.totalVotes }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import usePropsal from "../hooks/propsal";
import { ethers } from "ethers";
import useCountDown from "../hooks/countDown";
import { ElLoading } from "element-plus";
interface response {
  id: number;
  forVote: number;
  againstVote: number;
  forVotes: number;
  againstVotes: number;
  endBlock: number;
  total: number;
  count: {
    count: number;
  };
  approve: number;
  again: number;
  totalVotes: number;
  startBlock: number;
  title: string;
  description: string;
  proposer: string;
  eta: number;
}
export default defineComponent({
  setup() {
    const ids = ref(0);
    const loading = ref(false);
    const arr = ref<response[]>([]);
    const { contractPropsal, provider, formatSeconds } = usePropsal();
    const router = useRouter();
    const handleClick = (param: string, item: any) => {
      const detail = JSON.stringify(item);
      localStorage.setItem("detail", detail);
      router.push(param);
    };
    const init = async () => {
      loading.value = true;
      const arrs = [];
      ids.value = (await contractPropsal.proposalCount()).toString();
      for (let i = ids.value; i > 0; i--) {
        //获取提案状态
        const propsalState = await contractPropsal.state(i);
        //监听事件
        if (propsalState > 5) break;
        console.log("提案状态", propsalState);
        if (propsalState < 2 || propsalState === 4 || propsalState === 5) {
          const response: response = await contractPropsal.proposals(i);
          const event = await contractPropsal.queryFilter(
            contractPropsal.filters.ProposalCreated(),
            Number(response.startBlock) - 1,
            Number(response.startBlock)
          );
          const description = JSON.parse(
            JSON.parse(event[0]!.args!.description).jsonStr
          );
          console.log(Number(response.startBlock));
          console.log("打印内容");
          console.log(response);

          const title = description.projectName;
          const nowBlock = await provider.getBlockNumber();
          const endsIn = (response.endBlock - nowBlock) * 3;

          const again = Number(ethers.utils.formatEther(response.againstVotes));
          const approve = Number(ethers.utils.formatEther(response.forVotes));
          const totalVotes = again + approve;
          const againstVote =
            again === 0 ? 0 : ((again / totalVotes) * 100).toFixed(2);
          console.log("反对票", againstVote, again, approve);
          const forVote =
            approve === 0 ? 0 : ((approve / totalVotes) * 100).toFixed(2);
          const { state } = useCountDown(endsIn);
          arrs.push(
            Object.assign(
              {
                ids: Number(response.id),
                count: state,
                totalVotes,
                title,
                propsalState,
                forVote,
                again,
                approve,
                againstVote,
                startBlockNumber: Number(response.startBlock),
                proposer: response.proposer,
                description: JSON.stringify(description),
              },
              response
            )
          );
        }
      }
      arr.value = arrs;
      loading.value = false;
    };
    console.log("被执行");
    init();
    return {
      arr,
      loading,
      init,
      useCountDown,
      handleClick,
      formatSeconds,
    };
  },
});
</script>
<style scoped>
.pending {
  width: 90%;
  height: 77vh;
  margin: 0 auto;
  padding: 3vh 0 0 0;
  background-color: #fddfa0;
}
.mt1 {
  margin-top: 5rem;
  font-size: 0.4rem;
}
.container {
  width: 95%;
  margin: 0 auto;
  height: 68vh;
  overflow-y: scroll;
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
.c27272d {
  color: #000;
}
.list {
  margin-top: 0.5rem;
  padding: 0.2rem 0 0.2rem 0.2rem;
  text-align: left;
  border: 0.05rem solid #e6965b;
  border-radius: 0.1rem;
}
.underline {
  text-decoration: underline;
  cursor: pointer;
}
.mt10 {
  margin-top: 0.1rem;
}
.mt20 {
  margin-top: 0.3rem;
}
.back {
  position: relative;
  display: flex;
  width: 80%;
  height: 0.5rem;
  margin: 0.2rem 0;
  justify-content: space-between;
  border: 1px solid #000;
}
.back span {
  z-index: 1;
}
.back p {
  position: absolute;
  left: -1px;
  right: 20%;
  top: -1px;
  bottom: -1px;
  z-index: 0;
  background: #e58b5a;
}
@media screen and (min-width: 900px) {
  .pending {
    width: 18rem;
  }
  .container {
    width: 80%;
  }
}
</style>
