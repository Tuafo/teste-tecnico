# Teste Técnico - Front-end Developer

Este é um projeto de com varias telas e atividades desenvolvidas para o teste técnico de front-end developer da empresa Chico Rei.

Link do Website: https://teste-tecnico-ivory-seven.vercel.app/

## 🚀 Tecnologias Utilizadas

- [Vue.js 3](https://vuejs.org/) - Framework JavaScript progressivo
- [Vue Router](https://router.vuejs.org/) - Roteamento oficial do Vue.js
- [Vite](https://vitejs.dev/) - Build tool e servidor de desenvolvimento
- [LESS](https://lesscss.org/) - Pré-processador CSS
- [Faker.js](https://fakerjs.dev/) - Geração de dados fictícios
- [CEP Promise](https://github.com/BrasilAPI/cep-promise) - Consulta de CEP

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- NPM (geralmente vem com o Node.js) ou [Yarn](https://yarnpkg.com/)

## 🔧 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/teste_tecnico-front_end_developer.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd teste-tecnico
   ```

3. Instale as dependências:
   ```bash
   npm i
   # ou
   npm install
   # ou
   yarn install
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Acesse a aplicação em `http://localhost:5173` (ou a porta que o Vite abrir no terminal)

## 📦 Build para Produção

Para gerar a versão de produção:

```bash
npm run build
# ou
yarn build
```

## 🎨 Personalização

### Paleta de Cores
As cores do projeto podem ser personalizadas no arquivo `src/assets/styles/variaveis.less`. As principais variáveis são:

- `@cor-primaria`: #333333 (Cor principal para textos)
- `@cor-secundaria`: #666666 (Cor secundária para textos)
- `@cor-fundo`: #ffffff (Cor de fundo)
- `@cor-erro`: #ff0000 (Cor para mensagens de erro)
- `@cor-sucesso`: #28a745 (Cor para indicar sucesso)

### Fontes
O projeto utiliza a fonte [Noto Sans](https://fonts.google.com/specimen/Noto+Sans) do Google Fonts, que pode ser alterada no arquivo `src/assets/styles/variaveis.less`.

## 📝 Instruções do Teste

- ✅ Utilização de um único projeto para todos os exercícios
- ✅ Personalização livre da paleta de cores e fontes
- ✅ Utilização de imagens do site da Chico Rei
- ✅ Uso do [Faker.js](https://fakerjs.dev/) para geração de dados de exemplo
- ✅ Personalização de estilos com LESS
- ✅ Código limpo e organizado
- ✅ Documentação detalhada
- ✅ Princípios de acessibilidade
- ✅ Otimização de performance
- ✅ Criatividade na implementação

## 🌟 Funcionalidades

- Grid responsivo de produtos
- Carrinho de compras com gerenciamento de quantidades
- Processo de checkout em múltiplas etapas
- Validação de formulários
- Integração com API de CEP
- Feedback visual para o usuário
- Modal para visualização de produtos
- Animações e transições suaves

## 📚 Estrutura do Projeto

```
src/
├── assets/
│   └── styles/          # Arquivos LESS
├── components/
│   ├── Base/            # Componentes base reutilizáveis
│   ├── Checkout/        # Componentes do processo de checkout
│   ├── LayoutResponsivo/# Componentes do grid de produtos
│   ├── MenuLateral/     # Componentes do menu
│   └── Roteamento/      # Componentes de navegação por categoria
├── router/
│   └── index.js        # Configuração centralizada das rotas
├── App.vue             # Componente raiz
└── main.js            # Arquivo principal de inicialização
```

## 🛠️ Organização do Código

### Router
O projeto utiliza Vue Router para gerenciamento de rotas, com a configuração centralizada em `src/router/index.js`. As principais características são:

- Lazy loading de componentes para melhor performance
- Rotas aninhadas para categorias de produtos
- Configuração de meta dados por rota
- Comportamento de scroll automático
- Histórico de navegação baseado em HTML5

### Principais Rotas
- `/layout-responsivo`: Grid de produtos com layout adaptativo
- `/roteamento`: Sistema de categorias com rotas dinâmicas
- `/menu-lateral`: Demonstração de menu responsivo
- `/checkout`: Processo de finalização de compra

## 📸 Direitos de Imagem

Todas as imagens de produtos utilizadas neste projeto são de propriedade da [Chico Rei](https://chicorei.com/) e estão sendo utilizadas com permissão expressa da empresa para fins deste teste técnico. Estas imagens estão protegidas por direitos autorais e não podem ser utilizadas, reproduzidas ou distribuídas sem autorização prévia da Chico Rei.

## 📄 Licença

Este projeto está sob a licença Unlicense. Este é um software de domínio público - use como desejar.

## ✨ Agradecimentos

- [Chico Rei](https://chicorei.com/) pelas imagens utilizadas no projeto e pela oportunidade do teste técnico
- [Faker.js](https://fakerjs.dev/) pela biblioteca de geração de dados
- [CEP Promise](https://github.com/BrasilAPI/cep-promise) pela API de consulta de CEP 
