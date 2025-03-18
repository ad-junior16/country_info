<template>
  <div id="app">
    <h1>Country Info</h1>
    <PesquisaInput @selecionar-pais="handleSelecionarPais" />
    <div v-if="paisSelecionado" class="detalhes-pais">
      <h2>{{ paisSelecionado.name.common }}</h2>
      <img :src="paisSelecionado.flags.png"  class="bandeira" />
      <p><strong>Capital:</strong> {{ paisSelecionado.capital[0] }}</p>
      <p><strong>Population:</strong> {{ paisSelecionado.population.toLocaleString() }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PesquisaInput from './components/PesquisaInput.vue';

// Estado reativo para armazenar o país selecionado
const paisSelecionado = ref(null);

// Função para lidar com o país selecionado
const handleSelecionarPais = (pais) => {
  paisSelecionado.value = pais;
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}

.detalhes-pais {
  margin-top: 20px;
}

.bandeira {
  width: 100px;
  height: auto;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

p {
  margin: 5px 0;
}
</style>