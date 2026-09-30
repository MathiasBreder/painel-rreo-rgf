import React, { useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine, ComposedChart, Area,
} from "recharts";

/* =========================================================
   PAINEL DE MONITORAMENTO FISCAL RREO / RGF
   Prefeitura Municipal de Niterói (Ente 3303302, Inst. 6655)
   Acompanhamento do exercício corrente (2026) com série
   histórica desde o 1º bimestre de 2024. Cálculos preditivos
   internos alimentados pela base 2022 a 2026.
   Fonte: SICONFI / STN, IFGF / Firjan e malha municipal IBGE.
   Valores em R$ milhões.
   ========================================================= */

const ANO_CORRENTE = 2026;

const fmt = (v, d = 2) =>
  v === null || v === undefined
    ? "–"
    : v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

const fmtPct = (v, d = 2) => (v === null || v === undefined ? "–" : `${fmt(v, d)}%`);

/* ---------------- DADOS (R$ milhões) ---------------- */

const execSerie = [
  { p: "24/B1", ano: 2024, receita: 1328.10, empenhada: 3455.21, liquidada: 636.90, paga: 505.94, rcl: 5661.70 },
  { p: "24/B2", ano: 2024, receita: 2163.45, empenhada: 4047.38, liquidada: 1414.47, paga: 1335.64, rcl: 5705.89 },
  { p: "24/B3", ano: 2024, receita: 3160.65, empenhada: 4459.18, liquidada: 2449.61, paga: 2325.32, rcl: 5630.38 },
  { p: "24/B4", ano: 2024, receita: 4445.19, empenhada: 5008.28, liquidada: 3347.42, paga: 3245.07, rcl: 5863.42 },
  { p: "24/B5", ano: 2024, receita: 5273.95, empenhada: 5513.08, liquidada: 4376.28, paga: 4254.45, rcl: 5890.33 },
  { p: "24/B6", ano: 2024, receita: 6523.51, empenhada: 6060.02, liquidada: 5543.30, paga: 5415.75, rcl: 5902.53 },
  { p: "25/B1", ano: 2025, receita: 1544.87, empenhada: 3717.13, liquidada: 719.68, paga: 652.49, rcl: 5999.83 },
  { p: "25/B2", ano: 2025, receita: 2492.69, empenhada: 4600.21, liquidada: 1579.79, paga: 1487.29, rcl: 6125.77 },
  { p: "25/B3", ano: 2025, receita: 3782.44, empenhada: 5141.14, liquidada: 2768.73, paga: 2636.33, rcl: 6309.80 },
  { p: "25/B4", ano: 2025, receita: 4991.92, empenhada: 5590.77, liquidada: 3742.62, paga: 3624.16, rcl: 6301.29 },
  { p: "25/B5", ano: 2025, receita: 5948.69, empenhada: 6006.78, liquidada: 4829.70, paga: 4644.90, rcl: 6355.71 },
  { p: "25/B6", ano: 2025, receita: 7262.82, empenhada: 6765.30, liquidada: 6228.73, paga: 6049.95, rcl: 6325.77 },
  { p: "26/B1", ano: 2026, receita: 1457.83, empenhada: 5168.10, liquidada: 1519.34, paga: 604.00, rcl: 6190.13 },
  { p: "26/B2", ano: 2026, receita: 2397.79, empenhada: 4787.43, liquidada: 1768.29, paga: 1589.17, rcl: 6228.29 },
  { p: "26/B4", ano: 2026, receita: 5264.38, empenhada: 5899.91, liquidada: 4263.15, paga: 4044.06, rcl: 6570.71 },
];

const receitasCat = [
  { p: "26/B1", ano: 2026, impostos: 468.64, contribuicoes: 34.33, patrimonial: 208.61, servicos: 0.02, transfCorrentes: 645.34, outrasCorrentes: 9.21, capital: 0.08 },
  { p: "26/B2", ano: 2026, impostos: 766.34, contribuicoes: 71.93, patrimonial: 316.78, servicos: 0.20, transfCorrentes: 1068.07, outrasCorrentes: 16.90, capital: 0.15 },
  { p: "26/B4", ano: 2026, impostos: 1377.19, contribuicoes: 145.66, patrimonial: 595.64, servicos: 0.30, transfCorrentes: 2727.20, outrasCorrentes: 35.71, capital: 0.29 },
];

const receitasSeries = [
  { key: "impostos", nome: "Impostos e Taxas", cor: "#1E3A8A" },
  { key: "contribuicoes", nome: "Contribuições", cor: "#7C3AED" },
  { key: "patrimonial", nome: "Patrimonial", cor: "#0EA5E9" },
  { key: "servicos", nome: "Serviços", cor: "#94A3B8" },
  { key: "transfCorrentes", nome: "Transferências Correntes", cor: "#D97706" },
  { key: "outrasCorrentes", nome: "Outras Correntes", cor: "#64748B" },
  { key: "capital", nome: "Receitas de Capital", cor: "#059669" },
];

const despesasGND = [
  { p: "26/B1", ano: 2026, pessoal: 2349.46, juros: 16.70, odc: 1250.31, investimentos: 64.90, inversoes: 0.0, amortizacao: 10.81 },
  { p: "26/B2", ano: 2026, pessoal: 2402.24, juros: 26.71, odc: 1539.98, investimentos: 261.51, inversoes: 0.0, amortizacao: 84.06 },
  { p: "26/B4", ano: 2026, pessoal: 2471.99, juros: 31.71, odc: 2157.69, investimentos: 599.38, inversoes: 0.0, amortizacao: 86.86 },
];

const gndSeries = [
  { key: "pessoal", nome: "Pessoal e Encargos (GND 1)", cor: "#1E3A8A" },
  { key: "juros", nome: "Juros e Encargos (GND 2)", cor: "#94A3B8" },
  { key: "odc", nome: "Outras Desp. Correntes (GND 3)", cor: "#D97706" },
  { key: "investimentos", nome: "Investimentos (GND 4)", cor: "#059669" },
  { key: "inversoes", nome: "Inversões Financeiras (GND 5)", cor: "#7C3AED" },
  { key: "amortizacao", nome: "Amortização da Dívida (GND 6)", cor: "#DC2626" },
];

// Insights do exercício corrente (até o 4º bimestre, 2026 x 2025)
// IPCA: 4,26% em 2025 e 4,22% em 12 meses até ago/2026 (IBGE)
const insightsReceita = [
  { grau: "Neutro", cor: "#2563EB", titulo: "Outras Transferências Correntes se recuperam, mas abaixo da inflação",
    texto: "A rubrica que concentra royalties e participação especial somou R$ 1.940,53 mi até o 4º bimestre, alta de 2,9% sobre o mesmo corte de 2025 (R$ 1.886,27 mi), revertendo a queda de 23,7% observada no 2º bimestre. O crescimento ainda fica abaixo do IPCA de 4,22% em 12 meses, com perda real de cerca de 1,3 p.p. Constatação objetiva do Anexo 06; a atribuição às receitas petrolíferas é inferência baseada na composição histórica da rubrica." },
  { grau: "Positivo", cor: "#059669", titulo: "IRRF e cota-parte de ICMS crescem bem acima da inflação",
    texto: "O IRRF avançou 22,1% (R$ 158,00 mi para R$ 192,87 mi) e a cota-parte do ICMS 12,4% (R$ 376,79 mi para R$ 423,44 mi), ambos muito acima do IPCA de 4,22% em 12 meses, com ganho real relevante nessas bases." },
  { grau: "Positivo", cor: "#059669", titulo: "Base tributária própria cresce acima da inflação",
    texto: "O ISS cresceu 10,1% (R$ 510,19 mi para R$ 561,59 mi), o ITBI 7,6% e o IPTU 4,5% (R$ 452,27 mi para R$ 472,72 mi), todos acima do IPCA de 4,22%. O IPTU, que no 2º bimestre crescia abaixo da inflação, passou a registrar ganho real, ainda que modesto." },
  { grau: "Atenção", cor: "#D97706", titulo: "Rendimentos de aplicações financeiras estagnados",
    texto: "As aplicações financeiras somaram R$ 438,35 mi, alta nominal de apenas 0,5% sobre 2025 (R$ 436,11 mi) apesar da Selic elevada, o que representa queda real de cerca de 3,6%. O comportamento é compatível com a redução dos saldos aplicados, coerente com o consumo de poupança observado em 2025." },
];

const insightsDespesa = [
  { grau: "Alto", cor: "#DC2626", titulo: "Outras Despesas Correntes aceleram e crescem quase 4 vezes a inflação",
    texto: "O custeio empenhado em ODC cresceu 16,3% (R$ 1.854,98 mi para R$ 2.157,69 mi), cerca de 3,9 vezes o IPCA de 4,22% em 12 meses, acelerando frente aos 11,8% observados no 2º bimestre. É o principal vetor de pressão sobre a despesa no exercício corrente." },
  { grau: "Atenção", cor: "#D97706", titulo: "Pessoal cresce acima da inflação",
    texto: "O empenho em pessoal e encargos avançou 7,3% (R$ 2.304,11 mi para R$ 2.471,99 mi), acima do IPCA. No RGF, a DTP recuou de 37,85% para 36,79% da RCL ajustada entre o 1º e o 2º quadrimestre por efeito do crescimento da RCL, mas segue 2,61 p.p. acima do 2º quadrimestre de 2025." },
  { grau: "Neutro", cor: "#2563EB", titulo: "Investimentos empenhados 23% abaixo de 2025",
    texto: "Os investimentos empenhados somam R$ 599,38 mi contra R$ 781,96 mi no mesmo corte de 2025. A distância diminuiu frente ao 2º bimestre (−34,1%), mas o ritmo de empenho segue inferior; o dado não reflete necessariamente a execução física." },
  { grau: "Fora do padrão", cor: "#7C3AED", titulo: "Amortização da dívida 71% acima de 2025",
    texto: "O empenho em amortização passou de R$ 50,71 mi para R$ 86,86 mi, mantendo o padrão de antecipação observado desde o início do exercício, enquanto juros e encargos recuaram 15,1% (R$ 37,36 mi para R$ 31,71 mi), movimento coerente com a redução do estoque devedor." },
];

const resumoExec = {
  2024: { prevAtualizada: 5534.07, receita: 6523.51, dotAtualizada: 6820.25, empenhada: 6060.02, liquidada: 5543.30, paga: 5415.75 },
  2025: { prevAtualizada: 6133.26, receita: 7262.82, dotAtualizada: 7502.19, empenhada: 6765.30, liquidada: 6228.73, paga: 6049.95 },
  2026: { prevAtualizada: 6808.21, receita: 5264.38, dotAtualizada: 7942.79, empenhada: 5899.91, liquidada: 4263.15, paga: 4044.06 },
};

const resultados = {
  2024: { primario: { meta: 74.92, apurado: 138.63 }, nominal: { meta: 408.57, apurado: 646.99 }, periodo: "6º bimestre (fechamento)" },
  2025: { primario: { meta: 68.11, apurado: -184.77 }, nominal: { meta: 191.06, apurado: -278.95 }, periodo: "6º bimestre (fechamento)" },
  2026: { primario: { meta: -201.62, apurado: 245.19 }, nominal: { meta: -310.17, apurado: 463.97 }, periodo: "4º bimestre" },
};

const seriePN = [
  { p: "24/B1", ano: 2024, primario: 472.59, nominal: 568.18, metaP: 74.92, metaN: 408.57 },
  { p: "24/B2", ano: 2024, primario: 678.46, nominal: 536.69, metaP: 74.92, metaN: 408.57 },
  { p: "24/B3", ano: 2024, primario: 106.63, nominal: 462.72, metaP: 74.92, metaN: 408.57 },
  { p: "24/B4", ano: 2024, primario: 581.17, nominal: 816.74, metaP: 74.92, metaN: 408.57 },
  { p: "24/B5", ano: 2024, primario: 38.25, nominal: 158.87, metaP: 74.92, metaN: 408.57 },
  { p: "24/B6", ano: 2024, primario: 138.63, nominal: 646.99, metaP: 74.92, metaN: 408.57 },
  { p: "25/B1", ano: 2025, primario: 352.28, nominal: 426.72, metaP: 68.11, metaN: 191.06 },
  { p: "25/B2", ano: 2025, primario: 213.74, nominal: 721.55, metaP: 68.11, metaN: 191.06 },
  { p: "25/B3", ano: 2025, primario: 330.18, nominal: 270.78, metaP: 68.11, metaN: 191.06 },
  { p: "25/B4", ano: 2025, primario: 467.55, nominal: 6.46, metaP: 68.11, metaN: 191.06 },
  { p: "25/B5", ano: 2025, primario: 114.36, nominal: 185.11, metaP: 68.11, metaN: 191.06 },
  { p: "25/B6", ano: 2025, primario: -184.77, nominal: -278.95, metaP: 68.11, metaN: 191.06 },
  { p: "26/B1", ano: 2026, primario: 255.64, nominal: 946.46, metaP: -201.62, metaN: -310.17 },
  { p: "26/B2", ano: 2026, primario: 10.00, nominal: 251.98, metaP: -201.62, metaN: -310.17 },
  { p: "26/B4", ano: 2026, primario: 245.19, nominal: 463.97, metaP: -201.62, metaN: -310.17 },
];

const rgfSerie = [
  { p: "24/1ºQ", ano: 2024, rclAj: 5694.56, dtp: 2057.15, dtpPct: 36.12, dclPct: -73.09 },
  { p: "24/2ºQ", ano: 2024, rclAj: 5852.19, dtp: 2130.84, dtpPct: 36.41, dclPct: -75.92 },
  { p: "24/3ºQ", ano: 2024, rclAj: 5888.43, dtp: 2163.27, dtpPct: 36.74, dclPct: -72.54 },
  { p: "25/1ºQ", ano: 2025, rclAj: 6111.22, dtp: 2141.66, dtpPct: 35.04, dclPct: -81.11 },
  { p: "25/2ºQ", ano: 2025, rclAj: 6287.51, dtp: 2149.29, dtpPct: 34.18, dclPct: -58.46 },
  { p: "25/3ºQ", ano: 2025, rclAj: 6314.80, dtp: 2255.74, dtpPct: 35.72, dclPct: -64.74 },
  { p: "26/1ºQ", ano: 2026, rclAj: 6218.76, dtp: 2353.99, dtpPct: 37.85, dclPct: -68.32 },
  { p: "26/2ºQ", ano: 2026, rclAj: 6559.81, dtp: 2413.70, dtpPct: 36.79, dclPct: -68.01 },
];

const limitesPessoal = { alerta: 48.6, prudencial: 51.3, maximo: 54.0 };

// Royalties e participação especial recebidos nos 12 meses encerrados em cada período (R$ milhões).
// Fonte: controle de arrecadação da SMF. Apuração disponível a partir de dez/2025 (janelas anteriores exigem 2024).
const royalties12m = {
  "25/B6": 2236.80, "26/B1": 2075.55, "26/B2": 2052.68, "26/B4": 2295.91,
  "25/3ºQ": 2236.80, "26/1ºQ": 2052.68, "26/2ºQ": 2295.91,
};
const ROY_PROJ_2026 = 2300.0; // estimativa de recebimento no exercício de 2026
const DCL_ATUAL = -4466.59;   // Dívida Consolidada Líquida · RGF 2º quadrimestre 2026
const RCL_AJ_ENDIV_ATUAL = 6567.91; // RCL ajustada para limites de endividamento · RGF 2º quadrimestre 2026

// vMin: valor nominal (R$ mi) equivalente ao mínimo constitucional sobre a base do período
const constitucionais = [
  {
    nome: "Educação (MDE)", minimo: 25, fund: "Art. 212 da CF",
    serie: [
      { p: "24/B1", ano: 2024, v: 6.84, vAplic: 40.04, vMin: 146.35 }, { p: "24/B2", ano: 2024, v: 20.14, vAplic: 177.39, vMin: 220.20 }, { p: "24/B3", ano: 2024, v: 24.00, vAplic: 318.90, vMin: 332.19 },
      { p: "24/B4", ano: 2024, v: 23.91, vAplic: 564.77, vMin: 590.51 }, { p: "24/B5", ano: 2024, v: 25.28, vAplic: 487.92, vMin: 482.52 }, { p: "24/B6", ano: 2024, v: 28.46, vAplic: 661.09, vMin: 580.72 },
      { p: "25/B1", ano: 2025, v: 16.79, vAplic: 108.04, vMin: 160.87 }, { p: "25/B2", ano: 2025, v: 19.34, vAplic: 207.42, vMin: 268.12 }, { p: "25/B3", ano: 2025, v: 22.17, vAplic: 328.51, vMin: 370.45 },
      { p: "25/B4", ano: 2025, v: 22.41, vAplic: 430.67, vMin: 480.44 }, { p: "25/B5", ano: 2025, v: 23.98, vAplic: 562.80, vMin: 586.74 }, { p: "25/B6", ano: 2025, v: 28.24, vAplic: 788.74, vMin: 698.24 },
      { p: "26/B1", ano: 2026, v: 19.11, vAplic: 128.38, vMin: 167.94 }, { p: "26/B2", ano: 2026, v: 19.01, vAplic: 221.81, vMin: 291.70 },
      { p: "26/B4", ano: 2026, v: 22.78, vAplic: 475.73, vMin: 522.09 },
    ],
    fechamentos: { 2024: 28.46, 2025: 28.24 }, atual: 22.78,
  },
  {
    nome: "FUNDEB · Profissionais da Educação", minimo: 70, fund: "Art. 212-A, XI, CF e art. 26 da Lei 14.113/2020",
    serie: [
      { p: "24/B2", ano: 2024, v: 94.10, vAplic: 64.85, vMin: 48.24 }, { p: "24/B3", ano: 2024, v: 94.33, vAplic: 93.35, vMin: 69.27 },
      { p: "24/B4", ano: 2024, v: 94.13, vAplic: 123.52, vMin: 91.86 }, { p: "24/B5", ano: 2024, v: 94.99, vAplic: 155.32, vMin: 114.46 }, { p: "24/B6", ano: 2024, v: 95.73, vAplic: 188.55, vMin: 137.87 },
      { p: "25/B1", ano: 2025, v: 93.26, vAplic: 35.50, vMin: 26.65 }, { p: "25/B2", ano: 2025, v: 92.90, vAplic: 71.45, vMin: 53.84 }, { p: "25/B3", ano: 2025, v: 99.33, vAplic: 108.90, vMin: 76.74 },
      { p: "25/B4", ano: 2025, v: 98.04, vAplic: 139.61, vMin: 99.68 }, { p: "25/B5", ano: 2025, v: 99.53, vAplic: 173.40, vMin: 121.95 }, { p: "25/B6", ano: 2025, v: 91.65, vAplic: 191.23, vMin: 146.06 },
      { p: "26/B2", ano: 2026, v: 103.45, vAplic: 85.00, vMin: 57.52 },
    ],
    fechamentos: { 2024: 95.73, 2025: 91.65 }, atual: 103.45,
    nota: "Os percentuais do 1º bimestre de 2024 (460,2%) e de 2026 (561,1%) decorrem de base de comparação reduzida no início do exercício e foram excluídos da série por distorção estatística. O Anexo 14 do 4º bimestre de 2026 foi publicado com o indicador zerado; o card mantém a última posição válida (2º bimestre) até a retificação ou a publicação do 5º bimestre.",
  },
  {
    nome: "Saúde (ASPS)", minimo: 15, fund: "Art. 198, §2º, III, CF e art. 7º da LC 141/2012",
    serie: [
      { p: "24/B2", ano: 2024, v: 11.44, vAplic: 66.90, vMin: 87.72 }, { p: "24/B3", ano: 2024, v: 15.22, vAplic: 201.25, vMin: 198.34 },
      { p: "24/B4", ano: 2024, v: 14.78, vAplic: 252.19, vMin: 255.95 }, { p: "24/B5", ano: 2024, v: 14.61, vAplic: 304.88, vMin: 313.01 }, { p: "24/B6", ano: 2024, v: 16.75, vAplic: 420.69, vMin: 376.74 },
      { p: "25/B1", ano: 2025, v: 9.51, vAplic: 60.55, vMin: 95.50 }, { p: "25/B2", ano: 2025, v: 10.21, vAplic: 109.57, vMin: 160.98 }, { p: "25/B4", ano: 2025, v: 12.97, vAplic: 249.27, vMin: 288.28 },
      { p: "25/B5", ano: 2025, v: 14.96, vAplic: 352.81, vMin: 353.76 }, { p: "25/B6", ano: 2025, v: 16.25, vAplic: 455.74, vMin: 420.69 },
      { p: "26/B1", ano: 2026, v: 17.93, vAplic: 120.45, vMin: 100.76 }, { p: "26/B2", ano: 2026, v: 19.78, vAplic: 230.78, vMin: 175.01 },
      { p: "26/B4", ano: 2026, v: 19.89, vAplic: 415.28, vMin: 313.18 },
    ],
    fechamentos: { 2024: 16.75, 2025: 16.25 }, atual: 19.89,
    nota: "O percentual de 47,7% do 1º bimestre de 2024 foi excluído da série pela mesma razão de base reduzida de início de exercício.",
  },
];

const restosAPagar = {
  2024: { inscritos: 679.48, cancelados: 115.57, pagos: 344.56, saldo: 219.34 },
  2025: { inscritos: 837.41, cancelados: 111.69, pagos: 454.12, saldo: 271.61 },
  2026: { inscritos: 985.87, cancelados: 105.81, pagos: 528.08, saldo: 351.98 },
  cobertura: { rpNaoLiq: 533.15, dispLiquida: 2853.50 },
};

