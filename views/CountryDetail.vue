<template>
  <div class="country-detail">
    <div v-if="carregando" class="carregando">
      Carregando...
    </div>
    <div v-else-if="country" class="detalhes-completos">
      <h1>{{ country.name.common }}</h1>
      <h2>{{ country.name.official }}</h2>
      <img :src="country.flags.png" :alt="country.name.common" class="bandeira" />
      
      <div class="info-grid">
        <div class="info-col">
          <p><strong>Capital:</strong> {{ country.capital?.[0] || 'N/A' }}</p>
          <p><strong>Continente:</strong> {{ country.region }}</p>
          <p><strong>Sub-região:</strong> {{ country.subregion || 'N/A' }}</p>
          <p><strong>População:</strong> {{ country.population.toLocaleString() }}</p>
        </div>
        
        <div class="info-col">
          <p><strong>Idiomas:</strong> {{ formatarIdiomas }}</p>
          <p><strong>Moeda:</strong> {{ formatarMoedas }}</p>
          <p><strong>Fuso Horário:</strong> {{ country.timezones?.[0] || 'N/A' }}</p>
          <p><strong>Código de Chamada:</strong> +{{ country.idd.root }}{{ country.idd.suffixes?.[0] }}</p>
        </div>
      </div>

      <button @click="$router.back()" class="botao-voltar">← Voltar para Pesquisa</button>
    </div>
    <div v-else class="nao-encontrado">
      País não encontrado
      <button @click="$router.push('/')" class="botao-voltar">← Voltar para Pesquisa</button>
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
  return Object.values(country.value.currencies).map(c => `${c.name} (${c.symbol || '?'})`).join(', ')
})

onMounted(async () => {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${route.params.name}?fullText=true`)
    const data = await response.json()
    country.value = data[0]
  } catch (error) {
    console.error('Erro ao carregar país:', error)
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
}

.detalhes-completos {
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

.carregando, .nao-encontrado {
  font-size: 1.2rem;
  margin: 3rem 0;
  color: #7f8c8d;
}
</style>