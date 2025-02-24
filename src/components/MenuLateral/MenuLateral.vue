<!--
  MenuLateral.vue
  
  Componente que demonstra um menu lateral animado.
  Funcionalidades:
  - Barra superior com ícone de menu
  - Menu que desliza para baixo
  - Barra que contrai quando o menu abre
  - Animação com @keyframes
-->

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const menuAberto = ref(false)
const ehMobile = ref(false)

const toggleMenu = () => {
    menuAberto.value = !menuAberto.value
}

const verificarMobile = () => {
    ehMobile.value = window.innerWidth <= 1024
}

onMounted(() => {
    verificarMobile()
    window.addEventListener('resize', verificarMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', verificarMobile)
})
</script>

<template>
    <div class="menu-lateral-page">
        <header class="menu-header">
            <!-- Barra superior com botão hamburguer -->
            <div class="barra-topo" :class="{ 'active': menuAberto }">
                <button 
                    class="hamburger-button"
                    :class="{ 'active': menuAberto }"
                    @click="toggleMenu"
                    aria-label="Menu"
                >
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </button>
                <h1 v-show="menuAberto">Menu Lateral</h1>
            </div>

            <!-- Menu -->
            <nav 
                class="menu-sidebar"
                :class="{ 'active': menuAberto }"
                role="navigation"
            >
                <ul>
                    <li><router-link to="/layout-responsivo" @click="toggleMenu">LAYOUT RESPONSIVO</router-link></li>
                    <li><router-link to="/roteamento" @click="toggleMenu">ROTEAMENTO</router-link></li>
                    <li><router-link to="/menu-lateral" @click="toggleMenu">MENU LATERAL</router-link></li>
                    <li><router-link to="/checkout" @click="toggleMenu">CHECKOUT</router-link></li>
                </ul>
            </nav>
        </header>

        <main>
            <p>Esta página demonstra a implementação de um menu lateral com animação.</p>
            <p>Clique no ícone de menu acima para ver a animação.</p>
        </main>
    </div>
</template>

<style lang="less">
@import '../../assets/styles/components/MenuLateral/menu-lateral.less';
</style> 