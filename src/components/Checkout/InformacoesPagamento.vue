<!--
  InformacoesPagamento.vue
  
  Componente de formulário para coleta de informações de pagamento.
  
  Funcionalidades:
  - Validação de cartão de crédito (Algoritmo de Luhn)
  - Formatação automática do número do cartão
  - Formatação automática da data de vencimento
  - Formatação do CVC
  - Feedback visual de erros
  - Limpeza automática de erros ao corrigir campos
  
  Props:
  - formulario: Object (required)
    Objeto contendo dados do cartão (numeroCartao, nomeCartao, dataVencimento, cvc)
  - erros: Object (default: {})
    Objeto contendo mensagens de erro para cada campo
    
  Eventos Emitidos:
  - update:formulario: Atualiza os dados do formulário no componente pai
  - update:erros: Atualiza as mensagens de erro no componente pai
  
  Validações:
  - Número do Cartão: Validação pelo algoritmo de Luhn
  - Data de Vencimento: Formato MM/AA e data futura
  - CVC: 3 ou 4 dígitos
  - Nome: Apenas letras maiúsculas
-->

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  formulario: {
    type: Object,
    required: true
  },
  erros: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:formulario'])

const formatarNumeroCartao = (valor) => {
  // Remove tudo que não for número
  let numero = valor.replace(/\D/g, '')
  
  // Aplica a máscara XXXX XXXX XXXX XXXX
  numero = numero.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  
  atualizarCampo('numeroCartao', numero)
}

const formatarDataVencimento = (valor) => {
  // Remove tudo que não for número
  let data = valor.replace(/\D/g, '')
  
  // Aplica a máscara MM/AA
  if (data.length >= 2) {
    data = data.substring(0, 2) + '/' + data.substring(2, 4)
  }
  
  atualizarCampo('dataVencimento', data)
}

const formatarCVC = (valor) => {
  // Remove tudo que não for número e limita a 4 dígitos
  let cvc = valor.replace(/\D/g, '').substring(0, 4)
  
  atualizarCampo('cvc', cvc)
}

const atualizarCampo = (campo, valor) => {
  // Emite o evento para atualizar o formulário
  emit('update:formulario', {
    ...props.formulario,
    [campo]: valor
  })

  // Limpa o erro específico do campo quando ele é atualizado
  if (props.erros[campo]) {
    emit('update:erros', {
      ...props.erros,
      [campo]: ''
    })
  }
}

// Algoritmo de Luhn para validação do número do cartão
const validarCartao = (numero) => {
  const digitos = numero.replace(/\D/g, '')
  if (digitos.length < 13 || digitos.length > 19) return false
  
  let soma = 0
  let dobro = false
  
  // Iteração da direita para a esquerda
  for (let i = digitos.length - 1; i >= 0; i--) {
    let digito = parseInt(digitos.charAt(i))
    
    if (dobro) {
      digito *= 2
      if (digito > 9) digito -= 9
    }
    
    soma += digito
    dobro = !dobro
  }
  
  return (soma % 10) === 0
}
</script>

<template>
  <section class="informacoes-pagamento">
    <h2>Informações de Pagamento</h2>
    
    <div class="campo">
      <label for="numeroCartao">Número do Cartão <span class="obrigatorio">*</span></label>
      <input
        type="text"
        id="numeroCartao"
        :value="formulario.numeroCartao"
        @input="formatarNumeroCartao($event.target.value)"
        :class="{ erro: erros.numeroCartao }"
        placeholder="0000 0000 0000 0000"
        maxlength="19"
      />
      <span class="erro-mensagem" v-if="erros.numeroCartao">{{ erros.numeroCartao }}</span>
    </div>

    <div class="campo">
      <label for="nomeCartao">Nome no Cartão <span class="obrigatorio">*</span></label>
      <input
        type="text"
        id="nomeCartao"
        :value="formulario.nomeCartao"
        @input="atualizarCampo('nomeCartao', $event.target.value.toUpperCase())"
        :class="{ erro: erros.nomeCartao }"
        placeholder="NOME COMO ESTÁ NO CARTÃO"
      />
      <span class="erro-mensagem" v-if="erros.nomeCartao">{{ erros.nomeCartao }}</span>
    </div>

    <div class="campo-grupo">
      <div class="campo">
        <label for="dataVencimento">Data de Vencimento <span class="obrigatorio">*</span></label>
        <input
          type="text"
          id="dataVencimento"
          :value="formulario.dataVencimento"
          @input="formatarDataVencimento($event.target.value)"
          :class="{ erro: erros.dataVencimento }"
          placeholder="MM/AA"
          maxlength="5"
        />
        <span class="erro-mensagem" v-if="erros.dataVencimento">{{ erros.dataVencimento }}</span>
      </div>

      <div class="campo">
        <label for="cvc">CVC <span class="obrigatorio">*</span></label>
        <input
          type="text"
          id="cvc"
          :value="formulario.cvc"
          @input="formatarCVC($event.target.value)"
          :class="{ erro: erros.cvc }"
          placeholder="000"
          maxlength="4"
        />
        <span class="erro-mensagem" v-if="erros.cvc">{{ erros.cvc }}</span>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
@import '../../assets/styles/variaveis.less';

.informacoes-pagamento {
  h2 {
    color: @cor-primaria;
    margin-bottom: @espacamento-base;
    font-size: 1.5em;
    font-weight: 600;
  }

  .campo-grupo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: @espacamento-base;

    @media (max-width: @mobile) {
      grid-template-columns: 1fr;
    }
  }

  .campo {
    margin-bottom: @espacamento-base;

    label {
      display: block;
      margin-bottom: @espacamento-metade;
      color: @cor-primaria;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: @espacamento-base;
      border: 1px solid @cor-secundaria;
      border-radius: @raio-borda;
      font-size: 1em;
      .transicao-suave();

      &:focus {
        outline: none;
        border-color: @cor-primaria;
      }

      &.erro {
        border-color: @cor-erro;
      }
    }

    .erro-mensagem {
      color: @cor-erro;
      font-size: 0.9em;
      margin-top: @espacamento-metade;
    }

    .obrigatorio {
      color: @cor-erro;
      margin-left: 2px;
    }
  }
}
</style> 