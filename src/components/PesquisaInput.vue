<template>
  <div class="pesquisa-container">
    <div class="input-wrapper">
      <input
        type="text"
        v-model="termoPesquisa"
        placeholder="Buscar país..."
        @focus="mostrarSugestoes = true"
        @keydown.enter="selecionarPrimeiroPais"
        @blur="fecharSugestoesComDelay"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['iniciou-carregamento', 'terminou-carregamento', 'erro-carregamento'])
const termoPesquisa = ref('')
const mostrarSugestoes = ref(false)
const mostrarListaFixa = ref(true)
const todosPaises = ref([])
const cachePaises = ref({})

// Método corrigido para fechar sugestões
const fecharSugestoesComDelay = () => {
  setTimeout(() => { mostrarSugestoes.value = false }, 200)
}

// Botão dropdown corrigido
const toggleSugestoes = () => {
  mostrarSugestoes.value = !mostrarSugestoes.value
  if (mostrarSugestoes.value) {
    document.querySelector('.pesquisa-container input').focus()
  }
}

// Enter corrigido
const selecionarPrimeiroPais = () => {
  if (paisesFiltrados.value.length > 0) {
    selecionarPais(paisesFiltrados.value[0])
  } else if (termoPesquisa.value === '' && paisesOrdenados.value.length > 0) {
    selecionarPais(paisesOrdenados.value[0])
  }
}

// Seu método original de seleção (com cache)
const selecionarPais = async (pais) => {
  if (!pais?.name) return
  
  emit('iniciou-carregamento')
  termoPesquisa.value = pais.name.common
  mostrarSugestoes.value = false
  
  try {
    if (cachePaises.value[pais.name.common]) {
      await router.push({
        name: 'country-detail',
        params: { name: encodeURIComponent(pais.name.common) },
        state: { paisData: cachePaises.value[pais.name.common] }
      })
      return
    }

    const data = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(pais.name.common)}?fullText=true`
    ).then(res => res.json())
    
    cachePaises.value[pais.name.common] = data[0]
    
    await router.push({
      name: 'country-detail',
      params: { name: encodeURIComponent(pais.name.common) },
      state: { paisData: data[0] }
    })
  } catch (error) {
    emit('erro-carregamento', error.message || 'Erro ao carregar país')
  } finally {
    emit('terminou-carregamento')
  }
}

// Seu fetch original
onMounted(async () => {
  try {
    emit('iniciou-carregamento')
    const response = await fetch('https://restcountries.com/v3.1/all')
    todosPaises.value = await response.json()
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

// Seus computed properties originais
const paisesOrdenados = computed(() => todosPaises.value)
const paisesFiltrados = computed(() => {
  return paisesOrdenados.value.filter(pais =>
    pais.name.common.toLowerCase().includes(termoPesquisa.value.toLowerCase())
  )
})
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