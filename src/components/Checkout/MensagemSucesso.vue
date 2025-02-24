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

<style lang="less">
@import '../../assets/styles/components/Checkout/mensagem-sucesso.less';
</style> 