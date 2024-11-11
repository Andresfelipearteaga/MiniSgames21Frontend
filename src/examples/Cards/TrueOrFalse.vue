<template>
  <div class="container py-4" v-if="!showIf">
    <h3 class="mb-4" style="color: white;">Verdadero o Falso Verde - Afirmaciones Climáticas</h3>
<br>
<h6 style="color: white;">Para información sobre la actividad, haga clic en el botón de información en la esquina superior derecha.</h6>
    <div v-if="!isValidated">
      <div class="carousel">

        <!-- Mostrar los items en función de currentPage -->
        <div class="carousel-items">
          <div
            v-for="(item, index) in paginatedItems"
            :key="index + currentPage * itemsPerPage"
            class="my-3 card"
          >
            <div class="statement">
              <span>{{ item.statement }}</span>
            </div>
            <div class="buttons">
              <button
                :class="{'selectedTrue': selectedAnswers[index + currentPage * itemsPerPage] === true}"
                @click="selectAnswer(index + currentPage * itemsPerPage, true)"
              >
                Verdadero
              </button>
              <button
                :class="{'selectedFalse': selectedAnswers[index + currentPage * itemsPerPage] === false}"
                @click="selectAnswer(index + currentPage * itemsPerPage, false)"
              >
                Falso
              </button>
            </div>
          </div>
        </div>
        <center>
        <!-- Botón de anterior -->
        <button @click="prevPage" :disabled="currentPage === 0" class="nav-button">Anterior</button>

        <!-- Botón de siguiente -->
        <button @click="nextPage" :disabled="currentPage >= maxPage" class="nav-button">Siguiente</button>
     
        </center>
 </div>
      <center>
        <button class="btn btn-primary mt-4" @click="validateAnswers">Validar Respuestas</button>
      <p v-if="warningMessage" style="color: white; font-weight: bold;">{{ warningMessage }}</p>
  
      </center>
  </div>

    <div v-else class="card results mt-4">
      <h4 style="color: white;">Resultados:</h4>
      <p>{{ resultMessage }}</p>
      <p >Antes de Completar esta actividad debes revisar el <strong>¿Por qúe?</strong></p>

      <ul>
        <li
          v-for="(result, index) in results"
          :key="index"
          :class="result.correct ? 'correct' : 'incorrect'"
        >
          {{ result.statement }}
          <p @click="openExplanation(result)" style="cursor: pointer; text-decoration: underline;">¿Por qué?</p>
        </li>
      </ul>
      <button v-if="isValidated && correctCount !== items.length" class="btn btn-primary mt-3" @click="completeActivity">Completar</button>
      <p v-if="showMessage">Debes revisar el <strong>¿Por qúe?</strong> de tus respuestas antes de completar la actividad</p>
    </div>
    <ExplanationModal
      v-if="isModalVisible"
      :title="modalTitle"
      :explanation="modalExplanation"
      :isVisible="isModalVisible"
      @close="closeModal"
    />

  </div>
  <div v-if="showIf" class="result-container">
    <h3 style="color: white;">Felicidades. Puedes continuar con la siguiente actividad.</h3>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import ExplanationModal from '../../components/ExplanationModal.vue'
import { useStore } from 'vuex'
import axios from 'axios'
const emit = defineEmits(['activityCompleted']);

