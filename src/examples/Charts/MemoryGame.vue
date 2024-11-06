<template>
  <div v-if="!showActivityDetails" class="container text-center my-5">
    <h1 style="color: white;">Juego de Memoria - Causas del Cambio Climático</h1>
    <h6 style="color: white;">Para información sobre la actividad, haga clic en el botón de información en la esquina superior derecha.</h6>
    <button class="btn btn-primary mb-3" v-if="!gameStarted" @click="startGame">Empezar</button>

    <div v-if="gameStarted" class="card-grid">
      <div
        class="col-4 col-md-2 mb-3"
        v-for="(card, index) in cards"
        :key="index"
        @click="flipCard(index)"
        :class="['card', { flipped: card.flipped || card.matched, defect: !card.flipped && !card.matched, matched: card.matched }]"
        style="cursor: pointer; width: 100%"
      >
        <div class="card-body">
          <div class="image-container">
            <h5 class="card-title" v-if="!card.flipped && !card.matched">Toca para voltear la carta</h5>
            <img v-if="card.flipped || card.matched" :src="card.imageUrl" alt="Imagen" class="card-image" />
          </div>
          <h5 class="card-title">{{ card.flipped || card.matched ? card.word : '' }}</h5>
        </div>
      </div>
    </div>
    <button v-if="activeResult" class="btn btn-secondary mt-3" @click="showActivityInfo">Resultado</button>
  </div>
  <div v-if="showActivityDetails" class="activity-details mt-3 p-3 border rounded">
      <h3 style="color: white; font-weight: bold;" >{{ currentActivity.title }}</h3>
      <p style="color: white;"><strong>Tiempo de finalización:</strong> {{ currentActivity.completionTime }} segundos</p>
      <p style="color: white;"><strong>Progreso:</strong> {{ currentActivity.progress }}%</p>
      <h4 style="color: white" ><strong>¡Puedes continuar a la segunda actividad!</strong></h4>
      <br>
    </div>
</template>

<script>
import fabricaImg from "../../assets/img/fabrica.jpg";
import emisionesImg from "../../assets/img/emision.jpg";
import glaciarImg from "../../assets/img/glaciar.jpg";
import nivelMarImg from "../../assets/img/aumentodelmar.jpg";
import panelImg from "../../assets/img/panel.jpg";
import turbinaImg from "../../assets/img/turbina.jpg";
import energiaImg from "../../assets/img/energia.jpg";
import deforestacionImg from "../../assets/img/17166.jpg";
import faunaImg from "../../assets/img/fauna.jpg";

import axios from "axios";

