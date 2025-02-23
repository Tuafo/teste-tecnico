<!--
  Checkout.vue
  
  Componente principal do processo de checkout que gerencia todo o fluxo de finalização de compra.
  
  Funcionalidades:
  - Gerenciamento de etapas do checkout (contato, entrega, pagamento)
  - Validação de formulários por etapa
  - Integração com API de CEP
  - Gerenciamento do carrinho de compras
  - Feedback visual do progresso
  
  Props: Nenhuma
  
  Eventos Emitidos: Nenhum
  
  Componentes Filhos:
  - InformacoesContato: Formulário de contato do cliente
  - InformacoesEntrega: Formulário de endereço de entrega
  - InformacoesPagamento: Formulário de dados do cartão
  - Sacola: Resumo dos produtos no carrinho
  - Carregando: Indicador de carregamento
  - MensagemSucesso: Feedback de compra finalizada
  
  Estado Global:
  - carregando: Controla o estado de loading
  - mostrarSucesso: Controla a exibição da mensagem de sucesso
  - tentouEnviar: Flag para controle de validação
  - dadosCEP: Armazena dados retornados pela API de CEP
  - produtos: Lista de produtos no carrinho
  - formulario: Dados do formulário de checkout
  - erros: Mensagens de erro por seção
-->

<script setup>
import { ref, reactive, computed } from 'vue'
import cep from 'cep-promise'
import { fakerPT_BR as faker } from '@faker-js/faker'

// Importação dos componentes
import InformacoesContato from './InformacoesContato.vue'
import InformacoesEntrega from './InformacoesEntrega.vue'
import InformacoesPagamento from './InformacoesPagamento.vue'
import Sacola from './Sacola.vue'
import Carregando from './Carregando.vue'
import MensagemSucesso from './MensagemSucesso.vue'

// Estados
const carregando = ref(false)
const mostrarSucesso = ref(false)
const tentouEnviar = ref(false)
const dadosCEP = ref(null) // Armazena os dados retornados pela API do CEP

// Controle de etapas
const etapaAtual = ref(0)
const etapas = [
  { titulo: 'Informações de Contato', componente: 'InformacoesContato' },
  { titulo: 'Informações de Entrega', componente: 'InformacoesEntrega' },
  { titulo: 'Informações de Pagamento', componente: 'InformacoesPagamento' }
]

// Estados válidos do Brasil
const ESTADOS_VALIDOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

const formulario = reactive({
  contato: {
    email: '',
    telefone: '',
  },
  entrega: {
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  },
  pagamento: {
    numeroCartao: '',
    nomeCartao: '',
    dataVencimento: '',
    cvc: '',
  }
})

const erros = reactive({
  contato: {},
  entrega: {},
  pagamento: {}
})

// Função para gerar um produto aleatório
const gerarProdutoAleatorio = () => {
  const categorias = [
    { nome: 'camiseta', quantidade: 4 },
    { nome: 'bermuda', quantidade: 3 },
    { nome: 'bolsa', quantidade: 2 },
    { nome: 'pochete', quantidade: 2 },
    { nome: 'moletom', quantidade: 1 }
  ]
  
  const categoria = faker.helpers.arrayElement(categorias)
  const numero = faker.number.int({ min: 1, max: categoria.quantidade })
  
  const imagens = Array.from({ length: 4 }, (_, j) => {
    const numeroImagem = j + 1
    return `/images/${categoria.nome}${numero}/${numeroImagem}.avif`
  })

  const preco = faker.number.float({ min: 29.90, max: 99.90, precision: 0.01 })
  const adjetivo = faker.commerce.productAdjective()
  const titulo = categoria.nome === 'camiseta' ? `Camiseta ${adjetivo}` :
                categoria.nome === 'bermuda' ? `Bermuda ${adjetivo}` :
                categoria.nome === 'bolsa' ? `Bolsa ${adjetivo}` :
                categoria.nome === 'pochete' ? `Pochete ${adjetivo}` :
                `Moletom ${adjetivo}`

  return {
    id: faker.string.uuid(),
    titulo,
    descricao: faker.lorem.paragraph(),
    preco,
    imagens,
    quantidade: 1
  }
}

