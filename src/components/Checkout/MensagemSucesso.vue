<!--
  MensagemSucesso.vue
  
  Componente de feedback para confirmar a finalização bem-sucedida da compra.
  
  Funcionalidades:
  - Overlay semi-transparente que cobre toda a tela
  - Ícone de sucesso animado
  - Mensagem de confirmação
  - Botão para retornar à loja
  - Animação de entrada suave
  
  Props: Nenhuma
  
  Eventos Emitidos: Nenhum
  
  Navegação:
  - Botão "Voltar para a Loja" redireciona para a rota "/"
  
  Estilo:
  - Card centralizado com sombra
  - Ícone de check em círculo verde
  - Animação de fade-in ao aparecer
-->

<template>
  <div class="mensagem-sucesso">
    <div class="conteudo">
      <div class="icone">✓</div>
      <h2>Pedido Realizado com Sucesso!</h2>
      <p>Seu pedido foi processado e em breve você receberá um e-mail com os detalhes.</p>
      <button @click="$router.push('/')" class="botao-voltar">
        Voltar para a Loja
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../assets/styles/variaveis.less';

.mensagem-sucesso {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  .centralizar-flex();
  z-index: 1000;

  .conteudo {
    background: @cor-fundo;
    padding: @espacamento-duplo;
    border-radius: @raio-borda;
    .sombra-cartao();
    text-align: center;
    max-width: 400px;
    width: 90%;
    animation: fadeIn 0.3s ease-in-out;

    .icone {
      width: 60px;
      height: 60px;
      background: @cor-primaria;
      color: @cor-fundo;
      border-radius: 50%;
      .centralizar-flex();
      font-size: 2em;
      margin: 0 auto @espacamento-base;
    }

    h2 {
      color: @cor-primaria;
      margin-bottom: @espacamento-base;
      font-weight: 600;
    }

    p {
      color: @cor-secundaria;
      margin-bottom: @espacamento-duplo;
      line-height: 1.5;
    }

    .botao-voltar {
      background: @cor-primaria;
      color: @cor-fundo;
      border: none;
      padding: @espacamento-base @espacamento-duplo;
      border-radius: @raio-borda;
      font-size: 1.1em;
      cursor: pointer;
      .transicao-suave();

      &:hover {
        background: darken(@cor-primaria, 10%);
      }
    }
  }
}
</style> 