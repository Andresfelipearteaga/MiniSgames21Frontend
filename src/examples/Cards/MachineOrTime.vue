<template>
  <div class="climate-machine">
    <div class="climate-machine" v-if="!showIf">

      <h1 style="color: white;">Máquina del Tiempo - Cambios en el Clima</h1>
      <br>
      <h6 style="color: white;">Para información sobre la actividad, haga clic en el botón de información en la esquina superior derecha.</h6>

    
    <!-- Pestañas -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'temperature' }" @click="changeTab('temperature')">Aumento de Temperatura</button>
      <button :class="{ active: activeTab === 'co2' }" @click="changeTab('co2')">Reducción de CO₂</button>
      <button :class="{ active: activeTab === 'deforestation' }" @click="changeTab('deforestation')">Reducción de Deforestación</button>
      <button :class="{ active: activeTab === 'quiz' }" @click="changeTab('quiz')">Quiz</button>
    </div>

    <!-- Contenido de la pestaña activa -->
    <div class="content">
      <div class="text-section" v-if="activeTab === 'temperature' || activeTab === 'co2' || activeTab === 'deforestation'">
        <p v-if="activeTab === 'temperature'">Aumento de Temperaturas: {{ temperature }}°C  <br>  {{ environmentDescription }}</p>
        <p v-if="activeTab === 'co2'">Reducción de CO₂: {{ co2Reduction }} <br>  {{ environmentDescription }}</p>
        <p v-if="activeTab === 'deforestation'">Reducción de Deforestación: {{ deforestationReduction }}% <br>  {{ environmentDescription }}</p>
      </div>
      <div class="image-section" v-if="activeTab === 'temperature' || activeTab === 'co2' || activeTab === 'deforestation'">
        <div class="image-container">
          <transition name="fade">
            <img :src="currentImage" :key="currentImage" alt="Escenario ambiental" />
          </transition>
        </div>
      </div>

      <!-- Quiz -->
      <div v-if="activeTab === 'quiz'" class="quiz">
        <h2>Quiz sobre el Impacto Climático</h2>

        <div class="question" v-for="(question, index) in questions" :key="index">
          <p>{{ index + 1 }}. {{ question.text }}</p>
          <label v-for="option in question.options" :key="option.value" class="custom-radio">
            <input type="radio" :name="`question${index}`" v-model="quizAnswers[question.id]" :value="option.value" @change="saveToLocalStorage" />
            <span>{{ option.text }}</span>
          </label>
        </div>

        <button @click="submitQuiz" class="submit-button" :disabled="!isQuizComplete">Enviar Respuestas</button>
      </div>
    </div>

    <!-- Slider correspondiente a la pestaña activa -->
    <div class="sliders">
      <div v-if="activeTab === 'temperature'">
        <i class="icon-temperature"></i>
        <input type="range" v-model="temperature" min="0" max="5" step="0.1" @input="trackSlider('temperature')" />
      </div>
      <div v-if="activeTab === 'co2'">
        <i class="icon-co2"></i>
        <input type="range" v-model="co2Reduction" min="0" max="300" step="10" @input="trackSlider('co2')" />
      </div>
      <div v-if="activeTab === 'deforestation'">
        <i class="icon-deforestation"></i>
        <input type="range" v-model="deforestationReduction" min="0" max="100" step="5" @input="trackSlider('deforestation')" />
      </div>  
    </div>
  </div>

    </div>

    <div class="climate-machine" v-if="showIf">

      <h3 style="color: white;">
      Actividad completada, continúa a la siguiente fase
     </h3>      
</div>
  
</template>

