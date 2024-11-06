<template>
  <div class="container py-4">
    <h3 v-if="!interactionData.completed" class="mb-4" style="color: white;">Drag and Drop - Causas y Efectos del cambio climático</h3>
    <br>
    <h6 style="color: white;">Para información sobre la actividad, haga clic en el botón de información en la esquina superior derecha.</h6>
    <div v-if="!interactionData.completed" class="row g-4">
      <!-- Contenedor de items iniciales -->
      <div class="col-md-6 col-lg-5">
        <div 
          class="border rounded p-3 shadow-sm"
          @dragover.prevent
          @drop="handleDrop($event, 'items')"
          @touchmove.prevent="handleTouchMove"
          @touchend="handleTouchEnd"
          style="background-color: #2A3552;"

        >
          <h5 class="mb-3" style="color: white;">{{ containers.items.title }}</h5>
          <div class="items-grid" >
            <div
              v-for="item in containers.items.items"
              :key="item.id"
              :class="['mb-2 p-3 rounded d-flex align-items-center justify-content-between text-white', item.color, { 'selected': selectedItem && selectedItem.id === item.id }]"
              draggable="true"
              @dragstart="handleDragStart($event, item)"
              @touchstart="handleTouchStart(item)"
              @click="selectItem(item)"
              style="cursor: move;"
            >
              <span>{{ item.content }}</span>
              <i class="bi bi-arrows-move"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenedores destino: Causas y Efectos -->
      <div 
        v-for="(container, key) in filteredContainers" 
        :key="key"
        class="col-md-6 col-lg-3"
        
      >
        <div 
          class="border rounded p-3 shadow-sm"
          @dragover.prevent
          @drop="handleDrop($event, key)"
          style="background-color: #2A3552;"
          @click="moveSelectedItemToContainer(key)"
        >
          <h5 class="mb-3" style="color: white;">{{ container.title }}</h5>
          <div class="min-height-100" style="min-height: 150px;">
            <div
              v-for="item in container.items"
              :key="item.id"
              :class="['mb-2 p-3 rounded d-flex align-items-center justify-content-between text-white', item.color, { 'border-red': item.isIncorrect }]"
              draggable="true"
              @dragstart="handleDragStart($event, item)"
              style="cursor: move;"
            >
              <span>{{ item.content }}</span>
              <i class="bi bi-arrows-move"></i>
            </div>
          </div>
        </div>
      </div>
      <center>
    <!-- Botón para validar las respuestas -->
    <button v-if="!interactionData.completed" class="btn btn-primary mt-4" @click="validateAnswers" :disabled="!allItemsSorted">
      Validar Respuestas
    </button>
    </center>
    <br>
    <center>
      <h4 v-if="errorMessage" class="mt-3 text-danger ">{{ errorMessage }}</h4>

    </center>

    </div>



        <!-- Mensaje de resultados o sección de resultados -->
        <div v-if="interactionData.completed" class="result-container mt-4">
      <h3 style="color: white;">Resultados:</h3>
      <p style="color: white;">Actividad completada en {{interactionData.completionTime}} segundos. Respuestas correctas: {{ countResult }} de 10</p>
      <p style="color: white;">Intentos: <strong>{{ interactionData.attempts.length }}</strong></p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

const store = useStore()
const emit = defineEmits(['activityCompleted']);
const selectedItem = ref(null); // Definir el elemento seleccionado

// Estado reactivo para los contenedores
const containers = ref({
  items: {
    title: 'Seleccione y arrastre',
    items: [
      { id: 1, content: 'Emisión de gases de efecto invernadero', color: 'bg-primary', type: 'Causa' },
      { id: 2, content: 'Incremento de la temperatura global', color: 'bg-success', type: 'Efecto' },
      { id: 3, content: 'Deforestación de bosques tropicales', color: 'bg-info', type: 'Causa' },
      { id: 4, content: 'Pérdida de biodiversidad', color: 'bg-warning', type: 'Efecto' },
      { id: 5, content: 'Quema de combustibles fósiles', color: 'bg-danger', type: 'Causa' },
      { id: 6, content: 'Aumento del nivel del mar', color: 'bg-secondary', type: 'Efecto' },
      { id: 7, content: 'Expansión de la agricultura intensiva', color: 'bg-dark', type: 'Causa' },
      { id: 8, content: 'Contaminación de los océanos', color: 'bg-info', type: 'Efecto' },
      { id: 9, content: 'Sobreexplotación de recursos naturales', color: 'bg-primary', type: 'Causa' },
      { id: 10, content: 'Pérdida de hábitats naturales', color: 'bg-success', type: 'Efecto' }
    ]
  },
  causas: {
    title: 'Causas',
    items: []
  },
  efectos: {
    title: 'Efectos',
    items: []
  }
})

