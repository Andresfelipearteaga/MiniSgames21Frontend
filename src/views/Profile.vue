<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, computed, ref } from "vue";
import { useStore } from "vuex";
import axios from 'axios';
// import { defineAsyncComponent } from 'vue';
import ActiveUsersChart from "../examples/Charts/ActiveUsersChart.vue";
// import { useRouter } from 'vue-router'
// import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
// import ArgonInput from "@/components/ArgonInput.vue";
// import ArgonButton from "@/components/ArgonButton.vue";


const body = document.getElementsByTagName("body")[0];
const store = useStore();
const dataUser = ref({});
const activitiesUser = ref(null);
// const router = useRouter();



const fetchUserInfo = async () => {
      try {
        const userId = computed(() => store.getters.getUserId);
        console.log('userId', userId.value);
        const response = await axios.get(`http://24.199.103.0:5000/api/users/profile/${userId.value}`,);
        console.log(response.data);
        dataUser.value = response.data.user;
        activitiesUser.value = response.data.activities;
        
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
      }
    };

onMounted(() => {
  store.state.isAbsolute = true;
  // setNavPills();
  setTooltip();

});

// const goToActivity = () => {
//   router.push('/dashboard-default')
// }

onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = false;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
  fetchUserInfo();
});
onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  body.classList.remove("profile-overview");
});
</script>
<template>
  <main>
    <div class="container-fluid">
      <div
      
        class="page-header min-height-300"
        style="
          background-image: url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a0c0e792-789a-4b21-8ce1-301669615b13/dgqb2rp-39b3289e-5f15-4236-82dd-a61d76656f84.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2EwYzBlNzkyLTc4OWEtNGIyMS04Y2UxLTMwMTY2OTYxNWIxM1wvZGdxYjJycC0zOWIzMjg5ZS01ZjE1LTQyMzYtODJkZC1hNjFkNzY2NTZmODQuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.r1zVL_PLT9Z-mksJeglfyjz6xbwIT6zohXGUJBG6Y-U);
          margin-right: -24px;
          margin-left: -34%;
        "
      >

      </div>
      <div class="card shadow-lg mt-n6">
        <div class="card-body p-3">
          <div class="row gx-4">
            <div class="col-auto">
              <div class="avatar avatar-xl position-relative">
                <img
                  src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/150638b1-e730-4bba-b173-e2ce3ced60be/difmui7-5068a5ff-649c-4736-bb58-8637dbc47677.jpg/v1/fill/w_894,h_894,q_70,strp/our_time_has_come__by_dmkope_difmui7-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAyNCIsInBhdGgiOiJcL2ZcLzE1MDYzOGIxLWU3MzAtNGJiYS1iMTczLWUyY2UzY2VkNjBiZVwvZGlmbXVpNy01MDY4YTVmZi02NDljLTQ3MzYtYmI1OC04NjM3ZGJjNDc2NzcuanBnIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.oZoMvAAZ8h6uj4iLJ6QxIg5TAHQsa9xlUZGyVlpoMiQ"
                  alt="profile_image"
                  class="shadow-sm w-100 border-radius-lg"
                />
              </div>
            </div>
            <div class="col-auto my-auto">
              <div class="h-100">
                <h5 class="mb-0">{{ dataUser.name }}</h5>
                <p class="mb-0 font-weight-bold text-sm"> {{ dataUser.institution }}</p>
                <p class="mb-0 font-weight-light text-sm">{{ dataUser.grade }}</p>
                <p class="mb-0 font-weight-light text-sm">{{ dataUser.age }} años</p>
              </div>
            </div>
            <div
              class="mx-auto mt-3 col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0"
            >
              <div class="nav-wrapper position-relative end-0">
                <ul
                  class="p-1 bg-transparent nav nav-pills nav-fill"
                  role="tablist"
                >
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-4 container-fluid">
      <div class="row">
        <div>
          <div class="card">
            <active-users-chart />
          </div>
        </div>
        <div class="col-md-4">
          <profile-card />
        </div>
      </div>
    </div>
  </main>
</template>
