<template>
  <div class="pesquisa-container">
    <div class="input-wrapper">
      <input
        type="text"
        v-model="termoPesquisa"
        placeholder="Buscar país..."
        @focus="mostrarLista = true"
      />
      <button @click="toggleDropdown" class="dropdown-button">
        {{ mostrarLista ? '▲' : '▼' }}
      </button>
    </div>

    <ul v-if="mostrarLista" class="sugestoes-lista">
      <li
        v-for="pais in paisesFiltrados"
        :key="pais.name.common"
        @click="selecionarPais(pais)"
      >
        {{ pais.name.common }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['selecionar-pais'])
const termoPesquisa = ref('')
const mostrarLista = ref(false)
const todosPaises = ref([])

// Carrega TODOS os países ordenados
onMounted(async () => {
  const response = await fetch('https://restcountries.com/v3.1/all')
  todosPaises.value = (await response.json()).sort((a, b) => 
    a.name.common.localeCompare(b.name.common)
  )
})

const toggleDropdown = () => {
  mostrarLista.value = !mostrarLista.value
}

// Mostra lista COMPLETA quando dropdown é aberto
const paisesFiltrados = computed(() => {
  if (!termoPesquisa.value) return todosPaises.value
  return todosPaises.value.filter(pais =>
    pais.name.common.toLowerCase().includes(termoPesquisa.value.toLowerCase())
  )
})

const selecionarPais = (pais) => {
  termoPesquisa.value = pais.name.common
  mostrarLista.value = false
  emit('selecionar-pais', pais)
}
</script>

<style scoped>
/* SEUS ESTILOS ATUAIS (mantidos exatamente como estão) */
.pesquisa-container {
  position: relative;
  width: 300px;
  margin: 0 auto;
}

.input-wrapper {
  position: relative;
  display: flex;
}

input {
  width: 100%;
  padding: 10px 35px 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.dropdown-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.sugestoes-lista {
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 5px;
  padding: 0;
  list-style: none;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.sugestoes-lista li {
  padding: 10px 15px;
  cursor: pointer;
}

.sugestoes-lista li:hover {
  background-color: #f5f5f5;
}
</style>