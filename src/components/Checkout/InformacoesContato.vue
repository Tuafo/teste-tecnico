<!--
  InformacoesContato.vue
  
  Componente de formulário para coleta de informações de contato do cliente.
  
  Funcionalidades:
  - Validação de e-mail
  - Formatação automática de telefone
  - Feedback visual de erros
  - Limpeza automática de erros ao corrigir campos
  
  Props:
  - formulario: Object (required)
    Objeto contendo email e telefone do cliente
  - erros: Object (default: {})
    Objeto contendo mensagens de erro para cada campo
    
  Eventos Emitidos:
  - update:formulario: Atualiza os dados do formulário no componente pai
  - update:erros: Atualiza as mensagens de erro no componente pai
  
  Validações:
  - E-mail: Formato válido de e-mail
  - Telefone: Formato (00) 0 0000-0000
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

const emit = defineEmits(['update:formulario', 'update:erros'])

const formatarTelefone = (valor) => {
  // Remove tudo que não for número
  let telefone = valor.replace(/\D/g, '')
  
  // Limita a 11 dígitos
  telefone = telefone.substring(0, 11)
  
  // Aplica a máscara conforme o usuário digita
  if (telefone.length > 0) {
    telefone = '(' + telefone
  }
  if (telefone.length > 2) {
    telefone = telefone.substring(0, 3) + ') ' + telefone.substring(3)
  }
  if (telefone.length > 3) {
    telefone = telefone.substring(0, 6) + ' ' + telefone.substring(6)
  }
  if (telefone.length > 7) {
    telefone = telefone.substring(0, 11) + '-' + telefone.substring(11)
  }
  
  // Aplica a formatação final com o traço
  if (telefone.length > 6) {
    const parte1 = telefone.substring(0, 6) // (XX) X
    const parte2 = telefone.substring(6).replace(/[- ]/g, '') // Remove qualquer traço ou espaço existente
    if (parte2.length > 4) {
      telefone = parte1 + ' ' + parte2.substring(0, 4) + '-' + parte2.substring(4)
    } else {
      telefone = parte1 + ' ' + parte2
    }
  }
  
  // Emite o evento para atualizar o formulário
  emit('update:formulario', {
    ...props.formulario,
    telefone
  })

  // Limpa o erro específico do campo quando ele é atualizado
  if (props.erros.telefone) {
    emit('update:erros', {
      ...props.erros,
      telefone: ''
    })
  }
}

const atualizarEmail = (valor) => {
  // Emite o evento para atualizar o formulário
  emit('update:formulario', {
    ...props.formulario,
    email: valor
  })

  // Limpa o erro específico do campo quando ele é atualizado
  if (props.erros.email) {
    emit('update:erros', {
      ...props.erros,
      email: ''
    })
  }
}
</script>

<template>
  <section class="informacoes-contato">
    <h2>Informações de Contato</h2>
    
    <div class="campo-grupo">
      <div class="campo">
        <label for="email">E-mail <span class="obrigatorio">*</span></label>
        <input
          type="text"
          id="email"
          :value="formulario.email"
          @input="atualizarEmail($event.target.value)"
          :class="{ erro: erros.email }"
          placeholder="seu@email.com"
        />
        <span class="erro-mensagem" v-if="erros.email">{{ erros.email }}</span>
      </div>

      <div class="campo">
        <label for="telefone">Telefone <span class="obrigatorio">*</span></label>
        <input
          type="text"
          id="telefone"
          :value="formulario.telefone"
          @input="formatarTelefone($event.target.value)"
          :class="{ erro: erros.telefone }"
          placeholder="(00) 0 0000-0000"
          maxlength="17"
        />
        <span class="erro-mensagem" v-if="erros.telefone">{{ erros.telefone }}</span>
      </div>
    </div>
  </section>
</template>

<style lang="less">
@import '../../assets/styles/components/Checkout/informacoes-contato.less';
</style> 