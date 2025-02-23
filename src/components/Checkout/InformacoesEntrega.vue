<!--
  InformacoesEntrega.vue
  
  Componente de formulário para coleta de informações de endereço de entrega.
  
  Funcionalidades:
  - Consulta automática de CEP
  - Preenchimento automático de endereço
  - Validação de campos de endereço
  - Formatação automática de CEP
  - Feedback visual de erros
  - Limpeza automática de erros ao corrigir campos
  
  Props:
  - formulario: Object (required)
    Objeto contendo dados do endereço (cep, endereco, numero, complemento, bairro, cidade, estado)
  - erros: Object (default: {})
    Objeto contendo mensagens de erro para cada campo
    
  Eventos Emitidos:
  - update:formulario: Atualiza os dados do formulário no componente pai
  - update:erros: Atualiza as mensagens de erro no componente pai
  - consultar-cep: Solicita consulta de CEP ao componente pai
  
  Validações:
  - CEP: Formato 00000-000
  - Estado: Sigla válida de estado brasileiro
  - Campos obrigatórios: CEP, endereço, número, bairro, cidade, estado
-->

<script setup>
import { defineProps, defineEmits, watch } from 'vue'

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

const emit = defineEmits(['update:formulario', 'consultar-cep', 'update:erros'])

const formatarCEP = (valor) => {
  // Remove tudo que não for número
  let cep = valor.replace(/\D/g, '')
  
  // Aplica a máscara XXXXX-XXX
  cep = cep.replace(/^(\d{5})(\d{3}).*/, '$1-$2')
  
  atualizarCampo('cep', cep)

  // Se o CEP estiver completo, consulta a API
  if (cep.replace(/\D/g, '').length === 8) {
    emit('consultar-cep', cep)
  }
}

const atualizarCampo = (campo, valor) => {
  // Emite o evento para atualizar o formulário
  emit('update:formulario', {
    ...props.formulario,
    [campo]: campo === 'estado' ? valor.toUpperCase() : valor
  })

  // Limpa o erro específico do campo quando ele é atualizado
  if (props.erros[campo]) {
    emit('update:erros', {
      ...props.erros,
      [campo]: ''
    })
  }
}

// Observa mudanças no formulário para limpar erros quando campos são preenchidos automaticamente
const limparErrosAoPreencherCampos = () => {
  const camposParaVerificar = ['endereco', 'bairro', 'cidade', 'estado']
  const errosAtualizados = { ...props.erros }
  let temMudanca = false

  camposParaVerificar.forEach(campo => {
    if (props.formulario[campo] && props.erros[campo]) {
      errosAtualizados[campo] = ''
      temMudanca = true
    }
  })

  if (temMudanca) {
    emit('update:erros', errosAtualizados)
  }
}

// Observa mudanças no formulário
watch(() => props.formulario, limparErrosAoPreencherCampos, { deep: true })
</script>

<template>
  <section class="informacoes-entrega">
    <h2>Informações de Entrega</h2>
    
    <div class="campo-grupo">
      <div class="campo campo-cep">
        <label for="cep">CEP <span class="obrigatorio">*</span></label>
        <input
          type="text"
          id="cep"
          :value="formulario.cep"
          @input="formatarCEP($event.target.value)"
          :class="{ erro: erros.cep }"
          placeholder="00000-000"
          maxlength="9"
        />
        <span class="erro-mensagem" v-if="erros.cep">{{ erros.cep }}</span>
      </div>
    </div>

    <div class="campo">
      <label for="endereco">Endereço <span class="obrigatorio">*</span></label>
      <input
        type="text"
        id="endereco"
        :value="formulario.endereco"
        @input="atualizarCampo('endereco', $event.target.value)"
        :class="{ erro: erros.endereco }"
        placeholder="Rua, Avenida, etc"
      />
      <span class="erro-mensagem" v-if="erros.endereco">{{ erros.endereco }}</span>
    </div>

    <div class="campo-grupo">
      <div class="campo">
        <label for="numero">Número <span class="obrigatorio">*</span></label>
        <input
          type="text"
          id="numero"
          :value="formulario.numero"
          @input="atualizarCampo('numero', $event.target.value)"
          :class="{ erro: erros.numero }"
          placeholder="Número"
        />
        <span class="erro-mensagem" v-if="erros.numero">{{ erros.numero }}</span>
      </div>

      <div class="campo">
        <label for="complemento">Complemento</label>
        <input
          type="text"
          id="complemento"
          :value="formulario.complemento"
          @input="atualizarCampo('complemento', $event.target.value)"
          :class="{ erro: erros.complemento }"
          placeholder="Apto, Bloco, etc"
        />
        <span class="erro-mensagem" v-if="erros.complemento">{{ erros.complemento }}</span>
      </div>
    </div>

    <div class="campo">
      <label for="bairro">Bairro <span class="obrigatorio">*</span></label>
      <input
        type="text"
        id="bairro"
        :value="formulario.bairro"
        @input="atualizarCampo('bairro', $event.target.value)"
        :class="{ erro: erros.bairro }"
        placeholder="Bairro"
      />
      <span class="erro-mensagem" v-if="erros.bairro">{{ erros.bairro }}</span>
    </div>

    <div class="campo-grupo">
      <div class="campo">
        <label for="cidade">Cidade <span class="obrigatorio">*</span></label>
        <input
          type="text"
          id="cidade"
          :value="formulario.cidade"
          @input="atualizarCampo('cidade', $event.target.value)"
          :class="{ erro: erros.cidade }"
          placeholder="Cidade"
        />
        <span class="erro-mensagem" v-if="erros.cidade">{{ erros.cidade }}</span>
      </div>

      <div class="campo">
        <label for="estado">Estado <span class="obrigatorio">*</span></label>
        <input
          type="text"
          id="estado"
          :value="formulario.estado"
          @input="atualizarCampo('estado', $event.target.value)"
          :class="{ erro: erros.estado }"
          placeholder="Estado"
          maxlength="2"
        />
        <span class="erro-mensagem" v-if="erros.estado">{{ erros.estado }}</span>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
@import '../../assets/styles/variaveis.less';

.informacoes-entrega {
  h2 {
    color: @cor-primaria;
    margin-bottom: @espacamento-base;
    font-size: 1.5em;
    font-weight: 600;
  }

  .campo-grupo {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: @espacamento-base;
  }

  .campo {
    margin-bottom: @espacamento-base;

    &.campo-cep {
      max-width: 200px;

      @media (max-width: @mobile) {
        max-width: 100%;
      }
    }

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