const indicadores = [
  { nome: "Dependência de Transferências", formula: "Transferências Correntes ÷ Receitas Correntes", valor: 54.89, unidade: "%", classe: "Regular", cor: "#D97706",
    leitura: "Mais da metade das receitas correntes provém de transferências intergovernamentais. Autonomia financeira moderada, com exposição a decisões alocativas de outros entes, especialmente royalties e cota parte de ICMS." },
  { nome: "Esforço Tributário", formula: "Receita Tributária ÷ Receitas Correntes", valor: 27.38, unidade: "%", classe: "Boa", cor: "#059669",
    leitura: "A arrecadação própria de impostos e taxas responde por mais de um quarto das receitas correntes, patamar superior à média dos municípios brasileiros, refletindo base econômica urbana consolidada." },
  { nome: "Capacidade de Investimento", formula: "Investimentos Empenhados ÷ Despesa Total Empenhada", valor: 15.80, unidade: "%", classe: "Excelente", cor: "#047857",
    leitura: "R$ 1,07 bilhão empenhado em investimentos em 2025, equivalente a 16,9% da RCL. Espaço fiscal relevante para expansão de infraestrutura, sustentado pelas receitas de royalties." },
  { nome: "Liquidez da Execução", formula: "Receita Realizada ÷ Despesa Liquidada", valor: 1.17, unidade: "x", classe: "Boa", cor: "#059669",
    leitura: "A arrecadação superou a despesa liquidada em 16,6% no exercício de 2025, indicando suficiência de recursos para suportar a execução sem pressão sobre o caixa." },
  { nome: "Rigidez Orçamentária", formula: "Despesas Correntes Empenhadas ÷ Receitas Correntes", valor: 75.00, unidade: "%", classe: "Atenção", cor: "#DC2626",
    leitura: "Três quartos das receitas correntes estão comprometidos com despesas correntes. A margem de manobra depende de receitas extraordinárias, o que exige disciplina no crescimento do custeio." },
  { nome: "Geração de Superávit", formula: "Superávit Orçamentário ÷ Receita Realizada", valor: 14.15, unidade: "%", classe: "Boa", cor: "#059669",
    leitura: "Superávit orçamentário de R$ 1,03 bilhão em 2025. A leitura deve ser combinada com o resultado primário negativo, que revela consumo de poupança acumulada de exercícios anteriores." },
];

const alertas = [
  { grau: "Alto", cor: "#DC2626", titulo: "Custeio cresce o dobro da receita",
    texto: "Pessoal e outras despesas correntes empenhados até o 4º bimestre somam R$ 4.629,68 mi em 2026, contra R$ 4.159,09 mi no mesmo corte de 2025, alta de 11,3%, enquanto a receita realizada cresceu 5,5% (R$ 4.991,92 mi para R$ 5.264,38 mi). A diferença de ritmo aumentou frente ao 2º bimestre e é puxada pelas ODC (+16,3%). O descumprimento das metas fiscais de 2025 reforça a necessidade da verificação bimestral de receitas e da limitação de empenho, se cabível, ao longo de 2026.",
    fund: "Arts. 9º, 15 a 17 da LC 101/2000 (geração de despesa e DOCC); art. 169 da CF" },
  { grau: "Médio", cor: "#D97706", titulo: "Despesa com pessoal recua, mas segue acima de 2025",
    texto: "A DTP recuou de 37,85% no 1º quadrimestre para 36,79% da RCL ajustada no 2º quadrimestre de 2026 (R$ 2.413,70 mi), efeito do crescimento da RCL. Ainda assim, é o maior patamar de 2º quadrimestre da série (34,18% em 2025 e 36,41% em 2024) e a projeção de fechamento é de 37,80%. Permanece 11,81 p.p. abaixo do limite de alerta. Inferência analítica sobre tendência.",
    fund: "Arts. 19, 20, III, b, 22, parágrafo único, e 59, §1º, II da LC 101/2000" },
  { grau: "Baixo", cor: "#2563EB", titulo: "RCL volta a crescer, porém com ganho real nulo",
    texto: "A RCL de 12 meses atingiu R$ 6.570,71 mi no 4º bimestre, novo pico da série e alta de 3,9% sobre o fechamento de 2025 (R$ 6.325,77 mi). Frente ao mesmo corte de 2025 (R$ 6.301,29 mi) o crescimento é de 4,3%, praticamente igual ao IPCA de 4,22%, o que indica estabilidade em termos reais. Como a RCL é denominador dos limites da LRF, a recuperação alivia os indicadores, mas não abre espaço fiscal estrutural.",
    fund: "Art. 2º, IV da LC 101/2000 (conceito de RCL como base dos limites)" },
  { grau: "Médio", cor: "#D97706", titulo: "Restos a pagar: estoque maior e cancelamentos em alta",
    texto: "A inscrição evoluiu de R$ 679,48 mi (2024) para R$ 837,41 mi (2025) e R$ 985,87 mi (2026), alta de 45,1% em dois exercícios. Até o 4º bimestre foram pagos R$ 528,08 mi e cancelados R$ 105,81 mi (10,7% do inscrito), restando saldo de R$ 351,98 mi. A cobertura de caixa é ampla, mas a curva merece monitoramento por fonte de recursos, sobretudo à medida que se aproxima 2028, último ano do mandato.",
    fund: "Art. 55, III, b e art. 42 da LC 101/2000; arts. 36 e 92 da Lei 4.320/1964" },
  { grau: "Positivo", cor: "#059669", titulo: "Metas fiscais de 2026 atendidas com folga até o 4º bimestre",
    texto: "O resultado primário acumulado é de R$ +245,19 mi e o nominal de R$ +463,97 mi, frente a metas da LDO de R$ −201,62 mi e R$ −310,17 mi. A gestão ativa de empenhos observada no início do exercício (anulações líquidas de cerca de R$ 380 mi entre o 1º e o 2º bimestre) contribuiu para esse desempenho.",
    fund: "Art. 4º, §1º e art. 9º da LC 101/2000; arts. 58 a 60 da Lei 4.320/1964" },
];

// Substituições das linhas que dependem da RCL quando a base sem royalties está ativa
const preditivosSemRoy = {
  "Despesa com Pessoal (DTP)": {
    atual: "56,61% no 2º quad (sem royalties)", proj: "58,02% no 3º quadrimestre",
    valor: "Acima do equivalente a 54%: excesso projetado de R$ 172,8 mi sobre o máximo e de R$ 405,1 mi sobre o alerta, na base de R$ 4.301,2 mi",
    situacao: "Dependente dos royalties", cor: "#DC2626",
  },
  "Dívida Consolidada Líquida": {
    atual: "−104,56% no 2º quad (sem royalties)", proj: "Posição credora mantida no 3º quadrimestre",
    valor: "Espaço de endividamento até 120% da RCL sem royalties: R$ 9,64 bi",
    situacao: "Cumprimento folgado", cor: "#059669",
  },
  "Receita Corrente Líquida": {
    atual: "R$ 4.274,79 mi no 4º bim (sem royalties)", proj: "R$ 4.312,2 mi no 6º bimestre",
    valor: "Crescimento projetado de 5,5% sobre dez/2025 (R$ 4.088,97 mi), acima da inflação de 12 meses (4,22%)",
    situacao: "Ganho real", cor: "#059669",
  },
};

// Insights preditivos: projeções para o fechamento de 2026 com base na sazonalidade 2023 a 2025 (base interna 2022 a 2026)
const preditivos = [
  {
    meta: "Educação (MDE)", ref: "Mínimo de 25% · art. 212 da CF",
    atual: "22,78% no 4º bim", proj: "27,97% no 6º bimestre",
    valor: "Aplicação adicional necessária para o mínimo: R$ 288,02 mi até o fim do exercício",
    situacao: "Cumprimento projetado", cor: "#059669",
  },
  {
    meta: "Saúde (ASPS)", ref: "Mínimo de 15% · art. 198 CF e LC 141/2012",
    atual: "19,89% no 4º bim", proj: "22,61% no 6º bimestre",
    valor: "Aplicação adicional necessária para o mínimo: R$ 42,97 mi até o fim do exercício",
    situacao: "Cumprimento projetado", cor: "#059669",
  },
  {
    meta: "FUNDEB · Profissionais", ref: "Mínimo de 70% · art. 212-A CF",
    atual: "103,45% no 2º bim", proj: "≈ 105,1% no 6º bimestre",
    valor: "Sem atualização: indicador publicado zerado no Anexo 14 do 4º bimestre; mantida a projeção do 2º bimestre",
    situacao: "Verificar publicação", cor: "#D97706",
  },
  {
    meta: "Despesa com Pessoal (DTP)", ref: "Alerta 48,6% · Prudencial 51,3% · Máximo 54% · LRF",
    atual: "36,79% no 2º quad", proj: "37,80% no 3º quadrimestre",
    valor: "Espaço projetado de gasto: R$ 712,7 mi até o alerta e R$ 1.069,2 mi até o limite máximo",
    situacao: "Dentro dos limites", cor: "#059669",
  },
  {
    meta: "Dívida Consolidada Líquida", ref: "Limite de 120% da RCL · Res. Senado 40/2001",
    atual: "−68,01% no 2º quad", proj: "Posição credora mantida no 3º quadrimestre",
    valor: "Espaço de endividamento até o limite: R$ 12,40 bi",
    situacao: "Cumprimento folgado", cor: "#059669",
  },
  {
    meta: "Receita Corrente Líquida", ref: "Base dos limites · art. 2º, IV da LC 101/2000",
    atual: "R$ 6.570,71 mi no 4º bim", proj: "R$ 6.612,2 mi no 6º bimestre",
    valor: "Crescimento projetado de 4,5% sobre 2025, próximo à inflação de 12 meses (4,22%)",
    situacao: "Estável em termos reais", cor: "#2563EB",
  },
];

/* ---------------- DADOS IFGF ---------------- */

const ifgfSimulacao = {
  exercicioBase: 2025,
  geral: 1.0,
  itens: [
    { nome: "Autonomia", nota: 1.0, indicador: 30.69, corte: "> 25% = nota 1,00",
      detalhe: "Receita da atividade econômica local de R$ 2.503,12 mi (IPTU 595,41; ISS 774,51; ITBI 125,94; IRRF 245,45; cotas-parte de ICMS, IPVA, ITR e IPI-Exportação líquidas de 20% do FUNDEB 726,46; patrimonial elegível 28,54; serviços 6,81) menos estrutura administrativa de R$ 561,85 mi (funções Administração 452,98 e Legislativa 108,87, liquidadas), sobre a RCL de R$ 6.325,77 mi." },
    { nome: "Gastos com Pessoal", nota: 1.0, indicador: 35.72, corte: "< 45% = nota 1,00",
      detalhe: "Despesa líquida com pessoal de R$ 2.255,74 mi sobre a RCL, conforme RGF do 3º quadrimestre de 2025. Muito abaixo do corte inferior de 45% e do teto de 60% da LRF." },
    { nome: "Liquidez", nota: 1.0, indicador: 51.17, corte: "> 25% = nota 1,00",
      detalhe: "Caixa e equivalentes de R$ 3.952,33 mi (RGF Anexo 05) menos restos a pagar inscritos no exercício de R$ 715,35 mi (empenhadas menos pagas, critério Firjan), sobre a RCL." },
    { nome: "Investimentos", nota: 1.0, indicador: 14.72, corte: "> 12% = nota 1,00",
      detalhe: "Investimentos e inversões financeiras liquidados, incluindo intraorçamentárias, de R$ 1.069,11 mi sobre a receita total de R$ 7.262,82 mi." },
  ],
};

const ifgfAnos = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const ifgfSeries = {
  "Niterói": { g: [0.6634, 0.8052, 0.7947, 0.9024, 0.9384, 0.8063, 0.964, 0.9393, 0.9727, 0.94, 1.0, 1.0], a: [1.0, 1.0, 1.0, 1.0, 1.0, 0.9021, 0.856, 0.8024, 0.965, 0.76, 1.0, 1.0], p: [0.9171, 1.0, 0.7956, 0.8189, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], l: [0.5665, 0.81, 0.7731, 0.7905, 0.9445, 0.9048, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], i: [0.1702, 0.4108, 0.6099, 1.0, 0.8092, 0.4182, 1.0, 0.9546, 0.9257, 1.0, 1.0, 1.0] },
  "Rio de Janeiro": { g: [0.9287, 0.8821, 0.8486, 0.749, 0.3839, 0.4227, 0.3496, 0.3043, 0.6909, 0.7562, 0.7542, 0.7203], a: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], p: [1.0, 0.8871, 0.8693, 0.5249, 0.2475, 0.4559, 0.1819, 0.0575, 0.9671, 0.8016, 0.6018, 0.6738], l: [0.7147, 0.6412, 0.5253, 0.4711, 0.0, 0.0, 0.0, 0.0, 0.6851, 0.6444, 0.6127, 0.5663], i: [1.0, 1.0, 1.0, 1.0, 0.2881, 0.2349, 0.2163, 0.1596, 0.1116, 0.5788, 0.8022, 0.641] },
  "Maricá": { g: [0.6586, 0.6702, 0.5023, 0.5327, 0.6809, 0.7184, 0.75, 0.7784, 0.7604, 0.7309, 0.75, 0.75], a: [0.103, 0.1376, 0.0093, 0.131, 0.0055, 0.0, 0.0, 0.1137, 0.3182, 0.0, 0.0, 0.0], p: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], l: [0.5315, 0.5432, 0.0, 0.0, 0.8615, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], i: [1.0, 1.0, 1.0, 1.0, 0.8565, 0.8736, 1.0, 1.0, 0.7236, 0.9235, 1.0, 1.0] },
  "São Gonçalo": { g: [0.7948, 0.7038, 0.6537, 0.6023, 0.5203, 0.584, 0.665, 0.6538, 0.7747, 0.7729, 0.7543, 0.779], a: [0.9919, 1.0, 0.9379, 0.8834, 0.9303, 0.9897, 0.964, 0.8815, 1.0, 0.5045, 0.7308, 1.0], p: [0.9323, 0.6301, 0.7477, 0.2138, 0.0816, 0.4786, 0.5416, 0.6874, 1.0, 1.0, 0.5775, 1.0], l: [0.8635, 0.8564, 0.4808, 0.7866, 0.9101, 0.741, 0.8834, 0.8087, 1.0, 1.0, 0.929, 0.7475], i: [0.3916, 0.3289, 0.4485, 0.5255, 0.1591, 0.1268, 0.2709, 0.2374, 0.0989, 0.587, 0.78, 0.3686] },
  "Macaé": { g: [0.6895, 0.7794, 0.6412, 0.4173, 0.4119, 0.7061, 0.5946, 0.6824, 0.7849, 0.8649, 0.884, 0.9471], a: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], p: [0.5192, 0.5496, 0.1698, 0.0, 0.0042, 0.9071, 0.3139, 0.5511, 1.0, 1.0, 1.0, 1.0], l: [1.0, 1.0, 1.0, 0.5694, 0.5577, 0.7433, 0.8278, 0.8265, 1.0, 1.0, 1.0, 1.0], i: [0.239, 0.5678, 0.3952, 0.0999, 0.0857, 0.1742, 0.2365, 0.352, 0.1397, 0.4594, 0.536, 0.7883] },
  "Campos dos Goytacazes": { g: [0.6693, 0.75, 0.4999, 0.2883, 0.279, 0.4678, 0.2831, 0.2547, 0.6868, 0.683, 0.6763, 0.6021], a: [0.0, 0.0, 0.0, 0.0, 0.7152, 0.3671, 0.5806, 0.6599, 0.7111, 0.4126, 0.4722, 0.5358], p: [1.0, 1.0, 0.8562, 0.3137, 0.3641, 0.7819, 0.4176, 0.2748, 1.0, 1.0, 1.0, 1.0], l: [0.6774, 1.0, 0.4449, 0.0, 0.0, 0.614, 0.0, 0.0, 1.0, 1.0, 0.8165, 0.6543], i: [1.0, 1.0, 0.6985, 0.8396, 0.0368, 0.1083, 0.1342, 0.0841, 0.0362, 0.3196, 0.4164, 0.2182] },
  "Duque de Caxias": { g: [0.5453, 0.4675, 0.3073, 0.3074, 0.285, 0.3403, 0.3748, 0.523, 0.7264, 0.7671, 0.6311, 0.7402], a: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], p: [0.5137, 0.1992, 0.0, 0.0, 0.0, 0.2505, 0.3144, 0.6213, 1.0, 1.0, 1.0, 1.0], l: [0.5806, 0.4345, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.6082, 0.447, 0.0, 0.4619], i: [0.0868, 0.2362, 0.2294, 0.2297, 0.14, 0.1107, 0.1847, 0.4705, 0.2972, 0.6215, 0.5245, 0.4988] },
  "Nova Iguaçu": { g: [0.5468, 0.3817, 0.3994, 0.4397, 0.467, 0.5497, 0.6794, 0.7905, 0.8391, 0.7816, 0.7795, 0.7241], a: [0.8334, 0.9007, 0.8479, 0.8568, 0.8683, 0.8818, 0.8983, 0.7077, 1.0, 0.7599, 0.7693, 0.7616], p: [0.2924, 0.0952, 0.417, 0.6409, 0.3521, 0.5547, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], l: [0.7328, 0.0, 0.0, 0.0, 0.4324, 0.4718, 0.5916, 0.5909, 0.8735, 0.9228, 0.7655, 0.6033], i: [0.3288, 0.531, 0.3329, 0.2609, 0.2151, 0.2904, 0.2278, 0.8636, 0.4828, 0.4437, 0.5832, 0.5316] },
  "Volta Redonda": { g: [0.5206, 0.2789, 0.5014, 0.3655, 0.4943, 0.426, 0.5426, 0.6213, 0.7686, 0.7261, 0.8368, 0.8433], a: [1.0, 0.4013, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], p: [0.5173, 0.2563, 0.5956, 0.1201, 0.3332, 0.1534, 0.5299, 0.8968, 1.0, 0.6298, 1.0, 1.0], l: [0.0, 0.0, 0.0, 0.0, 0.5422, 0.4477, 0.5546, 0.4877, 0.9412, 1.0, 1.0, 1.0], i: [0.5651, 0.4581, 0.4098, 0.3419, 0.1016, 0.1027, 0.0861, 0.1005, 0.1332, 0.2747, 0.3472, 0.3734] },
  "Angra dos Reis": { g: [0.2898, 0.5449, 0.5884, 0.6215, 0.6899, 0.6863, 0.7356, 0.6225, 0.7661, 0.8498, 0.857, 0.863], a: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9762, 1.0, 1.0, 1.0, 0.9484], p: [0.0, 0.0125, 0.2261, 0.2915, 0.6719, 1.0, 1.0, 0.5897, 1.0, 1.0, 1.0, 0.9337], l: [0.0, 1.0, 1.0, 1.0, 1.0, 0.6643, 0.7454, 0.4714, 0.6863, 1.0, 1.0, 0.8223], i: [0.1592, 0.1672, 0.1274, 0.1946, 0.0878, 0.0807, 0.1971, 0.4526, 0.378, 0.3991, 0.4279, 0.7477] },
  "Petrópolis": { g: [0.7342, 0.5915, 0.4622, 0.5275, 0.4749, 0.6086, 0.6161, 0.6727, 0.698, 0.6658, 0.7582, 0.7142], a: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], p: [1.0, 1.0, 0.5138, 0.5048, 0.4142, 0.9594, 1.0, 1.0, 1.0, 0.9717, 1.0, 1.0], l: [0.6417, 0.0, 0.0, 0.4402, 0.4524, 0.4253, 0.4115, 0.5562, 0.6546, 0.6405, 0.8099, 0.7147], i: [0.295, 0.3662, 0.335, 0.165, 0.0329, 0.0496, 0.0531, 0.1346, 0.1375, 0.051, 0.223, 0.142] },
  "Cabo Frio": { g: [0.5297, 0.5601, 0.2375, 0.6969, 0.3978, null, 0.391, null, 0.4488, 0.4873, 0.4432, 0.1562], a: [0.3733, 0.2159, 0.6003, 1.0, 0.5054, null, 0.3832, null, 0.4093, 0.4164, 0.4254, 0.1151], p: [0.3689, 0.6137, 0.0, 0.7216, 0.0, null, 0.0989, null, 0.3086, 0.3484, 0.264, 0.0], l: [0.728, 0.6777, 0.0, 1.0, 1.0, null, 1.0, null, 1.0, 1.0, 1.0, 0.4607], i: [0.6487, 0.7331, 0.3495, 0.0661, 0.0858, null, 0.0818, null, 0.0771, 0.1844, 0.0832, 0.0488] },
  "Itaboraí": { g: [0.7925, 0.789, 0.5411, 0.3485, 0.1318, 0.382, 0.5835, 0.4641, 0.6362, 0.5705, 0.4611, 0.6378], a: [1.0, 1.0, 0.8639, 0.2887, 0.3006, 0.3053, 0.55, 0.2515, 0.2705, 0.2882, 0.0216, 0.3094], p: [1.0, 1.0, 0.7167, 0.0, 0.1447, 0.4702, 0.7135, 0.6133, 1.0, 0.7913, 0.6675, 1.0], l: [0.9925, 0.6305, 0.0, 0.7955, 0.0, 0.6619, 0.9109, 0.8616, 1.0, 1.0, 1.0, 1.0], i: [0.1775, 0.5257, 0.5838, 0.3098, 0.0817, 0.0907, 0.1595, 0.1302, 0.2741, 0.2025, 0.155, 0.2416] },
  "São João de Meriti": { g: [0.455, 0.4042, 0.5036, 0.332, 0.1981, null, 0.0646, null, 0.4143, 0.1895, 0.376, 0.3504], a: [0.555, 0.6315, 0.944, 0.8291, 0.6234, null, 0.2171, null, 0.1181, 0.3833, 0.2599, 0.2631], p: [0.1331, 0.0, 0.0632, 0.365, 0.0, null, 0.0, null, 1.0, 0.0, 0.5088, 0.2762], l: [0.755, 0.6153, 0.5369, 0.0, 0.0, null, 0.0, null, 0.4129, 0.0, 0.4874, 0.4641], i: [0.3767, 0.3698, 0.4701, 0.1338, 0.169, null, 0.0411, null, 0.1261, 0.3749, 0.248, 0.3982] },
  "Saquarema": { g: [0.5857, 0.6649, 0.5148, 0.6276, 0.5487, 0.6906, 0.6795, 0.774, 0.7275, 0.7941, 0.8375, 0.7831], a: [1.0, 1.0, 1.0, 0.9732, 0.6874, 0.4876, 0.2408, 0.1576, 0.2163, 0.2181, 0.3502, 0.3583], p: [0.3428, 0.6598, 0.6519, 0.6423, 0.7617, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], l: [0.0, 0.0, 0.0, 0.4241, 0.6124, 0.8677, 0.8805, 1.0, 1.0, 1.0, 1.0, 1.0], i: [1.0, 1.0, 0.4071, 0.4709, 0.1331, 0.407, 0.5966, 0.9383, 0.6935, 0.9581, 1.0, 0.774] },
  "Resende": { g: [0.6557, 0.638, 0.2917, 0.525, 0.5517, 0.6445, 0.6464, 0.7833, 0.7956, 0.6875, 0.6957, 0.7128], a: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], p: [0.8555, 0.8432, 0.0328, 0.4712, 0.4857, 0.5863, 0.5824, 0.9462, 1.0, 0.3789, 0.4067, 0.4893], l: [0.5489, 0.4258, 0.0, 0.4402, 0.6207, 0.7044, 0.7382, 0.9422, 1.0, 1.0, 1.0, 1.0], i: [0.2184, 0.2829, 0.1339, 0.1885, 0.1003, 0.2874, 0.2649, 0.245, 0.1824, 0.3713, 0.376, 0.3621] },
};

