import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../../views/HomeView.vue'
import CountryDetail from '../../views/CountryDetail.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/country/:name', // Rota dinâmica com nome do país
    name: 'country-detail',
    component: CountryDetail,
    props: true // Permite passar parâmetros como props
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router