export default {
  data() {
    return {
      cards: [],
      currentActivity: {},
      showActivityDetails: false,
      activityNumber: 1,
      flippedCards: [],
      matchedCount: 0,
      gameStarted: false,
      activeResult: false,
      activityStats: {
        startTime: null,
        totalClicks: 0,
        incorrectPairs: 0,
        completionTime: null,
        averagePairTime: 0,
        progress: 0,
        completed: false
      },
    };
  }, 
  computed: {
    userId() {
      return this.$store.state.userId; // Asegúrate de tener el ID del usuario en Vuex
    },
  },
  created() {
    this.verifyCompleted()
    this.loadGameFromStorage();
  },
  methods: {


    startGame() {
      this.gameStarted = true;
      this.activityStats.startTime = Date.now();
      this.activityStats.totalClicks = 0;
      this.activityStats.incorrectPairs = 0;
      this.activityStats.progress = 0;
      this.flipAllCardsTemporarily();
    },
    flipAllCardsTemporarily() {
      this.cards.forEach((card) => (card.flipped = true));
      setTimeout(() => {
        this.cards.forEach((card) => (card.flipped = false));
        this.saveGameToStorage();
      }, 5000);
    },
    flipCard(index) {
      if (this.cards[index].flipped || this.cards[index].matched) return;

      this.cards[index].flipped = true;
      this.flippedCards.push(index);
      this.activityStats.totalClicks++;

      if (this.flippedCards.length === 2) {
        setTimeout(this.checkMatch, 1000);
      }
      this.saveGameToStorage();
    },
    checkMatch() {
      const [firstIndex, secondIndex] = this.flippedCards;
      const firstCard = this.cards[firstIndex];
      const secondCard = this.cards[secondIndex];

      const matchingPairs = {
        "Fábrica": "Emisiones de gases de efecto invernadero",
        "Panel Solar": "Energía limpia y renovable",
        "Turbina Eólica": "Energía limpia y renovable",
        "Glaciar Derritiéndose": "Aumento del nivel del mar",
        "Deforestación": "Pérdida de fauna",
      };

      if (matchingPairs[firstCard.word] === secondCard.word || matchingPairs[secondCard.word] === firstCard.word) {
        firstCard.matched = true;
        secondCard.matched = true;
        this.matchedCount += 2;
        this.activityStats.progress = (this.matchedCount / this.cards.length) * 100;
      } else {
        firstCard.flipped = false;
        secondCard.flipped = false;
        this.activityStats.incorrectPairs++;
      }

      const currentTime = Date.now();
      this.activityStats.averagePairTime =
        ((currentTime - this.activityStats.startTime) / this.matchedCount) / 2;
      this.flippedCards = [];

      if (this.matchedCount === this.cards.length) {
        this.activityStats.completionTime = (currentTime - this.activityStats.startTime) / 1000; // En segundos
        this.sendStats();
        this.activeResult = true

      }

      this.saveGameToStorage();
    },
    resetGame() {
      this.matchedCount = 0;
      this.gameStarted = false;
      this.cards.forEach((card) => {
        card.flipped = false;
        card.matched = false;
      });
      this.generateCards();
      this.saveGameToStorage();
    },
    generateCards() {
      const initialCards = [
        { word: "Fábrica", imageUrl: fabricaImg, flipped: false, matched: false },
        { word: "Emisiones de gases de efecto invernadero", imageUrl: emisionesImg, flipped: false, matched: false },
        { word: "Glaciar Derritiéndose", imageUrl: glaciarImg, flipped: false, matched: false },
        { word: "Aumento del nivel del mar", imageUrl: nivelMarImg, flipped: false, matched: false },
        { word: "Panel Solar", imageUrl: panelImg, flipped: false, matched: false },
        { word: "Energía limpia y renovable", imageUrl: energiaImg, flipped: false, matched: false },
        { word: "Energía limpia y renovable", imageUrl: energiaImg, flipped: false, matched: false },
        { word: "Turbina Eólica", imageUrl: turbinaImg, flipped: false, matched: false },
        { word: "Deforestación", imageUrl: deforestacionImg, flipped: false, matched: false },
        { word: "Pérdida de fauna", imageUrl: faunaImg, flipped: false, matched: false },
      ];
      this.cards = [...initialCards];
      this.cards.sort(() => Math.random() - 0.5); // Mezclar cartas
      this.saveGameToStorage();
    },
    sendStats() {
      if (this.activityStats.progress === 100) {
        this.completed = true }

      const activityInfo = {
          title: "Memory Game Activity",
          totalClicks: this.activityStats.totalClicks,
          incorrectPairs: this.activityStats.incorrectPairs,
          completionTime: this.activityStats.completionTime,
          averagePairTime: this.activityStats.averagePairTime,
          progress: this.activityStats.progress,
          completed: this.completed
    };
      // Aquí enviarías statsPayload a tu base de datos con una llamada API
      console.log("Enviando datos a la base de datos:", activityInfo);
      const userIdparams = this.userId;
      axios.put(`http://24.199.103.0:5000/api/activities/update/${userIdparams}/${this.activityNumber}`, activityInfo).then((response) => {
        console.log("Datos enviados:", response.data);
      });
    },


    async showActivityInfo() {
      try {
        const response = await axios.get(`http://24.199.103.0:5000/api/activities/get/${this.userId}/${this.activityNumber}`);
        this.currentActivity = response.data.activities;
        console.log(this.currentActivity);
        this.showActivityDetails = true; // Muestra el div con la información
        this.$emit('activityCompleted');
      } catch (error) {
        console.error('Error al obtener la actividad:', error);
      }
    },


    saveGameToStorage() {
      const gameData = {
        cards: this.cards,
        gameStarted: this.gameStarted,
        matchedCount: this.matchedCount,
      };
      localStorage.setItem("memoryGame", JSON.stringify(gameData));
    },
    loadGameFromStorage() {
      
      
      const savedGame = localStorage.getItem("memoryGame");
      if (savedGame) {
        const gameData = JSON.parse(savedGame);
        this.cards = gameData.cards;
        this.gameStarted = gameData.gameStarted;
        this.matchedCount = gameData.matchedCount;
      } else {
        this.generateCards();
      }
    },

    async verifyCompleted() {
      try {
        const response = await axios.get(`http://24.199.103.0:5000/api/activities/get/${this.userId}/${this.activityNumber}`);
        this.currentActivity = response.data.activities;
        console.log(this.currentActivity);
        if (this.currentActivity.completed === true) {
        this.showActivityDetails = true; }
      } catch (error) {
        console.error('Error al obtener la actividad:', error);
      }
    },
  },
};
</script>


<style>
.card {
  transition: transform 0.3s;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.card-title {
  font-size: 1rem;
  text-align: center;
  margin-bottom: 10px;
  color: white;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  padding: 10px;
  border-radius: 20px;
}

.image-container {
  width: 200px;
  height: 200px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}



.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.card.flipped {
  background-color: rgba(19, 28, 53, 0);
  transform: rotateY(360deg);
  border: 1px solid white;
}

.card.defect {
  background-color: rgba(19, 28, 53, 0);
  border: 1px solid white;
}

.card.matched {
  border: 2px solid green; /* Borde verde para cartas emparejadas */
}

@media screen and (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .image-container {
    width: auto;
    height: auto;
  }

  .card-image {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
}
</style>
