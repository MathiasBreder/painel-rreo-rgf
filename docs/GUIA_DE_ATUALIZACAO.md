# Guia de Atualização de Dados

Este guia permite que qualquer pessoa da equipe atualize o painel sem conhecimento prévio de
React. Todas as edições acontecem em **um único arquivo**: `src/PainelRREORGF.jsx`, no bloco de
constantes marcado como `DADOS`, no início do arquivo. Após editar, teste com `npm run dev`,
valide com `npm run build` e publique com `git push` (ver README, seções 3 e 5).

Regras de digitação que valem para todo o arquivo:

- Valores monetários em **R$ milhões com ponto decimal e sem aspas**: `2397.79`.
- Percentuais como número simples: `37.85` significa 37,85%.
- Textos sempre entre aspas duplas.
- Todo item de lista termina com vírgula. Na dúvida, copie um item existente e altere os valores.

---

## 1. Calendário de atualização

| Evento | Prazo típico de publicação no SICONFI | O que atualizar |
|---|---|---|
| RREO bimestral | Até 30 dias após o fim do bimestre | Seções A, B, C, D, E, F, G, H deste guia |
| RGF quadrimestral | Até 30 dias após o fim do quadrimestre | Seções D e H |
| IFGF anual (Firjan, ~setembro) | Uma vez ao ano | Seção I |
| Virada de exercício (janeiro) | | Seção J |

Download dos demonstrativos: https://siconfi.tesouro.gov.br > Consultas > Consultar FINBRA /
Declarações > RREO ou RGF > Ente 3303302 (Niterói) > exportar XLS.

---

## 2. Mapa de constantes por seção do painel

### A. `execSerie` (Seção 1 · abas RCL e Balanço)

Uma linha por bimestre. Fonte: **RREO Anexo 14** (Demonstrativo Simplificado), valores
acumulados "até o bimestre", e a RCL do Anexo 03 (total 12 meses).

```js
{ p: "26/B3", ano: 2026, receita: 0.0, empenhada: 0.0, liquidada: 0.0, paga: 0.0, rcl: 0.0 },
```

| Campo | Linha do Anexo 14 |
|---|---|
| receita | Receitas Realizadas (até o bimestre) |
| empenhada | Despesas Empenhadas |
| liquidada | Despesas Liquidadas |
| paga | Despesas Pagas |
| rcl | Receita Corrente Líquida (Anexo 03, total 12 meses) |

Acrescente a nova linha ao final da lista. Nunca remova bimestres anteriores.

### B. `resumoExec` e `resultados` (cards da Seção 1 e da Seção 2)

Atualize o bloco do exercício corrente em `resumoExec` (previsão atualizada, receita, dotação
atualizada, empenhada, liquidada, paga, todos do Anexo 14) e em `resultados` os campos
`apurado` do primário e do nominal (Anexo 14, linhas RESULTADO PRIMÁRIO e RESULTADO NOMINAL)
e o texto `periodo`. As metas da LDO só mudam na virada do exercício.

### C. `seriePN` (gráficos da Seção 2)

Uma linha por bimestre com o resultado primário e nominal apurados até o bimestre (Anexo 14)
e as metas anuais da LDO repetidas em `metaP` e `metaN`.

### D. `rgfSerie` (Seção 3) — a cada RGF

```js
{ p: "26/2ºQ", ano: 2026, rclAj: 0.0, dtp: 0.0, dtpPct: 0.0, dclPct: 0.0 },
```

Fonte: **RGF Anexo 06** (Demonstrativo Simplificado): RCL Ajustada, Despesa Total com Pessoal
(valor e % sobre a RCL ajustada) e % da Dívida Consolidada Líquida. Se algum dos demais limites
(garantias, operações de crédito, ARO) deixar de ser zero, atualize também a tabela fixa
"Demais limites" dentro do layout da Seção 3.

### E. `constitucionais` (Seção 4)

Para cada novo bimestre, acrescente um ponto em cada uma das três séries (educação, FUNDEB,
saúde), com quatro campos vindos do **Anexo 14**:

