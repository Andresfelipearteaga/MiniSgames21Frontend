<script setup>
import { onBeforeUnmount, onBeforeMount, ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import image from '../assets/img/Fondoinicio.png'
const body = document.getElementsByTagName("body")[0];

const store = useStore();
const router = useRouter();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

const name = ref("");
const password = ref("");
const errorMessage = ref("");

const singup = () => {
  router.push("/signup");
};

const login = async () => {
  try {
    const response = await axios.post("http://24.199.103.0:5000/api/auth/login", {
      name: name.value,
      password: password.value,
    },    
        );
      errorMessage.value = response.data.error
      console.log('errorMessage', errorMessage.value)

    setTimeout(() => {
        errorMessage.value = ''
      }, 5000);

    if (response.status === 200) {
      store.commit("setUserId", response.data.userId);
      const userFromVuex = store.getters.getUserId;
      console.log('userFromVuex', userFromVuex);
      localStorage.setItem('showHistory', 'false');
      router.push("/content");
    } else {
      errorMessage.value = response.data.error
      console.log('errorMessage', errorMessage.value)
    } 
} 
  catch (error) {
    console.log("error", error)
  }
};

</script>
<template>
  <main class="mt-0 main-content" style="background-color: #121827;">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Iniciar Sesión</h4>
                  <p class="mb-0">Ingresa tu <strong> Correo </strong> y <strong> Contraseña </strong> para Iniciar Sesión</p>
                </div>
                <div class="card-body" style="background-color: white;">
                  <form role="form" @submit.prevent="login">
                    <div class="mb-3">
                      <argon-input
                      v-model="name"
                        id="name"
                        type="text"
                        placeholder="Usuario"
                        name="name"
                        size="lg"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        v-model="password"
                        id="password"
                        type="password"
                        placeholder="Contraseña"
                        name="password"
                        size="lg"
                      />
                    </div>


                    <div class="text-center">
                      <argon-button style="background-color: linear-gradient(135deg, #121827 0%, #6a11cb 100%);"
                        class="mt-4"
                        fullWidth
                        size="lg"
                        >Iniciar Sesión</argon-button
                      >
                    </div>
                  </form>

                  <p class="text-center text-danger" v-if="errorMessage">{{ errorMessage }}</p>

                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2" style="background-color: white;">
                  <p class="mx-auto mb-4 text-sm">
                    ¿No tienes cuenta?
                    <a style="color: #2c3e50; cursor: pointer;"
                      @click="singup"
                      class="font-weight-bold"
                      >Registrate</a
                    >
                  </p>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2" style="background-color: white;">

                    <img src="../assets/img/logosgamesbgout.png" alt="facebook" class="w-35 me-2" />

                    <img src="../assets/img/edutlan.jpg" alt="facebook" class="w-35 me-2" />

             
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                :style="`background-image: url(${image});
                background-size: cover;`"
                
              >
                <span class="mask"></span>
                <img src="../assets/img/logosgamesblanco.png" alt="profile_image" class="shadow-sm w-100 border-radius-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