const ifgfMapa = [
  { n: "Angra dos Reis", g: 0.863, a: 0.9484, p: 0.9337, l: 0.8223, i: 0.7477 },
  { n: "Aperibé", g: 0.2976, a: 0.0, p: 0.4893, l: 0.5025, i: 0.1985 },
  { n: "Araruama", g: 0.6798, a: 0.4244, p: 1.0, l: 0.4695, i: 0.8251 },
  { n: "Areal", g: 0.4383, a: 0.0713, p: 0.4642, l: 1.0, i: 0.2178 },
  { n: "Armação dos Búzios", g: 0.4699, a: 0.2168, p: 0.7456, l: 0.8735, i: 0.0438 },
  { n: "Arraial do Cabo", g: 0.633, a: 0.0, p: 1.0, l: 1.0, i: 0.5319 },
  { n: "Barra Mansa", g: 0.6341, a: 0.8629, p: 0.6491, l: 0.8794, i: 0.1451 },
  { n: "Barra do Piraí", g: 0.3668, a: 0.0, p: 0.9742, l: 0.0, i: 0.493 },
  { n: "Bom Jardim", g: 0.6171, a: 0.9034, p: 0.5368, l: 0.8612, i: 0.1671 },
  { n: "Bom Jesus do Itabapoana", g: 0.5597, a: 0.4614, p: 1.0, l: 0.5856, i: 0.1919 },
  { n: "Cabo Frio", g: 0.1562, a: 0.1151, p: 0.0, l: 0.4607, i: 0.0488 },
  { n: "Cachoeiras de Macacu", g: 0.5815, a: 0.3193, p: 1.0, l: 0.6951, i: 0.3115 },
  { n: "Cambuci", g: 0.5548, a: 0.0, p: 0.4557, l: 1.0, i: 0.7637 },
  { n: "Campos dos Goytacazes", g: 0.6021, a: 0.5358, p: 1.0, l: 0.6543, i: 0.2182 },
  { n: "Cantagalo", g: 0.6201, a: 1.0, p: 0.3328, l: 0.7805, i: 0.3669 },
  { n: "Cardoso Moreira", g: 0.5131, a: 0.4231, p: 0.6927, l: 0.6764, i: 0.2601 },
  { n: "Casimiro de Abreu", g: 0.5674, a: 0.2765, p: 0.9606, l: 0.7296, i: 0.303 },
  { n: "Comendador Levy Gasparian", g: 0.3157, a: 0.0, p: 0.628, l: 0.0, i: 0.6348 },
  { n: "Conceição de Macabu", g: 0.6548, a: 0.6675, p: 0.9058, l: 0.7468, i: 0.2992 },
  { n: "Cordeiro", g: 0.7245, a: 0.5901, p: 0.8637, l: 1.0, i: 0.444 },
  { n: "Duas Barras", g: 0.6408, a: 0.527, p: 1.0, l: 0.8396, i: 0.1964 },
  { n: "Duque de Caxias", g: 0.7402, a: 1.0, p: 1.0, l: 0.4619, i: 0.4988 },
  { n: "Engenheiro Paulo de Frontin", g: 0.3084, a: 0.0, p: 0.0, l: 0.6135, i: 0.6199 },
  { n: "Guapimirim", g: 0.635, a: 0.0586, p: 1.0, l: 1.0, i: 0.4814 },
  { n: "Iguaba Grande", g: 0.6876, a: 0.0476, p: 1.0, l: 0.7028, i: 1.0 },
  { n: "Itaboraí", g: 0.6378, a: 0.3094, p: 1.0, l: 1.0, i: 0.2416 },
  { n: "Itaguaí", g: 0.2853, a: 0.9506, p: 0.0, l: 0.0, i: 0.1905 },
  { n: "Italva", g: 0.6938, a: 0.5662, p: 0.6585, l: 1.0, i: 0.5505 },
  { n: "Itaocara", g: 0.4911, a: 0.4007, p: 0.3414, l: 1.0, i: 0.2222 },
  { n: "Itaperuna", g: 0.5762, a: 0.5591, p: 0.7543, l: 0.9505, i: 0.0409 },
  { n: "Itatiaia", g: 0.5576, a: 1.0, p: 0.3356, l: 0.7017, i: 0.193 },
  { n: "Macaé", g: 0.9471, a: 1.0, p: 1.0, l: 1.0, i: 0.7883 },
  { n: "Macuco", g: 0.6043, a: 0.2974, p: 1.0, l: 1.0, i: 0.1198 },
  { n: "Magé", g: 0.6739, a: 0.2808, p: 0.5552, l: 0.911, i: 0.9486 },
  { n: "Mangaratiba", g: 0.0867, a: 0.0299, p: 0.3001, l: 0.0, i: 0.0168 },
  { n: "Maricá", g: 0.75, a: 0.0, p: 1.0, l: 1.0, i: 1.0 },
  { n: "Mesquita", g: 0.5859, a: 0.0, p: 1.0, l: 0.6322, i: 0.7113 },
  { n: "Miguel Pereira", g: 0.6268, a: 0.0, p: 0.9743, l: 0.7729, i: 0.7599 },
  { n: "Natividade", g: 0.504, a: 0.4365, p: 0.9543, l: 0.5856, i: 0.0395 },
  { n: "Nilópolis", g: 0.7081, a: 0.2769, p: 1.0, l: 0.7216, i: 0.8339 },
  { n: "Niterói", g: 1.0, a: 1.0, p: 1.0, l: 1.0, i: 1.0 },
  { n: "Nova Friburgo", g: 0.5928, a: 0.737, p: 0.4062, l: 0.9941, i: 0.234 },
  { n: "Nova Iguaçu", g: 0.7241, a: 0.7616, p: 1.0, l: 0.6033, i: 0.5316 },
  { n: "Paracambi", g: 0.4807, a: 0.0, p: 1.0, l: 0.6594, i: 0.2633 },
  { n: "Paraty", g: 0.7389, a: 0.4554, p: 1.0, l: 0.8838, i: 0.6163 },
  { n: "Paraíba do Sul", g: 0.4168, a: 0.1559, p: 0.726, l: 0.7352, i: 0.0501 },
  { n: "Paty do Alferes", g: 0.606, a: 0.5216, p: 0.3906, l: 0.6513, i: 0.8605 },
  { n: "Petrópolis", g: 0.7142, a: 1.0, p: 1.0, l: 0.7147, i: 0.142 },
  { n: "Pinheiral", g: 0.6495, a: 0.5241, p: 0.7246, l: 0.6641, i: 0.6853 },
  { n: "Piraí", g: 0.7338, a: 1.0, p: 0.9298, l: 0.7423, i: 0.2632 },
  { n: "Porciúncula", g: 0.1689, a: 0.0, p: 0.2821, l: 0.0, i: 0.3937 },
  { n: "Porto Real", g: 0.6959, a: 0.8774, p: 1.0, l: 0.7069, i: 0.1994 },
  { n: "Quatis", g: 0.5258, a: 0.1475, p: 0.7251, l: 1.0, i: 0.2305 },
  { n: "Queimados", g: 0.6269, a: 0.183, p: 0.933, l: 1.0, i: 0.3915 },
  { n: "Quissamã", g: 0.5553, a: 0.5442, p: 1.0, l: 0.5294, i: 0.1478 },
  { n: "Resende", g: 0.7128, a: 1.0, p: 0.4893, l: 1.0, i: 0.3621 },
  { n: "Rio Bonito", g: 0.2527, a: 0.277, p: 0.5283, l: 0.0, i: 0.2057 },
  { n: "Rio Claro", g: 0.6588, a: 0.6448, p: 0.5725, l: 1.0, i: 0.4179 },
  { n: "Rio das Flores", g: 0.4083, a: 0.4997, p: 1.0, l: 0.0, i: 0.1335 },
  { n: "Rio das Ostras", g: 0.5841, a: 0.8548, p: 0.2353, l: 0.8815, i: 0.3649 },
  { n: "Rio de Janeiro", g: 0.7203, a: 1.0, p: 0.6738, l: 0.5663, i: 0.641 },
  { n: "Santa Maria Madalena", g: 0.686, a: 0.837, p: 1.0, l: 0.8102, i: 0.0969 },
  { n: "Santo Antônio de Pádua", g: 0.624, a: 0.1989, p: 1.0, l: 0.6367, i: 0.6604 },
  { n: "Sapucaia", g: 0.7125, a: 0.3401, p: 1.0, l: 1.0, i: 0.5099 },
  { n: "Saquarema", g: 0.7831, a: 0.3583, p: 1.0, l: 1.0, i: 0.774 },
  { n: "Seropédica", g: 0.168, a: 0.0, p: 0.0, l: 0.5057, i: 0.1663 },
  { n: "Silva Jardim", g: 0.6689, a: 0.2321, p: 1.0, l: 1.0, i: 0.4437 },
  { n: "São Fidélis", g: 0.4332, a: 0.206, p: 0.6821, l: 0.5849, i: 0.2597 },
  { n: "São Francisco de Itabapoana", g: 0.2869, a: 0.0, p: 0.3345, l: 0.6749, i: 0.1381 },
  { n: "São Gonçalo", g: 0.779, a: 1.0, p: 1.0, l: 0.7475, i: 0.3686 },
  { n: "São José de Ubá", g: 0.2235, a: 0.0, p: 0.3052, l: 0.5483, i: 0.0406 },
  { n: "São José do Vale do Rio Preto", g: 0.4683, a: 0.201, p: 0.7357, l: 0.6534, i: 0.283 },
  { n: "São João da Barra", g: 0.8061, a: 0.716, p: 1.0, l: 0.939, i: 0.5692 },
  { n: "São João de Meriti", g: 0.3504, a: 0.2631, p: 0.2762, l: 0.4641, i: 0.3982 },
  { n: "São Pedro da Aldeia", g: 0.5873, a: 0.7776, p: 0.6814, l: 0.6, i: 0.2904 },
  { n: "São Sebastião do Alto", g: 0.2414, a: 0.4855, p: 0.0, l: 0.4726, i: 0.0073 },
  { n: "Tanguá", g: 0.4685, a: 0.1771, p: 1.0, l: 0.6105, i: 0.0865 },
  { n: "Teresópolis", g: 0.5729, a: 1.0, p: 0.501, l: 0.7467, i: 0.0438 },
  { n: "Trajano de Moraes", g: 0.3592, a: 0.5269, p: 0.2817, l: 0.5433, i: 0.085 },
  { n: "Valença", g: 0.4057, a: 0.1073, p: 0.4449, l: 1.0, i: 0.0705 },
  { n: "Varre-Sai", g: 0.3455, a: 0.0, p: 0.5887, l: 0.6181, i: 0.1751 },
  { n: "Vassouras", g: 0.4042, a: 0.1316, p: 0.5898, l: 0.6979, i: 0.1975 },
  { n: "Volta Redonda", g: 0.8433, a: 1.0, p: 1.0, l: 1.0, i: 0.3734 },
];

const indicadoresIFGF = [
  { key: "g", nome: "IFGF Geral" },
  { key: "a", nome: "Autonomia" },
  { key: "p", nome: "Gastos com Pessoal" },
  { key: "l", nome: "Liquidez" },
  { key: "i", nome: "Investimentos" },
];