```js
{ p: "26/B3", ano: 2026, v: 0.0, vAplic: 0.0, vMin: 0.0 },
```

- `v`: % aplicado até o bimestre.
- `vAplic`: valor aplicado até o bimestre, em R$ milhões.
- `vMin`: mínimo nominal do período. Calcule assim: `vMin = (vAplic ÷ v) × mínimo`.
  Exemplo educação: aplicado 221,81 a 19,01% → base 1.166,8 → vMin = 1.166,8 × 25% = 291,70.
- No fechamento do exercício, atualize também `fechamentos` e `atual` de cada card.
- Percentuais distorcidos de início de exercício (base reduzida, tipicamente FUNDEB no 1º
  bimestre) devem ser excluídos da série, com registro na `nota` do card.

### F. `restosAPagar` e `rpExecucao` (Seção 5)

`restosAPagar`: inscritos, cancelados, pagos e saldo do exercício (Anexo 14, quadro de RP).
`rpExecucao`: execução por Poder e Órgão do **Anexo 07**, nos três recortes (não processados,
processados e total), com cancelados, pagos e saldo por linha. Atenção: nos não processados,
o campo `pagos` é o valor pago (não o liquidado).

### G. `insightsReceita`, `insightsDespesa` e `alertas` (Seções 1 e 6)

São textos analíticos. A cada bimestre, recalcule as variações interanuais no mesmo corte
(Anexo 06 para receitas por origem; Anexo 01 para despesas por GND) e reescreva os cards que
mudaram, sempre citando os valores e o IPCA de referência (IBGE, acumulado em 12 meses).
Alertas referem-se **somente ao exercício corrente**; exercícios encerrados entram apenas como
contexto de tendência. Cite sempre o fundamento normativo no campo `fund`.

### H. `preditivos` (Seção 8)

Recalcule as projeções a cada novo demonstrativo, mantendo a metodologia registrada no rodapé
da seção: incremento médio em pontos percentuais entre o bimestre atual e o 6º (educação e
saúde, exercícios de referência 2023 a 2025); razões médias 1ºQ→3ºQ para DTP (1,0606) e RCL
ajustada (1,0218); base anual de impostos projetada pela razão média B2→B6 de 2,622; FUNDEB
pela mediana. Ao avançar os bimestres, substitua as razões pelo par equivalente (ex.: B3→B6).

### I. `ifgfSimulacao`, `ifgfSeries` e `ifgfMapa` (Seção 9) — anual

Na divulgação de cada edição do IFGF (Firjan): acrescente o novo ano em `ifgfAnos` e nas
séries de `ifgfSeries`; substitua os valores de `ifgfMapa` pelos da nova edição (planilha
"Evolução por Indicador" em https://www.firjan.com.br/ifgf); refaça `ifgfSimulacao` com os
dados do exercício encerrado seguindo o memorial descrito nos próprios cards. A constante
`rjGeo` é a malha do mapa e **não deve ser alterada**.

### J. Virada de exercício (janeiro)

1. Altere `const ANO_CORRENTE` para o novo ano.
2. Crie os blocos do novo exercício em `resumoExec` e `resultados` (metas da nova LDO).
3. Os dados do exercício mais antigo saem da visualização? **Não por padrão**: o painel exibe
   2024 em diante. Para manter a janela de três exercícios, remova as linhas do ano mais
   antigo de todas as séries e ajuste os marcadores `fimExercicio` nas chamadas dos gráficos.
4. Atualize textos do cabeçalho, KPIs do topo e da Seção 8.

---

## 3. Checklist antes de publicar

- [ ] `npm run dev` abre sem erro e os novos pontos aparecem nos gráficos
- [ ] Conferência de dois ou três valores contra o XLS do SICONFI
- [ ] Tooltips das Seções 3 e 4 exibindo os valores nominais corretos
- [ ] Botão Gerar PDF produzindo o relatório até a Seção 8
- [ ] `npm run build` concluído sem erros
- [ ] Commit com mensagem descritiva e push na `main`
