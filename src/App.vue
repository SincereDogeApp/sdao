<template>
  <div class="layout">
    <el-row class="nav">
      <el-col :xs="14" :sm="14" :md="5" :lg="4" :xl="4">
        <div
          @click="
            handleLink('/');
            activeMenu = 0;
          "
          class="flex"
        >
          <img src="./assets/logo.png" />SincereDogeDAO
        </div>
      </el-col>
      <el-col
        :xs="8"
        :sm="8"
        :md="5"
        :lg="4"
        :xl="4"
        class="hidden-sm-and-down fb"
      >
        <p
          :class="activeMenu === 1 ? 'cffs' : 'cb4b4b9'"
          @click="
            handleLink('/home');
            activeMenu = 1;
          "
        >
          <span>Home</span>
        </p>
      </el-col>
      <el-col
        :xs="8"
        :sm="8"
        :md="5"
        :lg="4"
        :xl="4"
        class="hidden-sm-and-down fb"
      >
        <p
          :class="activeMenu === 2 ? 'cffs' : 'cb4b4b9'"
          @click="
            handleLink('/stake');
            activeMenu = 2;
          "
        >
          <span> Stake TOKEN</span>
        </p>
      </el-col>
      <el-col
        :xs="8"
        :sm="8"
        :md="5"
        :lg="4"
        :xl="4"
        class="hidden-sm-and-down fb"
        ><span
          :class="activeMenu === 3 ? 'cffs' : 'cb4b4b9'"
          @click="
            handleLink('/propsals');
            activeMenu = 3;
          "
          >Propsals</span
        >
      </el-col>
      <el-col
        :xs="8"
        :sm="8"
        :md="5"
        :lg="4"
        :xl="4"
        class="hidden-sm-and-down fb"
        ><span @click="handleLink('/swap')">Swap</span>
      </el-col>
      <el-col
        :xs="10"
        :sm="10"
        :md="4"
        :lg="4"
        :xl="4"
        class="hidden-md-and-up"
      >
        <!-- sm && >sm -->
        <div>
          <p class="cursor" @click="handleConnect">
            {{
              account
                ? `${account.substring(0, 4)}...${account.substring(
                    account.length - 4
                  )}`
                : "Connect"
            }}
          </p>
          <el-popover
            placement="bottom"
            :width="80"
            trigger="hover"
            :effect="'dark'"
            :visible="visible"
          >
            <p
              class="submenu"
              :class="activeMenu !== 1 ? 'cffs' : 'cb4b4b9'"
              @click="
                handleLink('/home');
                activeMenu = 1;
              "
            >
              Home
            </p>
            <p
              class="submenu"
              :class="activeMenu !== 3 ? 'cffs' : 'cb4b4b9'"
              @click="
                handleLink('/propsals');
                activeMenu = 3;
              "
            >
              Propsals
            </p>
            <p
              class="submenu"
              :class="activeMenu !== 2 ? 'cffs' : 'cb4b4b9'"
              @click="
                handleLink('/stake');
                activeMenu = 2;
              "
            >
              Stake TOKEN
            </p>
            <p class="submenu cffs" @click="handleLink('/swap')">Swap</p>
            <template #reference>
              <i class="iconfont icon-gengduo" @click="visible = true"></i>
            </template>
          </el-popover>
        </div>
      </el-col>
      <el-col
        :xs="10"
        :sm="10"
        :md="4"
        :lg="3"
        :xl="3"
        class="hidden-sm-and-down"
      >
        <div class="flex">
          <!-- xs	<768px sm	≥768px md	≥992px lg	≥1200px xl	≥1920px -->
          <div class="address" @click="handleConnect">
            {{
              account
                ? `${account.substring(0, 4)}...${account.substring(
                    account.length - 4
                  )}`
                : "Connect"
            }}
          </div>
        </div>
      </el-col>
    </el-row>

    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
    <footer>
      <img src="./assets/footer1.png" />
      <img src="./assets/footer2.png" />
      <!-- <i class="iconfont icon-telegram cb4b4b9"></i>
      <i class="iconfont icon-tuite_twitter43 cb4b4b9"></i> -->
    </footer>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import useWallet from "./hooks/wallet";

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const activeMenu = ref();
    const { account, init } = useWallet();
    const visible = ref(false);
    const handleLink = (param: string) => {
      console.log(param);
      if (param === "/swap") {
        window.open("https://sinceredogeswap.app");
        return;
      }
      router.push(param);
      visible.value = false;
    };
    watchEffect(() => {
      console.log(route.name);
      switch (route.name) {
        case "home":
          return (activeMenu.value = 1);
        case "stake":
          return (activeMenu.value = 2);
        case "propsals":
          return (activeMenu.value = 3);
        default:
          return (activeMenu.value = 0);
      }
    });
    init();
    return {
      activeMenu,
      handleLink,
      visible,
      account,
      init,
    };
  },
  methods: {
    handleConnect() {
      if (!this.account) {
        this.init();
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/font/iconfont.css";

.flex {
  display: flex;
  align-items: center;
  font-size: 0.4rem;
  font-weight: bold;
  color: #000;
  img {
    width: 1rem;
    margin-left: 0.5rem;
  }
}
.el-input__wrapper {
  height: 0.8rem;
}
.layout {
  height: 100vh;
  text-align: center;
  background-color: rgb(253, 244, 206);
  //background-color: #fffdf7;
}
.cff {
  position: relative;
  color: #fff;
}
.fb {
  font-weight: bold;
}
.hidden-sm-and-down {
  .cffs {
    position: relative;
    &::before {
      position: absolute;
      display: block;
      bottom: -0.2rem;
      left: 50%;
      width: 1.6rem;
      height: 1px;
      margin-left: -0.8rem;
      content: "";
      background-color: #e6965b;
    }
  }
  .cff:after {
    position: absolute;
    left: 50%;
    top: 0.7rem;
    display: block;
    content: "";
    width: 2.2rem;
    height: 2px;
    margin-left: -1.1rem;
    background-color: #fff;
  }
}
.hidden-sm-and-up {
  .cffs {
    color: #fff;
  }
}

.cb4b4b9 {
  color: #e6965b;
}
.mr-10 {
  margin-right: 10px;
}
#app {
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.logo {
  font-size: 26px;
  font-weight: bolder;
}
.nav {
  display: flex;
  height: 1.3rem;
  flex: 1;
  justify-content: space-around;
  align-items: center;
  font-size: 0.4rem;
  color: #e6965b;
  cursor: pointer;
}
.address {
  width: 2.3rem;
  height: 0.8rem;
  line-height: 0.8rem;
  color: #fff;
  background-color: #f2ac76;
  border-radius: 5px;
  font-size: 0.4rem;
}
footer img {
  width: 1rem;
  margin: 0 0.3rem;
  // font-size: 32px !important;
}
.icon-gengduo {
  font-weight: bolder;
  font-size: 0.3rem !important;
}
.submenu {
  padding: 5px 0;
  font-weight: bold;
}
footer {
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: center;
  align-items: center;
}
.el-form-item__label {
  color: #fff !important;
  font-size: 0.5rem !important;
}
.cursor {
  cursor: pointer;
}
</style>
