<script setup>
import { computed, ref, onBeforeMount } from "vue";
import axios from 'axios';
import { useStore } from 'vuex';
const store = useStore();
const arrayNumbers = ref([]);
import Chart from "chart.js/auto";


const fetchUserInfo = async () => {
      try {
        const userId = computed(() => store.getters.getUserId);
        console.log('userId', userId.value);
        const response = await axios.get(`http://localhost:5000/api/users/profile/${userId.value}`);
        const activitiesProgress = response.data.activitiesProgress;
        console.log('activitiesUser', activitiesProgress);
        arrayNumbers.value = Object.values(activitiesProgress).filter(value => typeof value === "number");
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
      }
    };

// onBeforeMount(() => {
//   fetchUserInfo();
// });

onBeforeMount(() => {
  fetchUserInfo();
  setTimeout(() => {
    console.log('activities in chart', arrayNumbers.value);
  let ctx = document.getElementById("chart-bars").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Interpretación", "Análisis", "Evaluación", "Observación", "Explicación", "Autorregulación"],
      datasets: [
        {
          label: "Progress",
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false,
          backgroundColor: "#fff",
          data: arrayNumbers.value,
          maxBarThickness: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            suggestedMin: 0,
            suggestedMax: 500,
            beginAtZero: true,
            padding: 15,
            font: {
              size: 14,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
            color: "#fff",
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            display: false,
          },
        },
      },
    },
  });
  }, 3000);

});
</script>
<template>
  <div class="card">
    <div class="card-body p-3">
      <div class="py-3 mb-3 bg-gradient-dark border-radius-lg pe-1">
        <div class="chart">
          <canvas id="chart-bars" class="chart-canvas" height="170"></canvas>
        </div>
      </div>
      <div class="container border-radius-lg">
        <div class="row">
          <div class="py-3 col-3 ps-0">
            <div class="mb-2 d-flex">
            
              <p class="mt-1 mb-0 text-xs font-weight-bold">Interpretación</p>
            </div>
            <h4 class="font-weight-bolder"> {{ arrayNumbers[0] }}%</h4>
           
          </div>
          <div class="py-3 col-3 ps-0">
            <div class="mb-2 d-flex">
              <p class="mt-1 mb-0 text-xs font-weight-bold">Análisis</p>
            </div>
            <h4 class="font-weight-bolder">{{ arrayNumbers[1] }}%</h4>
            
          </div>
          <div class="py-3 col-3 ps-0">
            <div class="mb-2 d-flex">
             
              <p class="mt-1 mb-0 text-xs font-weight-bold">Evaluación</p>
            </div>
            <h4 class="font-weight-bolder">{{ arrayNumbers[2] }}%</h4>
          
          </div>
          <div class="py-3 col-3 ps-0">
            <div class="mb-2 d-flex">
            
           
              <p class="mt-1 mb-0 text-xs font-weight-bold">Observación</p>
            </div>
            <h4 class="font-weight-bolder">{{ arrayNumbers[3] }}%</h4>
           
          </div>

          <div class="py-3 col-3 ps-0">
            <div class="mb-2 d-flex">
            
           
              <p class="mt-1 mb-0 text-xs font-weight-bold">Explicación</p>
            </div>
            <h4 class="font-weight-bolder">{{ arrayNumbers[4] }}%</h4>
        
          </div>

          <div class="py-3 col-3 ps-0">
            <div class="mb-2 d-flex">
            
           
              <p class="mt-1 mb-0 text-xs font-weight-bold">Autorregulación</p>
            </div>
            <h4 class="font-weight-bolder">{{ arrayNumbers[5] }}%</h4>
       
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
