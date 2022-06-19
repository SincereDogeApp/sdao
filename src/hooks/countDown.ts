import { reactive, onBeforeUnmount } from "vue";
export default function useCountDown(count = 60) {
  interface State {
    count: number;
    timer: any;
  }
  const state = reactive<State>({
    count: 0,
    timer: {},
  });

  /**
   * 开始倒计时
   */

  function start() {
    clear();
    state.count = count;
    state.timer = setInterval(() => {
      state.count--;
      if (state.count <= 0) {
        clear();
      }
    }, 1000);
  }

  /**
   * 清除倒计时
   */
  function clear() {
    if (state.timer) {
      clearInterval(state.timer);
    }
  }
  start();
  onBeforeUnmount(() => {
    clear();
  });
  return {
    state,
    start,
  };
}
