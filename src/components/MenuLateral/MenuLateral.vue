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

<style lang="less" scoped>
@import '../../assets/styles/variaveis.less';

// Animações
@keyframes slideRight {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideLeft {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(-100%);
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

// Página
.menu-lateral-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: @largura-maxima;
    margin: 0 auto;
    width: 100%;
    padding: @espacamento-duplo @espacamento-base;
}

// Header e menu
.menu-header {
    position: relative;
    z-index: 1001;
    width: 100%;
    padding: 0 @espacamento-base;
}

// Barra superior
.barra-topo {
    background: @cor-navbar;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    gap: @espacamento-duplo;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: @altura-navbar;
    border-radius: @raio-borda;
    width: 100%;
    transition: width 0.3s ease, border-radius 0.3s ease;
    padding: @espacamento-base * 0.5 @espacamento-base;

    &.active {
        width: 280px;
        border-radius: @raio-borda @raio-borda 0 0;
    }

    h1 {
        font-size: 1.2em;
        color: @cor-primaria;
        margin: 0;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: all 0.3s ease;
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

// Menu
.menu-sidebar {
    position: absolute;
    top: 100%;
    left: @espacamento-base;
    width: 280px;
    background: @cor-navbar;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: @espacamento-base;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-20px);
    z-index: 999;
    border-radius: 0 0 @raio-borda @raio-borda;
    height: calc(100vh - (@altura-navbar + @espacamento-base));
    margin-top: 0;

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

        li {
            margin-bottom: @espacamento-base;
            text-align: left;

            &:last-child {
                margin-bottom: 0;
            }

            a {
                color: @cor-link;
                text-decoration: none;
                font-weight: 500;
                font-size: 1.1em;
                padding: @espacamento-base * 0.75 @espacamento-base;
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

// Conteúdo principal
main {
    flex: 1;
    padding: @espacamento-duplo;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 1;

    p {
        color: @cor-secundaria;
        line-height: 1.6;
        margin-bottom: @espacamento-base;
    }
}

// Responsividade
@media (max-width: @mobile) {
    .menu-header {
        padding: 0 @espacamento-base * 0.75;
    }

    .barra-topo {
        height: @altura-navbar-mobile;
        padding: @espacamento-base * 0.35 @espacamento-base * 0.75;

        &.active {
            width: 240px;
        }

        h1 {
            font-size: 1.2em;
        }
    }

    .menu-sidebar {
        left: @espacamento-base * 0.75;
        width: 240px;
        padding: @espacamento-base * 0.75;
    }

    .hamburger-button {
        width: 36px;
        height: 36px;
        padding: 6px;
    }

    .menu-sidebar {
        ul li a {
            font-size: 1em;
            padding: @espacamento-base * 0.5 @espacamento-base;
        }
    }
}
</style> 