<template>
  <!-- SEU TEMPLATE ORIGINAL (sem alterações) -->
  <div class="pesquisa-container">
    <div class="input-wrapper">
      <input
        type="text"
        v-model="termoPesquisa"
        placeholder="Buscar país..."
        @focus="mostrarSugestoes = true"
        @keydown.enter="selecionarPrimeiroPais"
        @blur="setTimeout(() => { mostrarSugestoes = false }, 200)"
      />
      <button @click="toggleSugestoes" class="dropdown-button">
        {{ mostrarSugestoes ? '▲' : '▼' }}
      </button>
    </div>

    <ul 
      v-if="mostrarSugestoes && termoPesquisa" 
      class="sugestoes-lista"
    >
      <li
        v-for="pais in paisesFiltrados"
        :key="pais.name.common"
        @mousedown.prevent="selecionarPais(pais)"
      >
        {{ pais.name.common }}
      </li>
    </ul>

    <ul 
      v-show="mostrarListaFixa" 
      class="sugestoes-lista lista-fixa"
    >
      <li
        v-for="pais in paisesOrdenados"
        :key="pais.name.common"
        @mousedown.prevent="selecionarPais(pais)"
      >
        {{ pais.name.common }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['iniciou-carregamento', 'terminou-carregamento', 'erro-carregamento'])

// Seus estados originais
const termoPesquisa = ref('')
const mostrarSugestoes = ref(false)
const mostrarListaFixa = ref(true)
const todosPaises = ref([])
const cachePaises = ref({}) // Cache de detalhes

// Fetch com cache (sem alterar sua lógica original)
onMounted(async () => {
  try {
    emit('iniciou-carregamento')
    const cache = localStorage.getItem('cachePaises')
    
    if (cache) {
      todosPaises.value = JSON.parse(cache)
    } else {
      const response = await fetch('https://restcountries.com/v3.1/all')
      todosPaises.value = await response.json()
      localStorage.setItem('cachePaises', JSON.stringify(todosPaises.value))
    }

    // Seu sort/filter original
    todosPaises.value = todosPaises.value
      .filter(pais => pais.name)
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
  } catch (error) {
    console.error("Erro ao carregar países:", error)
    emit('erro-carregamento', 'Não foi possível carregar a lista de países')
  } finally {
    emit('terminou-carregamento')
  }
})

// Prefetch ao digitar (melhoria invisível)
watch(termoPesquisa, async (termo) => {
  if (termo.length > 2 && paisesFiltrados.value.length > 0) {
    const pais = paisesFiltrados.value[0]
    if (!cachePaises.value[pais.name.common]) {
      const res = await fetch(`https://restcountries.com/v3.1/name/${pais.name.common}?fullText=true`)
      cachePaises.value[pais.name.common] = await res.json()
    }
  }
})

// Seus computed properties originais
const paisesOrdenados = computed(() => todosPaises.value)
const paisesFiltrados = computed(() => {
  return paisesOrdenados.value.filter(pais =>
    pais.name.common.toLowerCase().includes(termoPesquisa.value.toLowerCase())
  )
})

// Método original com cache via router.state
const selecionarPais = (pais) => {
  if (!pais?.name) return
  
  emit('iniciou-carregamento')
  termoPesquisa.value = pais.name.common
  mostrarSugestoes.value = false

  // Usa cache se disponível
  if (cachePaises.value[pais.name.common]) {
    router.push({
      name: 'country-detail',
      params: { name: encodeURIComponent(pais.name.common) },
      state: { paisData: cachePaises.value[pais.name.common][0] } // Dados via state
    })
  } else {
    router.push({
      name: 'country-detail',
      params: { name: encodeURIComponent(pais.name.common) }
    })
  }
  emit('terminou-carregamento')
}

// Seus outros métodos originais (toggleSugestoes, selecionarPrimeiroPais...)
</script>

<style scoped>
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

.lista-fixa {
  position: relative;
  margin-top: 350px;
  z-index: 1;
  border-top: 1px solid #eee;
  padding-top: 15px;
}
</style>