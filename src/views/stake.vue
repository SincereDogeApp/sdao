<template>
  <div class="stake">
    <div class="flex flex-column">
      <div class="wrap">
        <p>SDAO Price</p>
        <p>${{ price }}</p>
      </div>
      <div class="wrap">
        <p>Guardiansip Token Threshold</p>
        <p>{{ thresholdToken }}</p>
      </div>
    </div>
    <div class="form">
      <div class="container">
        <p class="title">Stake SDAO</p>
        <div class="flex">
          <p class="f30">Balance</p>
          <p class="f40">{{ Number(cultBalance).toFixed(4) ?? 0 }}</p>
        </div>
        <el-input
          class="input"
          :class="errorInput1"
          type="number"
          :min="0"
          v-model="balance"
        >
          <template #append
            ><span class="cursor" @click="balance = cultBalance"
              >Max</span
            ></template
          >
        </el-input>
        <div class="btn-wrap">
          <el-button
            :loading="approveLoading"
            @click="handleApprove"
            :disabled="!account || depositLoading"
            >Approve</el-button
          >
          <el-button
            :loading="depositLoading"
            @click="handleDeposit"
            :disabled="!account || approveLoading"
            >Deposite</el-button
          >
        </div>
        <div class="flex">
          <p class="f30">dSDAO Balance</p>
          <p class="f40">{{ Number(dcultBalance).toFixed(4) ?? 0 }}</p>
        </div>
        <el-input
          class="input"
          :class="errorInput2"
          v-model="balance2"
          type="number"
        >
          <template #append
            ><span class="cursor" @click="balance2 = dcultBalance"
              >Max</span
            ></template
          >
        </el-input>
        <el-button
          :loading="withdrawLoading"
          :disabled="parseFloat(dcultBalance) <= 0 || !account"
          @click="handleWithdraw"
          >Withdraw</el-button
        >
        <div class="flex">
          <p class="f30">Claimable dSDAO</p>
          <p class="f40">{{ Number(claimBalance).toFixed(4) ?? 0 }}</p>
        </div>
        <el-button
          @click="handleClaim"
          :loading="claimLoading"
          :disabled="parseFloat(claimBalance) <= 0 || !account"
          >Claim</el-button
        >
      </div>
    </div>
    <div class="flex flex-column">
      <div class="wrap">
        <p>Treasury Balance</p>
        <p>{{ treasuryBalance }} BNB</p>
      </div>
      <div class="wrap">
        <p>Total SDAO Staked</p>
        <p>{{ totalStake }} BNB</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import useStake from "../hooks/stake";
import useWallet from "../hooks/wallet";
import usePropsal from "../hooks/propsal";
import useTreasury from "../hooks/treasury";
import { ethers } from "ethers";

import { ElNotification } from "element-plus";

