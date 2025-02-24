<!--
  Sacola.vue
  
  Componente que exibe o resumo do pedido com a lista de produtos selecionados.
  
  Funcionalidades:
  - Exibição dos primeiros 3 produtos
  - Modal para visualização de todos os produtos
  - Controle de quantidade de produtos
  - Adição/remoção de produtos
  - Cálculo automático de totais
  - Visualização de imagens dos produtos
  - Formatação de valores monetários
  
  Props:
  - produtos: Array (required)
    Lista de produtos no carrinho com suas informações
  - total: Number (required)
    Valor total do pedido
    
  Eventos Emitidos:
  - alterar-quantidade: Atualiza a quantidade de um produto
  - adicionar-produto: Solicita adição de novo produto
  - remover-produto: Remove um produto do carrinho
  
  Comportamentos:
  - Exibe até 3 produtos na visualização principal
  - Botão "Ver todos" aparece quando há mais de 3 produtos
  - Modal com scroll para lista completa
  - Controles de quantidade por produto
  - Botão de remoção para produtos (exceto quando há apenas um)
-->

<script setup>
import { ref } from 'vue'
import ImagemProduto from '../LayoutResponsivo/ImagemProduto.vue'

const props = defineProps({
  produtos: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['alterar-quantidade', 'adicionar-produto', 'remover-produto'])
const modalAberto = ref(false)

const alterarQuantidade = (id, novaQuantidade) => {
  if (novaQuantidade >= 1) {
    emit('alterar-quantidade', id, novaQuantidade)
  }
}

const formatarPreco = (valor) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const abrirModal = () => {
  modalAberto.value = true
  document.body.style.overflow = 'hidden'
}

const fecharModal = () => {
  modalAberto.value = false
  document.body.style.overflow = ''
}
</script>

<template>
  <section class="sacola">
    <h2>Resumo do Pedido</h2>
    
    <div class="lista-produtos">
      <!-- Mostra até 3 produtos -->
      <div v-for="(produto, index) in produtos.slice(0, 3)" :key="produto.id" class="produto">
        <div class="produto-container">
          <div class="imagem-wrapper">
            <ImagemProduto 
              :imagens="produto.imagens"
              :titulo="produto.titulo"
              class="imagem-produto"
            />
          </div>
          
          <div class="produto-info">
            <div class="info-header">
              <h3>{{ produto.titulo }}</h3>
              <button 
                @click="emit('remover-produto', produto.id)"
                class="botao-remover"
                v-if="produtos.length > 1"
              >
                ×
              </button>
            </div>
            
            <div class="info-content">
              <div class="controle-quantidade">
                <button 
                  @click="alterarQuantidade(produto.id, produto.quantidade - 1)"
                  :disabled="produto.quantidade <= 1"
                  class="botao-quantidade"
                >
                  -
                </button>
                
                <input
                  type="number"
                  v-model.number="produto.quantidade"
                  @input="alterarQuantidade(produto.id, $event.target.value)"
                  min="1"
                  class="input-quantidade"
                />
                
                <button 
                  @click="alterarQuantidade(produto.id, produto.quantidade + 1)"
                  class="botao-quantidade"
                >
                  +
                </button>
              </div>

              <div class="preco">
                {{ formatarPreco(produto.preco * produto.quantidade) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botão para ver todos os produtos quando houver mais de 3 -->
    <button 
      v-if="produtos.length > 3"
      @click="abrirModal"
      class="botao-ver-todos"
    >
      Ver todos os produtos ({{ produtos.length }})
    </button>

    <button 
      @click="emit('adicionar-produto')"
      class="botao-adicionar"
    >
      + Adicionar Produto
    </button>

    <div class="resumo">
      <div class="linha">
        <span>Subtotal</span>
        <span>{{ formatarPreco(total) }}</span>
      </div>
      
      <div class="linha">
        <span>Frete</span>
        <span>Grátis</span>
      </div>
      
      <div class="linha total">
        <span>Total</span>
        <span>{{ formatarPreco(total) }}</span>
      </div>
    </div>

    <!-- Modal com todos os produtos -->
    <div v-if="modalAberto" class="modal">
      <div class="modal-overlay" @click="fecharModal"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3>Todos os Produtos</h3>
          <button @click="fecharModal" class="botao-fechar">×</button>
        </div>

        <div class="modal-content">
          <div v-for="produto in produtos" :key="produto.id" class="produto">
            <div class="produto-container">
              <div class="imagem-wrapper">
                <ImagemProduto 
                  :imagens="produto.imagens"
                  :titulo="produto.titulo"
                  class="imagem-produto"
                />
              </div>
              
              <div class="produto-info">
                <div class="info-header">
                  <h3>{{ produto.titulo }}</h3>
                  <button 
                    @click="emit('remover-produto', produto.id)"
                    class="botao-remover"
                    v-if="produtos.length > 1"
                  >
                    ×
                  </button>
                </div>
                
                <div class="info-content">
                  <div class="controle-quantidade">
                    <button 
                      @click="alterarQuantidade(produto.id, produto.quantidade - 1)"
                      :disabled="produto.quantidade <= 1"
                      class="botao-quantidade"
                    >
                      -
                    </button>
                    
                    <input
                      type="number"
                      v-model.number="produto.quantidade"
                      @input="alterarQuantidade(produto.id, $event.target.value)"
                      min="1"
                      class="input-quantidade"
                    />
                    
                    <button 
                      @click="alterarQuantidade(produto.id, produto.quantidade + 1)"
                      class="botao-quantidade"
                    >
                      +
                    </button>
                  </div>

                  <div class="preco">
                    {{ formatarPreco(produto.preco * produto.quantidade) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
@import '../../assets/styles/variaveis.less';

.sacola {
  background: @cor-fundo;
  padding: @espacamento-duplo;
  border-radius: @raio-borda;
  border: 1px solid fade(@cor-primaria, 50%);

  h2 {
    color: @cor-primaria;
    margin-bottom: @espacamento-base;
    font-size: 1.5em;
    font-weight: 600;
  }

  .lista-produtos {
    display: flex;
    flex-direction: column;
    gap: @espacamento-base;
  }

  .produto {
    border-bottom: 1px solid fade(@cor-primaria, 10%);
    padding-bottom: @espacamento-base;
    
    &:last-child {
      border-bottom: none;
    }

    .produto-container {
      display: flex;
      gap: @espacamento-base;
      position: relative;

      .imagem-wrapper {
        width: 100px;
        height: 150px;
        flex-shrink: 0;
        
        :deep(.imagem-produto) {
          width: 100%;
          height: 100%;
          
          :deep(.imagem-base) {
            width: 100%;
            height: 100%;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              border-radius: @raio-borda;
            }

            .indicadores-progresso {
              display: none;
            }
          }
        }
      }

      .produto-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: @espacamento-base;
          
          h3 {
            font-size: 1.1em;
            color: @cor-primaria;
            margin: 0;
            .linha-clamp(2);
          }
        }

        .info-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: @espacamento-base;
          gap: @espacamento-base;

          .preco {
            font-size: 1.1em;
            font-weight: 600;
            color: @cor-primaria;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .controle-quantidade {
    display: flex;
    align-items: center;
    gap: @espacamento-metade;
    border: 1px solid fade(@cor-primaria, 50%);
    border-radius: @raio-borda;
    padding: @espacamento-metade;
    width: fit-content;

    .botao-quantidade {
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      border-radius: @raio-borda;
      cursor: pointer;
      .centralizar-flex();
      font-size: 1.2em;
      color: @cor-primaria;
      .transicao-suave();
      padding: 0;
      outline: none;

      &:hover:not(:disabled) {
        background: fade(@cor-primaria, 10%);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .input-quantidade {
      width: 32px;
      text-align: center;
      border: none;
      border-radius: @raio-borda;
      padding: 0;
      font-size: 1em;
      background: transparent;
      color: @cor-primaria;
      appearance: textfield;
      -moz-appearance: textfield;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &:focus {
        outline: none;
        background: fade(@cor-primaria, 5%);
      }
    }
  }

  .botao-remover {
    width: 24px;
    height: 24px;
    border: none;
    background: fade(@cor-erro, 10%);
    color: @cor-erro;
    border-radius: 50%;
    cursor: pointer;
    .centralizar-flex();
    font-size: 1.2em;
    .transicao-suave();
    outline: none;
    flex-shrink: 0;

    &:hover {
      background: fade(@cor-erro, 20%);
    }
  }

  .botao-adicionar {
    width: 100%;
    padding: @espacamento-base;
    margin: @espacamento-base 0;
    border: 2px dashed fade(@cor-primaria, 30%);
    background: transparent;
    color: @cor-primaria;
    border-radius: @raio-borda;
    cursor: pointer;
    font-size: 1em;
    .transicao-suave();
    outline: none;

    &:hover {
      border-color: @cor-primaria;
      background: fade(@cor-primaria, 5%);
    }
  }

  .resumo {
    margin-top: @espacamento-duplo;
    border-top: 1px solid fade(@cor-primaria, 10%);
    padding-top: @espacamento-base;

    .linha {
      display: flex;
      justify-content: space-between;
      margin-bottom: @espacamento-base;
      color: @cor-primaria;

      &.total {
        font-weight: bold;
        font-size: 1.2em;
        color: @cor-primaria;
        margin-top: @espacamento-base;
        padding-top: @espacamento-base;
        border-top: 1px solid fade(@cor-primaria, 10%);
      }
    }
  }
}

.botao-ver-todos {
  width: 100%;
  padding: @espacamento-base;
  margin: @espacamento-base 0 0;
  border: none;
  background: fade(@cor-primaria, 5%);
  color: @cor-primaria;
  border-radius: @raio-borda;
  cursor: pointer;
  font-size: 1em;
  .transicao-suave();
  outline: none;

  &:hover {
    background: fade(@cor-primaria, 10%);
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: calc(@altura-navbar + @espacamento-base);

  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal-container {
    position: relative;
    background: @cor-fundo;
    width: 90%;
    max-width: 600px;
    max-height: calc(90vh - @altura-navbar - @espacamento-duplo);
    border-radius: @raio-borda;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1;
    display: flex;
    flex-direction: column;

    .modal-header {
      padding: @espacamento-base @espacamento-duplo;
      border-bottom: 1px solid fade(@cor-primaria, 10%);
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 1.3em;
        color: @cor-primaria;
      }

      .botao-fechar {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: @cor-secundaria;
        font-size: 1.5em;
        cursor: pointer;
        .centralizar-flex();
        .transicao-suave();
        border-radius: 50%;

        &:hover {
          background: fade(@cor-primaria, 5%);
          color: @cor-primaria;
        }
      }
    }

    .modal-content {
      padding: @espacamento-duplo;
      overflow-y: auto;
      max-height: calc(90vh - 70px);

      .produto {
        &:not(:last-child) {
          margin-bottom: @espacamento-base;
          padding-bottom: @espacamento-base;
          border-bottom: 1px solid fade(@cor-primaria, 10%);
        }
      }
    }
  }
}
</style> 