<template>
    <div class="home">
      <!-- Loading global -->
      <div v-if="carregando" class="global-loading">
        <div class="spinner"></div>
      </div>
  
      <!-- Mensagem de erro global -->
      <div v-if="erro" class="global-error">
        <p>{{ erro }}</p>
      </div>
  
      <h1>Country Info</h1>
      <PesquisaInput 
        @iniciou-carregamento="carregando = true"
        @terminou-carregamento="carregando = false"
        @erro-carregamento="mostrarErro"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import PesquisaInput from '@/components/PesquisaInput.vue'
  
  const carregando = ref(false)
  const erro = ref(null)
  
  const mostrarErro = (mensagem) => {
    erro.value = mensagem
    setTimeout(() => { erro.value = null }, 5000)
  }
  </script>
  
  <style scoped>
  .home {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    position: relative;
  }
  
  .global-loading {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
  }
  
  .global-error {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #e74c3c;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    z-index: 1000;
    animation: fadeInOut 5s forwards;
  }
  
  @keyframes fadeInOut {
    0% { opacity: 0; top: 0; }
    10% { opacity: 1; top: 20px; }
    90% { opacity: 1; top: 20px; }
    100% { opacity: 0; top: 0; }
  }
  
  .spinner {
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