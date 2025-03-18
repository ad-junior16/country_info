<template>
    <div class="pesquisa-input">
      <input
        type="text"
        v-model="termoPesquisa"
        placeholder="Type a country name"
        @input="buscarPaises"
      />
      <ul v-if="sugestoes.length > 0" class="sugestoes-lista">
        <li
          v-for="pais in sugestoes"
          :key="pais.name.common"
          @click="selecionarPais(pais)"
        >
          {{ pais.name.common }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Estado reativo para o termo de pesquisa
  const termoPesquisa = ref('');
  
  // Estado reativo para armazenar as sugestões de países
  const sugestoes = ref([]);
  
  // Emitir evento para o componente pai
  const emit = defineEmits(['selecionar-pais']);
  
  // Função para buscar países na API
  const buscarPaises = async () => {
    if (termoPesquisa.value.length > 0) {
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${termoPesquisa.value}`
        );
        const data = await response.json();
  
        // Ordenar os países alfabeticamente pelo nome comum
        const paisesOrdenados = data.sort((a, b) => {
          return a.name.common.localeCompare(b.name.common);
        });
  
        sugestoes.value = paisesOrdenados;
      } catch (error) {
        console.error('Erro ao buscar países:', error);
        sugestoes.value = [];
      }
    } else {
      sugestoes.value = [];
    }
  };
  
  // Função para selecionar um país da lista
  const selecionarPais = (pais) => {
    termoPesquisa.value = pais.name.common;
    sugestoes.value = []; // Limpa a lista de sugestões após a seleção
    emit('selecionar-pais', pais); // Emitir o país selecionado para o componente pai
  };
  </script>
  
  <style>
  .pesquisa-input {
    position: relative;
    width: 300px;
    margin: 20px auto;
  }
  
  input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .sugestoes-lista {
    position: absolute;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    list-style-type: none;
    padding: 0;
    margin: 0;
    z-index: 1000;
  }
  
  .sugestoes-lista li {
    padding: 10px;
    cursor: pointer;
  }
  
  .sugestoes-lista li:hover {
    background-color: #f0f0f0;
  }
  </style>