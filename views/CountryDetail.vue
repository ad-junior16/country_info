<template>
  <div class="country-detail">
    <!-- Tela de carregamento -->
    <div v-if="carregando" class="carregando-container">
      <div class="spinner"></div>
      <p>Carregando informações...</p>
    </div>

    <!-- Tentativa automática -->
    <div v-else-if="erro && tentativas < 2" class="tentativa-automatica">
      <p>Tentando reconectar... ({{ tentativas + 1 }}/2)</p>
      <div class="spinner small"></div>
    </div>

    <!-- Erro persistente -->
    <div v-else-if="erro" class="erro-container">
      <p class="erro-mensagem">❌ Não foi possível carregar os dados</p>
      <div class="botoes-erro">
        <button @click="recarregar" class="botao-recarregar">
          ↻ Tentar Novamente
        </button>
        <button @click="$router.back()" class="botao-voltar">
          ← Voltar
        </button>
      </div>
    </div>

    <!-- Dados do país -->
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
          <p><strong>Código:</strong> {{ country.cca2 }}</p>
        </div>
      </div>

      <button @click="$router.back()" class="botao-voltar">← Voltar</button>
    </div>

    <!-- País não encontrado -->
    <div v-else class="nao-encontrado">
      <p>País não encontrado na base de dados</p>
      <button @click="$router.back()" class="botao-voltar">← Voltar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const country = ref(null)
const carregando = ref(true)
const erro = ref(false)
const tentativas = ref(0)

const formatarIdiomas = computed(() => {
  return country.value?.languages ? Object.values(country.value.languages).join(', ') : 'N/A'
})

const formatarMoedas = computed(() => {
  if (!country.value?.currencies) return 'N/A'
  return Object.values(country.value.currencies)
    .map(c => `${c.name} (${c.symbol || '?'})`)
    .join(', ')
})

const formatarArray = (valor) => {
  return Array.isArray(valor) ? valor.join(', ') : 'N/A'
}

const fetchCountryData = async () => {
  try {
    erro.value = false
    carregando.value = true
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(
      `https://restcountries.com/v3.1/name/${route.params.name}?fullText=true`,
      { signal: controller.signal }
    )
    
    clearTimeout(timeoutId)

    if (!response.ok) throw new Error('Erro na API')
    
    const data = await response.json()
    if (data.status === 404) throw new Error('País não encontrado')
    
    country.value = data[0]
  } catch (error) {
    erro.value = true
    tentativas.value++
    
    // Tentativa automática
    if (tentativas.value < 2) {
      setTimeout(fetchCountryData, 3000)
    }
  } finally {
    carregando.value = false
  }
}

const recarregar = () => {
  tentativas.value = 0
  fetchCountryData()
}

onMounted(() => {
  fetchCountryData()
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

/* Estilos para tratamento de erro */
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

.spinner.small {
  width: 30px;
  height: 30px;
  border-width: 3px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.erro-container {
  margin: 2rem 0;
  text-align: center;
}

.erro-mensagem {
  color: #e74c3c;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.botoes-erro {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.botao-recarregar {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.botao-recarregar:hover {
  background: #2980b9;
}

.tentativa-automatica {
  color: #f39c12;
  margin-top: 2rem;
}

.nao-encontrado {
  color: #7f8c8d;
  margin: 2rem 0;
}
</style>