const items = [
  { statement: 'El cambio climático hace que los huracanes sean más fuertes.', answer: true, explanation: 'Esto se debe a que el calentamiento de los océanos proporciona más energía a las tormentas.' },
  { statement: 'Los árboles ayudan a limpiar el aire.', answer: true, explanation: 'Los árboles absorben dióxido de carbono y producen oxígeno, mejorando la calidad del aire.' },
  { statement: 'Los glaciares se están derritiendo por el calentamiento del planeta.', answer: true, explanation: 'El calentamiento global causa el derretimiento de los glaciares, lo que contribuye al aumento del nivel del mar.' },
  { statement: 'Es importante usar más energía.', answer: false, explanation: 'Usar más energía contribuye a la contaminación y al cambio climático.' },
  { statement: 'Las energías renovables ayudan a cuidar el medio ambiente.', answer: true, explanation: 'Las energías renovables reducen la dependencia de combustibles fósiles, disminuyendo la contaminación.' },
  { statement: 'El cambio climático no afecta a los animales.', answer: false, explanation: 'El cambio climático tiene un impacto negativo en la biodiversidad y los hábitats naturales.' },
  { statement: 'Los océanos se están calentando.', answer: true, explanation: 'Los océanos absorben gran parte del calor del calentamiento global, afectando la vida marina.' },
  { statement: 'La contaminación no tiene impacto en el cambio climático.', answer: false, explanation: 'La contaminación contribuye al efecto invernadero, agravando el cambio climático.' },
  { statement: 'Usar menos energía ayuda al planeta.', answer: true, explanation: 'Reducir el consumo de energía disminuye las emisiones de gases de efecto invernadero.' },
  { statement: 'El sol no tiene efecto en el clima.', answer: false, explanation: 'El sol es la principal fuente de energía que influye en el clima de la Tierra.' },
]

const store = useStore()
const activityNumber = ref(3)
const userId = computed(() => store.state.userId)
const completionTime = ref(0)

const shuffledItems = ref([])
const selectedAnswers = ref([])
const resultMessage = ref('')
const results = ref([])
const isValidated = ref(false)
const correctCount = ref(0)

const startTime = ref(0)

const interactionData = ref({
  timeTaken: 0,
  correctAnswers: [],
  incorrectAnswers: [],
  completed: false,
  progress: 0
})

const showMessage = ref(false)
const isModalVisible = ref(false)
const modalTitle = ref('')
const modalExplanation = ref('')

const warningMessage = ref('') 

const itemsPerPage = 2
const currentPage = ref(0)
const maxPage = computed(() => Math.ceil(items.length / itemsPerPage) - 1)


const paginatedItems = computed(() => {
  const start = currentPage.value * itemsPerPage
  return items.slice(start, start + itemsPerPage)
})

// Navegar entre páginas
const prevPage = () => {
  if (currentPage.value > 0) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < maxPage.value) currentPage.value++
}


// // Función para mezclar los items aleatoriamente
// const shuffleItems = () => {
//   shuffledItems.value = items.sort(() => Math.random() - 0.5)
// }

// Al seleccionar una respuesta
const selectAnswer = (index, answer) => {
  selectedAnswers.value[index] = answer
  saveAnswersToLocalStorage()

}

// Validar las respuestas
const validateAnswers = () => {
  // Verificar que todas las respuestas estén seleccionadas
  if (selectedAnswers.value.length < shuffledItems.value.length || selectedAnswers.value.includes(undefined)) {
    warningMessage.value = 'Por favor, selecciona una respuesta para cada declaración.'
    return // Detener la validación
  } else {
    warningMessage.value = '' // Limpiar el mensaje de advertencia si todo está bien
  }

  isValidated.value = true // Cambia el estado a validado
  results.value = shuffledItems.value.map((item, index) => {
    const correct = item.answer === selectedAnswers.value[index]
    if (correct) interactionData.value.correctAnswers.push(item.statement)
    else interactionData.value.incorrectAnswers.push(item.statement)
    return {
      statement: item.statement,
      correct: item.answer === selectedAnswers.value[index],
      explanation: item.explanation // Añadimos la explicación al resultado
    }
  })

  const endTime = Date.now()
  const correctCount = results.value.filter(result => result.correct).length
  resultMessage.value = `Respuestas correctas: ${correctCount} de ${items.length}`
  interactionData.value.progress = 100
  interactionData.value.timeTaken = Math.floor((endTime - startTime.value) / 1000)

}

const calculateCompletionTime = () => {
  startTime.value = Date.now()
}

const selectedResult = ref(null) // Nueva referencia para almacenar el item seleccionado en el modal