const activityNumber = ref(2)
const countResult = ref(null)

const interactionData = ref({
  title: 'Drag and Drop to Climate', 
  startTime: null,
  endTime: null,
  attempts: [],
  completed: false,
  progress: 0,
  completionTime: null
})

const userId = computed(() => store.state.userId)


// Función para seleccionar un elemento
function selectItem(item) {
  selectedItem.value = selectedItem.value && selectedItem.value.id === item.id ? null : item;
  console.log('selectedItem', selectedItem.value);
}
// Función para mover el elemento seleccionado al contenedor especificado
function moveSelectedItemToContainer(containerKey) {
  if (!selectedItem.value) return;

  // Encontrar y eliminar el item del contenedor original
  const sourceContainerKey = Object.keys(containers.value).find(key =>
    containers.value[key].items.some(i => i.id === selectedItem.value.id)
  );

  if (sourceContainerKey) {
    const sourceContainer = containers.value[sourceContainerKey].items;
    const itemIndex = sourceContainer.findIndex(i => i.id === selectedItem.value.id);
    if (itemIndex !== -1) {
      sourceContainer.splice(itemIndex, 1);
    }
  }

  // Mover el item al contenedor de destino
  containers.value[containerKey].items.push(selectedItem.value);

  // Limpiar la selección
  selectedItem.value = null;
}

// Función para calcular el tiempo de interacción
const calculateCompletionTime = () => {
  if (interactionData.value.startTime && interactionData.value.endTime) {
    const duration = interactionData.value.endTime - interactionData.value.startTime
    const completionTime = Math.floor(duration / 1000) // tiempo en segundos
    return completionTime
  }
  return 0
}

// Inicializar el tiempo de inicio cuando el usuario comienza a interactuar
const initializeInteraction = () => {
  if (!interactionData.value.startTime) {
    interactionData.value.startTime = Date.now()
  }
}

// Computed property para filtrar los contenedores destino
const filteredContainers = computed(() => {
  const { items, ...rest } = containers.value
  console.log(items)
  return rest
})

// Estado para el elemento que se está arrastrando
const draggingItem = ref(null)
let sourceContainer = ref(null)
const resultMessage = ref('')
const errorMessage = ref('')
const currentTouchContainer = ref(null)

const allItemsSorted = computed(() => containers.value.items.items.length === 0)


// Eventos para dispositivos móviles
const handleTouchStart = (item) => {
  draggingItem.value = item
  sourceContainer.value = Object.keys(containers.value).find(key => 
    containers.value[key].items.find(i => i.id === item.id)
  )
  console.log('Touch start', sourceContainer.value)
}

const handleTouchMove = (event) => {
  const touch = event.touches[0]
  const element = document.elementFromPoint(touch.clientX, touch.clientY)
  
  if (element && element.closest('[data-container]')) {
    currentTouchContainer.value = element.closest('[data-container]').getAttribute('data-container')
  }
  console.log('Touch Move', currentTouchContainer.value)

}

const handleTouchEnd = () => {
  if (draggingItem.value && currentTouchContainer.value) {
    handleDrop({ preventDefault: () => {} }, currentTouchContainer.value)
  }
  draggingItem.value = null
  sourceContainer.value = null
  currentTouchContainer.value = null
  console.log('Touch End')

}


// Manejador para iniciar el arrastre
const handleDragStart = (event, item) => {
  draggingItem.value = item
  // Encontrar el contenedor de origen
  sourceContainer.value = Object.keys(containers.value).find(key => 
    containers.value[key].items.find(i => i.id === item.id)
  )
}