// Malha municipal do RJ (IBGE via geodata-br), simplificada e pré-projetada
const MAPA_W = 640, MAPA_H = 457.4;
const rjGeo = [{"n":"Angra dos Reis","d":"M68.8,372.6 76.6,366.0 83.8,367.8 91.6,364.3 92.0,366.3 94.0,365.3 95.5,367.1 98.8,364.9 102.2,365.9 107.0,370.5 105.7,378.0 109.7,380.7 113.2,380.1 114.1,382.1 118.1,394.3 117.6,398.5 115.9,399.3 116.5,401.2 113.1,402.3 112.1,399.5 106.0,402.7 103.8,401.6 108.6,395.8 104.3,392.0 97.4,397.0 94.8,396.9 96.1,394.5 95.1,393.2 87.6,398.1 85.7,395.9 87.0,392.5 91.2,391.7 91.1,389.8 94.2,389.2 95.9,385.4 90.0,386.4 90.4,383.1 92.6,381.5 91.4,379.3 88.5,379.0 85.2,379.5 86.0,380.7 84.2,381.8 84.6,383.3 85.4,382.2 87.7,383.2 83.2,387.4 81.7,387.3 83.0,385.4 78.4,384.4 77.6,382.5 73.8,386.5 74.6,388.9 72.9,391.2 75.5,392.4 72.0,394.8 74.5,396.3 72.2,397.5 69.3,393.8 67.0,393.8 62.3,398.1 57.2,397.1 55.2,393.8 56.3,390.3 53.5,387.8 53.2,384.8 43.5,382.0 40.8,377.7 45.9,372.6 50.9,371.4 54.3,373.2 56.2,372.5 64.2,365.7 67.1,367.5 66.4,369.2 68.8,372.6ZM113.6,410.7 112.1,411.9 109.2,411.4 112.6,414.2 117.0,413.6 118.1,417.7 120.6,414.7 123.9,413.8 121.7,417.3 122.9,418.4 121.8,420.5 125.7,418.8 127.1,421.6 129.7,422.2 129.1,423.5 123.1,425.6 124.5,424.0 123.7,422.8 118.7,422.9 116.8,425.2 114.4,424.5 114.9,427.0 112.6,428.6 110.9,426.5 103.7,428.7 102.5,428.3 103.4,426.3 100.4,427.3 100.1,424.3 96.8,423.8 92.9,425.4 90.3,432.0 87.8,432.5 89.2,431.1 87.4,430.3 89.0,424.6 86.4,426.3 85.7,424.1 83.1,423.8 84.7,421.6 91.4,419.9 91.8,417.3 94.0,416.8 94.1,414.7 96.7,412.8 96.2,415.8 98.3,416.7 99.8,413.3 104.0,412.0 102.4,410.2 106.4,407.6 113.6,410.7Z","cx":63.2,"cy":383.9},{"n":"Aperibé","d":"M451.4,147.6 455.1,151.7 463.5,152.7 448.4,165.1 441.4,162.6 436.8,155.4 439.7,151.0 440.7,152.5 447.6,147.7 451.4,147.6Z","cx":447.5,"cy":159.0},{"n":"Araruama","d":"M440.5,314.1 448.6,331.7 443.0,336.5 434.5,352.4 428.8,356.1 431.1,364.7 429.6,366.2 431.5,368.8 423.9,375.2 425.3,378.2 422.8,380.1 422.8,382.1 410.4,381.4 407.1,374.4 409.9,363.8 397.2,361.7 398.4,345.5 401.8,346.4 405.8,343.8 410.1,344.2 416.0,340.8 419.3,329.8 421.8,326.8 427.4,323.9 431.5,324.1 431.5,322.3 435.0,321.2 440.5,314.1Z","cx":417.1,"cy":349.4},{"n":"Areal","d":"M297.8,250.4 299.7,253.7 292.1,259.6 292.7,263.0 290.9,263.5 289.4,266.9 287.0,265.5 283.6,270.6 279.0,272.0 277.7,269.1 281.3,252.8 280.1,250.0 289.7,252.2 292.2,249.3 301.2,245.8 300.5,248.6 297.8,250.4Z","cx":288.2,"cy":256.7},{"n":"Armação dos Búzios","d":"M480.8,351.7 483.3,352.5 484.4,349.8 488.3,349.5 491.0,346.6 490.6,349.0 492.3,349.5 490.2,350.9 489.9,353.3 488.2,352.4 489.3,354.9 484.4,353.9 481.3,357.1 481.6,360.0 479.7,359.2 475.1,361.3 468.8,354.4 474.4,345.4 477.4,345.7 480.8,351.7Z","cx":479.0,"cy":353.6},{"n":"Arraial do Cabo","d":"M431.5,368.8 432.0,370.6 434.3,369.7 435.9,371.3 442.1,370.4 455.4,380.9 464.4,381.1 465.0,383.3 466.7,383.3 466.8,386.0 469.8,384.0 468.7,385.7 470.7,385.8 469.7,387.4 468.0,386.5 467.1,387.7 468.9,389.8 468.0,392.3 464.6,387.6 457.8,384.9 422.8,382.1 422.8,380.1 425.3,378.2 423.9,375.2 431.5,368.8Z","cx":438.9,"cy":380.5},{"n":"Barra do Piraí","d":"M148.7,271.9 150.1,277.5 156.0,278.9 153.2,281.6 154.3,283.9 158.6,278.7 162.0,277.7 163.3,275.0 168.2,272.4 170.3,274.7 167.8,282.6 169.5,282.0 169.9,284.5 171.2,284.9 171.1,282.9 175.6,279.0 181.2,281.8 185.5,288.0 180.7,294.5 184.6,297.9 182.8,297.7 182.1,308.0 180.8,310.5 178.5,311.0 177.6,314.0 174.3,313.4 173.9,310.9 176.4,308.6 175.3,307.0 173.2,307.9 169.9,305.5 166.6,310.0 153.9,307.6 145.9,307.9 141.9,302.5 140.3,302.5 139.7,304.4 133.1,297.8 144.3,288.7 130.8,284.3 134.3,276.0 141.0,270.5 140.9,268.9 143.2,271.5 148.7,271.9Z","cx":161.8,"cy":291.6},{"n":"Barra Mansa","d":"M141.0,270.5 134.3,276.0 130.8,284.3 143.8,288.6 129.0,288.7 121.7,293.5 120.0,296.6 119.7,309.0 122.6,311.4 129.9,309.9 130.7,312.9 128.8,318.4 129.8,318.8 128.9,322.0 130.3,323.2 130.2,331.0 120.5,331.0 118.5,336.2 113.7,331.0 114.7,329.0 111.5,327.2 110.8,324.8 109.0,325.5 107.8,323.2 103.4,324.6 100.5,322.6 98.2,324.2 96.5,322.1 88.8,320.4 88.2,317.9 91.2,317.6 92.4,313.8 91.2,308.3 92.7,306.3 89.9,299.6 92.7,299.4 95.6,295.7 102.8,301.9 108.5,301.4 109.2,298.5 107.9,296.9 110.8,285.0 119.4,282.6 117.2,275.5 124.5,276.6 140.6,269.1 141.0,270.5Z","cx":105.8,"cy":304.1},{"n":"Belford Roxo","d":"M247.9,337.5 250.3,339.7 254.0,339.3 255.3,341.7 253.6,349.9 244.8,351.7 242.9,353.6 239.7,351.4 236.7,344.0 237.3,340.6 245.3,338.0 247.2,338.9 247.9,337.5Z","cx":246.0,"cy":346.9},{"n":"Bom Jardim","d":"M393.7,236.8 405.7,238.3 406.7,239.9 413.9,235.8 414.5,239.1 418.9,236.4 421.5,238.9 422.3,237.3 425.0,239.9 421.8,243.6 424.2,248.8 423.7,252.3 432.0,257.8 429.3,258.6 429.1,262.1 422.2,267.2 423.3,268.6 411.8,270.3 392.8,256.7 393.3,254.4 391.1,251.1 384.7,245.3 394.6,239.9 393.7,236.8Z","cx":408.9,"cy":253.4},{"n":"Bom Jesus do Itabapoana","d":"M514.6,17.7 517.0,18.9 514.6,22.6 515.8,23.4 515.3,27.9 512.9,29.3 516.2,33.6 517.3,39.6 515.3,43.4 516.4,45.5 514.7,47.2 516.3,49.7 515.1,51.4 514.3,50.3 513.8,53.2 515.5,54.4 513.2,59.6 517.8,60.3 516.0,63.2 518.3,63.8 519.7,61.7 522.9,64.9 525.1,63.4 526.5,66.6 530.6,66.8 533.1,68.8 537.4,67.7 540.9,73.5 542.1,71.8 548.1,74.3 549.6,72.3 551.8,74.0 554.9,73.4 556.4,77.0 557.0,81.3 551.8,85.2 551.2,87.4 547.4,88.5 537.3,96.3 534.2,90.5 529.0,87.2 530.4,86.2 528.6,84.4 521.9,86.6 518.1,79.9 514.5,80.3 515.7,77.2 514.0,77.3 515.9,73.3 514.4,71.1 508.8,72.6 508.4,68.1 502.1,66.7 502.9,61.8 497.9,62.8 500.0,59.6 494.1,51.4 496.5,51.0 504.1,36.9 504.0,34.8 500.5,31.8 509.7,19.6 514.6,17.7Z","cx":506.3,"cy":57.0},{"n":"Cabo Frio","d":"M448.7,313.0 448.5,314.6 450.4,314.5 449.9,316.2 454.5,315.7 454.9,317.6 457.0,318.1 460.1,317.6 460.2,315.5 463.3,317.0 464.2,315.5 466.7,318.3 468.3,317.4 469.4,319.8 471.5,318.7 470.5,333.6 472.1,341.7 474.4,345.4 468.8,354.4 475.1,361.3 472.4,366.1 473.3,370.4 469.9,373.4 468.3,372.4 466.3,374.0 464.4,381.1 455.4,380.9 450.1,376.5 452.8,374.8 452.6,369.5 454.2,368.4 463.5,369.1 466.4,356.9 463.3,350.3 448.6,331.7 440.5,314.1 444.8,313.0 445.5,314.8 447.1,313.5 446.1,312.1 448.7,313.0Z","cx":467.1,"cy":347.8},{"n":"Cachoeiras de Macacu","d":"M354.4,283.4 358.8,286.1 362.3,284.8 364.1,286.5 369.8,284.7 374.9,279.5 379.9,282.6 379.2,291.6 376.4,294.5 380.6,296.6 380.3,299.0 378.2,299.2 378.0,302.2 372.1,312.1 378.3,326.0 375.1,326.9 368.9,332.3 363.5,329.1 357.4,330.0 357.7,332.0 355.2,334.3 348.7,337.6 341.4,328.7 332.7,328.9 322.5,332.2 323.6,328.9 322.0,325.5 322.6,322.6 329.1,317.4 324.0,308.2 325.6,307.1 325.0,305.4 320.2,300.6 320.3,298.0 325.1,297.4 327.8,295.8 328.5,292.9 331.5,291.8 331.4,290.2 338.2,287.8 337.4,285.8 339.4,285.0 339.4,283.4 345.0,284.5 351.8,279.5 354.5,280.7 354.4,283.4Z","cx":349.2,"cy":310.2},{"n":"Cambuci","d":"M500.3,98.9 506.3,109.5 506.3,112.0 517.1,121.5 498.9,126.2 500.0,127.5 498.9,131.5 491.8,138.2 491.6,142.3 486.0,142.9 471.1,152.8 460.5,153.2 451.3,148.7 461.2,137.5 461.3,134.0 475.1,124.1 478.1,117.5 486.8,110.6 486.4,109.0 491.8,105.5 493.4,102.4 500.3,98.9Z","cx":488.3,"cy":125.2},{"n":"Carapebus","d":"M520.1,236.2 539.4,241.5 542.2,244.4 545.2,250.5 542.9,252.5 543.7,256.9 546.0,257.3 520.8,269.8 518.2,265.7 518.1,262.4 507.3,248.6 520.1,236.2Z","cx":527.7,"cy":254.7},{"n":"Comendador Levy Gasparian","d":"M252.2,218.9 255.7,218.3 255.9,219.9 258.8,220.6 267.3,218.3 271.1,222.6 274.4,221.5 274.6,223.6 279.8,221.0 286.1,223.4 272.5,228.9 265.2,235.2 265.9,227.0 262.8,230.3 251.1,226.6 251.0,217.7 252.2,218.9Z","cx":266.4,"cy":225.1},{"n":"Campos dos Goytacazes","d":"M571.5,75.8 579.9,79.8 581.4,79.0 581.3,80.4 588.6,84.7 586.1,86.6 582.1,96.2 592.4,95.8 588.9,103.6 594.3,107.3 589.6,112.9 591.4,119.4 590.4,127.4 592.4,129.4 595.6,129.2 589.9,138.4 603.4,146.5 600.9,161.3 603.9,162.4 608.8,159.5 610.8,160.5 609.4,163.3 601.7,169.1 605.0,173.1 604.1,177.7 608.6,184.9 607.0,193.5 607.9,196.5 612.2,201.7 636.2,202.2 637.1,211.6 635.4,217.1 631.4,221.0 611.6,233.1 609.2,232.9 609.2,234.4 607.0,233.6 606.8,235.0 604.2,233.9 601.1,235.5 599.1,234.0 591.1,234.6 587.8,228.6 559.8,212.5 556.3,217.4 548.8,219.9 544.6,226.4 532.6,225.3 522.9,227.4 519.0,225.8 512.5,232.2 510.8,232.2 507.1,220.9 508.6,220.2 508.7,221.3 516.4,214.0 515.7,207.3 518.1,198.2 504.7,197.4 503.2,195.4 496.5,197.4 488.5,196.1 488.3,193.1 496.2,188.0 501.2,181.4 503.5,180.8 503.5,179.1 511.3,180.0 510.6,178.5 513.1,175.4 519.1,171.3 520.3,166.1 527.0,162.2 528.8,159.1 536.9,158.1 545.2,150.7 550.9,155.7 553.2,159.9 563.7,148.7 567.4,147.0 568.3,140.3 572.8,135.2 572.4,130.2 565.8,122.9 565.8,118.8 559.8,111.4 543.1,116.9 537.3,96.3 547.4,88.5 551.2,87.4 551.8,85.2 557.0,81.3 556.4,77.0 562.1,79.4 565.0,76.5 571.5,75.8Z","cx":580.9,"cy":153.2},{"n":"Cantagalo","d":"M431.5,164.1 443.0,192.4 440.2,195.2 435.9,196.1 434.2,201.2 435.9,202.9 434.2,202.8 432.2,206.0 428.2,215.4 421.3,212.6 419.1,216.6 407.7,217.6 402.6,224.2 387.2,201.0 400.1,194.5 396.4,191.2 398.6,187.2 393.9,181.8 395.2,179.4 408.6,173.0 417.3,171.9 431.5,164.1Z","cx":420.4,"cy":193.4},{"n":"Cardoso Moreira","d":"M565.8,122.9 572.4,130.2 572.8,135.2 568.3,140.3 567.4,147.0 563.7,148.7 553.2,159.9 550.9,155.7 543.6,149.5 544.8,140.1 530.9,146.1 526.3,125.6 532.3,124.2 535.0,126.1 543.1,116.9 559.8,111.4 565.8,118.8 565.8,122.9Z","cx":549.8,"cy":137.6},{"n":"Carmo","d":"M398.5,189.1 396.4,191.2 400.1,194.5 398.7,195.8 396.5,195.5 386.9,201.8 384.3,200.7 382.6,202.3 381.2,208.7 379.3,209.7 381.1,216.5 379.0,217.0 377.0,220.4 356.3,210.2 359.4,208.1 362.1,202.3 361.3,195.0 373.0,191.4 375.8,190.0 375.4,188.6 395.2,179.4 393.9,181.8 398.6,187.2 397.3,187.7 398.5,189.1Z","cx":376.9,"cy":198.3},{"n":"Casimiro de Abreu","d":"M433.4,279.0 436.8,282.2 435.0,284.3 436.4,285.1 434.5,288.4 436.8,289.8 437.0,292.3 439.5,293.2 442.2,291.2 446.4,292.2 451.1,287.7 454.0,288.2 452.9,293.7 459.8,293.3 459.6,291.4 464.2,293.0 467.7,291.8 465.7,299.4 471.8,306.1 473.5,315.9 471.9,322.3 470.8,321.4 471.5,318.7 469.4,319.8 468.3,317.4 466.7,318.3 464.2,315.5 463.3,317.0 460.2,315.5 460.1,317.6 457.0,318.1 454.9,317.6 454.5,315.7 449.9,316.2 450.4,314.5 448.5,314.6 447.5,312.0 446.1,312.1 447.1,313.5 445.5,314.8 444.8,313.0 441.4,312.9 439.6,314.6 435.2,311.7 429.1,312.7 426.1,302.5 420.7,297.6 426.1,287.8 422.9,285.8 428.1,281.4 433.9,280.1 433.4,279.0Z","cx":445.8,"cy":301.0},{"n":"Conceição de Macabu","d":"M488.4,225.7 496.6,229.6 499.2,234.5 512.5,232.2 519.0,225.8 525.9,227.2 520.1,236.2 507.3,248.6 498.8,242.6 499.6,249.8 496.2,252.1 492.4,265.2 490.0,265.4 485.4,259.8 486.0,257.7 483.4,256.5 486.3,250.0 484.6,249.6 485.1,247.8 477.8,243.7 474.6,244.6 474.8,240.2 477.0,237.7 476.6,230.7 480.8,227.0 484.8,229.0 488.4,225.7Z","cx":490.7,"cy":246.2},{"n":"Cordeiro","d":"M418.4,216.7 419.5,222.6 421.7,222.4 421.9,224.3 419.4,229.3 421.6,231.6 426.4,232.9 424.9,233.9 425.3,235.9 426.9,235.8 426.9,238.4 423.6,237.1 421.5,238.9 418.9,236.4 414.5,239.1 413.9,235.8 402.6,224.2 407.7,217.6 418.4,216.7Z","cx":412.9,"cy":226.8},{"n":"Duas Barras","d":"M384.3,200.7 387.2,201.0 402.6,224.2 413.9,235.8 406.7,239.9 405.7,238.3 400.4,237.2 398.9,238.6 393.7,236.8 394.6,239.9 384.7,245.3 381.5,244.4 376.8,245.8 376.1,241.8 369.7,240.7 374.6,235.3 371.9,234.2 371.6,232.5 376.7,228.6 375.6,225.8 378.5,222.3 376.5,221.6 377.3,219.0 381.2,215.9 379.3,209.7 381.2,208.7 381.2,204.8 384.3,200.7Z","cx":389.9,"cy":223.3},{"n":"Duque de Caxias","d":"M259.2,300.6 271.4,308.6 270.5,310.0 267.3,309.6 265.0,315.6 265.9,317.9 270.8,316.1 275.7,326.4 270.8,335.7 272.5,341.3 270.9,342.7 272.9,345.4 270.4,347.1 269.0,346.3 267.9,348.8 265.2,349.8 266.0,350.5 262.2,354.2 260.5,359.0 257.4,357.3 253.6,357.9 255.3,341.7 254.0,339.3 250.3,339.7 242.1,332.4 245.1,326.3 240.6,324.5 239.9,322.6 244.2,317.6 243.6,314.8 240.8,312.8 246.4,308.5 247.6,309.6 253.4,308.3 259.2,300.6Z","cx":258.9,"cy":329.4},{"n":"Engenheiro Paulo de Frontin","d":"M216.1,305.7 210.1,316.2 206.1,309.5 204.2,317.4 198.1,320.1 194.6,318.5 196.4,315.1 195.2,314.0 191.2,315.7 191.4,313.7 193.8,312.3 190.7,304.2 212.4,297.3 214.2,298.0 216.1,305.7Z","cx":203.5,"cy":307.6},{"n":"Guapimirim","d":"M300.8,297.1 311.6,299.7 319.1,296.1 321.7,297.0 320.2,300.6 325.0,305.4 325.6,307.1 324.0,308.2 329.1,317.4 322.6,322.6 322.0,325.5 323.6,328.9 321.7,335.1 311.6,345.5 306.4,342.6 302.9,344.4 301.7,341.8 303.1,341.0 300.3,337.5 303.7,333.8 305.3,329.0 303.8,307.5 302.9,304.7 297.3,302.0 300.8,297.1Z","cx":315.3,"cy":320.0},{"n":"Iguaba Grande","d":"M438.2,367.3 437.8,371.5 434.3,369.7 432.0,370.6 429.6,366.2 431.1,364.7 428.8,356.1 437.0,354.2 438.8,361.5 441.4,362.5 438.2,367.3Z","cx":435.7,"cy":363.6},{"n":"Itaboraí","d":"M332.7,328.9 341.4,328.7 348.7,337.6 344.9,341.7 346.2,343.4 345.8,346.9 340.1,346.5 339.0,347.7 342.1,350.4 341.4,352.7 342.7,353.3 339.4,356.6 342.5,358.3 346.8,357.0 350.0,358.9 347.7,362.7 350.8,364.8 329.2,370.3 326.0,369.4 322.6,360.7 320.6,361.0 316.7,356.8 316.5,352.3 309.1,348.7 307.8,346.1 304.5,347.6 302.4,345.9 306.4,342.6 311.6,345.5 319.2,338.8 321.7,335.1 321.6,332.3 332.7,328.9Z","cx":326.0,"cy":349.6},{"n":"Itaguaí","d":"M179.6,338.7 187.3,341.7 185.2,344.9 182.0,346.1 182.8,349.7 181.2,352.2 177.7,352.9 176.8,358.1 183.5,363.0 197.7,368.9 185.4,371.4 185.2,373.1 178.2,375.8 178.1,378.2 174.6,378.5 173.6,377.1 174.0,378.9 171.9,380.2 168.4,378.4 171.3,377.4 171.2,375.7 165.7,376.1 163.4,379.0 163.3,372.6 162.1,371.9 155.0,373.9 154.5,371.4 159.3,365.6 158.9,363.9 162.4,362.8 164.3,359.7 170.9,357.2 175.1,352.6 171.0,350.7 171.9,345.3 179.6,338.7ZM198.9,400.2 198.6,402.2 167.6,405.4 166.7,400.5 178.2,403.5 198.9,400.2Z","cx":172.1,"cy":358.9},{"n":"Italva","d":"M537.8,97.1 543.1,116.9 535.0,126.1 532.3,124.2 526.3,125.6 530.9,146.1 521.7,132.1 512.0,123.0 517.1,121.5 506.3,112.0 515.6,105.9 518.4,106.7 524.1,102.1 526.9,104.4 527.6,102.2 531.7,104.4 531.1,101.3 537.8,97.1Z","cx":526.5,"cy":122.3},{"n":"Itaocara","d":"M480.3,146.3 480.3,171.7 477.9,169.5 468.4,172.3 466.6,174.3 467.9,177.0 465.0,176.0 463.0,179.1 461.9,178.3 459.9,180.5 460.5,182.1 455.6,182.3 455.1,184.3 453.3,183.7 451.6,186.3 449.8,186.3 451.2,188.5 450.5,190.8 447.9,188.5 446.5,189.5 446.9,192.3 443.0,192.4 431.5,164.1 438.2,161.6 448.4,165.1 463.5,152.7 465.9,152.1 468.5,153.8 480.3,146.3Z","cx":456.6,"cy":167.3},{"n":"Itaperuna","d":"M453.7,47.5 461.9,48.3 463.8,54.5 467.6,55.8 464.3,61.5 465.8,64.9 467.7,64.9 468.6,63.0 473.9,62.7 474.3,64.8 481.6,68.9 484.3,65.3 483.4,64.4 486.7,65.0 487.4,62.1 490.3,61.8 490.9,59.2 496.3,55.7 500.0,59.6 497.9,62.8 502.9,61.8 502.1,66.7 508.4,68.1 508.8,72.6 514.4,71.1 515.9,73.3 514.0,77.3 515.7,77.2 514.5,80.3 518.1,79.9 521.9,86.6 528.6,84.4 530.4,86.2 529.0,87.2 534.2,90.5 537.8,97.1 531.1,101.3 531.7,104.4 527.6,102.2 526.9,104.4 524.1,102.1 518.4,106.7 515.6,105.9 506.3,112.0 506.3,109.5 496.4,92.0 491.5,95.0 488.9,93.3 486.5,94.6 483.6,93.4 481.2,96.2 472.4,96.4 472.1,97.9 466.6,99.2 462.0,103.6 454.4,102.6 457.8,98.5 458.1,96.9 455.8,95.4 457.3,94.0 457.1,89.6 465.4,84.5 461.3,82.5 463.0,79.8 462.2,75.9 461.1,76.0 462.5,73.1 457.0,72.7 456.0,75.6 453.5,73.9 451.8,79.1 448.4,73.1 450.3,71.0 445.8,69.7 443.2,72.1 443.8,69.3 441.7,72.7 438.3,69.6 442.4,64.0 443.5,59.3 447.4,59.5 448.5,55.7 450.5,55.2 453.7,50.2 453.7,47.5Z","cx":488.9,"cy":79.5},{"n":"Itatiaia","d":"M49.0,273.6 52.8,275.4 55.8,273.9 55.2,279.7 54.2,281.2 50.9,279.9 44.7,285.0 65.6,293.9 66.6,297.5 51.9,306.8 50.8,309.5 52.8,310.8 47.4,316.5 44.6,314.8 42.7,311.1 44.4,303.7 37.1,283.9 42.8,276.1 49.0,273.6Z","cx":53.8,"cy":295.7},{"n":"Japeri","d":"M216.4,328.8 217.2,331.3 220.4,332.0 216.8,338.1 212.2,338.6 210.2,337.4 205.1,343.9 203.5,343.5 201.4,337.0 204.1,332.7 203.2,331.5 200.4,332.9 198.4,331.7 199.3,326.3 201.1,325.1 206.1,329.9 214.8,324.0 214.1,328.0 216.4,328.8Z","cx":210.7,"cy":334.9},{"n":"Laje do Muriaé","d":"M438.8,69.3 441.7,72.7 442.4,69.6 443.8,69.3 443.2,72.1 445.8,69.7 450.3,71.0 448.4,73.1 451.8,79.1 453.5,73.9 456.0,75.6 457.0,72.7 462.5,73.1 461.1,76.0 462.2,75.9 463.0,79.8 461.3,82.5 465.4,84.5 457.1,89.6 457.3,94.0 455.8,95.4 458.1,96.9 455.0,102.0 451.6,100.6 448.9,95.6 447.0,95.2 443.7,97.3 437.9,96.9 433.7,100.8 431.7,98.6 433.7,90.0 439.3,85.3 439.0,80.8 437.2,80.4 438.5,76.9 436.3,72.7 438.8,69.3Z","cx":448.7,"cy":87.5},{"n":"Macaé","d":"M477.8,243.7 483.1,245.5 485.1,247.8 484.6,249.6 486.3,250.0 483.4,256.5 486.0,257.7 485.4,259.8 490.0,265.4 492.4,265.2 496.2,252.1 499.6,249.8 498.8,242.6 507.3,248.6 518.1,262.4 518.2,265.7 520.8,269.8 508.1,279.5 506.9,282.8 508.0,285.4 499.9,290.3 493.9,288.8 492.8,290.5 490.2,290.7 485.3,287.3 479.7,286.0 480.3,283.4 479.0,286.0 475.8,285.2 470.0,287.1 466.2,285.4 462.5,288.0 458.9,293.6 452.9,293.7 454.0,288.2 451.1,287.7 446.4,292.2 442.2,291.2 439.5,293.2 437.0,292.3 436.8,289.8 434.5,288.4 436.4,285.1 435.1,282.8 436.8,282.2 434.9,277.1 426.9,272.6 429.0,271.6 429.8,268.7 444.3,254.9 455.1,252.4 454.3,249.4 457.8,245.8 465.8,244.7 473.7,239.0 474.6,244.6 477.8,243.7Z","cx":475.3,"cy":267.2},{"n":"Macuco","d":"M421.3,212.6 428.2,215.4 430.6,212.4 432.7,212.8 434.3,216.4 434.5,218.8 432.2,222.2 429.4,222.2 431.1,223.1 427.8,225.2 426.4,232.9 421.6,231.6 419.4,229.3 421.9,224.3 421.7,222.4 419.5,222.6 418.4,216.7 420.0,213.8 421.2,215.0 421.3,212.6Z","cx":426.2,"cy":222.8},{"n":"Magé","d":"M294.7,302.6 302.9,304.7 304.3,309.4 305.3,329.0 303.7,333.8 299.2,338.2 293.5,336.1 289.8,337.8 290.1,339.1 288.9,338.0 286.7,342.5 282.7,341.3 271.5,344.3 270.9,342.7 272.5,341.3 270.8,335.7 275.7,326.4 270.8,316.1 275.5,315.7 287.5,310.3 289.9,310.8 295.8,305.7 294.7,302.6Z","cx":289.1,"cy":321.3},{"n":"Mangaratiba","d":"M143.9,368.0 145.5,369.6 147.9,369.0 150.0,372.5 155.0,373.9 163.3,372.6 163.4,379.0 144.1,381.9 139.7,386.5 139.1,389.5 137.0,390.0 135.6,389.4 137.9,386.1 137.1,382.0 131.1,385.6 132.4,388.0 131.4,391.2 129.0,392.1 127.6,395.4 119.8,399.9 119.1,398.6 117.6,398.5 118.1,394.3 113.2,380.1 115.9,380.5 118.1,375.3 119.3,375.6 125.5,368.4 130.4,372.2 138.0,372.1 143.9,368.0ZM143.3,407.1 146.1,402.7 152.0,399.7 155.8,402.8 163.4,404.6 164.6,402.9 164.1,400.1 159.7,397.4 159.0,396.3 166.7,400.5 167.6,405.4 151.8,408.2 146.8,410.7 143.5,409.4 143.3,407.1ZM159.4,385.0 159.0,381.2 163.5,380.0 163.5,383.6 161.5,385.4 159.4,385.0Z","cx":124.3,"cy":383.8},{"n":"Maricá","d":"M351.1,364.9 353.7,367.1 362.6,367.9 359.7,371.4 359.4,376.9 365.6,376.9 366.6,381.7 359.7,383.2 357.5,386.1 353.9,385.0 320.7,388.3 303.6,387.6 303.8,385.8 314.7,376.6 314.8,373.8 326.0,369.4 332.4,370.4 340.5,366.4 345.5,365.2 348.2,366.5 351.1,364.9Z","cx":337.1,"cy":375.2},{"n":"Mendes","d":"M193.8,312.3 191.4,313.7 191.2,315.7 181.9,321.7 181.8,323.6 181.0,316.7 179.1,313.7 177.6,314.0 178.5,311.0 180.8,310.5 182.1,308.0 182.8,297.7 185.5,298.4 186.8,301.8 190.7,304.2 193.8,312.3Z","cx":186.4,"cy":310.8},{"n":"Mesquita","d":"M242.9,353.6 230.9,364.8 226.9,360.5 229.9,355.6 236.9,351.7 242.9,353.6Z","cx":233.3,"cy":358.1},{"n":"Miguel Pereira","d":"M227.3,290.7 235.9,295.3 235.6,299.2 237.4,300.6 250.2,295.9 255.0,297.6 258.8,296.5 260.4,297.9 253.4,308.3 247.6,309.6 246.4,308.5 239.2,311.6 234.6,309.7 227.3,313.7 224.4,317.4 216.6,316.7 216.4,318.4 212.5,319.1 206.0,325.8 206.1,329.9 201.1,325.1 210.1,317.0 216.1,305.7 217.1,309.5 219.5,296.4 221.0,294.8 223.2,295.5 225.2,293.4 224.7,292.0 227.3,290.7Z","cx":223.2,"cy":310.6},{"n":"Miracema","d":"M443.7,97.3 448.9,95.6 448.8,97.2 454.4,102.6 462.0,103.6 464.7,101.7 463.8,105.7 465.6,107.5 465.3,110.0 460.8,117.6 457.2,120.5 452.8,121.0 450.1,124.8 437.3,123.8 425.4,116.7 425.5,112.4 426.7,111.7 427.8,113.5 431.2,112.3 431.5,110.5 429.1,109.3 432.8,105.8 431.8,101.8 437.9,96.9 443.7,97.3Z","cx":448.1,"cy":110.2},{"n":"Natividade","d":"M484.6,29.0 483.9,33.4 487.6,36.6 492.7,36.1 493.8,32.7 496.7,33.8 498.2,32.8 500.9,34.8 500.0,36.9 502.6,39.1 496.5,51.0 494.1,51.4 496.3,55.7 490.9,59.2 490.3,61.8 487.4,62.1 486.7,65.0 483.4,64.4 484.3,65.3 481.6,68.9 474.3,64.8 473.9,62.7 468.6,63.0 467.7,64.9 465.8,64.9 464.3,61.5 467.6,55.8 463.8,54.5 461.9,48.3 456.4,45.5 469.8,43.8 469.8,35.8 473.3,33.9 478.0,34.4 478.5,30.8 480.2,32.1 484.6,29.0Z","cx":479.8,"cy":49.7},{"n":"Nilópolis","d":"M243.7,360.1 232.9,366.2 230.9,364.8 240.5,356.2 243.7,360.1Z","cx":236.6,"cy":362.4},{"n":"Niterói","d":"M302.6,371.0 306.1,373.7 309.0,373.1 310.6,378.1 314.8,375.3 303.8,385.8 305.1,388.6 299.0,389.7 299.9,388.0 298.6,386.3 289.4,384.6 288.3,381.9 285.3,382.0 287.2,379.3 289.8,381.8 291.9,379.8 291.7,377.8 289.3,378.0 288.4,376.1 286.1,377.2 285.1,375.7 287.1,374.3 285.7,371.7 288.7,371.9 290.6,367.7 302.6,371.0Z","cx":301.5,"cy":378.7},{"n":"Nova Friburgo","d":"M384.7,245.3 391.1,251.1 393.3,254.4 392.8,256.7 411.8,270.3 423.3,268.6 426.9,271.1 428.5,270.5 427.6,273.5 434.9,277.1 436.6,281.8 433.4,279.0 433.9,280.1 428.1,281.4 422.9,285.8 424.8,287.7 418.8,291.7 412.4,292.5 410.6,290.8 406.7,291.1 392.3,295.8 386.9,293.3 381.7,297.5 376.4,294.5 379.2,291.6 380.4,285.0 378.2,280.4 374.9,279.5 369.8,284.7 364.1,286.5 362.3,284.8 358.8,286.1 354.4,283.4 354.5,280.7 351.8,279.5 351.7,276.0 353.3,274.7 351.9,272.6 354.3,268.7 353.9,264.1 360.4,259.3 363.0,253.8 365.3,254.3 365.9,250.0 370.4,251.6 373.8,248.5 378.1,248.4 381.5,244.4 384.7,245.3Z","cx":389.8,"cy":270.8},{"n":"Nova Iguaçu","d":"M234.6,309.7 241.7,311.0 240.8,312.8 243.6,314.8 244.2,317.6 239.9,322.6 240.6,324.5 245.1,326.3 242.1,332.4 247.9,336.5 247.2,338.9 245.3,338.0 237.3,340.6 236.7,344.0 240.4,352.0 236.9,351.7 231.2,354.5 229.7,357.6 227.3,358.1 226.9,360.5 211.7,364.4 210.8,368.2 202.6,367.4 197.7,368.9 198.1,366.9 205.8,362.3 204.1,354.6 206.0,354.5 205.4,352.7 207.7,348.5 216.3,350.2 220.3,349.1 219.2,342.7 223.7,339.0 216.9,336.2 220.4,332.0 218.3,332.1 216.4,328.8 214.1,328.0 214.8,324.0 206.1,329.9 206.0,325.8 212.5,319.1 216.4,318.4 216.6,316.7 224.4,317.4 227.3,313.7 234.6,309.7Z","cx":231.3,"cy":339.8},{"n":"Paracambi","d":"M210.1,317.0 199.3,326.3 198.4,331.7 191.4,329.7 183.8,340.5 181.8,338.8 174.7,337.7 174.4,334.3 170.7,331.0 181.8,323.6 181.9,321.7 188.7,316.2 192.6,316.2 195.2,314.0 196.4,315.1 194.6,318.5 198.1,320.1 204.2,317.4 206.1,309.5 210.1,317.0Z","cx":190.3,"cy":325.0},{"n":"Paraíba do Sul","d":"M250.6,217.7 251.1,226.6 262.8,230.3 265.9,227.0 265.2,235.2 267.5,241.3 274.7,248.3 275.2,252.4 280.1,250.0 281.5,251.0 278.5,269.5 269.0,271.8 268.0,270.4 264.5,273.5 261.3,281.0 253.8,269.0 241.8,255.1 236.3,227.6 250.6,217.7Z","cx":257.7,"cy":249.2},{"n":"Paraty","d":"M53.2,384.8 53.5,387.8 56.3,390.3 55.7,396.3 60.1,397.6 53.5,399.6 47.1,403.9 48.5,402.0 47.6,400.8 35.9,402.2 31.3,410.8 30.9,414.1 32.7,415.1 30.9,415.9 31.8,418.5 29.6,422.0 31.0,423.4 29.0,423.8 27.9,425.2 29.6,425.4 27.2,428.2 29.4,431.4 28.7,433.8 29.8,433.8 35.8,428.9 37.4,429.2 38.7,425.7 44.3,428.5 42.4,432.1 40.3,431.2 41.0,429.8 38.7,431.7 36.8,430.4 36.6,432.8 38.0,432.7 35.1,433.3 35.2,434.9 31.9,437.2 36.7,436.3 38.7,434.1 44.8,433.9 37.9,444.7 40.6,445.6 39.5,443.8 47.6,434.0 53.5,432.7 49.6,439.6 55.3,441.0 57.2,439.7 62.8,444.8 61.7,445.7 58.5,443.4 56.6,446.4 54.1,446.4 53.2,450.8 49.4,455.9 46.2,457.3 45.9,454.1 44.1,454.5 43.1,452.6 41.5,454.7 42.2,452.3 40.4,451.2 36.9,452.4 37.3,453.9 34.6,451.7 32.9,454.7 30.4,452.6 27.8,453.8 25.6,455.9 26.8,457.4 22.6,455.7 21.0,452.8 18.0,452.2 16.6,445.4 13.3,442.5 10.1,444.0 8.5,437.8 2.3,436.5 0.0,432.1 2.6,424.9 10.7,420.5 10.3,417.9 12.7,414.8 11.8,412.1 13.0,410.2 11.4,408.5 12.6,402.3 13.9,401.5 15.6,394.5 14.0,392.5 15.7,389.6 21.8,389.2 23.7,383.5 28.5,380.4 32.7,381.5 35.0,378.3 37.4,380.0 40.8,377.7 43.5,382.0 53.2,384.8Z","cx":21.2,"cy":416.9},{"n":"Paty do Alferes","d":"M250.6,265.4 261.3,281.0 255.8,284.4 252.4,290.1 248.6,290.9 246.0,295.0 247.1,296.4 245.0,298.0 237.4,300.6 235.6,299.2 235.9,295.3 227.4,290.8 224.7,287.6 228.0,282.7 223.9,275.8 225.1,271.7 250.6,265.4Z","cx":242.3,"cy":283.6},{"n":"Petrópolis","d":"M302.7,252.8 304.5,256.2 308.0,256.8 310.7,260.9 309.1,266.0 304.7,268.0 305.3,269.5 301.0,271.8 299.5,274.5 301.9,274.8 303.3,276.7 301.9,277.7 304.1,279.5 301.9,282.0 302.9,286.1 301.1,290.2 303.8,294.5 303.2,297.0 299.6,297.9 298.2,301.5 294.7,302.6 295.8,305.7 289.9,310.8 287.5,310.3 275.5,315.7 265.9,317.9 265.0,315.6 267.3,309.6 270.5,310.0 271.4,308.6 258.1,300.4 260.4,297.9 258.8,296.5 247.9,296.7 246.0,295.0 246.6,293.5 248.6,290.9 252.4,290.1 255.8,284.4 261.3,281.0 264.5,273.5 268.0,270.4 269.0,271.8 273.7,269.6 277.9,269.9 279.0,272.0 282.8,271.2 286.5,265.8 289.4,266.9 290.9,263.5 292.7,263.0 292.1,259.6 294.2,257.1 299.7,253.7 302.7,252.8Z","cx":279.0,"cy":285.3},{"n":"Pinheiral","d":"M144.9,307.4 158.8,308.5 151.8,316.0 147.4,313.4 145.3,319.1 133.6,321.1 135.8,314.3 139.3,311.6 140.3,302.5 141.9,302.5 144.9,307.4Z","cx":146.6,"cy":312.5},{"n":"Piraí","d":"M168.3,306.1 175.3,307.0 176.4,308.6 173.9,310.9 174.3,313.4 179.1,313.7 181.0,316.7 181.8,323.6 170.7,331.0 174.4,334.3 174.7,337.7 179.6,338.7 171.9,345.3 171.0,350.7 175.1,352.6 170.9,357.2 164.3,359.7 161.6,353.6 163.2,349.9 159.7,348.5 164.1,345.0 163.9,340.3 158.9,342.4 157.2,339.9 155.1,342.0 153.5,341.5 154.0,339.3 151.5,337.4 151.1,333.6 149.3,333.4 143.8,337.7 141.3,335.7 143.1,331.1 141.8,329.6 136.8,329.4 133.1,332.2 132.0,336.9 131.6,330.7 130.2,331.0 133.6,321.1 145.3,319.1 147.4,313.4 151.8,316.0 158.8,308.5 166.6,310.0 168.3,306.1Z","cx":157.6,"cy":332.8},{"n":"Porciúncula","d":"M498.6,4.3 498.1,5.7 501.6,5.9 500.5,7.2 506.8,6.3 491.4,18.5 485.7,20.0 485.9,24.2 489.2,28.3 485.5,28.2 480.2,32.1 478.5,30.8 478.0,34.4 473.3,33.9 469.8,35.8 469.8,43.8 456.4,45.5 449.6,42.1 445.6,38.0 447.7,34.5 451.4,34.3 454.9,30.2 459.5,30.7 466.4,28.4 474.0,30.1 473.5,27.8 475.5,26.8 475.9,22.6 478.3,19.4 477.6,17.8 482.2,13.0 480.7,11.3 481.9,5.4 486.3,5.7 490.5,0.4 492.7,0.0 498.6,4.3Z","cx":480.8,"cy":23.4},{"n":"Porto Real","d":"M100.0,288.4 92.7,299.4 89.9,299.6 90.9,303.4 87.5,303.4 83.9,298.1 87.8,293.3 87.5,289.8 91.4,290.0 94.7,286.9 100.0,288.4Z","cx":90.5,"cy":295.7},{"n":"Quatis","d":"M115.1,259.2 118.7,260.9 117.2,264.6 120.8,266.5 120.8,270.2 119.0,272.0 120.7,275.2 117.2,275.5 119.4,282.6 110.8,285.0 107.9,296.9 109.2,298.5 108.5,301.4 105.4,302.7 95.6,295.7 100.0,288.4 90.9,286.4 89.2,283.7 89.3,280.3 90.6,279.8 91.3,275.5 100.4,273.3 102.0,270.5 105.8,273.0 102.4,269.9 102.3,264.2 103.9,262.9 106.4,263.8 110.0,260.3 111.9,261.3 115.1,259.2Z","cx":104.1,"cy":281.4},{"n":"Queimados","d":"M216.9,336.2 223.8,338.4 219.2,342.7 220.3,349.1 216.3,350.2 207.7,348.5 205.4,352.7 206.0,354.5 204.1,354.6 202.5,346.5 208.1,338.6 210.2,337.4 212.2,338.6 216.8,338.1 216.9,336.2Z","cx":211.7,"cy":344.6},{"n":"Quissamã","d":"M559.8,212.5 587.8,228.6 591.1,234.6 599.1,234.0 601.1,235.5 601.5,234.2 606.8,235.0 607.0,233.6 609.2,234.4 609.2,232.9 611.6,233.1 607.3,236.4 593.5,242.9 545.3,258.0 543.7,256.9 542.9,252.5 545.2,250.5 539.4,241.5 520.1,236.2 525.2,227.5 532.6,225.3 544.6,226.4 548.8,219.9 556.3,217.4 559.8,212.5Z","cx":560.7,"cy":235.2},{"n":"Resende","d":"M97.2,259.8 101.8,259.8 102.4,269.9 106.1,272.4 102.0,270.5 100.4,273.3 91.3,275.5 90.6,279.8 89.3,280.3 89.2,283.7 93.5,287.8 91.4,290.0 87.5,289.8 87.8,293.3 83.9,298.1 87.5,303.4 92.2,304.8 91.2,308.3 92.4,313.8 91.2,317.6 88.2,317.9 88.8,320.4 86.6,325.0 85.8,321.2 84.4,320.7 86.1,319.3 80.9,317.7 78.0,320.4 79.8,323.0 78.5,323.9 74.7,322.2 68.8,325.2 66.0,323.3 61.8,329.6 60.9,327.8 57.6,329.0 59.1,325.9 55.0,323.3 53.0,324.5 51.4,322.8 49.6,327.0 46.7,323.8 45.4,325.4 43.4,323.5 41.4,324.1 39.6,323.1 40.2,315.3 37.0,313.8 34.4,315.7 35.6,311.8 30.6,306.8 28.2,307.4 29.1,305.0 26.9,302.1 27.9,299.3 25.3,293.2 21.8,289.9 13.0,288.3 15.5,285.1 23.5,283.1 26.8,280.3 29.8,282.6 36.2,282.6 44.4,303.7 42.7,311.1 44.6,314.8 47.4,316.5 52.8,310.8 50.8,309.5 51.9,306.8 60.9,302.3 61.6,300.0 65.7,299.1 66.6,296.0 65.6,293.9 47.1,287.0 44.7,285.0 46.8,282.6 50.9,279.9 54.2,281.2 56.2,275.4 69.6,266.3 70.4,262.2 77.2,261.7 80.4,262.5 81.6,264.9 86.0,261.4 92.3,262.9 97.2,259.8Z","cx":76.3,"cy":295.0},{"n":"Rio Bonito","d":"M380.1,325.8 384.2,327.8 384.1,343.1 389.0,344.4 395.3,343.4 398.4,345.5 397.2,361.7 392.3,361.7 391.3,363.0 385.1,361.8 383.3,359.3 375.5,358.5 366.7,364.3 365.0,367.2 364.9,365.6 362.5,366.2 361.1,365.4 363.1,362.3 360.9,359.6 362.6,357.5 358.1,356.3 359.9,352.4 357.8,351.0 356.3,345.2 348.7,337.6 355.2,334.3 357.7,332.0 357.4,330.0 363.5,329.1 368.9,332.3 375.1,326.9 380.1,325.8Z","cx":377.6,"cy":348.3},{"n":"Rio Claro","d":"M136.8,329.4 143.1,331.1 141.3,335.7 143.8,337.7 149.3,333.4 151.1,333.6 151.5,337.4 154.0,339.3 153.5,341.5 155.1,342.0 157.2,339.9 158.9,342.4 163.9,340.3 164.1,345.0 159.7,348.5 163.2,349.9 161.6,353.6 164.3,360.6 158.9,363.9 159.3,365.6 154.7,372.9 150.0,372.5 147.9,369.0 145.5,369.6 143.9,368.0 138.0,372.1 130.4,372.2 126.3,368.1 118.1,375.3 115.9,380.5 109.7,380.7 105.4,377.4 106.8,369.9 102.2,365.9 98.8,364.9 95.5,367.1 92.9,365.5 96.4,362.5 100.2,363.3 102.1,358.5 104.9,358.0 105.6,356.1 102.9,355.2 102.8,351.8 105.8,349.8 105.2,348.8 107.8,345.9 111.8,345.7 111.5,342.9 115.6,341.4 120.5,331.0 131.6,330.7 130.9,335.2 132.0,336.9 133.1,332.2 136.8,329.4Z","cx":132.4,"cy":354.4},{"n":"Rio das Flores","d":"M212.1,226.2 212.3,229.5 215.8,232.6 223.8,227.5 224.8,230.2 232.2,229.8 236.3,227.6 241.8,255.1 237.2,258.7 231.4,254.9 229.1,260.9 223.7,258.6 221.8,265.7 216.1,263.7 210.9,267.4 211.7,263.5 208.4,262.5 208.4,256.8 201.5,253.0 200.4,248.8 197.7,246.3 199.7,244.4 199.1,230.1 202.4,228.7 207.6,231.5 207.8,229.6 212.1,226.2Z","cx":219.7,"cy":247.6},{"n":"Rio das Ostras","d":"M480.3,283.4 479.7,286.0 485.3,287.3 490.2,290.7 492.8,290.5 493.9,288.8 499.9,290.3 494.2,295.5 492.6,300.9 487.9,302.6 481.1,311.6 479.3,309.9 477.1,310.6 473.5,315.9 471.8,306.1 465.7,299.4 467.7,291.8 464.2,293.0 459.6,291.4 466.2,285.4 470.0,287.1 475.8,285.2 479.0,286.0 480.3,283.4Z","cx":479.6,"cy":300.2},{"n":"Rio de Janeiro","d":"M262.6,360.9 267.6,365.1 268.7,371.1 273.4,369.7 274.7,371.0 273.5,374.0 276.6,373.1 280.5,374.6 278.6,374.5 281.9,377.5 279.3,378.1 280.1,381.9 278.1,383.6 279.8,384.3 282.8,381.9 283.0,384.0 280.7,384.7 281.6,386.4 277.8,387.8 277.9,390.2 271.3,390.7 259.1,395.7 259.5,394.8 257.6,392.9 251.6,389.6 248.1,388.1 245.1,388.1 243.3,389.8 241.7,388.4 241.8,390.1 241.3,389.4 239.8,390.5 241.1,391.4 243.9,390.7 244.1,391.8 245.4,388.9 250.4,389.1 251.3,390.0 249.2,390.1 251.0,391.4 248.8,391.6 254.7,392.1 259.3,394.9 235.2,396.6 231.1,399.4 227.0,398.9 224.7,401.1 220.2,401.8 217.3,406.2 214.3,405.7 214.9,403.9 210.6,401.9 198.6,402.2 198.9,400.2 207.4,398.3 214.9,402.2 215.0,404.1 216.8,401.3 214.3,401.5 209.8,396.9 201.1,393.3 197.2,389.4 195.1,391.4 181.2,378.9 178.1,378.2 178.2,375.8 185.2,373.1 185.4,371.4 202.6,367.4 210.8,368.2 211.7,364.4 213.6,363.4 226.9,360.5 232.9,366.2 239.9,361.3 249.0,358.1 257.4,357.3 261.3,360.5 262.9,359.5 262.6,360.9ZM278.5,358.7 278.9,361.1 280.5,361.2 277.3,363.5 276.2,361.2 273.4,360.3 268.0,363.4 264.5,359.2 267.7,358.9 270.1,354.6 276.5,356.9 278.9,353.5 281.8,353.8 278.5,358.7ZM269.5,365.7 270.8,367.6 273.4,367.9 271.6,368.3 272.3,370.0 268.8,368.5 268.0,364.1 271.3,364.9 271.3,366.1 270.8,364.9 269.5,365.7Z","cx":231.3,"cy":380.4},{"n":"Santa Maria Madalena","d":"M477.9,191.7 482.2,195.2 487.2,195.7 487.7,193.7 486.3,193.3 488.3,193.1 488.5,196.1 496.5,197.4 503.2,195.4 504.7,197.4 518.1,198.2 515.7,207.3 516.4,214.0 508.7,221.3 508.6,220.2 507.1,220.9 510.8,232.2 499.2,234.5 496.6,229.6 494.8,229.6 491.7,226.2 488.4,225.7 484.8,229.0 480.8,227.0 476.6,230.7 470.0,227.2 461.7,227.5 453.5,225.3 453.9,222.5 448.1,222.9 448.7,218.4 454.3,212.8 453.7,209.4 455.7,210.2 456.7,208.8 453.7,204.2 457.7,205.8 457.6,202.3 460.0,202.7 469.3,188.4 475.0,182.5 477.9,191.7Z","cx":486.0,"cy":208.0},{"n":"Santo Antônio de Pádua","d":"M437.3,123.8 450.1,124.8 452.8,121.0 457.2,120.5 460.8,117.6 466.5,118.1 468.6,116.7 471.2,121.7 469.0,125.0 470.6,127.2 469.7,128.5 461.3,134.0 461.2,137.5 453.2,147.2 448.5,147.3 440.7,152.5 439.7,151.0 436.8,155.4 441.4,162.6 438.2,161.6 426.0,166.9 426.2,161.2 424.1,161.0 424.1,159.2 421.1,156.5 415.2,157.7 413.7,154.4 410.0,153.9 412.3,151.4 410.1,150.3 411.4,147.2 417.2,141.6 416.3,139.9 419.9,138.2 420.3,134.4 423.6,134.2 425.6,130.0 429.0,128.2 426.5,123.8 422.6,122.2 425.4,116.7 437.3,123.8Z","cx":434.9,"cy":144.4},{"n":"São Francisco de Itabapoana","d":"M592.8,80.3 601.9,85.1 603.2,82.9 604.2,84.4 607.6,84.5 611.1,81.2 613.6,81.9 617.9,79.8 626.2,86.3 628.9,84.7 631.9,85.7 633.8,91.7 636.5,90.8 636.1,92.2 640.0,94.8 639.4,104.9 621.5,129.2 621.4,137.1 623.7,144.1 626.8,147.4 631.3,148.9 624.3,150.0 620.7,152.3 614.8,160.4 608.8,159.5 603.9,162.4 600.9,161.3 603.4,146.5 589.9,138.4 595.6,129.2 592.4,129.4 590.4,127.4 591.4,119.4 589.6,112.9 594.3,107.3 588.9,103.6 592.4,95.8 582.1,96.2 586.1,86.6 588.6,84.7 588.1,83.0 590.3,83.0 592.8,80.3Z","cx":608.3,"cy":123.4},{"n":"São Fidélis","d":"M523.3,134.6 530.9,146.1 544.8,140.1 543.6,149.5 544.8,151.6 540.4,153.9 536.9,158.1 528.8,159.1 527.0,162.2 520.3,166.1 519.1,171.3 513.1,175.4 510.6,178.5 511.3,180.0 503.5,179.1 503.5,180.8 501.2,181.4 496.2,188.0 486.3,193.3 487.7,193.7 487.2,195.7 480.3,194.5 477.9,191.7 475.0,182.5 478.0,176.8 480.6,176.3 481.4,171.8 480.3,171.7 480.3,146.3 486.0,142.9 491.6,142.3 491.8,138.2 498.9,131.5 500.0,127.5 498.9,126.2 512.0,123.0 523.3,134.6Z","cx":504.1,"cy":160.7},{"n":"São Gonçalo","d":"M307.8,346.1 309.1,348.7 316.5,352.3 316.7,356.8 320.6,361.0 322.6,360.7 326.0,369.4 314.8,373.8 314.8,375.3 310.6,378.1 309.0,373.1 306.1,373.7 302.6,371.0 290.6,367.7 291.8,362.4 296.7,358.0 294.6,357.5 294.2,355.3 296.3,352.1 307.8,346.1Z","cx":307.8,"cy":361.7},{"n":"São João da Barra","d":"M631.3,148.9 628.7,168.1 636.2,202.2 612.2,201.7 607.0,194.4 608.6,184.9 604.1,177.7 605.0,173.1 601.7,169.1 609.4,163.3 610.8,160.5 616.1,159.8 620.7,152.3 624.3,150.0 631.3,148.9Z","cx":617.4,"cy":175.4},{"n":"São João de Meriti","d":"M253.6,349.9 253.6,357.9 243.7,360.1 240.5,356.2 244.8,351.7 253.6,349.9Z","cx":248.1,"cy":354.0},{"n":"São José de Ubá","d":"M496.4,92.0 500.3,98.9 493.4,102.4 491.8,105.5 486.4,109.0 486.8,110.6 478.1,117.5 475.1,124.1 471.4,126.8 469.0,125.0 471.2,121.7 470.0,117.6 460.8,117.6 465.3,110.0 465.6,107.5 463.8,105.7 466.6,99.2 470.2,99.1 472.4,96.4 481.2,96.2 483.6,93.4 486.5,94.6 488.9,93.3 491.5,95.0 496.4,92.0Z","cx":475.9,"cy":109.5},{"n":"São José do Vale do Rio Preto","d":"M312.4,232.7 319.0,235.4 321.2,234.6 322.5,236.7 328.2,235.1 329.4,239.5 327.9,244.5 329.5,246.1 335.3,242.3 336.7,242.9 341.1,238.7 348.5,238.7 343.9,240.0 337.6,245.8 328.8,250.6 324.8,250.5 322.6,256.6 319.5,256.7 310.6,263.6 310.7,260.9 308.0,256.8 304.5,256.2 302.7,252.8 299.6,253.6 305.2,242.9 314.5,241.3 311.8,234.5 312.4,232.7Z","cx":317.7,"cy":248.3},{"n":"São Pedro da Aldeia","d":"M463.3,350.3 466.4,356.9 463.5,369.1 454.2,368.4 452.6,369.5 451.6,376.7 442.1,370.4 437.8,371.5 438.2,367.3 441.4,362.5 438.8,361.5 437.0,354.2 428.8,356.1 434.5,352.4 443.0,336.5 448.6,331.7 463.3,350.3Z","cx":448.9,"cy":353.3},{"n":"São Sebastião do Alto","d":"M477.9,169.5 481.4,171.8 480.6,176.3 478.0,176.8 476.9,180.6 469.3,188.4 460.0,202.7 457.6,202.3 457.7,205.8 453.7,204.2 456.7,208.8 455.7,210.2 453.7,209.4 454.3,212.8 448.7,218.4 448.9,220.5 446.1,221.4 444.9,218.8 441.9,217.9 439.8,220.2 433.7,218.2 434.3,216.4 432.7,212.8 430.6,212.4 430.6,209.0 434.2,202.8 435.9,202.9 434.2,201.2 435.9,196.1 440.2,195.2 443.0,192.4 446.9,192.3 446.5,189.5 447.9,188.5 450.5,190.8 451.2,188.5 449.8,186.3 451.6,186.3 453.3,183.7 455.1,184.3 455.6,182.3 460.5,182.1 459.9,180.5 461.9,178.3 463.0,179.1 465.0,176.0 467.9,177.0 466.6,174.3 468.4,172.3 477.9,169.5Z","cx":451.4,"cy":195.6},{"n":"Sapucaia","d":"M355.9,215.9 356.8,217.4 353.7,221.6 353.4,226.3 349.1,225.3 351.3,232.3 350.4,233.9 346.5,234.9 347.3,237.7 341.1,238.7 336.7,242.9 335.3,242.3 329.5,246.1 327.9,244.5 329.4,239.5 328.2,235.1 322.5,236.7 321.2,234.6 319.0,235.4 314.3,232.0 305.1,231.8 306.9,222.8 322.2,215.4 326.6,210.1 345.2,203.3 361.3,195.0 362.1,202.3 359.4,208.1 356.3,210.2 358.0,210.7 355.9,215.9Z","cx":334.5,"cy":219.5},{"n":"Saquarema","d":"M375.5,358.5 383.3,359.3 385.1,361.8 391.3,363.0 392.3,361.7 397.2,361.7 409.9,363.8 407.1,374.4 410.4,381.4 366.6,381.7 365.6,376.9 359.4,376.9 359.7,371.4 366.9,365.8 366.7,364.3 375.5,358.5Z","cx":386.0,"cy":368.6},{"n":"Seropédica","d":"M192.0,329.5 200.4,332.9 203.2,331.5 204.1,332.7 201.4,337.0 203.6,342.5 202.6,349.5 206.0,361.2 198.1,366.9 197.7,368.9 183.5,363.0 176.8,358.1 177.7,352.9 181.2,352.2 182.8,349.7 182.0,346.1 185.2,344.9 187.3,341.7 184.7,340.0 185.7,337.4 192.0,329.5Z","cx":192.6,"cy":347.8},{"n":"Silva Jardim","d":"M426.1,287.8 422.2,292.7 421.1,298.9 426.1,302.5 429.1,312.7 435.2,311.7 438.7,313.3 439.6,314.6 437.8,318.3 435.0,321.2 433.1,320.7 431.5,324.1 427.4,323.9 421.8,326.8 419.3,329.8 416.0,340.8 410.1,344.2 405.8,343.8 401.8,346.4 395.3,343.4 389.0,344.4 384.1,343.1 384.2,327.8 378.3,326.0 372.1,312.1 378.0,302.2 378.2,299.2 386.9,293.3 394.2,295.7 396.5,293.5 406.7,291.1 410.6,290.8 412.4,292.5 418.8,291.7 426.1,287.8Z","cx":406.4,"cy":316.4},{"n":"Sumidouro","d":"M378.2,223.9 375.6,225.8 376.7,228.6 371.6,232.5 371.9,234.2 374.6,235.3 369.7,240.7 376.1,241.8 376.8,245.8 379.4,245.9 379.7,247.3 373.8,248.5 370.4,251.6 365.9,250.0 365.3,254.3 363.0,253.8 360.4,259.3 353.9,264.1 352.3,260.2 349.0,258.1 350.8,253.9 347.8,250.5 349.0,246.2 347.2,243.3 348.9,239.4 346.5,234.9 350.4,233.9 351.3,232.3 349.1,225.3 353.4,226.3 353.7,221.6 356.8,217.4 355.9,215.9 357.6,211.8 377.0,220.4 378.2,223.9Z","cx":360.3,"cy":237.3},{"n":"Tanguá","d":"M356.3,345.2 357.8,351.0 359.9,352.4 358.1,356.3 362.6,357.5 360.9,359.6 363.1,362.3 361.1,365.4 364.9,365.6 365.0,367.2 353.7,367.1 347.7,362.7 350.0,358.9 346.8,357.0 342.5,358.3 339.4,356.6 342.7,353.3 341.4,352.7 342.1,350.4 339.0,347.7 340.1,346.5 345.8,346.9 346.2,343.4 344.9,341.7 348.7,337.6 356.3,345.2Z","cx":350.6,"cy":352.6},{"n":"Teresópolis","d":"M348.9,239.4 347.2,243.3 349.0,246.2 347.8,250.5 350.9,255.4 349.0,258.1 353.5,262.0 354.4,267.6 351.9,272.6 353.3,274.7 351.7,276.0 352.5,278.7 345.0,284.5 339.4,283.4 339.4,285.0 337.4,285.8 338.2,287.8 331.4,290.2 331.5,291.8 328.5,292.9 327.8,295.8 325.1,297.4 319.1,296.1 311.6,299.7 307.5,297.7 303.4,298.1 303.8,294.5 301.1,290.2 302.9,286.1 301.9,282.0 304.1,279.5 301.9,277.7 303.3,276.7 301.9,274.8 299.5,274.5 301.0,271.8 317.6,257.8 322.6,256.6 324.8,250.5 328.8,250.6 337.6,245.8 343.9,240.0 348.9,239.4Z","cx":328.4,"cy":269.7},{"n":"Trajano de Moraes","d":"M444.9,218.8 446.1,221.4 447.7,220.5 448.1,222.9 453.9,222.5 453.5,225.3 461.7,227.5 470.0,227.2 476.6,230.7 477.0,237.7 465.8,244.7 457.8,245.8 454.3,249.4 455.1,252.4 444.3,254.9 429.8,268.7 429.3,271.0 426.9,271.1 422.2,267.2 429.1,262.1 429.3,258.6 432.0,257.8 423.7,252.3 424.2,248.8 421.8,243.6 425.0,239.9 422.3,237.3 427.3,237.9 424.9,233.9 427.0,231.5 427.8,225.2 431.1,223.1 429.4,222.2 432.2,222.2 434.5,218.8 439.8,220.2 441.9,217.9 444.9,218.8Z","cx":444.4,"cy":244.2},{"n":"Três Rios","d":"M282.4,230.8 285.2,236.3 290.1,231.8 294.7,231.8 295.4,233.5 302.0,228.6 301.0,225.3 306.9,222.8 305.1,231.8 312.4,232.7 311.8,234.5 314.5,241.3 305.2,242.9 299.6,253.6 297.8,250.4 300.5,248.6 301.2,245.8 292.2,249.3 289.7,252.2 280.7,249.7 275.2,252.4 274.7,248.3 267.5,241.3 265.2,235.2 272.5,228.9 286.1,223.4 285.6,227.4 282.4,230.8Z","cx":290.0,"cy":238.8},{"n":"Valença","d":"M182.8,228.1 183.7,231.3 187.9,234.2 194.8,229.5 199.7,233.1 199.7,244.4 197.7,246.3 200.4,248.8 201.5,253.0 208.4,256.8 208.4,262.5 211.7,263.5 211.6,267.7 208.8,270.9 200.7,272.1 198.6,274.1 199.7,276.8 197.4,277.5 197.2,280.2 194.5,280.7 192.8,285.0 188.4,283.4 185.5,288.0 181.2,281.8 175.6,279.0 171.1,282.9 171.2,284.9 169.9,284.5 169.5,282.0 167.8,282.6 170.3,274.7 168.2,272.4 163.3,275.0 162.0,277.7 158.6,278.7 154.3,283.9 153.2,281.6 156.0,278.9 150.1,277.5 148.7,271.9 143.2,271.5 140.9,268.9 124.5,276.6 120.7,275.2 119.0,272.0 120.8,270.2 120.8,266.5 117.2,264.6 118.7,260.9 113.8,259.4 115.3,257.1 118.0,257.9 120.4,254.6 121.7,255.8 124.9,253.8 124.6,250.1 127.6,249.5 128.4,247.5 130.4,249.5 132.9,246.0 140.8,243.7 143.9,245.6 164.1,237.0 164.2,234.7 170.2,234.5 182.8,228.1Z","cx":161.4,"cy":258.6},{"n":"Varre-Sai","d":"M506.8,6.3 512.4,9.5 512.5,17.9 506.4,23.4 500.5,31.8 504.0,34.8 503.4,38.7 500.0,36.9 500.9,34.8 498.2,32.8 496.7,33.8 493.8,32.7 491.7,36.7 485.4,35.4 483.5,32.1 484.6,29.0 489.2,28.3 485.9,24.2 485.9,19.8 491.4,18.5 506.8,6.3Z","cx":497.1,"cy":21.6},{"n":"Vassouras","d":"M233.1,255.1 237.2,258.7 241.8,255.1 250.6,265.4 225.1,271.7 223.9,275.8 228.0,282.7 224.7,287.6 227.3,290.7 224.7,292.0 225.2,293.4 223.2,295.5 221.0,294.8 219.5,296.4 217.1,309.5 214.2,298.0 212.4,297.3 190.7,304.2 186.8,301.8 183.8,296.1 180.7,294.5 188.4,283.4 192.8,285.0 194.5,280.7 197.2,280.2 197.4,277.5 199.7,276.8 198.6,274.1 200.5,272.3 208.8,270.9 216.1,263.7 221.8,265.7 223.7,258.6 229.1,260.9 230.7,255.3 233.1,255.1Z","cx":210.7,"cy":281.7},{"n":"Volta Redonda","d":"M139.7,304.4 137.9,313.9 135.8,314.3 130.7,329.9 130.3,323.2 128.9,322.0 129.8,318.8 128.8,318.4 130.7,312.9 129.9,309.9 122.6,311.4 119.7,309.0 120.0,296.6 121.7,293.5 130.1,288.4 144.3,288.7 133.1,297.8 139.7,304.4Z","cx":129.5,"cy":309.4}];

