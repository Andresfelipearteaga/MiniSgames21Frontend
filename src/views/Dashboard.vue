<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
// import ActiveUsersChart from "@/examples/Charts/ActiveUsersChart.vue";
import MemoryGame from "../examples/Charts/MemoryGame.vue";
import TrueOrFalse from "../examples/Cards/TrueOrFalse.vue";
import MachineOrTime from "../examples/Cards/MachineOrTime.vue";
import explain from "../examples/Cards/Explain.vue";
import actions from "../examples/Cards/ActionsEvalue.vue";
// import ModalHistory from "../examples/Cards/ModalHistory.vue";
// import Carousel from "./components/Carousel.vue";
// import CategoriesList from "./components/CategoriesList.vue";
import { ref, computed, onBeforeMount } from "vue";
import { onMounted} from "vue";
import axios from 'axios';
import { useStore } from 'vuex';
const store = useStore();
const userId = computed(() => store.state.userId);


const selectedActivity = ref('activity1');
const showInfoModal = ref(false);
const activities = ref([]);
const lockedActivities = ref([]);
import bgLuna1 from "../assets/img/luna1.webp";
import bgLuna2 from "../assets/img/luna2.webp";
import bgLuna3 from "../assets/img/content3.webp";
import bgLuna4 from "../assets/img/luna4.webp";

import { eventBus } from '../eventBus'

eventBus.on('verHistoria', () => {
  showInfoModalHistory.value = true
})


const handleActivityCompleted = () => {
  console.log('Actividad completada');
  setTimeout(() => {
    fetchUserActivities();
    console.log('Actualizando las actividades');
  }, 1000);
  setTimeout(() => {
    window.location.reload();
    console.log('Recargando la página');
  }, 2000);
}

// Obtener el estado de cada actividad
const fetchUserActivities = async () => {
  const userIdparams = userId.value;
  console.log('userIdparams', userIdparams);
  try {
    const response = await axios.get(`http://24.199.103.0/api/activities/getAll/${userIdparams}/`);

    // Transforma el objeto en un arreglo de actividades con `id` y `completed`
    activities.value = Object.entries(response.data.activities).map(([key, completed]) => ({
      id: key,
      completed,
    }));
    console.log('actividades', activities.value);

// Añade los IDs a lockedActivity si completed es false
for (let i = 1; i < activities.value.length; i++) {
  if (!activities.value[i - 1].completed) {
    lockedActivities.value.push(activities.value[i].id);
  }
}

  } catch (error) {
    console.error("Error al obtener las actividades:", error);
  }
};

const showInfoModalHistory = ref(null); // Controla la visibilidad del modal
const currentDescriptionIndex = ref(0); // Índice de la descripción actual
const backgrounds = [bgLuna1, bgLuna2, bgLuna3, bgLuna4]; // Arreglo de fondos

const currentBackground = ref(backgrounds[0]);

const nextDescription = () => {
  if (currentDescriptionIndex.value < historyInfo.descriptions.length - 1) {
    currentDescriptionIndex.value++;
    currentBackground.value = backgrounds[currentDescriptionIndex.value]; // Actualizamos el fondo
  } else {
    currentDescriptionIndex.value = 0; // Reinicia el índice al inicio
    currentBackground.value = backgrounds[currentDescriptionIndex.value]; // Restablece el fondo al inicial
    showInfoModalHistory.value = false;
     

  }
};

// Función para cargar la historia una sola vez por sesión
const loadStoryOncePerSession = () => {
  const showHistory = localStorage.getItem('showHistory');
  if (showHistory === 'false') {
    showInfoModalHistory.value = true;
    localStorage.setItem('showHistory', 'true');
  } else {
    showInfoModalHistory.value = false;
  }
}


