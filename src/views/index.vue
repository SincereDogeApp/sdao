<template>
  <div class="w80">
    <h1>INVESTING</h1>
    <h1>IN THE REVOLUTION</h1>
    <img src="../assets/logo.png" />
    <p class="f24">
      The purpose of SincereDogeDao is to give everyone the opportunity to
      participate in investing, Whether they are rich or not, Let every sdao
      holder feel the charm of SincereDoge ecology
    </p>
    <el-button
      class="button"
      type="primary"
      @click="$router.push({ name: 'home' })"
      >ENTER APP</el-button
    >
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    console.log("dd");
  },
});
</script>
<style scoped>
h1 {
  color: rgb(223, 143, 95);
}
.w80 {
  width: 9rem;
  height: 80vh;
  margin: 0 auto;
  text-align: center;
}
img {
  width: 6rem;
}
.f24 {
  font-size: 0.5rem;
}
.button {
  margin-top: 0.8rem;
}
h1:nth-of-type(1) {
  padding-top: 0.5rem;
}
@media screen and (min-width: 900px) {
  .w80 {
    width: 80%;
  }
}
</style>
