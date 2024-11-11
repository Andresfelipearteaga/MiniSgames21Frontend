<template>
  <div class="actions-activity">
    <h3 style="color: white;">Acciones - Qué Podemos Hacer para Mitigar el Cambio Climático</h3>
    <h5 style="color: white;"> <strong> {{   messageAlert }}</strong>  </h5>

    <div v-if="completed" class="completed-message">
      <h3 style="color: white;">Has completado todas las fases de estas actividades. ¡Felicidades!</h3>
    </div>
    <div v-else class="actions-container">
      <div class="available-actions">
        <h5 style="color: white;">Acciones Disponibles</h5>
        <ul>
          <li 
            v-for="(action, index) in availableActions" 
            :key="index" 
            @click="selectAction(action)"
            class="list-group-item-1"
          >
            {{ action.text }}
            <span v-if="selectedActions.some(selected => selected.text === action.text)" style="color: white;" class="checkmark">✅</span>
          </li>
        </ul>
      </div>

      <div class="selected-actions">
        <h5 style="color: white;">Acciones Seleccionadas</h5>
        <ul>
          <li 
            v-for="(action, index) in selectedActions" 
            :key="index" 
            :class="{'good-action': action.checked && action.isGood, 'bad-action': action.checked && !action.isGood, 'list-group-item': !action.checked}"
          >
            {{ action.text }}
            <a class="why-button" v-if="action.checked" @click.stop="showMessage(action)">¿Por qué?</a>
          </li>
        </ul>
      </div>
    </div>
<center>
  <button v-if="!completed" @click="checkActions" :disabled="selectedActions.length !== 5">Verificar Acciones</button>

  <button v-if="!completed" class="btn btn-primary mt-4" :disabled="!verified" @click="completeActivity">Completar</button>

</center>

    <!-- Div para mostrar el mensaje -->
    <div v-if="messageVisible" class="message">
      <h3>Razón</h3>
      <p>{{ messageText }}</p>
      <button @click="closeMessage">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch, computed } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
const userId = computed(() => store.state.userId);
console.log('userId', userId.value);
const activityNumber = ref(6);
const startTime = ref(Date.now());
const messageAlert = ref('');


const actions = [
  { text: "Usar transporte público", isGood: true, message: "¡Buena acción! Ayuda a reducir el impacto ambiental." },
  { text: "Reciclar materiales", isGood: true, message: "¡Buena acción! Reduce la necesidad de nuevos materiales." },
  { text: "Utilizar bolsas de plástico desechables", isGood: false, message: "Mala acción. Contribuye a la contaminación." },
  { text: "Desperdiciar agua", isGood: false, message: "Mala acción. Agota recursos esenciales." },
  { text: "Promover el uso de energías renovables", isGood: true, message: "¡Buena acción! Ayuda a combatir el cambio climático." },
  { text: "Comprar productos de un solo uso", isGood: false, message: "Mala acción. Aumenta la cantidad de residuos." },
  { text: "Apagar luces innecesarias", isGood: true, message: "¡Buena acción! Ahorra energía y recursos." },
  { text: "Dejar el motor encendido mientras se espera", isGood: false, message: "Mala acción. Aumenta las emisiones de CO2." },
  { text: "Plantando árboles", isGood: true, message: "¡Buena acción! Ayuda a absorber CO2." },
  { text: "No compostar residuos orgánicos", isGood: false, message: "Mala acción. Contribuye a la producción de gases de efecto invernadero." }
];

const availableActions = ref(shuffle(actions));
const selectedActions = ref([]);
const messageVisible = ref(false);
const messageText = ref('');
const completed = ref(false);

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

const selectAction = (action) => {
  const existingAction = selectedActions.value.find(item => item.text === action.text);
  if (existingAction) {
    selectedActions.value = selectedActions.value.filter(item => item.text !== action.text);
  } else if (selectedActions.value.length < 5) {
    selectedActions.value.push({ ...action, checked: false });
  }
  localStorage.setItem('selectedActions', JSON.stringify(selectedActions.value));
};

const loadSelectedActions = () => {
  const storedActions = JSON.parse(localStorage.getItem('selectedActions') || '[]');
  selectedActions.value = storedActions;
};

const verified = ref(false);

const checkActions = async () => {
  const allCorrect = selectedActions.value.every(action => action.isGood);
  selectedActions.value.forEach(action => {
    action.checked = true;
  });

  if (allCorrect) {
    const endTime = Date.now();
    const duration = (endTime - startTime.value) / 1000; // en segundos
    verified.value = true;
    try {
      const userIdparams = userId.value;
      console.log('userIdparams', userIdparams);
      console.log('activityNumber', activityNumber.value);
      await axios.put(`http://24.199.103.0/api/activities/update/${userIdparams}/${activityNumber.value}`, {
        actions: selectedActions.value,
        duration,
        progress: 100,
        completed: true,
      });
    } catch (error) {
      console.error("Error al enviar las acciones:", error);
    }
  } else {
    messageAlert.value = "Escoge un plan correcto para completar la actividad.";
  }
};

const completeActivity = async () => {
  completed.value = true;
}

const showMessage = (action) => {
  messageText.value = action.message;
  messageVisible.value = true;
  scrollToBottom();
};

const scrollToBottom = () => {
  setTimeout(() => {
    const messageDiv = document.querySelector('.message');
    if (messageDiv) {
      messageDiv.scrollIntoView({ behavior: 'smooth' });
    }
  }, 0);
};

const closeMessage = () => {
  messageVisible.value = false;
};

onBeforeMount(async () => {
  loadSelectedActions();
  const userIdparams = userId.value;
  try {
    const response = await axios.get(`http://24.199.103.0/api/activities/get/${userIdparams}/${activityNumber.value}`)
    completed.value = response.data.activities.completed;
  } catch (error) {
    console.error("Error al cargar el estado de la actividad:", error);
  }
});

watch(selectedActions, () => {
  localStorage.setItem('selectedActions', JSON.stringify(selectedActions.value));
});
</script>

  
  <style scoped>
  .actions-activity {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    background-color: #17213d;
  }
  
  .actions-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .available-actions, .selected-actions {
    width: 45%;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  .list-group-item-1 {
    padding: 10px;
    background: linear-gradient(90deg, rgb(162, 0, 255) 0%, rgb(98, 0, 255) 100%);
    margin-bottom: 5px;
    cursor: pointer;
    border-radius: 5px;
    color: white;
    font-weight: bold;
  }

  .list-group-item {
    padding: 10px;
    background: linear-gradient(90deg, rgb(162, 0, 255) 0%, rgb(98, 0, 255) 100%);
    margin-bottom: 5px;
    cursor: pointer;
    border-radius: 5px;
    color: white;
    font-weight: bold;
}
  
  li.good-action {
    background-color: #43a146; /* Color verde para buenas acciones */
    color: white;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
    cursor: pointer;
    font-weight: bold;
}
  
  li.bad-action {
    background-color: #d14957; /* Color rojo para malas acciones */
    color: white;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
    cursor: pointer;
    font-weight: bold;
}

.why-button {
  color: white;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}
  
  button {
    padding: 5px 10px;
    margin-left: 10px;
    color: white;
    background-color: #6200ea;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #3700b3;
  }
  
  button:disabled {
    background-color: #c0c0c0;
    cursor: not-allowed;
  }
  
  .message {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #6200ea;
    background-color: #f0f4c3;
    border-radius: 5px;
  }

  .checkmark {
    color: white;
    font-size: 20px;
  }
  </style>
  