<template>
    <div class="home">
      <!-- Feedback global de loading -->
      <div v-if="carregando" class="global-loading">
        <div class="spinner-small"></div>
      </div>
  
      <h1>Country Info</h1>
      <PesquisaInput 
        @selecionar-pais="navegarParaDetalhes"
        @iniciou-carregamento="carregando = true"
        @terminou-carregamento="carregando = false"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import PesquisaInput from '@/components/PesquisaInput.vue'
  
  const carregando = ref(false)
  
  const navegarParaDetalhes = (pais) => {
    // Navegação tratada no próprio PesquisaInput
  }
  </script>
  
  <style scoped>
  .home {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  /* Spinner global */
  .global-loading {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
  }
  
  .spinner-small {
    width: 30px;
    height: 30px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #42b983;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>