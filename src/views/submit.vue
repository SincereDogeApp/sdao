<template>
  <div class="submit">
    <div class="box" @click="handleClick('/propsals')"></div>
    <div class="container">
      <p class="f20">Submit a Proposal</p>
      <el-form
        :model="form"
        :label-position="'top'"
        :rules="rules"
        ref="ruleFormRef"
      >
        <el-form-item class="m0">
          <div class="flex">
            <el-checkbox
              v-model="checkbox"
              size="large"
              @change="handleChange"
            />
            <span
              class="label w90 ml-5"
              @click="
                checkbox = !checkbox;
                handleChange(checkbox);
              "
            >
              Sweet proposal.</span
            >
          </div>
        </el-form-item>
        <el-form-item prop="guardianProposal">
          <p class="label w90">Name of the Guardian submitting the Proposal.</p>
          <el-input v-model="form.guardianProposal" />
        </el-form-item>
        <el-form-item
          v-if="!checkbox"
          class="name"
          prop="guardianDiscord"
          :rules="{
            required: checkbox ? false : true,
            message: 'Require',
            trigger: 'change',
          }"
        >
          <p class="label w90">Telegram or Twitter Handle.</p>
          <el-input v-model="form.guardianDiscord" />
        </el-form-item>
        <el-form-item class="name" prop="guardianAddress">
          <p class="label w90">Guardian Wallet Address.</p>
          <el-input v-model="form.guardianAddress" />
        </el-form-item>
        <el-form-item class="name" prop="projectName">
          <p class="label w90">What is the name of the Project?</p>
          <el-input v-model="form.projectName" :disabled="checkbox" />
        </el-form-item>
        <el-form-item class="name" prop="shortDescription">
          <p class="label w90">
            Provide a short description of the Project, and why it is suitable
            for investment from the SDAO.
          </p>
          <el-input v-model="form.shortDescription" :disabled="checkbox" />
        </el-form-item>
        <el-form-item
          v-if="!checkbox"
          class="name"
          prop="file"
          :rules="{
            required: checkbox ? false : true,
            message: 'Require',
            trigger: 'change',
          }"
        >
          <p class="label w90">
            Please provide either an investment deck, a Litepaper or a
            whitepaper. This must include your tokenomics, will all current
            token owners, your projected future fund raise and all details.
          </p>
          <el-input v-model="form.file" />
        </el-form-item>
        <el-form-item
          v-if="!checkbox"
          class="name"
          prop="socialChannel"
          :rules="{
            required: checkbox ? false : true,
            message: 'Require',
            trigger: 'change',
          }"
        >
          <p class="label w90">
            Provide all social channels associated with the project.
          </p>
          <el-input v-model="form.socialChannel" />
        </el-form-item>
        <el-form-item
          v-if="!checkbox"
          class="name"
          prop="links"
          :rules="{
            required: checkbox ? false : true,
            message: 'Require',
            trigger: 'change',
          }"
        >
          <p class="label w90">
            Provide links to the audited token and contracts.
          </p>
          <div class="flex w100">
            <el-input v-model="form.links" :disabled="form.checkbox1" />
            <el-checkbox v-model="form.checkbox1" label="none" size="large" />
          </div>
        </el-form-item>
        <el-form-item
          v-if="!checkbox"
          class="name"
          prop="checkbox2"
          :rules="{
            required: checkbox ? false : true,
            message: 'Require',
            trigger: 'change',
          }"
        >
          <div class="flex">
            <span class="label w90">
              Confirm 70% of the SDAO once swapped will be sent to our dSDAO
              contract and 30% sent to a burn wallet.</span
            >
            <el-checkbox v-model="form.checkbox2" size="large" />
          </div>
        </el-form-item>
      </el-form>
      <el-button @click="handleSubmit(ruleFormRef)" :loading="loading"
        >Submit</el-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onDeactivated } from "vue";
import { useRouter } from "vue-router";
import usePropsal from "../hooks/propsal";
import type { FormInstance, FormRules } from "element-plus";
import useWallet from "../hooks/wallet";
const xss = require("xss");