export default defineComponent({
  setup() {
    const { treasuryBalance } = useTreasury();
    const { account, contractCallback } = useWallet();
    const { getSdaoPrice } = useStake();
    const approveLoading = ref(false);
    const withdrawLoading = ref(false);
    const claimLoading = ref(false);
    const depositLoading = ref(false);
    const totalStake = ref(0);
    const thresholdToken = ref("0");
    const price = ref("0");
    const { contractPropsal } = usePropsal();
    const {
      cultBalance,
      dcultBalance,
      claimBalance,
      contractCult,
      contractDcult,
      signer,
      addressDcult,
      addressCult,
      getBalance,
    } = useStake();

    (async () => {
      totalStake.value = (await contractPropsal.nextInvesteeFund()) * 25;
      console.log(contractDcult);
      try {
        const response = await contractDcult.highestStakerInPool(0, 0);
        thresholdToken.value = Number(
          ethers.utils.formatEther(response[0])
        ).toFixed(2);
      } catch (e) {
        console.log(e);
      }

      price.value = await getSdaoPrice();
    })();

    return {
      cultBalance,
      dcultBalance,
      claimBalance,
      contractCult,
      contractDcult,
      account,
      signer,
      treasuryBalance,
      addressCult,
      addressDcult,
      claimLoading,
      withdrawLoading,
      approveLoading,
      depositLoading,
      totalStake,
      thresholdToken,
      price,
      getBalance,
      contractCallback,
    };
  },
  data() {
    return {
      balance: "",
      errorInput1: "",
      balance2: "",
      errorInput2: "",
    };
  },
  methods: {
    async handleApprove() {
      if (this.balance === "" || this.balance <= "0") {
        this.errorInput1 = "error";
        return;
      }
      this.errorInput1 = ""; //报错提示
      this.approveLoading = true;
      try {
        const result = await this.contractCult
          .connect(this.signer)
          .approve(this.addressDcult, ethers.utils.parseEther(this.balance));
        await this.contractCallback(result);
      } catch (e: any) {
        ElNotification({
          title: "",
          message: e.message,
          type: "error",
        });
      }
      this.approveLoading = false;
    },
    async handleDeposit() {
      if (this.balance === "" || this.balance <= "0") {
        this.errorInput1 = "error";
        return;
      }
      this.errorInput1 = ""; //报错提示
      this.depositLoading = true;
      const allowance = ethers.utils.formatEther(
        await this.contractCult.allowance(this.account, this.addressDcult)
      );
      if (Number(allowance) < Number(this.balance)) {
        ElNotification({
          title: "",
          message: "Insufficient allowance,please approve allowance first",
          type: "warning",
        });
      } else {
        try {
          const result = await this.contractDcult
            .connect(this.signer)
            .deposit(0, ethers.utils.parseEther(this.balance), {
              gasLimit: "0x7a120",
            });
          await this.contractCallback(result);
          this.getBalance();
        } catch (e) {
          console.log(e);
        }
      }

      this.depositLoading = false;
    },
    async handleWithdraw() {
      if (this.dcultBalance === "" || this.balance2 <= "0") {
        this.errorInput2 = "error";
        return;
      }
      this.errorInput2 = ""; //报错提示
      try {
        this.withdrawLoading = true;
        const result = await this.contractDcult
          .connect(this.signer)
          .withdraw(0, ethers.utils.parseEther(this.balance2));

        await this.contractCallback(result);
        this.getBalance();
        this.withdrawLoading = false;
      } catch (e) {
        console.log(e);
        this.withdrawLoading = false;
      }
    },
    async handleClaim() {
      try {
        this.claimLoading = true;
        const result = await this.contractDcult
          .connect(this.signer)
          .claimCULT(0);

        await this.contractCallback(result);
        this.getBalance();
      } catch (e) {
        console.log(e);
      }
      this.claimLoading = false;
    },
  },
});
</script>
<style scoped lang="scss">
.row {
  margin-top: 80px;
}
.title {
  font-weight: bolder;
  font-size: 0.5rem !important;
}
.wrap {
  display: flex;
  width: 4.2rem;
  height: 1.6rem;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #fddfa0;
  box-shadow: 0px 0.04rem 0px 0px #dbb055;
  border-radius: 0.2rem;
}
.flex-column {
  p:nth-of-type(1) {
    margin-bottom: 0.2rem;
    line-height: 0.4rem;
    font-size: 0.4rem;
    color: #000;
  }
  p:nth-of-type(2) {
    font-size: 0.4rem;
    color: #000;
  }
}

.f30 {
  font-size: 0.3rem !important;
}
.f40 {
  font-size: 0.4rem !important;
}
.flex {
  display: flex;
}
.input {
  width: 50%;
}
.form {
  width: 8rem;
  height: 10.5rem;
  margin: 0.5rem auto;
  background-color: #fddfa0;
  .el-input__wrapper {
    height: 0.8rem;
  }
}
.form .flex {
  margin: 0.5rem 0 0.1rem 0;
  align-items: center;
  justify-content: space-between;
}
.btn-wrap {
  display: flex;
  justify-content: space-between;
}
.flex-column {
  padding-top: 3rem;
}
.container {
  width: 5rem;
  margin: 0.5rem auto 0;
}
.el-input {
  width: 100%;
}
.error {
  border: 1px solid red;
}
.el-button {
  width: 2rem;
  height: 0.7rem;
  margin-top: 0.5rem;
  font-size: 0.3rem;
  background-color: #e58b5a;
  border: #f2ac76;
  color: #fff;
}

@media screen and (max-width: 900px) {
  .flex-column {
    padding-top: 0.5rem;
  }
  .container {
    padding-top: 0.5rem;
  }
}
@media screen and (min-width: 900px) {
  .flex-column {
    height: 5rem;
    flex-direction: column;
    justify-content: space-between;
  }
  .stake {
    display: flex;
    width: 80%;
    margin: 0 auto;
    min-height: 80vh;
    justify-content: space-around;
  }
  .wrap {
    width: 5rem;
  }
  /* .form .flex {
    margin-top: 1rem;
  }
  .el-button {
    margin-top: 0.5rem;
  } */
}
</style>
