<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from 'axios';
import SidenavItem from "./SidenavItem.vue";
// import SidenavCard from "./SidenavCard.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL)
const router = useRouter();

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};

const logout = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/logout", {} ,{ withCredentials: true });
    console.log(response);
    router.push("/signin");
    store.commit("setUserId", null);
    localStorage.clear();
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
</script>
<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/content"
          :class="getRoute() === 'content' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Contenidos'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/dashboard-default"
          :class="getRoute() === 'dashboard-default' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Actividades'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm"></i>
          </template>
        </sidenav-item>
      </li>



      <li class="nav-item">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="isRTL ? 'حساب تعريفي' : 'Tu perfil'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm"></i>
          </template>
        </sidenav-item>
      </li>

      <center>
        <li class="nav-item">
          <button @click="logout" class="btn btn-link btn-sm">Cerrar Sesión</button>
        </li>
      </center>



      
    </ul>
  </div>
</template>