// Lista de produtos no carrinho
const produtos = ref([gerarProdutoAleatorio()])

// Computed property para o total
const total = computed(() => {
  return produtos.value.reduce((acc, produto) => {
    return acc + (produto.preco * produto.quantidade)
  }, 0)
})

const adicionarProduto = () => {
  produtos.value.push(gerarProdutoAleatorio())
}

const removerProduto = (id) => {
  const index = produtos.value.findIndex(p => p.id === id)
  if (index !== -1) {
    produtos.value.splice(index, 1)
  }
}

const alterarQuantidade = (id, quantidade) => {
  const produto = produtos.value.find(p => p.id === id)
  if (produto && quantidade >= 1) {
    produto.quantidade = quantidade
  }
}

// Validações
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const validarTelefone = (telefone) => {
  const regex = /^\(\d{2}\) \d \d{4}-\d{4}$/
  return regex.test(telefone)
}

const validarCartao = (numero) => {
  const digitos = numero.replace(/\D/g, '')
  if (digitos.length < 13 || digitos.length > 19) return false
  
  let soma = 0
  let dobro = false
  
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

const validarDataVencimento = (data) => {
  if (!/^\d{2}\/\d{2}$/.test(data)) return false
  
  const [mes, ano] = data.split('/')
  const dataAtual = new Date()
  const anoAtual = dataAtual.getFullYear() % 100
  const mesAtual = dataAtual.getMonth() + 1
  
  const mesValido = parseInt(mes) > 0 && parseInt(mes) <= 12
  const anoValido = parseInt(ano) >= anoAtual
  
  if (!mesValido || !anoValido) return false
  
  if (parseInt(ano) === anoAtual) {
    return parseInt(mes) >= mesAtual
  }
  
  return true
}

const validarCVC = (cvc) => {
  return /^\d{3,4}$/.test(cvc)
}

const validarCEP = (cep) => {
  const cepLimpo = cep.replace(/\D/g, '')
  return cepLimpo.length === 8
}

const validarEstado = (estado) => {
  const estadoUpperCase = estado.toUpperCase()
  return ESTADOS_VALIDOS.includes(estadoUpperCase)
}

const validarCamposVazios = () => {
  // Validar contato
  if (!formulario.contato.email) erros.contato.email = 'Campo obrigatório'
  if (!formulario.contato.telefone) erros.contato.telefone = 'Campo obrigatório'
  
  // Validar entrega
  if (!formulario.entrega.cep) {
    erros.entrega.cep = 'Campo obrigatório'
  } else if (!validarCEP(formulario.entrega.cep)) {
    erros.entrega.cep = 'CEP inválido'
  }

  if (!formulario.entrega.endereco) erros.entrega.endereco = 'Campo obrigatório'
  if (!formulario.entrega.numero) erros.entrega.numero = 'Campo obrigatório'
  if (!formulario.entrega.bairro) erros.entrega.bairro = 'Campo obrigatório'
  
  if (!formulario.entrega.cidade) {
    erros.entrega.cidade = 'Campo obrigatório'
  } else if (dadosCEP.value && formulario.entrega.cidade !== dadosCEP.value.city) {
    erros.entrega.cidade = 'Cidade não corresponde ao CEP informado'
  }
  
  if (!formulario.entrega.estado) {
    erros.entrega.estado = 'Campo obrigatório'
  } else if (!validarEstado(formulario.entrega.estado)) {
    erros.entrega.estado = 'Estado inválido'
  } else if (dadosCEP.value && formulario.entrega.estado !== dadosCEP.value.state) {
    erros.entrega.estado = 'Estado não corresponde ao CEP informado'
  }
  
  // Validar pagamento
  if (!formulario.pagamento.numeroCartao) erros.pagamento.numeroCartao = 'Campo obrigatório'
  if (!formulario.pagamento.nomeCartao) erros.pagamento.nomeCartao = 'Campo obrigatório'
  if (!formulario.pagamento.dataVencimento) erros.pagamento.dataVencimento = 'Campo obrigatório'
  if (!formulario.pagamento.cvc) erros.pagamento.cvc = 'Campo obrigatório'
}

const validarFormulario = () => {
  // Limpar erros anteriores
  erros.contato = {}
  erros.entrega = {}
  erros.pagamento = {}
  
  // Validar campos vazios
  validarCamposVazios()
  
  // Validar formatos apenas se os campos não estiverem vazios
  if (formulario.contato.email && !validarEmail(formulario.contato.email)) {
    erros.contato.email = 'Adicione um email válido'
  }
  
  if (formulario.contato.telefone && !validarTelefone(formulario.contato.telefone)) {
    erros.contato.telefone = 'Telefone inválido'
  }
  
  if (formulario.pagamento.numeroCartao && !validarCartao(formulario.pagamento.numeroCartao)) {
    erros.pagamento.numeroCartao = 'Número de cartão inválido'
  }
  
  if (formulario.pagamento.dataVencimento && !validarDataVencimento(formulario.pagamento.dataVencimento)) {
    erros.pagamento.dataVencimento = 'Data de vencimento inválida'
  }
  
  if (formulario.pagamento.cvc && !validarCVC(formulario.pagamento.cvc)) {
    erros.pagamento.cvc = 'CVC inválido'
  }
  
  // Retorna true se não houver erros
  return !Object.values(erros).some(secao => Object.keys(secao).length > 0)
}

const consultarCEP = async (cepValue) => {
  try {
    carregando.value = true
    erros.entrega.cep = ''
    
    if (!validarCEP(cepValue)) {
      erros.entrega.cep = 'CEP inválido'
      return
    }

    const resultado = await cep(cepValue)
    dadosCEP.value = resultado // Armazena o resultado da API
    
    formulario.entrega = {
      ...formulario.entrega,
      endereco: resultado.street,
      bairro: resultado.neighborhood,
      cidade: resultado.city,
      estado: resultado.state,
    }
  } catch (error) {
    erros.entrega.cep = 'CEP não encontrado'
    dadosCEP.value = null
  } finally {
    carregando.value = false
  }
}

const validarEtapaAtual = () => {
  // Limpar erros anteriores
  erros.contato = {}
  erros.entrega = {}
  erros.pagamento = {}
  
  switch (etapaAtual.value) {
    case 0: // Contato
      if (!formulario.contato.email) erros.contato.email = 'Campo obrigatório'
      if (!formulario.contato.telefone) erros.contato.telefone = 'Campo obrigatório'
      if (formulario.contato.email && !validarEmail(formulario.contato.email)) {
        erros.contato.email = 'Adicione um email válido'
      }
      if (formulario.contato.telefone && !validarTelefone(formulario.contato.telefone)) {
        erros.contato.telefone = 'Telefone inválido'
      }
      break
      
    case 1: // Entrega
      if (!formulario.entrega.cep) erros.entrega.cep = 'Campo obrigatório'
      if (!formulario.entrega.endereco) erros.entrega.endereco = 'Campo obrigatório'
      if (!formulario.entrega.numero) erros.entrega.numero = 'Campo obrigatório'
      if (!formulario.entrega.bairro) erros.entrega.bairro = 'Campo obrigatório'
      if (!formulario.entrega.cidade) erros.entrega.cidade = 'Campo obrigatório'
      if (!formulario.entrega.estado) erros.entrega.estado = 'Campo obrigatório'
      
      if (formulario.entrega.cep && !validarCEP(formulario.entrega.cep)) {
        erros.entrega.cep = 'CEP inválido'
      }
      if (formulario.entrega.estado && !validarEstado(formulario.entrega.estado)) {
        erros.entrega.estado = 'Estado inválido'
      }
      if (dadosCEP.value) {
        if (formulario.entrega.cidade !== dadosCEP.value.city) {
          erros.entrega.cidade = 'Cidade não corresponde ao CEP informado'
        }
        if (formulario.entrega.estado !== dadosCEP.value.state) {
          erros.entrega.estado = 'Estado não corresponde ao CEP informado'
        }
      }
      break
      
    case 2: // Pagamento
      if (!formulario.pagamento.numeroCartao) erros.pagamento.numeroCartao = 'Campo obrigatório'
      if (!formulario.pagamento.nomeCartao) erros.pagamento.nomeCartao = 'Campo obrigatório'
      if (!formulario.pagamento.dataVencimento) erros.pagamento.dataVencimento = 'Campo obrigatório'
      if (!formulario.pagamento.cvc) erros.pagamento.cvc = 'Campo obrigatório'
      
      if (formulario.pagamento.numeroCartao && !validarCartao(formulario.pagamento.numeroCartao)) {
        erros.pagamento.numeroCartao = 'Número de cartão inválido'
      }
      if (formulario.pagamento.dataVencimento && !validarDataVencimento(formulario.pagamento.dataVencimento)) {
        erros.pagamento.dataVencimento = 'Data de vencimento inválida'
      }
      if (formulario.pagamento.cvc && !validarCVC(formulario.pagamento.cvc)) {
        erros.pagamento.cvc = 'CVC inválido'
      }
      break
  }
  
  // Retorna true se não houver erros na etapa atual
  const secaoAtual = Object.keys(erros)[etapaAtual.value]
  return Object.keys(erros[secaoAtual]).length === 0
}

const avancarEtapa = () => {
  tentouEnviar.value = true
  if (!validarEtapaAtual()) return
  
  if (etapaAtual.value < etapas.length - 1) {
    tentouEnviar.value = false
    etapaAtual.value++
  }
}

const voltarEtapa = () => {
  if (etapaAtual.value > 0) {
    tentouEnviar.value = false
    etapaAtual.value--
  }
}

const finalizarCompra = async () => {
  tentouEnviar.value = true
  if (!validarEtapaAtual()) return

  try {
    carregando.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const dadosPedido = {
      formulario,
      produtos: produtos.value.map(produto => ({
        ...produto,
        total: produto.preco * produto.quantidade
      })),
      total: total.value
    }
    
    console.log('Dados do pedido:', dadosPedido)
    mostrarSucesso.value = true
  } catch (error) {
    console.error('Erro ao finalizar compra:', error)
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="checkout">
    <header>
      <h1>Finalizar Compra</h1>
      <div class="etapas">
        <div 
          v-for="(etapa, index) in etapas" 
          :key="index"
          :class="['etapa', { 'ativa': index === etapaAtual, 'concluida': index < etapaAtual }]"
        >
          <div class="numero">{{ index + 1 }}</div>
          <span>{{ etapa.titulo }}</span>
        </div>
      </div>
    </header>

    <main class="checkout-container">
      <div class="checkout-form">
        <form @submit.prevent="etapaAtual === etapas.length - 1 ? finalizarCompra() : avancarEtapa()">
          <transition name="fade" mode="out-in">
            <div :key="etapaAtual">
              <InformacoesContato
                v-if="etapaAtual === 0"
                v-model:formulario="formulario.contato"
                v-model:erros="erros.contato"
                :erros="tentouEnviar ? erros.contato : {}"
              />
              
              <InformacoesEntrega
                v-if="etapaAtual === 1"
                v-model:formulario="formulario.entrega"
                v-model:erros="erros.entrega"
                :erros="erros.entrega"
                @consultar-cep="consultarCEP"
              />
              
              <InformacoesPagamento
                v-if="etapaAtual === 2"
                v-model:formulario="formulario.pagamento"
                v-model:erros="erros.pagamento"
                :erros="tentouEnviar ? erros.pagamento : {}"
              />
            </div>
          </transition>

          <div class="acoes">
            <button
              type="button"
              class="botao-voltar"
              v-if="etapaAtual > 0"
              @click="voltarEtapa"
              :disabled="carregando"
            >
              Voltar
            </button>

            <button
              type="submit"
              class="botao-avancar"
              :disabled="carregando"
            >
              <template v-if="!carregando">
                {{ etapaAtual === etapas.length - 1 ? 'Finalizar Compra' : 'Próximo' }}
              </template>
              <template v-else>
                Processando...
              </template>
            </button>
          </div>
        </form>
      </div>

      <div class="checkout-sacola">
        <Sacola
          :produtos="produtos"
          :total="total"
          @alterar-quantidade="alterarQuantidade"
          @adicionar-produto="adicionarProduto"
          @remover-produto="removerProduto"
        />
      </div>
    </main>

    <Carregando v-if="carregando" />
    <MensagemSucesso v-if="mostrarSucesso" />
  </div>
</template>

<style lang="less" scoped>
@import '../../assets/styles/variaveis.less';
@import '../../assets/styles/responsivo.less';

.checkout {
  padding: @espacamento-metade @espacamento-base 0;
  
  header {
    text-align: center;
    margin-bottom: @espacamento-base;
    max-width: @largura-maxima;
    margin: 0 auto;
    padding: 0 @espacamento-base;
    
    h1 {
      font-size: 2em;
      color: @cor-primaria;
      font-weight: 600;
      margin-bottom: @espacamento-base;
    }

    .etapas {
      display: flex;
      justify-content: center;
      gap: @espacamento-duplo;
      margin-bottom: @espacamento-base;
      background: @cor-fundo;
      padding: @espacamento-base @espacamento-duplo;
      border-radius: @raio-borda;
      border: 1px solid fade(@cor-primaria, 50%);

      @media (max-width: @mobile) {
        flex-direction: column;
        gap: @espacamento-base;
      }

      .etapa {
        display: flex;
        align-items: center;
        gap: @espacamento-base;
        color: @cor-secundaria;
        
        .numero {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: @cor-secundaria;
          color: @cor-fundo;
          .centralizar-flex();
          font-weight: 600;
        }

        &.ativa {
          color: @cor-primaria;
          
          .numero {
            background: @cor-primaria;
          }
        }

        &.concluida {
          color: @cor-sucesso;
          
          .numero {
            background: @cor-sucesso;
          }
        }
      }
    }
  }

  .checkout-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: @espacamento-base;
    max-width: @largura-maxima;
    margin: 0 auto;
    padding: 0 @espacamento-base;

    @media (max-width: @mobile) {
      grid-template-columns: 1fr;
      padding: @espacamento-base;
      gap: @espacamento-base;
    }
  }

  .checkout-form {
    background: @cor-fundo;
    padding: @espacamento-duplo;
    border-radius: @raio-borda;
    border: 1px solid fade(@cor-primaria, 50%);

    form {
      display: flex;
      flex-direction: column;
      gap: @espacamento-duplo;

      > div {
        background: transparent;
        padding: 0;
        border-radius: 0;
        box-shadow: none;
      }
    }

    .informacoes-contato,
    .informacoes-entrega,
    .informacoes-pagamento {
      background: transparent;
      padding: 0;
      border-radius: 0;
      box-shadow: none;
      margin-top: 0;
    }
  }

  .checkout-sacola {
    position: sticky;
    top: calc(@altura-navbar + @espacamento-base);

    @media (max-width: @mobile) {
      position: relative;
      top: 0;
    }
  }

  .acoes {
    margin-top: @espacamento-duplo;
    display: flex;
    justify-content: space-between;
    gap: @espacamento-base;

    button {
      padding: @espacamento-base @espacamento-duplo;
      border: none;
      border-radius: @raio-borda;
      font-size: 1.1em;
      cursor: pointer;
      .transicao-suave();
      outline: none;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .botao-voltar {
      background: @cor-secundaria;
      color: @cor-fundo;

      &:hover:not(:disabled) {
        background: darken(@cor-secundaria, 10%);
      }
    }

    .botao-avancar {
      background: @cor-primaria;
      color: @cor-fundo;
      margin-left: auto;

      &:hover:not(:disabled) {
        background: darken(@cor-primaria, 10%);
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 