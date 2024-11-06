<template>
    <div v-if="showInfoModal" class="info-modal" :style="{ backgroundImage: `url(${currentBackground})` }">
      <div class="modal-content">
        <h3>{{ activityInfo.title }}</h3>
        <button @click="nextDescription">Continuar</button>
        
        <div v-if="currentDescriptionIndex < activityInfo.descriptions.length" class="description-box">
          <p>{{ activityInfo.descriptions[currentDescriptionIndex] }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <style>
 
  
  .modal-content {
    width: 10px;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    color: rgb(8, 8, 8);
  }
  
  .description-box {
    margin-top: 20px;
  }
  </style>

<script setup>
import { ref } from 'vue';

const showInfoModal = ref(true); // Controla la visibilidad del modal
const currentDescriptionIndex = ref(0); // Índice de la descripción actual

const activityInfo = {
  title: "El Jardín de Luna",
  descriptions: [
    "Luna era una niña de 10 años que amaba su pequeño jardín. En él cultivaba flores de colores, tomates y hasta un pequeño árbol de manzanas que había plantado con su abuela. Cada día, después de la escuela, Luna regaba sus plantas y les hablaba con cariño.",
    "Un día, Luna notó algo extraño: sus plantas parecían tristes y marchitas, a pesar de regarlas regularmente. Preocupada, le preguntó a su profesora de ciencias qué podría estar pasando. La maestra le explicó que el clima estaba cambiando: los veranos eran más calurosos, las lluvias más escasas y el aire estaba más contaminado debido al cambio climático.",
    "Luna decidió investigar más sobre el tema y descubrió que muchas actividades humanas, como el uso excesivo de automóviles y fábricas, estaban afectando el clima de todo el planeta. No solo su jardín estaba sufriendo; muchos animales y plantas en todo el mundo también estaban en peligro.",
    "Determinada a hacer algo, Luna organizó un club ecológico en su escuela. Junto con sus compañeros, comenzaron a plantar más árboles, crear un huerto escolar y enseñar a otros niños sobre la importancia de cuidar el medio ambiente. Poco a poco, su jardín comenzó a recuperarse, y Luna aprendió que incluso las acciones pequeñas pueden hacer una gran diferencia cuando se trata de proteger nuestro planeta."
  ]
};

// Cambiar las imágenes de fondo según el índice de descripción
const backgrounds = [
  '../../assets/img/co21.webp', // Cambia por la URL de la primera imagen de fondo
  '../../assets/img/co21.webp', // Cambia por la URL de la primera imagen de fondo
  '../../assets/img/co21.webp', // Cambia por la URL de la primera imagen de fondo
  '../../assets/img/co21.webp', // Cambia por la URL de la primera imagen de fondo
 ];

const currentBackground = ref(backgrounds[currentDescriptionIndex.value]);

const nextDescription = () => {
  if (currentDescriptionIndex.value < activityInfo.descriptions.length - 1) {
    currentDescriptionIndex.value++;
    currentBackground.value = backgrounds[currentDescriptionIndex.value];
  } else {
    showInfoModal.value = false; // Cerrar el modal después de la última descripción
  }
};
</script>