export default defineComponent({
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const { signer, contractPropsal, encodeParameters, address, provider } =
      usePropsal();
    const options = ref(["Day", "Week", "Month"]);
    const { contractCallback } = useWallet();
    let checkbox = ref(false);

    const form = reactive({
      projectName: "",
      shortDescription: "",
      file: "",
      socialChannel: "",
      links: "",
      time: "Day",
      checkbox1: false,
      checkbox2: false,
      guardianProposal: "",
      guardianAddress: "",
      guardianDiscord: "",
    });
    const ruleFormRef = ref<FormInstance>();
    const validateLinks = (rule: any, value: any, callback: any) => {
      if (value === "" && !form.checkbox1 && !checkbox.value) {
        //未选择且每没填
        callback(new Error("Please enter links"));
      } else {
        callback();
      }
    };
    const validateCheckbox = (rule: any, value: any, callback: any) => {
      if (checkbox.value) callback();
      if (!value) {
        callback(new Error("Require"));
        return;
      } else {
        callback();
      }
    };
    const validtaeAddress = (rule: any, value: any, callback: any) => {
      if (value) {
        provider
          .getCode(value)
          .then((res) => {
            console.log(res, "校验结果");
            if (res !== "0x") {
              callback(new Error("Please input correct address"));
              return;
            } else {
              callback();
            }
          })
          .catch((e) => {
            callback(new Error("Please input correct address"));
            return;
          });
      }
    };
    const rules = reactive<FormRules>({
      projectName: [
        {
          required: true,
          message: "Require",
          trigger: "blur",
        },
      ],
      shortDescription: [
        {
          required: true,
          message: "Require",
          trigger: "change",
        },
      ],
      // file: [
      //   {
      //     required: true,
      //     message: "Require",
      //     trigger: "change",
      //   },
      // ],
      // guardianDiscord: [
      //   {
      //     required: true,
      //     message: "Require",
      //     trigger: "change",
      //   },
      // ],
      guardianAddress: [
        {
          required: true,
          message: "Require",
          trigger: "change",
        },
        { validator: validtaeAddress, trigger: "change" },
      ],
      guardianProposal: [
        {
          required: true,
          message: "Require",
          trigger: "change",
        },
      ],
      // socialChannel: [
      //   {
      //     required: true,
      //     message: "Require",
      //     trigger: "change",
      //   },
      // ],
      links: [
        {
          validator: validateLinks,
        },
      ],
      // time: [
      //   {
      //     required: true,
      //     message: "Require",
      //     trigger: "change",
      //   },
      // ],
      checkbox2: [
        // {
        //   required: true,
        //   message: "Require",
        //   trigger: "change",
        // },
        { validator: validateCheckbox },
      ],
    });
    const handleClick = (param: string) => {
      router.push(param);
    };
    const handleSubmit = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          loading.value = true;
          submitForm();
        } else {
          locateToErr();
          console.log("error submit!", fields);
        }
      });
    };
    const handleChange = (value: boolean) => {
      ruleFormRef.value!.resetFields();
      form.projectName = value ? "reward proposal" : "";
      form.shortDescription = value
        ? "All the bnb used for investment will be repurchased as sdao for rewards"
        : "";
    };
    const submitForm = async () => {
      try {
        console.log(xss(JSON.stringify(form)));
        console.log(JSON.stringify(form));
        const params = {
          target: [address],
          values: [0],
          signatures: ["_setInvesteeDetails(address)"],
          callDatas: [encodeParameters(["address"], [form.guardianAddress])],
          jsonStr: xss(JSON.stringify(form)),
        };
        const result = await contractPropsal
          .connect(signer)
          .propose(
            params.target,
            params.values,
            params.signatures,
            params.callDatas,
            JSON.stringify(params),
            { gasLimit: "0x7a120" }
          );
        await contractCallback(result);
      } catch (e: any) {
        console.log(e);
      }
      loading.value = false;
    };
    // 滚动条定位到第一个校验失败的div的位置
    const locateToErr = () => {
      setTimeout(() => {
        const errorDiv = document.getElementsByClassName("is-error");
        errorDiv[0].scrollIntoView();
      }, 0);
    };
    onDeactivated(() => {
      ruleFormRef.value!.resetFields();
    });
    return {
      form,
      options,
      rules,
      ruleFormRef,
      loading,
      checkbox,
      handleClick,
      handleSubmit,
      handleChange,
    };
  },
});
</script>
<style scoped lang="scss">
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.w5 {
  width: 4.7rem;
  .ml-10 {
    margin-left: 0.1rem;
  }
}
.m0 {
  margin: 0;
}
.w90 {
  width: 90%;
}
.w100 {
  width: 100%;
}
.w100 .el-input {
  width: 80%;
}
.w120 {
  width: 1.5rem;
  height: 0.7rem;
}
.el-slider {
  width: 85%;
  margin: 0 auto;
}
.name {
  margin-top: 0.5rem;
}
.el-select {
  width: 2rem;
}
.label {
  text-align: left;
  font-weight: bold;
  font-size: 0.4rem;
}
.submit {
  position: relative;
  width: 9rem;
  height: 74vh;
  margin: 0 auto;
  padding-top: 6vh;
  text-align: center;
  background-color: #fddfa0;
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
.mt10 {
  margin-top: 0.5rem;
}
.ml-5 {
  margin-left: 0.3rem;
}
.mr-5 {
  margin-right: 0.3rem;
}
.container {
  width: 8rem;
  height: 68vh;
  margin: 0 auto;
  padding: 0 0 0.5rem 0;
  overflow: scroll;
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
}

@media screen and (min-width: 900px) {
  .submit {
    width: 18rem;
  }
  .container {
    width: 80%;
  }
}
</style>
