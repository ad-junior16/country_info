<template>
    <div class="home">
      <h1>Country Info</h1>
      <PesquisaInput @selecionar-pais="navegarParaDetalhes" />
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import PesquisaInput from '@/components/PesquisaInput.vue'
  
  const router = useRouter()
  
  const navegarParaDetalhes = (pais) => {
    router.push({
      name: 'country-detail',
      params: { name: encodeURIComponent(pais.name.common) }
    })
  }
  </script>
  
  <style scoped>
  .home {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  </style>