// Marca institucional oficial da Prefeitura de Niterói / Fazenda (fundo recortado, arte original preservada)
const LOGO_FAZENDA = "data:image/png;base64,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";

/* ---------------- COMPONENTES ---------------- */

const Section = ({ title, subtitle, cor, className = "", children }) => (
  <section className={`mb-10 ${className}`}>
    <div className="px-5 py-3" style={{ background: cor || "linear-gradient(90deg,#1E3A8A,#2563EB)", borderRadius: "10.8px 10.8px 0 0" }}>
      <h2 className="text-white text-lg font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>{title}</h2>
      {subtitle && <p className="text-blue-100 text-xs mt-0.5">{subtitle}</p>}
    </div>
    <div className="bg-white border border-t-0 border-slate-200 p-5 shadow-sm" style={{ borderRadius: "0 0 10.8px 10.8px" }}>{children}</div>
  </section>
);

const Kpi = ({ label, value, sub, tone = "slate" }) => {
  const tones = { slate: "border-slate-200", green: "border-emerald-300", red: "border-red-300", amber: "border-amber-300" };
  return (
    <div className={`bg-white rounded-xl border ${tones[tone]} p-4 shadow-sm`}>
      <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-semibold text-slate-800 mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
};

const KpiMini = ({ label, value, sub, tone = "slate" }) => {
  const tones = { slate: "border-slate-200", green: "border-emerald-300", red: "border-red-300", amber: "border-amber-300" };
  return (
    <div className={`bg-white rounded-xl border ${tones[tone]} px-4 py-3 shadow-sm`}>
      <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium leading-tight">{label}</p>
      <p className="text-xl font-semibold text-slate-800 mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>{value}</p>
      {sub && <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{sub}</p>}
    </div>
  );
};

const RangeToggle = ({ expandido, setExpandido }) => (
  <div className="flex gap-1.5 no-print">
    <button onClick={() => setExpandido(false)}
      className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${!expandido ? "bg-blue-700 text-white border-blue-700" : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"}`}>
      Exercício selecionado
    </button>
    <button onClick={() => setExpandido(true)}
      className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${expandido ? "bg-blue-700 text-white border-blue-700" : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"}`}>
      Desde 2024
    </button>
  </div>
);

// Marcador de fechamento de exercício nas visões históricas
const fimExercicio = (pontos) => pontos.map((x) => (
  <ReferenceLine key={x} x={x} stroke="#94A3B8" strokeDasharray="2 5" strokeOpacity={0.75}
    label={{ value: `Fecha 20${x.slice(0, 2)}`, fontSize: 9, fill: "#94A3B8", position: "top" }} />
));

// Alterna a base de cálculo dos indicadores entre a RCL oficial e a RCL sem royalties (visão gerencial)
const RoyaltiesToggle = ({ semRoy, setSemRoy }) => (
  <div className="flex gap-1.5 no-print">
    <button onClick={() => setSemRoy(false)}
      className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${!semRoy ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"}`}>
      RCL com royalties
    </button>
    <button onClick={() => setSemRoy(true)}
      className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${semRoy ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-600 border-slate-300 hover:border-amber-500"}`}>
      RCL sem royalties
    </button>
  </div>
);

const NotaRoyalties = () => (
  <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-3 leading-snug">
    Visão gerencial: a LRF inclui royalties e participação especial na RCL (art. 2º, IV da LC 101/2000), de modo que os
    limites oficiais seguem a base com royalties. A base sem royalties mede a dependência fiscal do petróleo, relevante
    porque o art. 8º da Lei 7.990/1989 veda a aplicação desses recursos no quadro permanente de pessoal, ressalvadas a
    capitalização de fundos de previdência e as aplicações da Lei 12.858/2013. Série disponível a partir de dez/2025.
  </p>
);

const FiltroPills = ({ series, ativo, setAtivo, rotuloTodos }) => (
  <div className="flex flex-wrap gap-1.5 mb-3 no-print">
    <button onClick={() => setAtivo("todos")}
      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition ${ativo === "todos" ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-500 border-slate-300 hover:border-slate-500"}`}>
      {rotuloTodos}
    </button>
    {series.map((s) => (
      <button key={s.key} onClick={() => setAtivo(s.key)}
        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition ${ativo === s.key ? "text-white" : "bg-white text-slate-500 border-slate-300 hover:border-slate-500"}`}
        style={ativo === s.key ? { background: s.cor, borderColor: s.cor } : {}}>
        {s.nome}
      </button>
    ))}
  </div>
);

const InsightCard = ({ item }) => (
  <div className="rounded-xl border border-slate-200 p-3.5 flex gap-3">
    <div className="shrink-0 w-20 text-center">
      <span className="text-[10px] font-bold px-2 py-1 rounded-lg text-white block" style={{ background: item.cor }}>{item.grau}</span>
    </div>
    <div>
      <p className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{item.titulo}</p>
      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.texto}</p>
    </div>
  </div>
);

// Tooltip das aplicações constitucionais com o valor nominal do mínimo
const TooltipMinimo = ({ active, payload, label, minimo }) => {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow text-xs">
      <p className="font-semibold text-slate-700">{label}</p>
      <p className="text-slate-600">Aplicado: {p.vAplic != null ? `${fmt(p.vAplic, 0)}m (${fmtPct(p.v)})` : fmtPct(p.v)}</p>
      {p.vMin != null && <p className="text-slate-500">Mínimo ({minimo}%): {fmt(p.vMin, 0)}m</p>}
    </div>
  );
};

// Tooltip da DTP com o valor nominal atual e o equivalente em reais de cada limite sobre a RCL ajustada do período
const TooltipDTP = ({ active, payload, label, semRoy }) => {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  const usarSR = semRoy && p.dtpPctSR != null;
  const base = usarSR ? p.rclAjSR : p.rclAj;
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow text-xs">
      <p className="font-semibold text-slate-700">{label}{usarSR ? " · base sem royalties" : ""}</p>
      <p className="text-slate-600">DTP: {fmt(p.dtp, 0)}m ({fmtPct(p.dtpPct)} da RCL oficial)</p>
      {usarSR && <p className="text-amber-700">Sobre a RCL sem royalties: {fmtPct(p.dtpPctSR)}</p>}
      <p style={{ color: "#D97706" }}>Alerta (48,6%): {fmt(base * 0.486, 0)}m</p>
      <p style={{ color: "#EA580C" }}>Prudencial (51,3%): {fmt(base * 0.513, 0)}m</p>
      <p style={{ color: "#DC2626" }}>Máximo (54%): {fmt(base * 0.54, 0)}m</p>
      {semRoy && p.dtpPctSR == null && <p className="text-slate-400">Base sem royalties indisponível neste período</p>}
    </div>
  );
};

const ClasseTag = ({ classe, cor }) => (
  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${cor}18`, color: cor }}>{classe}</span>
);

const BarraLimite = ({ atual, marcos }) => {
  const max = 60;
  return (
    <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden mt-2">
      <div className="absolute inset-y-0 left-0 rounded-lg" style={{ width: `${Math.min(atual / max, 1) * 100}%`, background: atual >= 54 ? "linear-gradient(90deg,#B91C1C,#EF4444)" : atual >= 48.6 ? "linear-gradient(90deg,#B45309,#F59E0B)" : "linear-gradient(90deg,#059669,#10B981)" }} />
      {marcos.map((m) => (
        <div key={m.label} className="absolute inset-y-0" style={{ left: `${(m.v / max) * 100}%` }}>
          <div className="w-0.5 h-full" style={{ background: m.cor }} />
          <span className="absolute -top-5 -translate-x-1/2 text-[10px] font-medium whitespace-nowrap" style={{ color: m.cor }}>{m.label} {m.v}%</span>
        </div>
      ))}
      <span className="absolute inset-y-0 flex items-center text-[11px] font-semibold text-white pl-2">DTP {fmtPct(atual)}</span>
    </div>
  );
};

const corNota = (v) => (v === null || v === undefined ? "#CBD5E1" : `hsl(${Math.round(v * 135)}, 68%, 42%)`);

/* ---------------- APP ---------------- */

export default function PainelRREORGF() {
  const [exercicio, setExercicio] = useState(ANO_CORRENTE);
  const [abaExec, setAbaExec] = useState("rcl"); // rcl | balanco | analise
  const [expExec, setExpExec] = useState(false);
  const [expPN, setExpPN] = useState(false);
  const [expDTP, setExpDTP] = useState(true);
  const [expConst, setExpConst] = useState(false);
  const [semRoy, setSemRoy] = useState(false); // base de cálculo: RCL oficial ou RCL sem royalties
  const [recFiltro, setRecFiltro] = useState("todos");
  const [gndFiltro, setGndFiltro] = useState("todos");
  const [compMuni, setCompMuni] = useState("Rio de Janeiro");
  const [compInd, setCompInd] = useState("g");
  const [mapaInd, setMapaInd] = useState("g");
  const [muniHover, setMuniHover] = useState(null);

  const r = resumoExec[exercicio];
  const res = resultados[exercicio];
  const grauReceita = (r.receita / r.prevAtualizada) * 100;
  const grauEmpenho = (r.empenhada / r.dotAtualizada) * 100;
  const rgfAtual = rgfSerie[rgfSerie.length - 1];
  const royAtual = royalties12m[rgfAtual.p];
  const rclAjSRAtual = rgfAtual.rclAj - royAtual;
  const dtpPctSRAtual = (rgfAtual.dtp / rclAjSRAtual) * 100;
  const rclEndivSRAtual = RCL_AJ_ENDIV_ATUAL - royAtual;
  const dclPctSRAtual = (DCL_ATUAL / rclEndivSRAtual) * 100;
  const comRoy = (serie) => serie.map((d) => (royalties12m[d.p] != null ? { ...d, rclSR: d.rcl != null ? d.rcl - royalties12m[d.p] : undefined, rclAjSR: d.rclAj != null ? d.rclAj - royalties12m[d.p] : undefined, dtpPctSR: d.dtp != null ? (d.dtp / (d.rclAj - royalties12m[d.p])) * 100 : undefined } : d));

  const filtrar = (serie, expandido) => (expandido ? serie : serie.filter((d) => d.ano === exercicio));
  const filtrarCorrente = (serie, expandido) => (expandido ? serie : serie.filter((d) => d.ano === ANO_CORRENTE));

  const dadosExec = comRoy(filtrar(execSerie, expExec));
  const tabelaExec = execSerie.filter((d) => d.ano === exercicio);
  const dadosPN = filtrarCorrente(seriePN, expPN);
  const dadosDTP = comRoy(filtrarCorrente(rgfSerie, expDTP));

  const recVisiveis = recFiltro === "todos" ? receitasSeries : receitasSeries.filter((s) => s.key === recFiltro);
  const gndVisiveis = gndFiltro === "todos" ? gndSeries : gndSeries.filter((s) => s.key === gndFiltro);

  const dadosComp = ifgfAnos.map((ano, ix) => ({
    ano,
    niteroi: ifgfSeries["Niterói"][compInd][ix],
    outro: ifgfSeries[compMuni] ? ifgfSeries[compMuni][compInd][ix] : null,
  }));

  const rankOrdenado = [...ifgfMapa].sort((x, y) => y.g - x.g);
  const top5 = rankOrdenado.slice(0, 5);
  const bottom5 = rankOrdenado.slice(-5).reverse();
  const nomeInd = indicadoresIFGF.find((x) => x.key === mapaInd).nome;

  return (
    <div className="min-h-screen" style={{ background: "#F1F5F9", fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
@media print {
  .no-print { display: none !important; }
  body { background: #FFFFFF !important; }
  section { break-inside: avoid; page-break-inside: avoid; }
  @page { size: A4; margin: 12mm; }
}`}</style>

      {/* Cabeçalho */}
      <header className="text-white" style={{ background: "linear-gradient(135deg,#0F2A6B 0%,#1E3A8A 55%,#2563EB 100%)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center md:items-stretch gap-8">
          <div className="flex-1 text-center">
            <p className="text-blue-200 text-xs uppercase tracking-widest">Prefeitura Municipal de Niterói · Secretaria Municipal de Fazenda</p>
            <h1 className="text-3xl font-bold mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>Painel de Monitoramento Fiscal - RREO e RGF</h1>
            <p className="text-blue-200 text-sm mt-1 font-medium">Departamento de Estudos Fiscais</p>
            <p className="text-blue-100 text-sm mt-3 max-w-3xl mx-auto">
              Acompanhamento do exercício corrente de 2026, com execução orçamentária, resultados fiscais, limites da
              Lei de Responsabilidade Fiscal e aplicações constitucionais.
            </p>
            <p className="text-blue-300 text-xs mt-3">Fonte: SICONFI/STN (Anexos 01, 02, 03, 06, 07 e 14 do RREO; Anexos 05 e 06 do RGF), IFGF/Firjan e malha municipal IBGE · Valores em R$ milhões</p>
          </div>
          <div className="shrink-0 self-stretch flex flex-col items-center md:items-end justify-between gap-5">
            <button onClick={() => window.print()}
              className="no-print px-4 py-1.5 rounded-lg text-xs font-medium border border-white/40 text-white hover:bg-white/10 transition">
              Gerar PDF
            </button>
            <img src={LOGO_FAZENDA} alt="Prefeitura de Niterói · Fazenda" className="w-36 md:w-40" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* KPIs do exercício corrente */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          <Kpi label="Receita 2026 (até 4º bim)" value={`R$ ${fmt(5264.38)}`} sub="77,3% da previsão atualizada" />
          <Kpi label="Resultado Primário 2026" value={`R$ ${fmt(245.19)}`} sub="Acima da meta LDO de R$ −201,62 mi" tone="green" />
          <Kpi label="Resultado Nominal 2026" value={`R$ ${fmt(463.97)}`} sub="Acima da meta LDO de R$ −310,17 mi" tone="green" />
          <Kpi label="Despesa com Pessoal" value={fmtPct(36.79)} sub="2º quadrimestre 2026 · limite 54%" tone="amber" />
          <Kpi label="DCL / RCL" value={fmtPct(-68.01)} sub="Posição credora · limite 120%" tone="green" />
          <Kpi label="RCL Ajustada" value={`R$ ${fmt(6559.81)}`} sub="2º quadrimestre 2026" />
        </div>

        {/* 1. Execução orçamentária */}
        <Section title="1 · Execução Orçamentária" subtitle="RCL, Balanço Orçamentário e composição da receita e da despesa · Anexos 01, 03 e 14 do RREO">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 no-print">
            <div className="flex gap-2">
              {[2024, 2025, 2026].map((ex) => (
                <button key={ex} onClick={() => setExercicio(ex)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition ${exercicio === ex ? "bg-blue-700 text-white border-blue-700" : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"}`}>
                  {ex} {ex === ANO_CORRENTE && <span className="text-[10px] opacity-75">(corrente)</span>}
                </button>
              ))}
            </div>
            <RangeToggle expandido={expExec} setExpandido={setExpExec} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 max-w-2xl">
            <KpiMini label="Previsão Atualizada" value={`R$ ${fmt(r.prevAtualizada)}`} />
            <KpiMini label="Receita Realizada" value={`R$ ${fmt(r.receita)}`} sub={`${fmt(grauReceita, 1)}% de realização`} tone={grauReceita >= 100 ? "green" : "slate"} />
            <KpiMini label="Dotação Atualizada" value={`R$ ${fmt(r.dotAtualizada)}`} />
            <KpiMini label="Despesa Empenhada" value={`R$ ${fmt(r.empenhada)}`} sub={`${fmt(grauEmpenho, 1)}% da dotação`} />
          </div>

          <div className="flex gap-1 border-b border-slate-200 mb-4 overflow-x-auto no-print">
            {[
              { id: "rcl", nome: "Receita Corrente Líquida" },
              { id: "balanco", nome: "Balanço Orçamentário" },
              { id: "analise", nome: "Análise da Receita e Despesa" },
            ].map((t) => (
              <button key={t.id} onClick={() => setAbaExec(t.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition ${abaExec === t.id ? "border-blue-700 text-blue-800" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                style={{ fontFamily: "Poppins, sans-serif" }}>
                {t.nome}
              </button>
            ))}
          </div>

          {abaExec === "rcl" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <p className="text-sm font-semibold text-slate-700" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Trajetória da Receita Corrente Líquida · acumulado de 12 meses ao fim de cada bimestre
                </p>
                <RoyaltiesToggle semRoy={semRoy} setSemRoy={setSemRoy} />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosExec}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="p" tick={{ fontSize: 11 }} />
                  <YAxis domain={semRoy ? [3800, 6800] : [5400, 6600]} tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v, 0)} />
                  <Tooltip formatter={(v) => `R$ ${fmt(v)} mi`} />
                  {semRoy && <Legend wrapperStyle={{ fontSize: 11 }} />}
                  {expExec && fimExercicio(["24/B6", "25/B6"])}
                  <Line type="monotone" dataKey="rcl" name="RCL (12 meses)" stroke="#1E3A8A" strokeWidth={2.5} dot={{ r: 4 }} />
                  {semRoy && <Line type="monotone" dataKey="rclSR" name="RCL sem royalties (12 meses)" stroke="#D97706" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 4 }} connectNulls />}
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-slate-500 mt-2">
                A RCL saiu de R$ 5.661,70 mi no 1º bimestre de 2024 para o pico de R$ 6.355,71 mi no 5º bimestre de 2025
                e recuou para R$ 6.228,29 mi no 2º bimestre de 2026, mas voltou a crescer e atingiu R$ 6.570,71 mi no
                4º bimestre, novo pico da série. O avanço de 4,3% sobre o mesmo corte de 2025 praticamente iguala o IPCA
                de 4,22% em 12 meses, o que indica estabilidade real. Como a RCL é o denominador de todos os limites da
                LRF (art. 2º, IV da LC 101/2000), sua trajetória condiciona diretamente o espaço fiscal. O 3º bimestre de
                2026 não integra a série carregada.
              </p>
              {semRoy && (
                <>
                  <p className="text-xs text-slate-600 mt-2">
                    Sem royalties, a RCL de 12 meses passa de R$ 4.088,97 mi em dez/2025 para R$ 4.274,79 mi em ago/2026,
                    alta de 4,5% em oito meses, com trajetória mais estável que a RCL total. Os royalties respondem por
                    34,9% da RCL de agosto. Com a estimativa de R$ 2,3 bi de royalties em 2026, a RCL sem royalties
                    projetada para dezembro é de R$ 4.312,2 mi.
                  </p>
                  <NotaRoyalties />
                </>
              )}
            </>
          )}

          {abaExec === "balanco" && (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={dadosExec}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="p" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v, 0)} />
                  <Tooltip formatter={(v) => `R$ ${fmt(v)} mi`} />
                  <Legend />
                  {expExec && fimExercicio(["24/B6", "25/B6"])}
                  <Area type="monotone" dataKey="receita" name="Receita Realizada" stroke="#1E3A8A" fill="#1E3A8A22" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="empenhada" name="Empenhada" stroke="#D97706" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="liquidada" name="Liquidada" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="paga" name="Paga" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-slate-400 mt-1">
                Valores acumulados dentro de cada exercício. Na visão histórica, o marcador tracejado indica o
                fechamento de cada exercício (6º bimestre), ponto em que os valores são definitivos.
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200">
                      <th className="py-2 pr-4 font-medium">Período</th>
                      <th className="py-2 pr-4 font-medium text-right">Receita</th>
                      <th className="py-2 pr-4 font-medium text-right">Empenhada</th>
                      <th className="py-2 pr-4 font-medium text-right">Liquidada</th>
                      <th className="py-2 pr-4 font-medium text-right">Paga</th>
                      <th className="py-2 font-medium text-right">RCL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabelaExec.map((d, i) => (
                      <tr key={d.p} className={i % 2 ? "bg-slate-50" : ""}>
                        <td className="py-1.5 pr-4">{d.p}</td>
                        <td className="py-1.5 pr-4 text-right">{fmt(d.receita)}</td>
                        <td className="py-1.5 pr-4 text-right">{fmt(d.empenhada)}</td>
                        <td className="py-1.5 pr-4 text-right">{fmt(d.liquidada)}</td>
                        <td className="py-1.5 pr-4 text-right">{fmt(d.paga)}</td>
                        <td className="py-1.5 text-right">{fmt(d.rcl)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {exercicio === 2026 && (
                <p className="text-xs text-slate-500 mt-3 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  O recuo da despesa empenhada entre o 1º e o 2º bimestre reflete anulações líquidas de aproximadamente
                  R$ 380 mi em empenhos globais e estimativos (arts. 58 a 60 da Lei 4.320/1964), gestão que contribui
                  para conter a despesa no exercício.
                </p>
              )}
            </>
          )}

          {abaExec === "analise" && (
            <div className="space-y-8">
              <p className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
                Análise restrita ao exercício corrente de 2026, acumulado até o 4º bimestre, com comparações contra o
                mesmo corte de 2025. Referenciais de inflação: IPCA de 4,26% em 2025 e de 4,22% nos 12 meses encerrados
                em agosto de 2026 (IBGE).
              </p>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Receitas realizadas por categoria econômica · acumulado até o bimestre
                </p>
                <FiltroPills series={receitasSeries} ativo={recFiltro} setAtivo={setRecFiltro} rotuloTodos="Todas" />
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={receitasCat}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="p" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v, 0)} />
                    <Tooltip formatter={(v) => `R$ ${fmt(v)} mi`} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {recVisiveis.map((s) => <Bar key={s.key} dataKey={s.key} name={s.nome} stackId="rec" fill={s.cor} />)}
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  {insightsReceita.map((it) => <InsightCard key={it.titulo} item={it} />)}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Insights apurados no Anexo 06 do RREO (metodologia acima da linha). Mais de 98% das receitas do
                  Município são correntes, razão pela qual a análise se concentra em suas origens.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Despesas empenhadas por Grupo de Natureza de Despesa · acumulado até o bimestre
                </p>
                <FiltroPills series={gndSeries} ativo={gndFiltro} setAtivo={setGndFiltro} rotuloTodos="Todos" />
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={despesasGND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="p" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v, 0)} />
                    <Tooltip formatter={(v) => `R$ ${fmt(v)} mi`} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {gndVisiveis.map((s) => <Bar key={s.key} dataKey={s.key} name={s.nome} stackId="gnd" fill={s.cor} />)}
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  {insightsDespesa.map((it) => <InsightCard key={it.titulo} item={it} />)}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Insights apurados por GND no Anexo 01 do RREO, conforme classificação da Portaria Interministerial
                  STN/SOF 163/2001 e do MTO. O empenho de pessoal concentrado no início do exercício decorre do empenho
                  estimativo anual da folha, prática presente em ambos os exercícios comparados.
                </p>
              </div>
            </div>
          )}
        </Section>

        {/* 2. Resultados fiscais */}
        <Section title="2 · Resultados Primário e Nominal" subtitle="Verificação das metas do Anexo de Metas Fiscais da LDO · art. 4º, §1º e art. 9º da LRF">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <p className="text-xs text-slate-500">
              Cards referentes ao exercício selecionado na Seção 1 ({exercicio}). A linha tracejada dos gráficos
              indica a meta anual fixada na LDO de cada exercício.
            </p>
            <RangeToggle expandido={expPN} setExpandido={setExpPN} />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {["primario", "nominal"].map((k) => {
              const item = res[k];
              const cumpre = item.apurado >= item.meta;
              return (
                <div key={k} className={`rounded-xl border p-4 ${cumpre ? "border-emerald-300 bg-emerald-50" : "border-red-300 bg-red-50"}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800" style={{ fontFamily: "Poppins, sans-serif" }}>
                      Resultado {k === "primario" ? "Primário" : "Nominal"} · {exercicio}
                    </p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cumpre ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
                      {cumpre ? "Meta atendida" : "Meta descumprida"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                    <div><p className="text-slate-500 text-xs">Meta LDO</p><p className="font-semibold text-slate-800">R$ {fmt(item.meta)}</p></div>
                    <div><p className="text-slate-500 text-xs">Apurado ({res.periodo})</p><p className={`font-semibold ${cumpre ? "text-emerald-700" : "text-red-700"}`}>R$ {fmt(item.apurado)}</p></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Resultado Primário (sem RPPS) · acima da linha</p>
              <ResponsiveContainer width="100%" height={240}>
                <ComposedChart data={dadosPN}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="p" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v, 0)} />
                  <Tooltip formatter={(v) => `R$ ${fmt(v)} mi`} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#64748B" />
                  {expPN && fimExercicio(["24/B6", "25/B6"])}
                  <Bar dataKey="primario" name="Apurado até o bimestre" fill="#1E3A8A" radius={[3, 3, 0, 0]} />
                  <Line type="stepAfter" dataKey="metaP" name="Meta anual LDO" stroke="#DC2626" strokeWidth={2} strokeDasharray="6 4" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Resultado Nominal (sem RPPS) · abaixo da linha</p>
              <ResponsiveContainer width="100%" height={240}>
                <ComposedChart data={dadosPN}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="p" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v, 0)} />
                  <Tooltip formatter={(v) => `R$ ${fmt(v)} mi`} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#64748B" />
                  {expPN && fimExercicio(["24/B6", "25/B6"])}
                  <Bar dataKey="nominal" name="Apurado até o bimestre" fill="#60A5FA" radius={[3, 3, 0, 0]} />
                  <Line type="stepAfter" dataKey="metaN" name="Meta anual LDO" stroke="#DC2626" strokeWidth={2} strokeDasharray="6 4" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Metodologia acima da linha (primário) e abaixo da linha (nominal), sem RPPS, conforme o MDF/STN.
            As metas de 2026 foram fixadas em patamar negativo na LDO. O histórico de 2025 justifica a verificação
            bimestral rigorosa da realização da receita prevista no art. 9º da LRF ao longo do exercício corrente.
          </p>
        </Section>

        {/* 3. Limites LRF */}
        <Section title="3 · Limites da Lei de Responsabilidade Fiscal" subtitle="RGF · Anexo 06 · Demonstrativo Simplificado da Gestão Fiscal">
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-sm font-semibold text-slate-700" style={{ fontFamily: "Poppins, sans-serif" }}>
                Despesa Total com Pessoal · {rgfAtual.p} · R$ {fmt(rgfAtual.dtp)} mi
                {semRoy && <span className="text-amber-700"> · sobre a RCL ajustada sem royalties de R$ {fmt(rclAjSRAtual)} mi</span>}
              </p>
              <RoyaltiesToggle semRoy={semRoy} setSemRoy={setSemRoy} />
            </div>
            <BarraLimite atual={semRoy ? dtpPctSRAtual : rgfAtual.dtpPct} marcos={[
              { label: "Alerta", v: limitesPessoal.alerta, cor: "#D97706" },
              { label: "Prudencial", v: limitesPessoal.prudencial, cor: "#EA580C" },
              { label: "Máximo", v: limitesPessoal.maximo, cor: "#DC2626" },
            ]} />
            <p className="text-xs text-slate-500 mt-6">
              Limites do Poder Executivo municipal: máximo de 54% (art. 20, III, b), prudencial de 51,3%
              (art. 22, parágrafo único) e alerta de 48,6% (art. 59, §1º, II), todos da LC 101/2000.
              {semRoy && ` Na base sem royalties, a DTP de ${fmtPct(dtpPctSRAtual)} supera em R$ ${fmt(rgfAtual.dtp - rclAjSRAtual * 0.54, 1)} mi o equivalente a 54%, o que evidencia que a folga do limite oficial depende da receita do petróleo.`}
            </p>
            {semRoy && <NotaRoyalties />}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-700" style={{ fontFamily: "Poppins, sans-serif" }}>Evolução da DTP sobre a RCL Ajustada</p>
                <RangeToggle expandido={expDTP} setExpandido={setExpDTP} />
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dadosDTP}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="p" tick={{ fontSize: 10 }} />
                  <YAxis domain={semRoy ? [30, 60] : [30, 56]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<TooltipDTP semRoy={semRoy} />} />
                  <ReferenceLine y={48.6} stroke="#D97706" strokeDasharray="4 4" label={{ value: "Alerta 48,6%", fontSize: 10, fill: "#D97706", position: "insideTopRight" }} />
                  <ReferenceLine y={54} stroke="#DC2626" strokeDasharray="4 4" label={{ value: "Máximo 54%", fontSize: 10, fill: "#DC2626", position: "insideTopRight" }} />
                  {expDTP && fimExercicio(["24/3ºQ", "25/3ºQ"])}
                  <Line type="monotone" dataKey="dtpPct" name="DTP/RCL" stroke="#1E3A8A" strokeWidth={2.5} dot={{ r: 4 }} />
                  {semRoy && <Line type="monotone" dataKey="dtpPctSR" name="DTP/RCL sem royalties" stroke="#D97706" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 4 }} connectNulls />}
                </LineChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-slate-400 mt-1">
                O RGF de 2026 possui dois quadrimestres publicados, razão pela qual este gráfico abre por padrão
                na série histórica. O marcador tracejado indica o fechamento de cada exercício (3º quadrimestre).
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                Demais limites · 2º quadrimestre 2026{semRoy && <span className="text-amber-700"> · base sem royalties</span>}
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-2 font-medium">Limite</th>
                    <th className="py-2 font-medium text-right">Apurado</th>
                    <th className="py-2 font-medium text-right">Teto</th>
                    <th className="py-2 font-medium text-right">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: "Dívida Consolidada Líquida", a: semRoy ? `${fmt(dclPctSRAtual)}%`.replace("-", "−") : "−68,01%", t: "120%" },
                    { n: "Garantias Concedidas", a: "0,00%", t: "22%" },
                    { n: "Operações de Crédito", a: "0,00%", t: "16%" },
                    { n: "Operações por ARO", a: "0,00%", t: "7%" },
                  ].map((l, i) => (
                    <tr key={l.n} className={i % 2 ? "bg-slate-50" : ""}>
                      <td className="py-2">{l.n}</td>
                      <td className="py-2 text-right font-medium">{l.a}</td>
                      <td className="py-2 text-right text-slate-500">{l.t}</td>
                      <td className="py-2 text-right"><span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Cumprido</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-slate-500 mt-3">
                Tetos das Resoluções 40 e 43/2001 do Senado Federal. A DCL negativa indica que as disponibilidades
                financeiras superam o estoque da dívida consolidada, configurando posição credora líquida.
              </p>
            </div>
          </div>
        </Section>

        {/* 4. Aplicações constitucionais */}
        <Section title="4 · Aplicações Constitucionais · Educação e Saúde" subtitle="Apuração anual · percentuais acumulados até o bimestre">
          <div className="flex justify-end mb-3"><RangeToggle expandido={expConst} setExpandido={setExpConst} /></div>
          <div className="grid md:grid-cols-3 gap-4">
            {constitucionais.map((c) => (
              <div key={c.nome} className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{c.nome}</p>
                <p className="text-[11px] text-slate-500 mb-3">{c.fund} · mínimo {c.minimo}%</p>
                <div className="flex items-end gap-4 mb-2">
                  <div><p className="text-[10px] uppercase text-slate-400">2024 (final)</p><p className="text-lg font-semibold text-emerald-700">{fmtPct(c.fechamentos[2024])}</p></div>
                  <div><p className="text-[10px] uppercase text-slate-400">2025 (final)</p><p className="text-lg font-semibold text-emerald-700">{fmtPct(c.fechamentos[2025])}</p></div>
                  <div><p className="text-[10px] uppercase text-slate-400">2026 (parcial)</p><p className="text-lg font-semibold text-slate-700">{fmtPct(c.atual)}</p></div>
                </div>
                <ResponsiveContainer width="100%" height={130}>
                  <LineChart data={expConst ? c.serie : c.serie.filter((d) => d.ano === ANO_CORRENTE)}>
                    <XAxis dataKey="p" tick={{ fontSize: 9 }} interval={expConst ? 2 : 0} />
                    <YAxis hide domain={["auto", "auto"]} />
                    <Tooltip content={<TooltipMinimo minimo={c.minimo} />} />
                    <ReferenceLine y={c.minimo} stroke="#DC2626" strokeDasharray="4 4" />
                    {expConst && fimExercicio(["24/B6", "25/B6"])}
                    <Line type="monotone" dataKey="v" stroke="#1E3A8A" strokeWidth={2} dot={{ r: 2.5 }} name="% aplicado" />
                  </LineChart>
                </ResponsiveContainer>
                {c.nota && <p className="text-[10px] text-slate-400 mt-2 leading-snug">{c.nota}</p>}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Ao passar o mouse sobre os pontos, o painel exibe o valor nominal aplicado até o período e o equivalente
            ao mínimo constitucional sobre a base de cálculo acumulada, em R$ milhões.
          </p>
        </Section>

        {/* 5. Restos a pagar */}
        <Section title="5 · Restos a Pagar" subtitle="Anexos 07 e 14 do RREO e Anexo 05 do RGF · art. 55, III, b da LRF">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-2 font-medium">Exercício</th>
                    <th className="py-2 font-medium text-right">Inscritos</th>
                    <th className="py-2 font-medium text-right">Cancelados</th>
                    <th className="py-2 font-medium text-right">Pagos</th>
                    <th className="py-2 font-medium text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {[2024, 2025, 2026].map((ex, i) => {
                    const d = restosAPagar[ex];
                    return (
                      <tr key={ex} className={i % 2 ? "bg-slate-50" : ""}>
                        <td className="py-2 font-medium">{ex}</td>
                        <td className="py-2 text-right">{fmt(d.inscritos)}</td>
                        <td className="py-2 text-right">{fmt(d.cancelados)}</td>
                        <td className="py-2 text-right">{fmt(d.pagos)}</td>
                        <td className="py-2 text-right font-medium">{fmt(d.saldo)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-xs text-slate-500 mt-3">
                A inscrição acumula alta de 45,1% entre 2024 e 2026. Como o mandato se encerra em 2028, a vedação do
                art. 42 da LRF ainda não incide, mas a curva recomenda acompanhamento por fonte de recursos.
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="font-semibold text-emerald-800 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Cobertura de caixa · RGF 3º quadrimestre 2025</p>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div><p className="text-[10px] uppercase text-emerald-600">RP não liquidados do exercício</p><p className="text-xl font-semibold text-emerald-900">R$ {fmt(restosAPagar.cobertura.rpNaoLiq)}</p></div>
                <div><p className="text-[10px] uppercase text-emerald-600">Disponibilidade líquida</p><p className="text-xl font-semibold text-emerald-900">R$ {fmt(restosAPagar.cobertura.dispLiquida)}</p></div>
              </div>
              <p className="text-xs text-emerald-700 mt-3">
                A disponibilidade de caixa líquida cobre 5,4 vezes os restos a pagar não liquidados inscritos no
                encerramento de 2025, situação confortável frente à exigência de lastro financeiro.
              </p>
            </div>
          </div>

        </Section>

        {/* 6. Alertas */}
        <Section title="6 · Alertas Normativos e Pontos de Atenção · Exercício de 2026" subtitle="Sinais do exercício corrente, lidos à luz da série histórica, com fundamentação legal expressa">
          <div className="space-y-3">
            {alertas.map((a) => (
              <div key={a.titulo} className="rounded-xl border border-slate-200 p-4 flex gap-4">
                <div className="shrink-0 w-16 text-center">
                  <span className="text-[11px] font-bold px-2 py-1 rounded-lg text-white block" style={{ background: a.cor }}>{a.grau}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{a.titulo}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.texto}</p>
                  <p className="text-[11px] text-blue-800 mt-1.5 font-medium">Fundamento: {a.fund}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 7. Indicadores */}
        <Section title="7 · Indicadores Estratégicos" subtitle="Base: exercício de 2025 encerrado · Anexo 01 do RREO">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indicadores.map((ind) => (
              <div key={ind.nome} className="rounded-xl border border-slate-200 p-4 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-800 text-sm leading-snug" style={{ fontFamily: "Poppins, sans-serif" }}>{ind.nome}</p>
                  <ClasseTag classe={ind.classe} cor={ind.cor} />
                </div>
                <p className="text-3xl font-semibold mt-2" style={{ color: ind.cor, fontFamily: "Poppins, sans-serif" }}>
                  {ind.unidade === "%" ? fmtPct(ind.valor) : `${fmt(ind.valor)}x`}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 italic">{ind.formula}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{ind.leitura}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 8. Insights Preditivos */}
        <Section title="8 · Insights Preditivos" subtitle="Projeções de fechamento do exercício de 2026 por sazonalidade histórica · base interna 2022 a 2026">
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            Mantido o comportamento sazonal médio dos exercícios de 2023 a 2025, as metas constitucionais e os limites
            da LRF encerram 2026 nas posições projetadas abaixo. Os valores indicam o esforço nominal necessário para
            o atingimento de cada meta ou o espaço fiscal disponível até cada limite.
          </p>
          <div className="flex justify-end mb-3"><RoyaltiesToggle semRoy={semRoy} setSemRoy={setSemRoy} /></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-3 font-medium">Meta ou Limite</th>
                  <th className="py-2 pr-3 font-medium">Posição atual</th>
                  <th className="py-2 pr-3 font-medium">Projeção de fechamento</th>
                  <th className="py-2 pr-3 font-medium">Valor necessário ou espaço</th>
                  <th className="py-2 font-medium text-right">Situação projetada</th>
                </tr>
              </thead>
              <tbody>
                {preditivos.map((p0, i) => { const p = semRoy && preditivosSemRoy[p0.meta] ? { ...p0, ...preditivosSemRoy[p0.meta] } : p0; return (
                  <tr key={p.meta} className={i % 2 ? "bg-slate-50" : ""}>
                    <td className="py-2.5 pr-3">
                      <p className="font-medium text-slate-800">{p.meta}</p>
                      <p className="text-[10px] text-slate-400">{p.ref}</p>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-700">{p.atual}</td>
                    <td className="py-2.5 pr-3 font-semibold text-slate-800">{p.proj}</td>
                    <td className="py-2.5 pr-3 text-slate-600 text-xs leading-snug">{p.valor}</td>
                    <td className="py-2.5 text-right">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: `${p.cor}18`, color: p.cor }}>{p.situacao}</span>
                    </td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
          {semRoy && <NotaRoyalties />}
          <p className="text-[11px] text-slate-400 mt-3 leading-snug">
            Metodologia (posição do 4º bimestre e 2º quadrimestre de 2026): incremento médio em pontos percentuais entre
            o 4º e o 6º bimestre dos exercícios de referência para educação (2024 e 2025, pois o 4º bimestre de 2023 foi
            publicado zerado) e saúde (2023 a 2025); base anual de impostos e transferências projetada pela razão média
            B4 para B6 de 1,463 (2023 a 2025) sobre a base de R$ 2.088,1 mi; razões médias entre o 2º e o 3º
            quadrimestre de 2023 a 2025 para a DTP (1,0339) e a RCL ajustada (1,0063); RCL pela razão média B4 para B6
            de 1,0063. FUNDEB mantido na posição do 2º bimestre. Estimativas de tendência elaboradas pelo DEEF sobre a
            base interna 2022 a 2026; não constituem meta nem compromisso da Administração. Na base sem royalties, subtrai-se
            da RCL o recebimento de royalties e participação especial dos 12 meses (R$ 2.295,91 mi em ago/2026 e estimativa
            de R$ 2,3 bi no exercício de 2026); educação, saúde e FUNDEB não se alteram, pois sua base é a receita de impostos.
          </p>
        </Section>

        {/* 9. Nota do IFGF */}
        <Section className="no-print" title="9 · Nota do IFGF · Índice Firjan de Gestão Fiscal" cor="#1C2C45" subtitle="Simulação com dados de 2025, comparativo histórico e panorama fluminense · metodologia Firjan sobre dados do SICONFI">
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                Simulação DEEF · IFGF de Niterói com os dados encerrados de {ifgfSimulacao.exercicioBase}
              </p>
              <div className="p-1.5 mb-3" style={{ border: "2px dashed rgba(28,44,69,0.7)", borderRadius: 14 }}>
                <div className="rounded-xl p-5 text-center text-white" style={{ background: "linear-gradient(135deg,#16233A,#1C2C45 60%,#2A3F63)" }}>
                  <p className="text-slate-300 text-xs uppercase tracking-widest">IFGF Geral simulado (dados {ifgfSimulacao.exercicioBase})</p>
                  <p className="text-5xl font-bold my-1" style={{ fontFamily: "Poppins, sans-serif" }}>{fmt(ifgfSimulacao.geral, 4)}</p>
                  <p className="text-slate-300 text-xs">Nota máxima nos quatro indicadores, mantendo a posição da edição oficial de 2025 (dados de 2024)</p>
                </div>
              </div>
              <div className="space-y-2">
                {ifgfSimulacao.itens.map((it) => (
                  <div key={it.nome} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>IFGF {it.nome}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">Indicador: {fmtPct(it.indicador)} <span className="text-slate-400">({it.corte})</span></span>
                        <span className="text-lg font-bold text-emerald-700" style={{ fontFamily: "Poppins, sans-serif" }}>{fmt(it.nota, 4)}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{it.detalhe}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-snug">
                Simulação do Departamento de Estudos Fiscais aplicando a metodologia do Anexo Metodológico do IFGF
                (Firjan, edição 2025) aos demonstrativos de 2025 do SICONFI. O resultado oficial da próxima edição pode
                divergir em função de ajustes de base da Firjan, em especial na apuração de caixa e equivalentes pela DCA.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                Comparativo histórico 2013 a 2024 · Niterói x ente selecionado
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <select value={compMuni} onChange={(e) => setCompMuni(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 bg-white text-slate-700">
                  {Object.keys(ifgfSeries).filter((n) => n !== "Niterói").map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <div className="flex flex-wrap gap-1.5">
                  {indicadoresIFGF.map((ind) => (
                    <button key={ind.key} onClick={() => setCompInd(ind.key)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${compInd === ind.key ? "text-white border-transparent" : "bg-white text-slate-500 border-slate-300 hover:border-slate-500"}`}
                      style={compInd === ind.key ? { background: "#1C2C45" } : {}}>
                      {ind.nome}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dadosComp}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="ano" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v, 1)} />
                  <Tooltip formatter={(v) => fmt(v, 4)} />
                  <Legend />
                  <ReferenceLine y={0.8} stroke="#059669" strokeDasharray="4 4" label={{ value: "Excelência 0,8", fontSize: 10, fill: "#059669", position: "insideBottomRight" }} />
                  <ReferenceLine y={0.4} stroke="#DC2626" strokeDasharray="4 4" label={{ value: "Crítica 0,4", fontSize: 10, fill: "#DC2626", position: "insideBottomRight" }} />
                  <Line type="monotone" dataKey="niteroi" name="Niterói" stroke="#1C2C45" strokeWidth={2.5} dot={{ r: 3.5 }} connectNulls />
                  <Line type="monotone" dataKey="outro" name={compMuni} stroke="#D97706" strokeWidth={2.5} dot={{ r: 3.5 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-slate-400 mt-1">
                Série oficial do IFGF (Firjan). Interrupções na linha indicam exercícios sem avaliação por
                indisponibilidade ou inconsistência dos dados declarados. Faixas de conceito: Excelência acima de 0,8;
                Boa entre 0,6 e 0,8; Dificuldade entre 0,4 e 0,6; Crítica abaixo de 0,4.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 mb-8">
            <p className="text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Panorama fluminense · IFGF 2024 (edição 2025)
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Niterói é o único município do estado com nota máxima (1,0000) nos quatro indicadores, em um contexto
              estadual desfavorável: o IFGF médio fluminense foi de 0,5587, abaixo da média nacional de 0,6531, com
              50,6% dos municípios do Rio de Janeiro em situação fiscal difícil ou crítica e o pior desempenho do país
              em investimentos (média de 0,3715, com aplicação de apenas 4,6% da receita). No extremo inferior,
              predominam municípios com nota zero em autonomia, que não geram receita local sequer para custear a
              própria estrutura administrativa, combinada com liquidez comprometida.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-emerald-700 font-semibold mb-1.5">Top 5 · melhores notas</p>
                {top5.map((mm, i) => (
                  <div key={mm.n} className={`flex items-center justify-between text-sm py-1.5 px-2 rounded ${i % 2 ? "" : "bg-slate-50"}`}>
                    <span className="text-slate-700"><span className="text-slate-400 font-medium mr-2">{i + 1}º</span>{mm.n}</span>
                    <span className="font-semibold" style={{ color: corNota(mm.g) }}>{fmt(mm.g, 4)}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-red-700 font-semibold mb-1.5">Bottom 5 · piores notas</p>
                {bottom5.map((mm, i) => (
                  <div key={mm.n} className={`flex items-center justify-between text-sm py-1.5 px-2 rounded ${i % 2 ? "" : "bg-slate-50"}`}>
                    <span className="text-slate-700"><span className="text-slate-400 font-medium mr-2">{83 - i}º</span>{mm.n}</span>
                    <span className="font-semibold" style={{ color: corNota(mm.g) }}>{fmt(mm.g, 4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mapa coroplético */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <p className="text-sm font-semibold text-slate-700" style={{ fontFamily: "Poppins, sans-serif" }}>
                Mapa fiscal do Estado do Rio de Janeiro · {nomeInd} · 2024
              </p>
              <div className="flex flex-wrap gap-1.5">
                {indicadoresIFGF.map((ind) => (
                  <button key={ind.key} onClick={() => setMapaInd(ind.key)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${mapaInd === ind.key ? "text-white border-transparent" : "bg-white text-slate-500 border-slate-300 hover:border-slate-500"}`}
                    style={mapaInd === ind.key ? { background: "#1C2C45" } : {}}>
                    {ind.nome}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <svg viewBox={`0 0 ${MAPA_W} ${MAPA_H}`} className="w-full" style={{ maxHeight: 480 }}>
                {rjGeo.map((g) => {
                  const dado = ifgfMapa.find((x) => x.n === g.n);
                  const v = dado ? dado[mapaInd] : null;
                  const hov = muniHover === g.n;
                  return (
                    <path key={g.n} d={g.d}
                      fill={dado ? corNota(v) : "#CBD5E1"}
                      stroke={hov ? "#0F172A" : "#FFFFFF"}
                      strokeWidth={hov ? 1.6 : 0.7}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setMuniHover(g.n)}
                      onMouseLeave={() => setMuniHover(null)}
                    />
                  );
                })}
                {(() => {
                  const g = rjGeo.find((x) => x.n === "Niterói");
                  return g ? <path d={g.d} fill="none" stroke="#0F2A6B" strokeWidth={2} pointerEvents="none" /> : null;
                })()}
                {muniHover && (() => {
                  const g = rjGeo.find((x) => x.n === muniHover);
                  const dado = ifgfMapa.find((x) => x.n === muniHover);
                  const x = Math.min(Math.max(g.cx + 12, 4), MAPA_W - 200);
                  const y = Math.max(g.cy - 12, 50);
                  return (
                    <g pointerEvents="none">
                      <rect x={x} y={y - 42} width="196" height="48" rx="8" fill="#0F172A" opacity="0.92" />
                      <text x={x + 10} y={y - 24} fill="#FFFFFF" fontSize="12" fontWeight="600">{muniHover}</text>
                      <text x={x + 10} y={y - 8} fill="#CBD5E1" fontSize="11">
                        {dado ? `${nomeInd}: ${fmt(dado[mapaInd], 4)} · Geral: ${fmt(dado.g, 4)}` : "Não avaliado na edição 2025"}
                      </text>
                    </g>
                  );
                })()}
              </svg>
              <div className="flex items-center justify-between mt-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">0,0 (pior)</span>
                  <div className="h-2.5 w-44 rounded-full" style={{ background: "linear-gradient(90deg, hsl(0,68%,42%), hsl(45,68%,42%), hsl(90,68%,42%), hsl(135,68%,42%))" }} />
                  <span className="text-[11px] text-slate-500">1,0 (melhor)</span>
                </div>
                <span className="text-[11px] text-slate-400">Niterói destacado com contorno azul · cinza: não avaliado</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Malha municipal derivada da base cartográfica do IBGE, simplificada para visualização. Municípios sem
              avaliação na edição 2025 (Belford Roxo, Carapebus, Carmo, Japeri, Laje do Muriaé, Mendes, Miracema,
              Sumidouro e Três Rios) aparecem em cinza.
            </p>
          </div>
        </Section>

        <footer className="text-center text-xs text-slate-400 pb-8">
          Departamento de Estudos Fiscais · Secretaria Municipal de Fazenda de Niterói · Dados do SICONFI/STN, IFGF/Firjan e IBGE
        </footer>
      </main>
    </div>
  );
}
