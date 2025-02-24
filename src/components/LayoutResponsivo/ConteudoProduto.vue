<!--
  ConteudoProduto.vue
  
  Este componente é responsável por exibir as informações textuais do produto:
  título, descrição e preço. Ele é um componente filho do CardProduto.
  
  Props:
  - titulo: String (obrigatório)
    Título/nome do produto
  - descricao: String (obrigatório)
    Descrição detalhada do produto
  - preco: String (obrigatório)
    Preço do produto já formatado em reais
  
  Características:
  - Limita o número de linhas do título e descrição
  - Adapta o tamanho do texto para diferentes telas
  - Mantém o preço sempre visível na parte inferior
-->

<script setup>
// Define as propriedades que o componente recebe
const props = defineProps({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    preco: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="conteudo-produto">
        <h3 id="produto-titulo">{{ titulo }}</h3>
        <p id="produto-descricao">{{ descricao }}</p>
        <strong class="preco" 
                role="text" 
                aria-labelledby="produto-titulo"
                aria-label="Preço">{{ preco }}</strong>
    </div>
</template>

<style lang="less">
@import '../../assets/styles/components/LayoutResponsivo/conteudo-produto.less';
</style> 