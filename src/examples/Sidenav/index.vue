<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import SidenavList from "./SidenavList.vue";

import fondodash from "@/assets/img/fondoDash.jpg";
import logosgames from "@/assets/img/logosgamesbgout.png";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const layout = computed(() => store.state.layout);
const sidebarType = computed(() => store.state.sidebarType);
</script>
<template>
  <div
    v-show="layout === 'default'"
    class="min-height-300 position-absolute w-100"
    :style="`background-image: url(${fondodash});
    background-size: cover;`"
  />

  <aside
    class="my-3 overflow-hidden border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
    :class="`${isRTL ? 'me-3 rotate-caret fixed-end' : 'fixed-start ms-3'}    
      ${
        layout === 'landing' ? 'bg-transparent shadow-none' : ' '
      } ${sidebarType}`"
    id="sidenav-main"
  >
    <div class="sidenav-header">
<div style="display: flex; justify-content: center; align-items: center; margin-top: 1rem;">
  <img
        :src="logosgames"
        alt="logosgames"
        class="w-40"
        />
</div>



      </div>

    <hr class="mt-0 horizontal dark" />

    <sidenav-list />
  </aside>
</template>