// Manejador para el drop
const handleDrop = (event, targetContainer) => {
  event.preventDefault()
  
  if (!draggingItem.value || sourceContainer.value === targetContainer) return

  // Remover item del contenedor origen
  containers.value[sourceContainer.value].items = 
    containers.value[sourceContainer.value].items.filter(
      item => item.id !== draggingItem.value.id
    )

  // Agregar item al contenedor destino
  containers.value[targetContainer].items.push(draggingItem.value)

  // Limpiar estado
  draggingItem.value = null
  sourceContainer.value = null

    // Guardar en localStorage
  saveToLocalStorage()

}

// Función para guardar en localStorage con datos sin reactividad
const saveToLocalStorage = () => {
  const containersCopy = JSON.parse(JSON.stringify(containers.value))
  localStorage.setItem('containers', JSON.stringify(containersCopy))
}


// Función para cargar desde localStorage
const loadFromLocalStorage = () => {
  const savedData = localStorage.getItem('containers')
  if (savedData) {
    containers.value = JSON.parse(savedData)
    console.log("Datos cargados desde localStorage:", containers.value)
  } else {
    console.log("No se encontraron datos en localStorage")
  }
}

// Función para validar las respuestas
const validateAnswers = () => {
  initializeInteraction() // Inicia el temporizador si no ha comenzado

  let correctCount = 0
  let currentAttempt = 0
  let errorCount = 0


  // Verificar cuántos elementos están correctamente clasificados
  Object.keys(containers.value).forEach(containerKey => {
    const container = containers.value[containerKey]
    
    container.items.forEach(item => {
      if ((containerKey === 'causas' && item.type === 'Causa') || 
          (containerKey === 'efectos' && item.type === 'Efecto')) {
        item.isIncorrect = false
        correctCount++
      } else {
        item.isIncorrect = true
        errorCount++
    }
    })
  })

  if (Array.isArray(interactionData.value.attempts)) {
    currentAttempt = correctCount;
  interactionData.value.attempts.push(currentAttempt);
} else {
  console.error('attempts no es un arreglo:', interactionData.value.attempts);
}

  // Calcular el progreso y verificar si completó la actividad
  interactionData.value.progress = (correctCount / 10) * 100
  interactionData.value.completed = correctCount === 10

  // Si completado, guarda el tiempo de finalización
  if (interactionData.value.completed) {
    interactionData.value.endTime = Date.now()
    const completionTime = calculateCompletionTime();
    interactionData.value.completionTime = completionTime
    countResult.value = correctCount
    resultMessage.value = `Actividad completada en ${completionTime} segundos. Respuestas correctas: ${correctCount} de 10`;
    sendInteractionData()
    emit('activityCompleted');

  } else {
    errorMessage.value = `Te has equivocado en ${errorCount} item. Puedes corregirlos y volver a intentarlo.`
  }
  console.log('interactionData', interactionData.value)
}


// Función para enviar interactionData al backend
const sendInteractionData = async () => {
  console.log('userId', userId.value)
  const userIdparams = userId.value
  console.log('interactionData antes de enviar', interactionData.value)
  try {
    await axios.put(`http://24.199.103.0:5000/api/activities/update/${userIdparams}/${activityNumber.value}`, interactionData.value)
    console.log('Datos enviados al backend:', interactionData.value)
    setTimeout(() => {
      fetchInteractionData()
    }, 3000)
  } catch (error) {
    console.error('Error al enviar los datos al backend:', error)
  }
}

const fetchInteractionData = async () => {
  const userIdparams = userId.value
  try {
    const response = await axios.get(`http://24.199.103.0:5000/api/activities/get/${userIdparams}/${activityNumber.value}`)
    console.log('response', response.data)
    interactionData.value = response.data.activities
    console.log('interactionData actualizado:', interactionData.value)
  } catch (error) {
    console.error('Error al obtener los datos del backend:', error)
  }
}


onBeforeMount(() => {
  loadFromLocalStorage()
  fetchInteractionData()
})

watch(containers, saveToLocalStorage, { deep: true })

</script>

<style scoped>
.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 8px;
}

.border-red {
  border: 6px solid red;
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: 1fr; /* Una columna en dispositivos pequeños */
  }
}
.min-height-100 {
  min-height: 150px;
}
</style>
