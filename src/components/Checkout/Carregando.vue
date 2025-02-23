<!--
  Carregando.vue
  
  Componente de feedback visual para indicar operações em andamento.
  
  Funcionalidades:
  - Overlay semi-transparente que cobre toda a tela
  - Spinner animado centralizado
  - Mensagem de "Carregando..."
  - z-index elevado para sobrepor outros elementos
  
  Props: Nenhuma
  
  Eventos Emitidos: Nenhum
  
  Estilo:
  - Fundo branco semi-transparente (95% opacidade)
  - Spinner com animação de rotação contínua
  - Cores consistentes com o tema da aplicação
-->

<template>
  <div class="carregando">
    <div class="spinner"></div>
    <p>Carregando...</p>
  </div>
</template>

<style lang="less" scoped>
@import '../../assets/styles/variaveis.less';

.carregando {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  .centralizar-flex();
  flex-direction: column;
  z-index: 1000;

  p {
    margin-top: @espacamento-base;
    color: @cor-primaria;
    font-weight: 500;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid @cor-secundaria;
    border-radius: 50%;
    border-top-color: @cor-primaria;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 