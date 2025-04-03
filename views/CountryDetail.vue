<template>
  <div class="country-detail">
    <!-- Feedback de carregamento -->
    <div v-if="carregando" class="carregando-container">
      <div class="spinner"></div>
      <p>Carregando informações...</p>
    </div>

    <div v-else-if="country">
      <h1>{{ country.name.common }}</h1>
      <h2>{{ country.name.official }}</h2>
      <img :src="country.flags.png" :alt="country.name.common" class="bandeira" />
      
      <div class="info-grid">
        <div class="info-col">
          <p><strong>Capital:</strong> {{ formatarArray(country.capital) }}</p>
          <p><strong>Continente:</strong> {{ country.region }}</p>
          <p><strong>População:</strong> {{ country.population.toLocaleString() }}</p>
          <p><strong>Área:</strong> {{ country.area.toLocaleString() }} km²</p>
        </div>
        
        <div class="info-col">
          <p><strong>Idiomas:</strong> {{ formatarIdiomas }}</p>
          <p><strong>Moeda:</strong> {{ formatarMoedas }}</p>
          <p><strong>Fuso Horário:</strong> {{ formatarArray(country.timezones) }}</p>
        </div>
      </div>

      <button @click="$router.back()" class="botao-voltar">← Voltar</button>
    </div>

    <div v-else class="nao-encontrado">
      <p>País não encontrado</p>
      <button @click="$router.push('/')" class="botao-voltar">← Voltar à pesquisa</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const country = ref(null)
const carregando = ref(true)

const formatarIdiomas = computed(() => {
  return country.value.languages ? Object.values(country.value.languages).join(', ') : 'N/A'
})

const formatarMoedas = computed(() => {
  if (!country.value.currencies) return 'N/A'
  return Object.values(country.value.currencies)
    .map(c => `${c.name} (${c.symbol || '?'})`)
    .join(', ')
})

const formatarArray = (valor) => {
  return Array.isArray(valor) ? valor.join(', ') : 'N/A'
}

onMounted(async () => {
  try {
    const nomePais = route.params.name
    const response = await fetch(`https://restcountries.com/v3.1/name/${nomePais}?fullText=true`)
    
    if (!response.ok) throw new Error()
    
    const data = await response.json()
    country.value = data[0]
  } catch (error) {
    country.value = null
  } finally {
    carregando.value = false
  }
})
</script>

<style scoped>
.country-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

h2 {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-weight: normal;
}

.bandeira {
  width: 200px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  text-align: left;
  margin: 2rem auto;
  max-width: 600px;
}

.info-col p {
  margin: 0.8rem 0;
  font-size: 1.1rem;
  line-height: 1.6;
}

.botao-voltar {
  display: inline-block;
  margin-top: 2rem;
  padding: 12px 25px;
  font-size: 1.1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.botao-voltar:hover {
  background: #369f6e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Estilos do loading */
.carregando-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.carregando-container p {
  color: #42b983;
  font-size: 1.2rem;
}

.nao-encontrado {
  font-size: 1.2rem;
  margin: 3rem 0;
  color: #7f8c8d;
}
</style>