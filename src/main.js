/**
 * Arquivo principal de inicialização do Vue
 * 
 * Este arquivo é o ponto de entrada da aplicação Vue.js.
 * Ele é responsável por:
 * - Importar o Vue e criar a aplicação
 * - Configurar o Vue Router para navegação entre páginas
 * - Importar estilos globais
 * - Montar a aplicação no elemento #app
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/main.less'

// Criação e montagem da aplicação
const app = createApp(App)
app.use(router)
app.mount('#app')
