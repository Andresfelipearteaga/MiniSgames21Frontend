<script setup>
import { onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ChevronDown } from "lucide-vue-next";
import axios from "axios";

import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import image from '../assets/img/Fondoinicio.png';

const router = useRouter();
const store = useStore();

const institution = ref("");
const grade = ref("");
const age = ref("");
const name = ref("");
const password = ref("");
const errorMessage = ref("");
const message = ref("")

const goToSignin = () => {
  router.push("/signin");
};

// const initializeActivity = async (userId) => { 
//     try {
//       const response = await axios.post(`http://localhost:5000/api/activities/initialize/${userId}`, {});
//       console.log(response.data);
//     } catch (error) {
//       console.error("Error al inicializar la actividad:", error);
//     }
//   };

// Función para registrar un usuario
const registerUser = async () => {
  try {
    const response = await axios.post("http://24.199.103.0:5000/api/auth/register", {
      institution: institution.value,
      grade: grade.value,
      age: age.value,
      name: name.value,
      password: password.value,
    });
    // Redireccionar a la página de inicio de sesión si el registro es exitoso
    if (response.status === 201) {
      message.value = response.data.message
      setTimeout(() => {
        message.value = ""
        router.push("/signin");

      }, 3000);
      institution.value = "";
      grade.value = "";
      age.value = "";
      name.value = "";
      password.value = "";
      // const userId = response.data.userId;
      // initializeActivity(userId);
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Error en el registro";

    setTimeout(() => {
      errorMessage.value = ""
    }, 3000);
  }
};

const body = document.getElementsByTagName("body")[0];

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
</script>

<template>
  <main class="main-content mt-0 mb-0" style="background-color: #121827;">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 border-radius-lg"
      :style="`background-image: url(${image}); background-size: cover;`"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">Bienvenido!</h1>
            <p class="text-lead text-white">
              Regístrate en Sgames21 para acceder a todas sus funcionalidades.
            </p>
            <ChevronDown style="color: white;" />
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0" style="background-color: #181d2b;">
            <div class="card-header text-center pt-4" style="background-color: #121827;">
              <img src="../assets/img/logosgamesblanco.png" alt="logo" class="w-30" />
              <h5 style="color: white;">Regístrate</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="registerUser">
                <argon-input
                  v-model="institution"
                  id="institution"
                  type="text"
                  placeholder="Institución"
                  aria-label="institution"
                />
                <select v-model="grade" name="grade" id="grade" class="form-control">
                  <option value="" disabled selected style="color: #888888;">Seleccione el grado</option>
                  <option value="Grado Primero">Grado Octavo</option>
                </select>
                <br>
                <argon-input
                  v-model="age"
                  id="age"
                  type="number"
                  placeholder="Edad"
                  aria-label="Edad"
                />
                <argon-input
                  v-model="name"
                  id="name"
                  type="text"
                  placeholder="Usuario"
                  aria-label="Name"
                />
                <argon-input
                  v-model="password"
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  aria-label="Password"
                />

                <div class="text-center">
                  <argon-button
                    fullWidth
                    color="primary"
                    variant="gradient"
                    class="my-4 mb-2"
                    
                  >Regístrate</argon-button>
                </div>
                <br>
                <div v-if="message || errorMessage"
             :style="{
               backgroundColor: message ? 'green' : 'red',
               color: 'white',
               padding: '5px',
               borderRadius: '20px',
               textAlign: 'center'
             }">
          <p>{{ message || errorMessage }}</p>
        </div>

                <center>


                  <p class="text-sm mt-3 mb-0">
                    ¿Ya tienes cuenta?
                    <a style="cursor: pointer; color: white ;" class="font-weight-bolder" @click="goToSignin">Inicia sesión</a>
                  </p>
                </center>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
