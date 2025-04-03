<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold">{{ pais.name.common }}</h1>
      <img :src="pais.flags.png" :alt="pais.name.common" class="w-32 my-4" />
      <p><strong>Capital:</strong> {{ pais.capital[0] }}</p>
      <p><strong>População:</strong> {{ pais.population.toLocaleString() }}</p>
      <button @click="voltar" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Voltar
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const pais = ref(null);
  
  onMounted(async () => {
    const response = await fetch(`https://restcountries.com/v3.1/name/${route.params.nome}`);
    const data = await response.json();
    pais.value = data[0];
  });
  
  const voltar = () => {
    router.go(-1);
  };
  </script>