<!--
  GridCategoria.vue
  
  Componente que gerencia a exibição e navegação entre categorias.
  Responsabilidades:
  - Gerenciar a seleção de categorias via dropdown
  - Sincronizar a navegação com o Vue Router
  - Exibir o grid de imagens da categoria selecionada
  - Manter o estado consistente com a URL
  
  Funcionalidades:
  - Dropdown para seleção de categoria
  - Navegação automática ao selecionar categoria
  - Grid responsivo de imagens
  - Suporte a todas as categorias ou categoria específica
-->

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ImagemCategoria from './ImagemCategoria.vue'

const route = useRoute()
const router = useRouter()

// Lista de categorias disponíveis
const categorias = [
    { id: 'camiseta', nome: 'Camisetas', quantidade: 4, rota: 'camisetas' },
    { id: 'bermuda', nome: 'Bermudas', quantidade: 3, rota: 'bermudas' },
    { id: 'bolsa', nome: 'Bolsas', quantidade: 2, rota: 'bolsas' },
    { id: 'pochete', nome: 'Pochetes', quantidade: 2, rota: 'pochetes' },
    { id: 'moletom', nome: 'Moletons', quantidade: 1, rota: 'moletons' }
]

// Adiciona opção "Todas" no início
const categoriasComTodas = [
    { id: 'todas', nome: 'Todas as Categorias', quantidade: 0, rota: '' },
    ...categorias
]

// Categoria atual baseada na rota
const categoriaAtual = computed(() => {
    const rotaAtual = route.path.split('/').pop()
    if (!rotaAtual || rotaAtual === 'roteamento') return 'todas'
    return categorias.find(cat => cat.rota === rotaAtual)?.id || 'todas'
})

// Array de imagens a serem exibidas
const imagensParaExibir = computed(() => {
    if (categoriaAtual.value === 'todas') {
        return categorias.flatMap(categoria => 
            Array.from({ length: categoria.quantidade }, (_, i) => ({
                categoria: categoria.id,
                numeroPasta: i + 1
            }))
        )
    }
    
    const categoria = categorias.find(cat => cat.id === categoriaAtual.value)
    return categoria 
        ? Array.from({ length: categoria.quantidade }, (_, i) => ({
            categoria: categoria.id,
            numeroPasta: i + 1
        }))
        : []
})

// Atualiza a rota quando a categoria muda
const mudarCategoria = (event) => {
    const categoria = categoriasComTodas.find(cat => cat.id === event.target.value)
    if (categoria) {
        router.push({
            path: `/roteamento/${categoria.rota}`
        })
    }
}
</script>

<template>
    <div class="grid-categoria">
        <div class="container">
            <div class="select-container">
                <select :value="categoriaAtual"
                        @change="mudarCategoria"
                        aria-label="Selecione uma categoria">
                    <option v-for="categoria in categoriasComTodas"
                            :key="categoria.id"
                            :value="categoria.id">
                        {{ categoria.nome }}
                    </option>
                </select>
                <span class="select-arrow">▼</span>
            </div>
            <div class="imagens-grid">
                <ImagemCategoria 
                    v-for="imagem in imagensParaExibir"
                    :key="`${imagem.categoria}-${imagem.numeroPasta}`"
                    :categoria="imagem.categoria"
                    :numero-pasta="imagem.numeroPasta"
                />
            </div>
        </div>
    </div>
</template>

<style lang="less">
@import '../../assets/styles/components/Roteamento/grid-categoria.less';
</style> 