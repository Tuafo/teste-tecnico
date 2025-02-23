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

<style lang="less" scoped>
@import '../../assets/styles/variaveis.less';

// Animações
@keyframes slideDown {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(-20px);
        opacity: 0;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: @altura-navbar;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1002;

    .navbar-container {
        max-width: @largura-maxima;
        margin: 0 auto;
        padding: 0 @espacamento-base;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .logo {
            height: 40px;
            display: flex;
            align-items: center;

            img {
                height: 100%;
                width: auto;
                object-fit: contain;
            }
        }

        .nav-content {
            display: flex;
            align-items: center;
            gap: @espacamento-duplo;

            .nav-links {
                display: flex;
                gap: @espacamento-duplo;

                .nav-link {
                    color: @cor-link;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 1em;
                    padding: @espacamento-base * 0.3 @espacamento-base;
                    border-radius: @raio-borda;
                    transition: background-color 0.2s ease, color 0.2s ease;
                    outline: none;
                    display: inline-block;
                    text-align: center;

                    &:hover {
                        color: @cor-link-hover;
                        background: rgba(0, 0, 0, 0.05);
                    }

                    &:focus-visible {
                        box-shadow: 0 0 0 2px rgba(255, 153, 53, 0.3);
                    }

                    &.router-link-active {
                        color: #4D4C4B;
                        background: rgba(255, 153, 53, 0.2);
                    }
                }
            }
        }
    }
}

// Botão hamburguer
.hamburger-button {
    width: 40px;
    height: 40px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    outline: none;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: @raio-borda;
    }

    &:focus-visible {
        box-shadow: 0 0 0 2px rgba(255, 153, 53, 0.3);
        border-radius: @raio-borda;
    }

    .hamburger-line {
        width: 100%;
        height: 2px;
        background-color: @cor-primaria;
        border-radius: @raio-borda;
        transition: all 0.3s ease;
        transform-origin: left;
    }

    &.active {
        .hamburger-line {
            &:first-child {
                transform: rotate(45deg);
                width: 110%;
            }
            &:nth-child(2) {
                opacity: 0;
                transform: translateX(-100%);
            }
            &:last-child {
                transform: rotate(-45deg);
                width: 110%;
            }
        }
    }
}

// Overlay
.overlay {
    position: fixed;
    top: @altura-navbar;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    visibility: hidden;

    &.active {
        visibility: visible;
        animation: fadeIn 0.3s ease forwards;
    }

    &:not(.active) {
        animation: fadeOut 0.3s ease forwards;
    }
}

// Menu lateral
.menu-sidebar {
    position: fixed;
    top: @altura-navbar;
    left: 0;
    right: 0;
    height: calc(100vh - @altura-navbar);
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 1001;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: @espacamento-duplo;
    display: flex;
    flex-direction: column;
    align-items: center;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-20px);

    &.active {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
        animation: slideDown 0.3s ease forwards;
    }

    &:not(.active) {
        animation: slideUp 0.3s ease forwards;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;
        max-width: 400px;

        li {
            margin-bottom: @espacamento-base;
            text-align: center;

            a {
                color: @cor-link;
                text-decoration: none;
                font-weight: 500;
                font-size: 1.2em;
                padding: @espacamento-base;
                display: block;
                border-radius: @raio-borda;
                transition: background-color 0.2s ease, color 0.2s ease;

                &:hover {
                    color: @cor-link-hover;
                    background: rgba(0, 0, 0, 0.05);
                }

                &:focus-visible {
                    box-shadow: 0 0 0 2px rgba(255, 153, 53, 0.3);
                }

                &.router-link-active {
                    color: #4D4C4B;
                    background: rgba(255, 153, 53, 0.2);
                }
            }
        }
    }
}

@media (max-width: @tablet) {
    .navbar {
        height: @altura-navbar-mobile;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    .menu-sidebar {
        top: @altura-navbar-mobile;
        height: calc(100vh - @altura-navbar-mobile);
        padding: @espacamento-duplo @espacamento-base;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);

        ul li a {
            font-size: 1.1em;
            padding: @espacamento-base * 0.75;
        }
    }

    .hamburger-button {
        width: 36px;
        height: 36px;
        padding: 6px;
    }

    .overlay {
        top: @altura-navbar-mobile;
    }
}
</style> 