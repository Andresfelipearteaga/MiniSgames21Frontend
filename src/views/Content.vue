<!-- ClimateChange.vue -->
<template>
    <div class="climate-container">
      <nav class="climate-nav">
        <button 
          v-for="(section, index) in sections" 
          :key="index"
          :class="['nav-button', { active: activeSection === index }]"
          @click="activeSection = index"
        >
          {{ section.title }}
        </button>
      </nav>
  
      <transition name="fade" mode="out-in">
        <section :key="activeSection" class="content-section">
          <h2>{{ sections[activeSection].title }}</h2>
          
          <div class="content-wrapper">
            <div class="text-content">
              <p>{{ sections[activeSection].description }}</p>
              
              <h3>{{ sections[activeSection].listTitle }}:</h3>
              <ul>
                <li v-for="(item, idx) in sections[activeSection].list" 
                    :key="idx">
                  {{ item }}
                </li>
              </ul>
            </div>
            
            <div class="image-placeholder">
            </div>
          </div>
        </section>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'

  
  
  const activeSection = ref(0)
  
  const sections = [
    {
      title: "Cambio Climático: Definición y Causas",
      description: "El cambio climático se refiere a las variaciones a largo plazo en las temperaturas y patrones climáticos de la Tierra. Estas variaciones son provocadas tanto por causas naturales como por actividades humanas, especialmente desde la Revolución Industrial. Entre las principales causas están las emisiones de gases de efecto invernadero, como el dióxido de carbono (CO₂) y el metano (CH₄), que atrapan el calor en la atmósfera.",
      listTitle: "Causas del cambio climático",
      list: [
        "Uso de combustibles fósiles (petróleo, gas natural y carbón) que generan grandes cantidades de CO₂",
        "Deforestación que reduce la cantidad de árboles capaces de absorber CO₂",
        "Agricultura intensiva y ganadería que producen metano y óxidos de nitrógeno",
        "Actividades industriales que emiten varios contaminantes al aire"
      ],
      imageDescription: "Gráfica de emisiones de CO₂ por sector"
    },
    {
      title: "Efectos del Cambio Climático",
      description: "Los efectos del cambio climático son variados y de gran alcance. Incluyen el aumento de las temperaturas globales, el derretimiento de los glaciares, el aumento del nivel del mar y cambios en los patrones climáticos, lo que lleva a fenómenos meteorológicos extremos.",
      listTitle: "Principales efectos",
      list: [
        "Calentamiento global: El aumento de la temperatura media global está afectando a todos los ecosistemas",
        "Aumento del nivel del mar: Provocado por el derretimiento de glaciares y la expansión térmica del agua",
        "Fenómenos extremos: Mayor frecuencia de huracanes, olas de calor, sequías, e inundaciones",
        "Pérdida de biodiversidad: Muchos hábitats se ven alterados, afectando a especies en peligro"
      ],
      imageDescription: "Representación visual del derretimiento de los glaciares"
    },
    {
      title: "Qué Hacer para Mejorar",
      description: "Combatir el cambio climático requiere acciones a nivel individual, comunitario, gubernamental y global. La adopción de energías renovables, la eficiencia energética y el consumo responsable son clave.",
      listTitle: "Acciones para combatir el cambio climático",
      list: [
        "Usar energías renovables: Como solar, eólica, y geotérmica",
        "Eficiencia energética: Ahorrar energía en el hogar, transporte y consumo industrial",
        "Reducir, reutilizar y reciclar: Minimizar los residuos y reducir la contaminación",
        "Promover la movilidad sostenible: Uso de transporte público, bicicletas, y vehículos eléctricos"
      ],
      imageDescription: "Ilustración de paneles solares y molinos de viento"
    },
    {
      title: "Reducción de CO₂ y Deforestación",
      description: "Reducir el CO₂ en la atmósfera es fundamental para frenar el cambio climático, así como detener la deforestación que contribuye al aumento de este gas.",
      listTitle: "Estrategias para reducir el CO₂",
      list: [
        "Plantación de árboles: Los árboles absorben CO₂ y ayudan a purificar el aire",
        "Conservar los bosques existentes: Evitar la deforestación preserva sumideros de carbono",
        "Restauración de ecosistemas: Revivir áreas dañadas mejora la absorción de carbono",
        "Agricultura sostenible: Reducir el uso de fertilizantes y el cambio de uso del suelo"
      ],
      imageDescription: "Ilustración de un bosque saludable comparado con uno deforestado"
    }
  ]
  </script>
  
  <style scoped>
  .climate-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: system-ui, -apple-system, sans-serif;
    background-color: #1118279a;
  }
  
  .climate-nav {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .nav-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #f3f4f6;
    color: #374151;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s ease;
  }
  
  .nav-button:hover {
    background-color: #e5e7eb;
  }
  
  .nav-button.active {
    background-color: #10b981;
    color: white;
  }
  
  .content-section {
    animation: fadeIn 0.5s ease-out;
  }
  
  .content-wrapper {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 2rem;
  }
  
  @media (min-width: 768px) {
    .content-wrapper {
      grid-template-columns: 3fr 2fr;
    }
  }
  
  .text-content {
    color: #ffffff;
  }
  
  h2 {
    font-size: 1.875rem;
    color: #ffffff;
    margin-bottom: 1.5rem;
  }
  
  h3 {
    font-size: 1.25rem;
    color: #ffffff;
    margin: 1.5rem 0 1rem;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    position: relative;
  }
  
  li::before {
    content: "•";
    color: #10b981;
    position: absolute;
    left: 0;
  }
  
  .image-placeholder {
    background-image: url('../assets/img/content1.webp');
    background-size: cover;
    background-position: center;
    border-radius: 0.5rem;
    padding: 2rem;
    aspect-ratio: 4/3;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  
  .image-text {
    color: #6b7280;
    margin: 0;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>