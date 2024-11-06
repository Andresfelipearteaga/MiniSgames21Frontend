<template>
    <div class="memory-game">
      <h2>Relaciona los Términos del Cambio Climático con sus Definiciones</h2>
      <v-container class="memory-board">
        <MemoryCard
          v-for="card in shuffledCards"
          :key="card.id"
          :cardData="card"
          :onFlip="handleCardFlip"
        />
      </v-container>
    </div>
  </template>
  
  <script>
  import { ref, reactive } from 'vue';
  import MemoryCard from '../examples/Cards/TrueOrFalse.vue';
  import climateTerms from '../assets/json/climateTerms.json';

  
  export default {
    components: { MemoryCard },
    setup() {
      const shuffledCards = ref([]);
      const selectedCards = reactive({ first: null, second: null });
  
      const shuffleCards = () => {
        shuffledCards.value = [...climateTerms, ...climateTerms]
          .sort(() => Math.random() - 0.5)
          .map((term, index) => ({ ...term, id: index }));
      };
  
      const handleCardFlip = (card) => {
        if (!selectedCards.first) {
          selectedCards.first = card;
        } else if (!selectedCards.second && card.id !== selectedCards.first.id) {
          selectedCards.second = card;
          checkMatch();
        }
      };
  
      const checkMatch = () => {
        if (selectedCards.first.term === selectedCards.second.term) {
          // Mantiene las tarjetas volteadas (match)
        } else {
          setTimeout(() => {
            selectedCards.first.isFlipped = selectedCards.second.isFlipped = false;
          }, 1000);
        }
        resetSelection();
      };
  
      const resetSelection = () => {
        selectedCards.first = selectedCards.second = null;
      };
  
      shuffleCards();
  
      return { shuffledCards, handleCardFlip };
    },
  };
  </script>
  
  <style scoped>
  .memory-game {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .memory-board {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    width: 100%;
  }
  </style>
  