const historyInfo = {
  title: "El Jardín de Luna",
  descriptions: [
    "Luna era una niña de 10 años que amaba su pequeño jardín. En él cultivaba flores de colores, tomates y hasta un pequeño árbol de manzanas que había plantado con su abuela. Cada día, después de la escuela, Luna regaba sus plantas y les hablaba con cariño.",
    "Un día, Luna notó algo extraño: sus plantas parecían tristes y marchitas, a pesar de regarlas regularmente. Preocupada, le preguntó a su profesora de ciencias qué podría estar pasando. La maestra le explicó que el clima estaba cambiando: los veranos eran más calurosos, las lluvias más escasas y el aire estaba más contaminado debido al cambio climático.",
    "Luna decidió investigar más sobre el tema y descubrió que muchas actividades humanas, como el uso excesivo de automóviles y fábricas, estaban afectando el clima de todo el planeta. No solo su jardín estaba sufriendo; muchos animales y plantas en todo el mundo también estaban en peligro.",
    "Determinada a hacer algo, Luna organizó un club ecológico en su escuela. Junto con sus compañeros, comenzaron a plantar más árboles, crear un huerto escolar y enseñar a otros niños sobre la importancia de cuidar el medio ambiente. Poco a poco, su jardín comenzó a recuperarse, y Luna aprendió que incluso las acciones pequeñas pueden hacer una gran diferencia cuando se trata de proteger nuestro planeta."
  ]
};


 // Definimos la información de cada actividad
 const activityInfo = {
      'activity1': {
        title: "Juego de Memoria - Causas del Cambio Climático",
        description1: "Esta actividad te ayudará a recordar las causas principales del cambio climático mediante un juego de memoria.",
        description2: "Asocia las tarjetas para aprender sobre la relación entre la actividad humana y el medio ambiente."
      },
      'activity2': {
        title: "Sistema de Drag and Drop - Causas y Efectos del Cambio Climático",
        description1: "   Esta actividad interactiva permite a los usuarios aprender sobre las causas y efectos del cambio climático mediante un sistema de arrastrar y soltar (Drag and Drop). La interfaz presenta elementos relacionados con diversas actividades humanas y fenómenos naturales, así como sus efectos en el medio ambiente.",
        description2: " El objetivo es que los usuarios asocien cada causa con su efecto correspondiente, desarrollando una comprensión visual y práctica sobre cómo ciertas acciones o fenómenos contribuyen al cambio climático. Al completar la actividad correctamente, los usuarios recibirán una retroalimentación sobre su desempeño, ayudándoles a reforzar su conocimiento sobre este tema crítico."
      },
      'activity3': {
        title: "Verdadero o Falso - Afirmaciones Climáticas",
        description1: "Evalúa tus conocimientos con preguntas sobre cambio climático y comprueba qué tan informadas están tus respuestas.",
        description2: "Descubre mitos y realidades sobre este tema crucial. Al final deberas verificar y corregir dependiendo del caso, tus respuestas"
      },
      'activity4': {
        title: "Máquina del Tiempo - Cambios en el Clima",
        description1: "Simula cómo el cambio climático afecta al planeta en diferentes períodos de tiempo.",
        description2: "Explora los efectos de las decisiones humanas sobre la salud del planeta a largo plazo. Mueve los slider para ver cómo diversos factores afectan a diferentes aspectos del clima. Luego, realiza un quiz para verificar tus conocimientos."
      },
      'activity5': {
        title: "Explicación Interactiva - Agrega tus Argumentos",
        description1: "Escoge un tema y agrega tus argumentos para explicarlo según lo que has entendido.",
        description2: "Envia tus argumentos para completar la actividad"
      },
      'activity6': {
        title: "Acciones - Qué Podemos Hacer para Mitigar el Cambio Climático",
        description1: "Explora acciones efectivas que puedes tomar para reducir tu huella de carbono.",
        description2: "Descubre cómo pequeñas acciones pueden marcar una gran diferencia para el medio ambiente."
      }
    };

// Seleccionar actividad solo si no está bloqueada
const selectActivity = (activityId) => {
  if (!lockedActivities.value.includes(activityId)) {
    selectedActivity.value = activityId;
    console.log('selectedActivity', selectedActivity.value);
    localStorage.setItem("selectedActivity", activityId);
  }
};

const loadActivity = () => {
  const savedActivity = localStorage.getItem("selectedActivity");
  console.log('savedActivity', savedActivity);
  if (savedActivity) {
    selectedActivity.value = savedActivity;
  }
};

onMounted(() => {
  loadActivity();
  loadStoryOncePerSession();
});

onBeforeMount (() => {
  fetchUserActivities();
})