// Abrir el modal con la explicación
const openExplanation = (result) => {
  modalTitle.value = result.correct ? 'Respuesta Correcta' : 'Respuesta Incorrecta'
  modalExplanation.value = result.explanation
  isModalVisible.value = true
  selectedResult.value = result // Almacena el item actual en selectedResult

}

const closeModal = () => {
  isModalVisible.value = false
  if (selectedResult.value && !selectedResult.value.correct) { // Verifica si hay un item seleccionado y es incorrecto
    selectedResult.value.correct = true // Marca el item como correcto
    interactionData.value.incorrectAnswers = interactionData.value.incorrectAnswers.filter(item => item !== selectedResult.value.statement)
    interactionData.value.correctAnswers.push(selectedResult.value.statement)
  }
  selectedResult.value = null // Limpia el item seleccionado después de cerrar el modal
}


const completeActivity = async () => {

  if (interactionData.value.correctAnswers.length !== items.length) {
    showMessage.value = true
    return
  }

  console.log('interactionData antes de enviar', interactionData.value)
  const userIdparams = userId.value
  interactionData.value.completed = true
  try {
    await axios.put(`http://24.199.103.0/api/activities/update/${userIdparams}/${activityNumber.value}`, interactionData.value)
    console.log('Datos enviados al backend:', interactionData.value)
    showIf.value = true
    emit('activityCompleted');
  } catch (error) {
    console.error('Error al enviar los datos al backend:', error)
  }
}

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
    completionTime.value = response.data.activities.timiTaken
    console.log('showIf', showIf.value)


    if (interactionData.value.completed) {
      resultMessage.value = `Respuestas correctas: ${interactionData.value.correctAnswers.length} de ${items.length}`
    }
  } catch (error) {
    console.error('Error al obtener los datos del backend:', error)
  }
}

// const resetGame = () => {
//   selectedAnswers.value = []
//   resultMessage.value = ''
//   results.value = []
//   isValidated.value = false
//   correctCount.value = 0
//   interactionData.value = { timeTaken: 0, correctAnswers: [], incorrectAnswers: [], completed: false, progress: 0 }
//   shuffleItems()
//   localStorage.removeItem('selectedAnswers')
// }


// Guardar las respuestas en el localStorage
const saveAnswersToLocalStorage = () => {
  localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers.value))
}

// Obtener las respuestas del localStorage
const loadAnswersFromLocalStorage = () => {
  const storedAnswers = localStorage.getItem('selectedAnswers')
  if (storedAnswers) {
    selectedAnswers.value = JSON.parse(storedAnswers)
  }
}


// Mezclar los items y guardar el orden en localStorage
const initializeItems = () => {
  const storedItems = localStorage.getItem('shuffledItems')
  if (storedItems) {
    shuffledItems.value = JSON.parse(storedItems)
  } else {
    shuffledItems.value = items.sort(() => Math.random() - 0.5)
    localStorage.setItem('shuffledItems', JSON.stringify(shuffledItems.value))
  }
}


onBeforeMount(() => {
  getActivityData()
  calculateCompletionTime()
  if (localStorage.getItem('selectedAnswers')) {
    selectedAnswers.value = JSON.parse(localStorage.getItem('selectedAnswers'))
  }})

initializeItems()
loadAnswersFromLocalStorage()
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  font-family: Arial, sans-serif;
}

.card {
  background-color: #2A3552;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin: 10px 0;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  color: white;
}

.statement {
  font-weight: bold;
  margin-bottom: 10px;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.selectedTrue {
  background-color: #67b669;
  color: white;
}

button.selectedFalse {
  background-color: #c23e3e;
  color: white;
}

button:hover {
  background-color: #3b445f;
}

.results {
  border-top: 2px solid #4caf50;
  padding-top: 15px;
}

.correct {
  color: white;
  background-color: #4caf50;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.incorrect {
  color: white;
  background-color: #c23e3e;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.btn-secondary {
  margin-top: 20px;
}

.carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.carousel-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nav-button {
  background-color: #3b445f;
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 20px;
}

.nav-button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.nav-button:hover:not(:disabled) {
  background-color: #6b7385;
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

