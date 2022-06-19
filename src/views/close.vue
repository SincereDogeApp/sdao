<template>
  <div
    class="pending"
    id="pending"
    v-loading="loading"
    element-loading-background="rgba(0,0,0,0)"
    :fullscreen="false"
    :locks="false"
  >
    <p class="f20 title">Closed Proposals</p>
    <div class="container">
      <p v-if="arr.length === 0 && !loading" class="mt1">No Propsal</p>
      <div v-if="arr.length > 0 && !loading">
        <div class="list f14" v-for="(item, key) in arr" :key="key">
          <p class="fb">
            <span
              class="c27272d underline cursor"
              @click="handleClick('/detail', item)"
              >Propsal({{ item.id }}):</span
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
          <p class="c27272d fb">
            Result:<span class="title">{{
              typeFilter(item.propsalState)
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
          <p class="c27272d">
            Ended:<span class="title"> {{ formatDateTime(item.ended) }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import usePropsal from "../hooks/propsal";
import { ethers } from "ethers";
interface response {
  id: number;
  approve: number;
  again: number;
  forVotes: number;
  forVote: string;
  againstVote: string;
  againstVotes: number;
  endBlock: number;
  total: number;
  count: {
    count: number;
  };
  totalVotes: number;
  startBlock: number;
  title: string;
  description: string;
  proposer: string;
  propsalState: number;
  ended: number;
}
export default defineComponent({
  setup() {
    const ids = ref(0);
    const arr = ref<response[]>([]);
    const loading = ref(false);
    const { contractPropsal, provider, formatSeconds } = usePropsal();

    return {
      arr,
      ids,
      loading,
      contractPropsal,
      provider,
      formatSeconds,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      this.ids = (await this.contractPropsal.proposalCount()).toString();
      const arrs = [];
      for (let i = this.ids; i > 0; i--) {
        //获取提案状态
        const propsalState = await this.contractPropsal.state(i);
        //监听事件
        if ([2, 3, 6, 7].includes(propsalState)) {
          const response: response = await this.contractPropsal.proposals(i);
          const event = await this.contractPropsal.queryFilter(
            this.contractPropsal.filters.ProposalCreated(),
            Number(response.startBlock) - 1,
            Number(response.startBlock)
          );
          const description = JSON.parse(
            JSON.parse(event[0]!.args!.description).jsonStr
          );

          const title = description.projectName;
          //const nowBlock = await this.provider.getBlockNumber();
          const endsIn = await this.provider.getBlock(
            Number(response.endBlock)
          );

          const again =
            Number(ethers.utils.formatEther(response.againstVotes)) || 0; //反对票

          const approve =
            Number(ethers.utils.formatEther(response.forVotes)) || 0; //赞成票
          const totalVotes = again + approve; //总票
          const againstVote =
            again === 0 ? 0 : ((again / totalVotes) * 100).toFixed(2);
          console.log("反对票", againstVote, again, approve);
          const forVote =
            approve === 0 ? 0 : ((approve / totalVotes) * 100).toFixed(2);
          arrs.push(
            Object.assign(
              {
                ids: Number(response.id),
                totalVotes,
                title,
                again,
                approve,
                propsalState,
                forVote,
                againstVote,
                startBlockNumber: Number(response.startBlock),
                proposer: response.proposer,
                description: JSON.stringify(description),
                ended: endsIn.timestamp * 1000,
              },
              response
            )
          );
        }
      }
      this.arr = arrs;
      this.loading = false;
    },
    handleClick(param: string, item: any) {
      const detail = JSON.stringify(item);
      localStorage.setItem("detail", detail);
      this.$router.push(param);
    },
    formatDateTime(data: number) {
      const date: Date = new Date(data);
      const year: string | number = date.getFullYear();
      let month: string | number = date.getMonth() + 1;
      let day: string | number = date.getDate();

      let hour: string | number = date.getHours();
      let minute: string | number = date.getMinutes();
      let second: string | number = date.getSeconds();

      if (month < 10) {
        month = "0" + month;
      }

      if (day < 10) {
        day = "0" + day;
      }

      if (hour < 10) {
        hour = "0" + hour;
      }

      if (minute < 10) {
        minute = "0" + minute;
      }

      if (second < 10) {
        second = "0" + second;
      }

      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    typeFilter(data: number) {
      // state <2 Pending Proposals  ,>2 Closed Proposals
      // 0 Pending
      // 1 Active   这个前端也显示 Pending    才能投票
      // 2 Canceled
      // 3 Defeated
      // 4 Succeeded 执行queue
      // 5 Queued 执行execute
      // 6 Expired
      // 7 Executed
      switch (data) {
        case 2:
          return "Canceled";
        case 3:
          return "Defeated";
        case 6:
          return "Expired";
        case 7:
          return "Executed";
      }
    },
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
.fb {
  font-weight: bold;
}
.mt1 {
  margin-top: 2rem;
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
  border: 1px solid #e6965b;
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
