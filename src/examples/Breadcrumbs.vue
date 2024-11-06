<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { eventBus } from '../eventBus'
import { useRoute } from 'vue-router'

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const isNavFixed = computed(() => store.state.isNavFixed);

defineProps({
  currentPage: {
    type: String,
    default: "",
  },
  currentDirectory: {
    type: String,
    default: "",
  },
});

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};

const emitirVerHistoria = () => {
  eventBus.emit('verHistoria')
}
</script>
<template>
  <nav aria-label="breadcrumb">
    <ol
      class="px-0 pt-1 pb-0 mb-0 bg-transparent breadcrumb"
      :class="`${isRTL ? '' : ' me-sm-6'} ${
        isNavFixed ? 'text-dark' : 'text-white'
      }`"
    >
    </ol>
    <h6
      class="mb-0 font-weight-bolder"
      :class="isNavFixed ? 'text-dark' : 'text-white'"
    >
      Historia - Pensamiento Crítico	
    </h6>
    <a v-if="getRoute() === 'dashboard-default'" @click="emitirVerHistoria" style="color: white; font-weight: bold; text-decoration: underline; cursor: pointer;"  >Ver Historia</a>
  </nav>
</template>
