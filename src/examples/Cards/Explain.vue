<template>
  <div class="reflection-activity">
    <div v-if="!activityCompleted"  class="reflection-activity">
      <h3 style="color: white;">Explicación Interactiva - Agrega tus Argumentos</h3>
      <br>
      <h6 style="color: white;">Para información sobre la actividad, haga clic en el botón de información en la esquina superior derecha.</h6>
    
    <!-- Selección de Aspecto del Cambio Climático -->
    <div class="topic-selection">
      <label style="color: white" for="topic">Selecciona un Aspecto del Cambio Climático:</label>
      <select id="topic" v-model="selectedTopic">
        <option disabled value="">Selecciona un aspecto</option>
        <option v-for="topic in topics" :key="topic" :value="topic">{{ topic }}</option>
      </select>
    </div>
  
    <!-- Instrucciones para agregar argumentos -->
    <div class="instructions">
      <p style="color: lightgrey;">Los argumentos deben:</p>
      <ul style="color: lightgrey;">
        <li>Contener al menos tres palabras.</li>
        <li>No ser solo una letra o una sola palabra.</li>
      </ul>
    </div>
    
    <label style="color: white" for="topic">
      Escribe tu argumento sobre el cambio climático aquí. Debes escribir por lo menos 3 argumentos para poder completar la actividad
    </label>
    
    <!-- Campo para ingresar argumentos -->
    <textarea 
      v-model="userArgument" 
      rows="3"
      placeholder="Escribe tu argumento aquí..."
    ></textarea>
    
    <button @click="addArgument">Agregar Argumento</button>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    
    <br><br>
    
    <!-- Listado de argumentos -->
    <div class="arguments">
      <h3>Mis Argumentos</h3>
      <ul>
        <p v-if="userArguments.length === 0" style="color: white;">No has agregado argumentos aún. Debes agregar por lo menos 3</p>
        <li v-for="(argument, index) in userArguments" :key="index" style="color: white;">{{ argument }}</li>
      </ul>
    </div>
    
    <button v-if="userArguments.length >= 3" @click="completeActivity">Completar</button>
    

  </div>
  <div v-if="activityCompleted" class="result-container">
     <h3>
      Actividad completada, continúa a la siguiente fase
     </h3>
    </div>
    </div>

</template>

<script setup>
import { ref, onBeforeMount, computed} from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
const userId = computed(() => store.state.userId);

const emit = defineEmits(['activityCompleted']);




// Aspectos relacionados con el cambio climático
const topics = [
  'Impacto del Calentamiento Global',
  'Efectos de la Deforestación',
  'Contaminación y su Relación con el Cambio Climático',
  'Energías Renovables como Solución',
  'Importancia de la Conservación de Recursos Naturales'
];

const selectedTopic = ref('');
const userArgument = ref('');
const userArguments = ref(JSON.parse(localStorage.getItem('userArguments')) || []);
const errorMessage = ref('');
const activityCompleted = ref(false);
const startTime = ref(Date.now());
const activityNumber = ref(5);


const addArgument = () => {
  if (validateArgument(userArgument.value)) {
    userArguments.value.push(userArgument.value);
    localStorage.setItem('userArguments', JSON.stringify(userArguments.value));
    userArgument.value = ''; // Limpiar el campo de entrada
    errorMessage.value = '';
  } else {
    errorMessage.value = 'Ingresa un argumento válido';
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  }
};

const validateArgument = (argument) => {
  const words = argument.trim().split(' ');
  return words.length >= 3 && !/^[a-zA-Z]$/.test(argument) && words.join('').length > 1;
};

const completeActivity = async () => {
  const endTime = Date.now();
  const duration = (endTime - startTime.value) / 1000; // en segundos
  const data = {
    topic: selectedTopic.value,
    arguments: userArguments.value,
    duration,
    progress: 100,
    completed: true,
  };

  const userIdparams = userId.value
  console.log('userIdparams', userIdparams)
  console.log('activityNumber', activityNumber.value)
  
  try {
    await axios.put(`http://24.199.103.0/api/activities/update/${userIdparams}/${activityNumber.value}`, data)
    activityCompleted.value = true;
    localStorage.setItem('activityCompleted', true);

    // Emitir evento para actualizar la lista de actividades
    emit('activityCompleted');

  } catch (error) {
    console.error("Error al completar la actividad", error);
  }
};

onBeforeMount(async () => {
  try {
    // Suponiendo que tienes `userId` y `activityNumber` disponibles
    const userIdparams = userId.value;

    // Solicitud a la base de datos para verificar el estado de la actividad
    const response = await axios.get(`http://24.199.103.0/api/activities/get/${userIdparams}/${activityNumber.value}`)
    const activityData = response.data;
    console.log('activityData', activityData);
    activityCompleted.value = response.data.activities.completed
    console.log('showIf', activityCompleted .value)

  } catch (error) {
    console.error("Error al cargar el estado de la actividad", error);
  }
});
</script>

<style scoped>
.reflection-activity {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #17213d;
}

h1, h3 {
  color: #ffffff;
}

textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  color: white;
  background-color: #586894;
  font-weight: bold;
}

button {
  margin-top: 10px;
  padding: 10px 15px;
  color: white;
  background-color: #6200ea;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #3700b3;
}

.topic-selection {
  margin-bottom: 20px;
}

#topic {
  color: white;
  background-color: #586894;
  font-weight: bold;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.instructions {
  margin-bottom: 10px;
}

.result-container {
  margin: 10px;
  padding: 20px;
  margin: auto;
  font-family: Arial, sans-serif;
  color: white;
  text-align: center;
}
</style>
