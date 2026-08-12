# Prompts — (Tasks)

> Use o **Agent Mode** com o **Task Agent** (`.github/agents/task.agent.md`).

---

## P5.1 — Gerar o backlog

```
Use `plans/weather-app-plan.md` como entrada. Gere `tasks/weather-app-tasks.md`
com tarefas no formato T-NN. Para cada tarefa inclua: ID, título, descrição
curta, critérios de aceite, dependências, arquivos prováveis e tipo
(UI/Data/Test/Infra). Organize por entrega e ordene por dependência.
```

## P5.2 — Forçar granularidade

```
Revise as tarefas. Quais estão grandes demais (mais de 1-2 arquivos relevantes
ou misturando UI + dados + testes)? Quebre cada uma dessas em subtarefas menores
e testáveis, mantendo o formato T-NN.
```

## P5.3 — Critérios de aceite

```
Para cada tarefa, garanta critérios de aceite objetivos e verificáveis,
rastreáveis aos requisitos da spec quando possível.
```

## P5.4 — Dependências e ordem

```
Adicione as dependências entre as tarefas e reordene o backlog para respeitar a
ordem de implementação: tipos → funções puras → services → hook → componentes →
integração → testes → hardening.
```

## P5.5 — Tarefas de teste explícitas

```
Garanta tarefas dedicadas a: testes unitários da conversão de unidade, testes do
service com mock de fetch, testes de componentes nos estados loading/erro/vazio,
e testes E2E do fluxo principal (incluindo viewport mobile).
```

## P5.6 — Rastreabilidade

```
Crie uma tabela ligando cada requisito funcional da spec às tarefas que o
implementam. Aponte qualquer requisito que ainda não tenha tarefa correspondente.
```

## P5.7 — Estimar e priorizar

```
Classifique as tarefas por prioridade (P0/P1/P2) e por tamanho relativo
(P/M/G). Sugira uma sequência de entrega em "fatias verticais" que produza algo
visível o quanto antes.
```

## P5.8 — Preparar delegação ao Coding Agent

```
Você é o Coding Agent do projeto SDD Weather App. Implemente somente a tarefa
abaixo, respeitando a spec, o plano técnico e as instruções do repositório.

## Tarefa

**T-01 — Criar os tipos de dados meteorológicos**

- **Tipo:** Data
- **Descrição:** Definir os contratos TypeScript compartilhados para cidade,
	clima atual, previsão, unidade e dados meteorológicos completos.
- **Dependências:** Nenhuma.

## Contexto do produto

O Weather App é uma SPA em React + TypeScript + Vite que consulta a API
Open-Meteo. A aplicação busca uma cidade, permite selecionar um resultado,
carrega o clima atual e exibe a previsão de cinco dias. A temperatura recebida
e armazenada internamente deve permanecer em Celsius; Fahrenheit será derivado
somente pela camada de apresentação em uma tarefa posterior.

Os tipos devem ser contratos internos estáveis. Eles não devem conhecer React,
`fetch`, URLs, payloads externos ou estado de componentes.

## Escopo de implementação

Crie ou atualize somente o arquivo abaixo:

- `src/types/weather.ts`

Defina os seguintes tipos e interfaces:

- `Unit`: união literal `'celsius' | 'fahrenheit'`.
- `City`: `id`, `name`, `countryCode`, `country`, `latitude` e `longitude`
	obrigatórios; `region` e `timezone` opcionais.
- `CurrentWeather`: `time`, `temperatureC` e `weatherCode` obrigatórios;
	`windSpeedKmh` opcional.
- `ForecastDay`: `date`, `weatherCode`, `temperatureMinC`,
	`temperatureMaxC` e `precipitationProbability` obrigatórios.
- `WeatherData`: `city`, `current`, `forecast` e `unit` obrigatórios.

Use `number` para identificadores numéricos, coordenadas, temperaturas,
velocidade do vento, códigos e probabilidades; use `string` para nomes, datas,
códigos de país e fuso horário. Preserve os nomes dos campos usados pelo plano
para manter compatibilidade com services, hooks e componentes futuros.

## Critérios de aceite

1. O arquivo `src/types/weather.ts` existe e exporta `Unit`, `City`,
	 `CurrentWeather`, `ForecastDay` e `WeatherData`.
2. Os campos obrigatórios e opcionais correspondem exatamente ao contrato acima.
3. Os campos de temperatura usam nomes que deixam explícito que os valores
	 persistidos são Celsius (`temperatureC`, `temperatureMinC` e
	 `temperatureMaxC`).
4. `WeatherData` consegue representar a cidade selecionada, o clima atual,
	 uma lista de previsão e a unidade ativa sem usar `any` ou campos genéricos.
5. O código compila em TypeScript strict e não introduz dependências de
	 runtime.
6. Nenhum service, hook, componente, chamada de API ou conversão de unidade é
	 implementado nesta tarefa.

## Regras do repositório

- Identificadores, nomes de arquivos e tipos permanecem em inglês.
- Documentação e comentários, se realmente necessários, devem estar em
	pt-BR.
- Não altere arquivos fora do escopo sem justificar uma necessidade de
	compilação.
- Não adicione funcionalidades das tarefas posteriores.

## Validação

Após editar, execute pelo menos `pnpm build` e confirme que o TypeScript strict
compila. Se os scripts estiverem disponíveis, execute também `pnpm lint`.
Não implemente testes de integração ou E2E nesta tarefa; os testes de contrato
e comportamento pertencem às tarefas posteriores do backlog.

Ao concluir, informe:

1. quais tipos foram criados;
2. quais arquivos foram alterados;
3. quais comandos de validação foram executados e seus resultados;
4. qualquer decisão ou bloqueio relevante.
```