<script setup>
import { ref, computed, onBeforeMount, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
const userId = computed(() => store.state.userId);
const activityNumber = ref(4);

import tempImg1 from '../../assets/img/temp1.webp';
import tempImg2 from '../../assets/img/temp2.webp';
import tempImg3 from '../../assets/img/temp3.webp';
import co2Img1 from '../../assets/img/co21.webp';
import co2Img2 from '../../assets/img/co22.webp';
import co2Img3 from '../../assets/img/co23.webp';
import deforestationImg1 from '../../assets/img/deforestacion1.webp';
import deforestationImg2 from '../../assets/img/deforestacion2.webp';
import deforestationImg3 from '../../assets/img/deforestacion3.jpeg';

const activeTab = ref('temperature');
const temperature = ref(0);
const co2Reduction = ref(0);
const deforestationReduction = ref(0);

const interactionData = ref({
  timeSpent: 0,
  slidersMoved: {
    temperature: false,
    co2: false,
    deforestation: false,
  },
  quizAnswers: null,
  progress: 0,
  completed: false,
});

const quizAnswers = ref(JSON.parse(localStorage.getItem('quizAnswers')) || {
  q1: null,
  q2: null,
  q3: null,
});

const questions = ref([
  { id: 'q1', text: "¿Qué puede causar un aumento de temperatura mayor a 2°C?", options: [{ value: 'a', text: "Deshielos y sequías" }, { value: 'b', text: "Mejora de ecosistemas" }, { value: 'c', text: "Aumento de biodiversidad" }] },
  { id: 'q2', text: "¿Cuál es un efecto positivo de la reducción de CO₂?", options: [{ value: 'a', text: "Mayor erosión" }, { value: 'b', text: "Mejora de la salud de los ecosistemas" }, { value: 'c', text: "Aumento de temperaturas" }] },
  { id: 'q3', text: "¿Qué ocurre con una reducción significativa de deforestación?", options: [{ value: 'a', text: "Disminución de biodiversidad" }, { value: 'b', text: "Aumento de CO₂" }, { value: 'c', text: "Fomento de la biodiversidad" }] },
]);

let timer;

// Función para cambiar de pestaña y reiniciar valores
function changeTab(tab) {
  activeTab.value = tab;
  if (tab !== 'quiz') resetSliders();
}

function resetSliders() {
  temperature.value = 0;
  co2Reduction.value = 0;
  deforestationReduction.value = 0;
}

function trackSlider(tab) {
  interactionData.value.slidersMoved[tab] = true;
}

function startTimer() {
  timer = setInterval(() => {
    interactionData.value.timeSpent += 1;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function saveToLocalStorage() {
  localStorage.setItem('quizAnswers', JSON.stringify(quizAnswers.value));
}

const emit = defineEmits(['activityCompleted']);

function submitQuiz() {
  const userIdparams = userId.value;
  console.log('userIdparams', userIdparams);
  console.log('activityNumber', activityNumber.value);
  interactionData.value.quizAnswers = quizAnswers.value;
  interactionData.value.progress = 100;
  interactionData.value.completed = true;
  // Envío de datos al backend
  axios.put(`http://24.199.103.0/api/activities/update/${userIdparams}/${activityNumber.value}`, 
    interactionData.value,
  )  
  .then(response => console.log('Respuestas enviadas:', response.data), emit('activityCompleted'))
  .catch(error => console.error('Error enviando respuestas:', error));
}

const isQuizComplete = computed(() => Object.values(quizAnswers.value).every(answer => answer !== null));

onBeforeMount(() => {
  startTimer();
  getActivityData();
});
onBeforeUnmount(() => {
  stopTimer();
});

const environmentDescription = computed(() => {
  let description = "";
  if (temperature.value > 2) {
    description += "Las temperaturas elevadas podrían provocar sequías y deshielos.";
  } else if (co2Reduction.value > 100) {
    description +=  " Una reducción significativa en CO2 podría mejorar la salud de los ecosistemas.";
  }
  if (deforestationReduction.value > 50) {
    description += " La reducción de la deforestación fomentará la biodiversidad.";
  }
  return description;
});

const currentImage = computed(() => {
  if (activeTab.value === 'temperature') {
    if (temperature.value < 2) return tempImg1;
    else if (temperature.value < 4) return tempImg2;
    else return tempImg3;
  } else if (activeTab.value === 'co2') {
    if (co2Reduction.value < 100) return co2Img1;
    else if (co2Reduction.value < 200) return co2Img2;
    else return co2Img3;
  } else if (activeTab.value === 'deforestation') {
    if (deforestationReduction.value < 30) return deforestationImg1;
    else if (deforestationReduction.value < 60) return deforestationImg2;
    else return deforestationImg3;
  }
  return '';
});



const showIf = ref(false)

const getActivityData = async () => {
  try {
    const userIdparams = userId.value
    console.log('userIdparams', userIdparams)
    console.log('activityNumber', activityNumber.value)
    const response = await axios.get(`http://24.199.103.0/api/activities/get/${userIdparams}/${activityNumber.value}`)
    console.log('Datos obtenidos del backend:', response.data)
    console.log('response', response.data)
    showIf.value = response.data.activities.completed
    console.log('showIf', showIf.value)


  } catch (error) {
    console.error('Error al obtener los datos del backend:', error)
  }
}
</script>

<style scoped>
.climate-machine {
  text-align: center;
  padding: 20px;
  border-radius: 5px;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tabs button {
  background: transparent;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

.tabs .active {
  background-color: #394b7a;
  border-radius: 5px;
}

.content {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  background-color: #242c44;
  padding: 20px;
  border-radius: 10px;
}

.text-section {
  flex: 1;
  margin-right: 20px;
  text-align: left;
  color: white;
}

.image-section {
  flex: 1;
}

.image-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
}

.image-container img {
  position: absolute;
  top: 50%;
  left: 50%;
  width: auto;
  height: 100%;
  min-width: 100%;
  transform: translate(-50%, -50%);
}

.sliders {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.slider-container i {
  margin-right: 10px;
}

.icon-temperature::before {
  content: '🌡️';
}

.icon-co2::before {
  content: '🌍';
}

.icon-deforestation::before {
  content: '🌳';
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.quiz {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quiz h2 {
  font-size: 1.6em;
  color: #e6e6e6;
  margin-bottom: 15px;
}

.question p {
  margin: 10px 0;
  font-weight: bold;
  color: #b0c4de;
}

.custom-radio {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;
  font-size: 1.1em;
  color: #f0f0f0;
}

.custom-radio input[type="radio"] {
  display: none;
}

.custom-radio span {
  position: relative;
  padding-left: 25px;
  cursor: pointer;
}

.custom-radio span::before {
  content: "";
  position: absolute;
  left: 0;
  top: 3px;
  width: 18px;
  height: 18px;
  border: 2px solid #6a8eae;
  border-radius: 50%;
  background-color: #2c3e50;
  transition: background-color 0.3s, border-color 0.3s;
}

.custom-radio input[type="radio"]:checked + span::before {
  background-color: #6a8eae;
  border-color: #6a8eae;
}

.custom-radio input[type="radio"]:checked + span::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
}

.submit-button {
  padding: 10px 20px;
  border: none;
  background: #6a8eae;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #8cb3c7;
}
</style>