</script>
<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card style="cursor: pointer;"
            @click="selectActivity('activity1')"
              title="Actividad 1"
              value="Interpreta"
            
              :icon="{
                component: lockedActivities.includes('activity1') ? 'ni ni-fat-remove' : 'ni ni-bullet-list-67',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
                   :style="{
                backgroundColor: selectedActivity === 'activity1' ? '#353B4C' : (lockedActivities.includes('activity1') ? '#444446': '#181d2b'),
                cursor: lockedActivities.includes('activity1') ? 'not-allowed' : 'pointer',

              }"             />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card style="cursor: pointer;"  @click="selectActivity('activity2')"
              title="Actividad 2"
              value="Analiza"
              :icon="{
                component: lockedActivities.includes('activity2') ? 'ni ni-fat-remove' : 'ni ni-bullet-list-67',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
                   :style="{
                backgroundColor: selectedActivity === 'activity2' ? '#353B4C' : (lockedActivities.includes('activity2') ? '#444446': '#181d2b'),
                cursor: lockedActivities.includes('activity2') ? 'not-allowed' : 'pointer',

              }"             />
          </div>
          <div class="col-lg-3 col-md-6 col-12" @click="selectActivity('activity3')">
            <mini-statistics-card style="cursor: pointer;"
              title="Actividad 3"
              value="Evalua"
              :icon="{
                component: lockedActivities.includes('activity3') ? 'ni ni-fat-remove' : 'ni ni-bullet-list-67',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
                   :style="{
                backgroundColor: selectedActivity === 'activity3' ? '#353B4C' : (lockedActivities.includes('activity3') ? '#444446': '#181d2b'),
                cursor: lockedActivities.includes('activity3') ? 'not-allowed' : 'pointer',

              }" 
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12" @click="selectActivity('activity4')">
            <mini-statistics-card style="cursor: pointer;"
              title="Actividad 4"
              value="Observa"
        
              :icon="{
                component: lockedActivities.includes('activity4') ? 'ni ni-fat-remove' : 'ni ni-bullet-list-67',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
                   :style="{
                backgroundColor: selectedActivity === 'activity4' ? '#353B4C' : (lockedActivities.includes('activity4') ? '#444446': '#181d2b'),
                cursor: lockedActivities.includes('activity4') ? 'not-allowed' : 'pointer',

              }"             />
          </div>
          <div class="col-lg-3 col-md-6 col-12"  @click="selectActivity('activity5')">
            <mini-statistics-card style="cursor: pointer;"
              title="Actividad 5"
              value="Explica"
        
              :icon="{
                component: lockedActivities.includes('activity5') ? 'ni ni-fat-remove' : 'ni ni-bullet-list-67',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
                    :style="{
                backgroundColor: selectedActivity === 'activity5' ? '#353B4C' : (lockedActivities.includes('activity5') ? '#444446': '#181d2b'),
                cursor: lockedActivities.includes('activity5') ? 'not-allowed' : 'pointer',

              }"             />
          </div>
          <div class="col-lg-3 col-md-6 col-12" @click="selectActivity('activity6')">
            <mini-statistics-card style="cursor: pointer;"
              title="Actividad 6"
              value="Autoregula"
        
              :icon="{
                component: lockedActivities.includes('activity6') ? 'ni ni-fat-remove' : 'ni ni-bullet-list-67',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
                    :style="{
                backgroundColor: selectedActivity === 'activity6' ? '#353B4C' : (lockedActivities.includes('activity6') ? '#444446': '#181d2b'),
                cursor: lockedActivities.includes('activity6') ? 'not-allowed' : 'pointer',

              }"         />
          </div>
        </div>
        <div class="row">
          <div class="mb-lg">
            <!-- line chart -->
            <div class="card z-index-2" style="background-color: #121827; position: relative;">

              <button @click="showInfoModal = true" class="info-button">
          <i class="fas fa-info-circle"></i>
              </button>
              <memory-game v-if="selectedActivity === 'activity1'" @activityCompleted="handleActivityCompleted" />
              <gradient-line-chart v-if="selectedActivity === 'activity2'" @activityCompleted="handleActivityCompleted"/>
              <true-or-false v-if="selectedActivity === 'activity3'" @activityCompleted="handleActivityCompleted"/>
              <machine-or-time v-if="selectedActivity === 'activity4'" @activityCompleted="handleActivityCompleted"/>
              <explain v-if="selectedActivity === 'activity5'" @activityCompleted="handleActivityCompleted"/>
              <actions v-if="selectedActivity === 'activity6'" @activityCompleted="handleActivityCompleted"/>

            </div>
          </div>

    <!-- Modal de información -->
    <div v-if="showInfoModal" class="info-modal">
      <div class="modal-content">
        <h3>{{ activityInfo[selectedActivity].title }}</h3>
        <p>{{ activityInfo[selectedActivity].description1 }}</p>
        <p>{{ activityInfo[selectedActivity].description2 }}</p>
        <button @click="showInfoModal = false">Cerrar</button>
      </div>
    </div>

        <!-- Modal de información -->
        <div v-if="showInfoModalHistory" class="info-modal-history">
      <div class="modal-content" :style="{ backgroundImage: `url(${currentBackground})`, backgroundSize: 'cover' }">
        <h3 style="color: white; filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 1.5));">{{ historyInfo.title }}</h3>
        <div v-if="currentDescriptionIndex < historyInfo.descriptions.length" class="description-box">
          <p class="text-description">{{ historyInfo.descriptions[currentDescriptionIndex] }}</p>
          <br>
          <center>
          <button @click="nextDescription">Continuar</button>

        </center>
        </div>
      </div>
    </div>

        <!-- Modal de información -->

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.description-box {
  margin-top: 20px;
  background-color: rgba(0, 0, 0, 0.336);
  padding: 20px;
  border-radius: 5px;
  
}


.info-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.info-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.info-modal-history {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.text-description {
  color: rgb(255, 255, 255);
  font-weight: bold;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 1.5));
}


.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
}

.modal-content h3 {
  margin-top: 0;
}

.modal-content button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #3700b3;
}
 </style>
