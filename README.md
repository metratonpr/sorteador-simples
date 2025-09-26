# Sorteador Web

Aplicativo React criado com Vite para sortear nomes, formar equipes equilibradas e controlar pontuacoes em tempo real.

## Requisitos

- Node.js 18+ (recomendado)
- npm 9+

## Como rodar

```bash
npm install
npm run dev
```

O projeto inicia em modo desenvolvimento na porta mostrada pelo Vite.

## Scripts adicionais

- `npm run build`: gera a versao de producao
- `npm run preview`: executa um servidor local para testar a build

## Estrutura destacada

- `src/` componentes principais (entrada de nomes, painel de sorteio, equipes, atividades)
- `public/assets/sounds/spin.mp3`: efeito sonoro de roleta usado pelo Howler.js
- `scripts/generateSpinAudio.js`: utilitario opcional para recriar o audio de sorteio

## Funcionalidades

- Importar nomes via arquivo .txt ou entrada manual com normalizacao e deduplicacao
- Sorteio individual com animacao, som e opcoes de embaralhar/remover vencedores
- Geracao de equipes balanceadas, placar com botoes rapidos e edicao manual
- Cadastro e atribuicao de atividades por equipe
- Ranking dinamico com destaque visual do primeiro lugar e confete
- Exportacao de dados em JSON ou CSV
- Estilo responsivo com TailwindCSS, animacoes via Framer Motion e feedback sonoro com Howler.js

