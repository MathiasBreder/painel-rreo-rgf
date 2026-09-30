# Painel de Monitoramento Fiscal - RREO e RGF

Dashboard institucional do **Departamento de Estudos Fiscais (DEEF)** da Secretaria Municipal de
Fazenda de Niterói para acompanhamento do exercício corrente: execução orçamentária, resultados
primário e nominal, limites da LRF, aplicações constitucionais, restos a pagar, insights preditivos
e posição no Índice Firjan de Gestão Fiscal (IFGF), incluindo mapa coroplético do Estado do RJ.

Fontes: SICONFI/STN (RREO e RGF), IFGF/Firjan e malha municipal do IBGE.

**Posição atual dos dados:** RREO até o 4º bimestre de 2026 e RGF até o 2º quadrimestre de 2026.
O registro de cada carga está em [`CHANGELOG.md`](CHANGELOG.md).

---

## 1. Stack

| Camada | Tecnologia |
|---|---|
| Interface | React 18 (componente único em `src/PainelRREORGF.jsx`) |
| Gráficos | Recharts 2 |
| Estilo | Tailwind CSS 3 |
| Build | Vite 5 |
| Hospedagem | Vercel (deploy automático a partir do GitHub) |

Não há backend nem banco de dados. **Todos os dados são constantes embutidas no início do
componente**, atualizadas manualmente a cada publicação de RREO ou RGF. O guia completo de
atualização está em [`docs/GUIA_DE_ATUALIZACAO.md`](docs/GUIA_DE_ATUALIZACAO.md).

## 2. Pré-requisitos

- **Node.js 18 ou superior** (https://nodejs.org). Verifique com `node -v`.
- **Git** (https://git-scm.com). No Windows, use o Git Bash instalado junto.
- Conta com acesso ao repositório no GitHub e ao projeto na Vercel.

## 3. Rodando localmente

```bash
# 1. Clonar o repositório (apenas na primeira vez)
git clone https://github.com/SUA-ORG/painel-rreo-rgf.git
cd painel-rreo-rgf

# 2. Instalar as dependências (primeira vez ou quando o package.json mudar)
npm install

# 3. Subir o servidor de desenvolvimento
npm run dev
```

O terminal exibirá um endereço local, normalmente `http://localhost:5173`. Toda edição salva em
`src/PainelRREORGF.jsx` recarrega a página automaticamente.

Para validar o pacote final antes de publicar:

```bash
npm run build     # gera a pasta dist/
npm run preview   # serve a dist/ localmente para conferência
```

Se `npm run build` terminar sem erros, o deploy na Vercel também funcionará.

## 4. Estrutura do projeto

```
painel-rreo-rgf/
├── index.html                  Página raiz (título da aba do navegador)
├── package.json                Dependências e scripts
├── vite.config.js              Configuração do Vite
├── tailwind.config.js          Configuração do Tailwind
├── postcss.config.js           Pipeline de CSS
├── src/
│   ├── main.jsx                Ponto de entrada React
│   ├── index.css               Diretivas do Tailwind
│   └── PainelRREORGF.jsx       ★ TODO O PAINEL: dados + componentes + layout
└── docs/
    └── GUIA_DE_ATUALIZACAO.md  Rotina de atualização de dados passo a passo
```

O arquivo `src/PainelRREORGF.jsx` está organizado em três blocos, nesta ordem:

1. **DADOS** (linhas iniciais): constantes `execSerie`, `receitasCat`, `despesasGND`,
   `insightsReceita`, `insightsDespesa`, `resumoExec`, `resultados`, `seriePN`, `rgfSerie`,
   `constitucionais`, `restosAPagar`, `rpExecucao`, `indicadores`, `alertas`, `preditivos`,
   `ifgfSimulacao`, `ifgfSeries`, `ifgfMapa` e `rjGeo` (malha do mapa, não editar).
2. **COMPONENTES**: cartões, tooltips, seções, logotipo, barra de limites.
3. **APP**: o layout das nove seções.

Para a rotina bimestral e quadrimestral, edita-se **apenas o bloco de dados**.

## 5. Publicação (GitHub + Vercel)

O projeto usa integração contínua: **todo push na branch `main` gera deploy automático na Vercel**.

```bash
# após editar e testar localmente
git add .
git commit -m "Atualiza dados do RREO 3º bimestre 2026"
git push origin main
```

Em um a dois minutos a Vercel publica a nova versão. O andamento pode ser acompanhado na aba
Deployments do projeto em https://vercel.com.

### Configuração inicial da Vercel (feita uma única vez)

1. Acesse https://vercel.com e entre com a conta institucional.
2. Add New > Project > importe o repositório `painel-rreo-rgf` do GitHub.
3. A Vercel detecta o Vite automaticamente. Confirme: Framework Preset `Vite`,
   Build Command `npm run build`, Output Directory `dist`.
4. Deploy. O endereço gerado pode ser trocado em Settings > Domains.

## 6. Recursos do painel

- **Seletor de exercício e visão histórica**: a Seção 1 controla o exercício exibido; o botão
  "Desde 2024" expande os gráficos para a série completa, com marcadores de fechamento em cada
  6º bimestre e 3º quadrimestre.
- **Gerar PDF**: o botão no cabeçalho aciona a impressão do navegador (Ctrl+P). O relatório sai
  até a Seção 8; a Seção 9 (IFGF), os botões e filtros interativos são omitidos automaticamente
  na impressão. Na caixa de diálogo, escolha "Salvar como PDF", papel A4. Recomenda-se gerar a
  partir de tela de desktop.
- **Mapa do IFGF**: malha municipal do IBGE embutida (constante `rjGeo`), sem chamadas externas.

## 7. Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| `npm run dev` falha com erro de sintaxe | Vírgula ou chave faltando em constante editada | Confira a linha indicada no erro; todo item de lista termina com vírgula |
| Página em branco após editar | Erro de JavaScript | Abra o console do navegador (F12) e leia a primeira mensagem em vermelho |
| Deploy falhou na Vercel | Build quebrado | Rode `npm run build` localmente, corrija e faça novo push |
| Números com ponto em vez de vírgula | Valor digitado como texto | Valores numéricos não usam aspas e usam ponto decimal (ex.: `2397.79`) |
| Gráfico não atualizou | Cache do navegador | Recarregue com Ctrl+Shift+R |

## 8. Suporte

Dúvidas sobre os dados e a metodologia: Departamento de Estudos Fiscais (DEEF/SMF).
Dúvidas sobre infraestrutura de publicação: TI da Secretaria Municipal de Fazenda.
