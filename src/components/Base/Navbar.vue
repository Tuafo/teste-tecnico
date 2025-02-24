<!--
  Navbar.vue
  
  Componente de navegação principal da aplicação.
  Responsabilidades:
  - Exibir o logo da aplicação
  - Prover navegação entre as diferentes seções
  - Menu lateral responsivo em mobile
  - Manter consistência visual em diferentes resoluções
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
    <nav class="navbar">
        <div class="navbar-container">
            <div class="logo">
                <img src="/images/logo_chico_rei.png" alt="Logo Chico Rei">
            </div>
            <div class="nav-content">
                <!-- Links para desktop -->
                <div class="nav-links" v-if="!ehMobile">
                    <router-link to="/layout-responsivo" class="nav-link">LAYOUT RESPONSIVO</router-link>
                    <router-link to="/roteamento" class="nav-link">ROTEAMENTO</router-link>
                    <router-link to="/menu-lateral" class="nav-link">MENU LATERAL</router-link>
                    <router-link to="/checkout" class="nav-link">CHECKOUT</router-link>
                </div>
                <!-- Botão hamburguer para mobile -->
                <button 
                    v-else
                    class="hamburger-button"
                    :class="{ 'active': menuAberto }"
                    @click="toggleMenu"
                    aria-label="Menu"
                >
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </button>
            </div>
        </div>

        <!-- Overlay para mobile -->
        <div 
            v-if="ehMobile"
            class="overlay"
            :class="{ 'active': menuAberto }"
            v-show="menuAberto"
            @click="toggleMenu"
        ></div>

        <!-- Menu lateral para mobile -->
        <nav 
            v-if="ehMobile"
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
    </nav>
</template>

<style lang="less">
@import '../../assets/styles/components/Base/navbar.less';
</style> 