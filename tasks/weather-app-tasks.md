# Backlog de Tarefas — Weather App

Tarefas derivadas de `plans/weather-app-plan.md`. A ordem segue o fluxo de
implementação: tipos → funções puras → services → hooks → componentes →
integração → testes → hardening. Cada dependência aponta apenas para tarefas
anteriores.

## Entrega 1 — Tipos e contratos

### T-01 — Criar os tipos de dados meteorológicos

- **Tipo:** Data
- **Descrição:** Definir os contratos compartilhados para cidade, clima atual, previsão, unidade e dados completos.
- **Critérios de aceite:** `City`, `CurrentWeather`, `ForecastDay`, `WeatherData` e `Unit` representam o plano; temperaturas internas são Celsius; `WeatherData` descreve cidade, clima atual e cinco dias.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`.

### T-02 — Criar status e erros de domínio

- **Tipo:** Data
- **Descrição:** Definir estados de request e categorias de erro usadas por services e hooks.
- **Critérios de aceite:** Status inclui `idle`, `loading`, `success`, `empty` e `error`; erros incluem `network`, `api`, `timeout`, `invalid-data` e `no-results`; os tipos não dependem de React.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/types/weather.ts`.

## Entrega 2 — Funções puras e normalização

### T-03 — Implementar validação da busca

- **Tipo:** Data
- **Descrição:** Validar o termo de busca sem efeitos colaterais.
- **Critérios de aceite:** Vazio, somente espaços, mais de 80 caracteres e caracteres não suportados são rejeitados; o resultado é determinístico.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/validation.ts`.

### T-04 — Implementar sanitização da busca

- **Tipo:** Data
- **Descrição:** Remover espaços periféricos antes da consulta.
- **Critérios de aceite:** Espaços no início e fim são removidos; conteúdo interno permanece igual; a função não acessa rede ou estado.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/validation.ts`.

### T-05 — Implementar conversão de temperatura

- **Tipo:** Data
- **Descrição:** Converter Celsius para Fahrenheit e arredondar apenas o valor de apresentação.
- **Critérios de aceite:** Celsius permanece inalterado; Fahrenheit usa `(valueC * 9 / 5) + 32`; negativos, zero e decimais são tratados; a fonte Celsius não é substituída.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/temperature.ts`.

### T-06 — Implementar mapeamento de códigos WMO

- **Tipo:** Data
- **Descrição:** Mapear códigos meteorológicos para descrições em pt-BR.
- **Critérios de aceite:** Códigos conhecidos têm descrição legível; código desconhecido tem fallback; a função é pura.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/weatherCode.ts`.

### T-07 — Normalizar resultados de geocoding

- **Tipo:** Data
- **Descrição:** Converter payload externo de geocoding em `City[]`.
- **Critérios de aceite:** Campos essenciais são validados; `admin1` ou `admin2` vira região; coordenadas, país e timezone são mapeados; `results` ausente ou vazio retorna lista vazia.
- **Dependências:** T-01, T-02.
- **Arquivos prováveis:** `src/lib/weatherMapper.ts`.

### T-08 — Normalizar clima atual

- **Tipo:** Data
- **Descrição:** Converter `current` da Open-Meteo para `CurrentWeather`.
- **Critérios de aceite:** Tempo, temperatura, código e vento são mapeados; temperatura permanece Celsius; campos essenciais inválidos geram `invalid-data`.
- **Dependências:** T-01, T-02.
- **Arquivos prováveis:** `src/lib/weatherMapper.ts`.

### T-09 — Normalizar os cinco dias de forecast

- **Tipo:** Data
- **Descrição:** Transformar arrays `daily` em cinco objetos `ForecastDay`.
- **Critérios de aceite:** Campos são mapeados por índice; menos de cinco itens, comprimentos desalinhados, datas duplicadas ou ordem inválida são rejeitados.
- **Dependências:** T-01, T-02.
- **Arquivos prováveis:** `src/lib/weatherMapper.ts`.

### T-10 — Montar `WeatherData` completo

- **Tipo:** Data
- **Descrição:** Combinar cidade, clima atual e forecast em um contrato de sucesso.
- **Critérios de aceite:** Cidade selecionada é preservada; resultado contém exatamente cinco dias; unidade inicial é `celsius`; payload parcial não é aceito.
- **Dependências:** T-07, T-08, T-09.
- **Arquivos prováveis:** `src/lib/weatherMapper.ts`.

## Entrega 3 — Services

### T-11 — Criar cliente HTTP com timeout

- **Tipo:** Data
- **Descrição:** Encapsular `fetch`, abortamento por timeout e falhas de rede.
- **Critérios de aceite:** Request excedendo o limite é abortado e gera `timeout`; falha de transporte gera `network`; detalhes externos não chegam à UI.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/services/httpClient.ts`.

### T-12 — Tratar respostas HTTP e JSON

- **Tipo:** Data
- **Descrição:** Converter status não-2xx e JSON inválido em erros internos.
- **Critérios de aceite:** Status não-2xx nunca é sucesso; JSON inválido gera erro categorizado; o cliente não expõe payload bruto.
- **Dependências:** T-11.
- **Arquivos prováveis:** `src/services/httpClient.ts`.

### T-13 — Implementar service de geocoding

- **Tipo:** Data
- **Descrição:** Consultar a API de geocoding e retornar cidades normalizadas.
- **Critérios de aceite:** URL usa `name`, `count=5`, `language=pt` e `format=json`; termo é sanitizado; resultado tem no máximo cinco cidades ou lista vazia.
- **Dependências:** T-04, T-07, T-12.
- **Arquivos prováveis:** `src/services/openMeteoService.ts`.

### T-14 — Implementar service de forecast

- **Tipo:** Data
- **Descrição:** Consultar clima atual e previsão para a cidade selecionada.
- **Critérios de aceite:** URL usa coordenadas, campos `current`/`daily`, Celsius, `timezone=auto` e `forecast_days=5`; retorno é `WeatherData`; payload parcial é rejeitado.
- **Dependências:** T-08, T-09, T-10, T-12.
- **Arquivos prováveis:** `src/services/openMeteoService.ts`.

## Entrega 4 — Hooks de estado

### T-15 — Implementar hook de busca

- **Tipo:** Data
- **Descrição:** Coordenar termo, submissão, resultados e status do geocoding.
- **Critérios de aceite:** Inicia em `idle`; busca válida passa por `loading`; lista vazia termina em `empty`; sucesso retorna até cinco cidades; entrada inválida não chama service.
- **Dependências:** T-03, T-04, T-13.
- **Arquivos prováveis:** `src/hooks/useCitySearch.ts`.

### T-16 — Adicionar retry ao hook de busca

- **Tipo:** Data
- **Descrição:** Repetir a última busca após erro com os mesmos parâmetros sanitizados.
- **Critérios de aceite:** Retry só aparece após erro recuperável; repete a consulta sem alterar o termo; status volta a `loading`.
- **Dependências:** T-15.
- **Arquivos prováveis:** `src/hooks/useCitySearch.ts`.

### T-17 — Implementar hook de forecast

- **Tipo:** Data
- **Descrição:** Coordenar cidade selecionada, carregamento e `WeatherData`.
- **Critérios de aceite:** Inicia em `idle`; cidade selecionada passa por `loading`; só há `success` com dados completos; falha ou payload inválido termina em `error`, não `empty`.
- **Dependências:** T-14.
- **Arquivos prováveis:** `src/hooks/useWeatherQuery.ts`.

### T-18 — Adicionar retry e preservação da seleção

- **Tipo:** Data
- **Descrição:** Repetir forecast e preservar a cidade durante falhas.
- **Critérios de aceite:** Retry usa a mesma cidade; seleção permanece após erro; payload inválido não substitui dados válidos anteriores.
- **Dependências:** T-17.
- **Arquivos prováveis:** `src/hooks/useWeatherQuery.ts`.

## Entrega 5 — Componentes de UI

### T-19 — Implementar `SearchBar`

- **Tipo:** UI
- **Descrição:** Criar campo e formulário de busca acessíveis.
- **Critérios de aceite:** Campo possui label semântico; Enter submete; termo inválido é bloqueado; componente não acessa services diretamente.
- **Dependências:** T-03, T-15.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`.

### T-20 — Implementar `SearchResults`

- **Tipo:** UI
- **Descrição:** Exibir cidades com contexto e seleção por click ou teclado.
- **Critérios de aceite:** Até cinco itens são exibidos; nome, região e país aparecem; seleção e foco são acessíveis.
- **Dependências:** T-01, T-15.
- **Arquivos prováveis:** `src/components/SearchResults.tsx`.

### T-21 — Implementar estados de loading e vazio

- **Tipo:** UI
- **Descrição:** Criar componentes para carregamento e ausência de resultados.
- **Critérios de aceite:** Loading tem role/texto acessível e não mostra conteúdo parcial; empty exibe `Nenhuma cidade encontrada` e orientação adequada em pt-BR.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/components/LoadingState.tsx`, `src/components/EmptyState.tsx`.

### T-22 — Implementar estado de erro e retry

- **Tipo:** UI
- **Descrição:** Exibir mensagens humanas e acionar callbacks de retry.
- **Critérios de aceite:** Rede, API, timeout e payload inválido têm mensagens apropriadas; timeout exibe a mensagem definida no plano; retry é acessível.
- **Dependências:** T-02, T-16, T-18.
- **Arquivos prováveis:** `src/components/ErrorState.tsx`.

### T-23 — Implementar resumo do clima

- **Tipo:** UI
- **Descrição:** Renderizar cidade, temperatura, condição WMO e vento opcional.
- **Critérios de aceite:** Cidade e contexto aparecem; temperatura usa unidade ativa; condição usa mapeamento WMO; vento ausente não quebra a UI.
- **Dependências:** T-05, T-06, T-10, T-17.
- **Arquivos prováveis:** `src/components/WeatherSummary.tsx`.

### T-24 — Implementar lista de previsão

- **Tipo:** UI
- **Descrição:** Renderizar cinco dias com mínimas, máximas e precipitação.
- **Critérios de aceite:** Exatamente cinco dias aparecem em ordem; cada item mostra os campos previstos; conversão não altera Celsius interno.
- **Dependências:** T-05, T-10, T-17.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`.

### T-25 — Implementar `UnitToggle`

- **Tipo:** UI
- **Descrição:** Criar o controle acessível de Celsius/Fahrenheit.
- **Critérios de aceite:** Celsius começa ativo; alternância funciona nos dois sentidos; opção ativa é comunicada e operável por teclado.
- **Dependências:** T-01, T-05.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.

## Entrega 6 — Integração da aplicação

### T-26 — Criar a fundação do `App`

- **Tipo:** Infra
- **Descrição:** Configurar entrada React/Vite e renderização inicial da aplicação.
- **Critérios de aceite:** `pnpm dev` inicia; `main.tsx` monta o `App`; página inicial renderiza conteúdo válido.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/main.tsx`, `src/App.tsx`.

### T-27 — Conectar busca e seleção no `App`

- **Tipo:** UI
- **Descrição:** Integrar `useCitySearch` com `SearchBar`, `SearchResults` e estados de busca.
- **Critérios de aceite:** Submissão chama o hook; resultados aparecem; seleção envia a cidade ao fluxo meteorológico; loading, empty e erro de busca são exibidos.
- **Dependências:** T-15, T-16, T-19, T-20, T-21, T-22, T-26.
- **Arquivos prováveis:** `src/App.tsx`.

### T-28 — Conectar forecast e unidade no `App`

- **Tipo:** UI
- **Descrição:** Integrar `useWeatherQuery`, resumo, previsão, toggle e estados meteorológicos.
- **Critérios de aceite:** Seleção dispara forecast; success exibe resumo e cinco dias; erro oferece retry; unidade inicial é Celsius.
- **Dependências:** T-17, T-18, T-22, T-23, T-24, T-25, T-27.
- **Arquivos prováveis:** `src/App.tsx`.

### T-29 — Configurar Tailwind e estilos globais

- **Tipo:** Infra
- **Descrição:** Integrar Tailwind e os tokens visuais do tema da aplicação.
- **Critérios de aceite:** Tailwind é processado; estilos globais são importados; tokens podem ser usados pelos componentes.
- **Dependências:** T-26.
- **Arquivos prováveis:** `src/styles/index.css`, `tailwind.config.js`.

## Entrega 7 — Testes

### T-30 — Testar validação e sanitização

- **Tipo:** Test
- **Descrição:** Cobrir exclusivamente as regras do termo de busca.
- **Critérios de aceite:** Vazio, espaços, limite de 80 caracteres e caracteres inválidos são testados; remoção de espaços periféricos é verificada; não há rede.
- **Dependências:** T-03, T-04.
- **Arquivos prováveis:** `tests/unit/validation.test.ts`.

### T-31 — Testar conversão de unidade

- **Tipo:** Test
- **Descrição:** Testar exclusivamente a conversão Celsius/Fahrenheit usada na apresentação.
- **Critérios de aceite:** Celsius permanece inalterado; Fahrenheit usa a fórmula definida; negativos, zero, decimais e arredondamento de exibição são cobertos; o valor Celsius original não é substituído.
- **Dependências:** T-05.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.

### T-32 — Testar mapeamento WMO e normalização

- **Tipo:** Test
- **Descrição:** Cobrir códigos WMO e transformação dos payloads para os contratos internos.
- **Critérios de aceite:** Código conhecido e desconhecido são testados; payloads válidos são normalizados; campos inválidos, arrays curtos, desalinhados, duplicados ou fora de ordem são rejeitados; geocoding vazio retorna lista vazia.
- **Dependências:** T-06, T-07, T-08, T-09, T-10.
- **Arquivos prováveis:** `tests/unit/weatherCode.test.ts`, `tests/unit/weatherMapper.test.ts`.

### T-33 — Testar services com mock de `fetch`

- **Tipo:** Test
- **Descrição:** Testar exclusivamente o cliente HTTP e os services usando `fetch` controlado.
- **Critérios de aceite:** URLs e parâmetros de geocoding/forecast são verificados; sucesso, lista vazia, falha de rede, timeout, HTTP não-2xx, JSON inválido e payload parcial são cobertos; nenhum teste acessa a API real.
- **Dependências:** T-11, T-12, T-13, T-14.
- **Arquivos prováveis:** `tests/unit/httpClient.test.ts`, `tests/unit/openMeteoService.test.ts`.

### T-34 — Testar hooks de estado

- **Tipo:** Test
- **Descrição:** Verificar transições, retry, respostas obsoletas e preservação da cidade nos hooks.
- **Critérios de aceite:** Busca cobre `idle/loading/success/empty/error`; forecast cobre `idle/loading/success/error`; retry repete parâmetros; payload inválido não atualiza sucesso; cidade permanece selecionada após falha.
- **Dependências:** T-15, T-16, T-17, T-18, T-33.
- **Arquivos prováveis:** `tests/unit/useCitySearch.test.ts`, `tests/unit/useWeatherQuery.test.ts`.

### T-35 — Testar componentes nos estados loading, erro e vazio

- **Tipo:** Test
- **Descrição:** Testar exclusivamente os componentes de estados e suas ações acessíveis.
- **Critérios de aceite:** Loading possui role/texto acessível e não mostra sucesso parcial; empty exibe `Nenhuma cidade encontrada`; erro exibe mensagens de rede, API, timeout e payload inválido; retry chama o callback; estados são legíveis por teclado.
- **Dependências:** T-21, T-22.
- **Arquivos prováveis:** `tests/unit/statusComponents.test.tsx`.

### T-36 — Testar componentes de dados e unidade

- **Tipo:** Test
- **Descrição:** Testar resumo, previsão, resultados e `UnitToggle` com Testing Library.
- **Critérios de aceite:** Resultados exibem contexto e permitem seleção; resumo exibe condição e vento opcional; previsão exibe cinco dias em ordem; toggle converte valores sem novo request.
- **Dependências:** T-05, T-06, T-20, T-23, T-24, T-25.
- **Arquivos prováveis:** `tests/unit/weatherComponents.test.tsx`.

### T-37 — Testar integração do App

- **Tipo:** Test
- **Descrição:** Verificar a composição da jornada com hooks e componentes simulados.
- **Critérios de aceite:** Busca, seleção e forecast são conectados; os cinco estados da tela são renderizados; retry dispara a operação correta; payload parcial nunca aparece como sucesso.
- **Dependências:** T-27, T-28, T-34, T-35, T-36.
- **Arquivos prováveis:** `tests/unit/App.test.tsx`.

### T-38 — Testar E2E do fluxo principal em desktop e mobile

- **Tipo:** Test
- **Descrição:** Validar a jornada feliz completa no navegador, incluindo o viewport mobile representativo.
- **Critérios de aceite:** Busca, seleção, clima atual e cinco dias funcionam com fixtures; o cenário passa em `1440x900` e `375x667`; foco e teclado funcionam; requests são interceptados e não dependem da API real.
- **Dependências:** T-28, T-37.
- **Arquivos prováveis:** `tests/e2e/weather-flow.spec.ts`, `playwright.config.ts`.

### T-39 — Testar E2E de vazio, erro e retry

- **Tipo:** Test
- **Descrição:** Validar no navegador cidade inexistente, falhas recuperáveis e retry.
- **Critérios de aceite:** Empty, rede, HTTP, timeout e payload parcial exibem mensagens adequadas; retry recupera a falha; cidade homônima mostra contexto regional.
- **Dependências:** T-22, T-28, T-38.
- **Arquivos prováveis:** `tests/e2e/weather-errors.spec.ts`.

## Entrega 8 — Hardening e validação final

### T-40 — Ajustar layout responsivo e foco

- **Tipo:** UI
- **Descrição:** Corrigir navegação por teclado, foco visível e layout após os cenários de viewport.
- **Critérios de aceite:** Em `375x667` e `1440x900` não há sobreposição ou overflow horizontal; loading, empty e erro permanecem legíveis; a lista mantém cinco dias.
- **Dependências:** T-28, T-29, T-35, T-38.
- **Arquivos prováveis:** `src/styles/index.css`, `src/components/ForecastList.tsx`.

### T-41 — Executar validação final do MVP

- **Tipo:** Infra
- **Descrição:** Consolidar lint, build, testes unitários e E2E e corrigir regressões do plano.
- **Critérios de aceite:** `pnpm lint`, `pnpm build` e `pnpm test` passam; Playwright passa em desktop/mobile; testes não fazem requests reais nem exibem payload parcial.
- **Dependências:** T-03, T-30, T-31, T-32, T-33, T-34, T-35, T-36, T-37, T-38, T-39, T-40.
- **Arquivos prováveis:** `package.json`, `playwright.config.ts`, arquivos indicados por falhas de validação.

## Rastreabilidade dos requisitos funcionais

| Requisito da spec | Tarefas de implementação | Tarefas de teste | Cobertura |
| --- | --- | --- | --- |
| **RF1 — Busca de cidade por nome** | T-03, T-04, T-07, T-13, T-15, T-19, T-20, T-27 | T-30, T-34, T-36, T-37, T-38 | Completa |
| **RF2 — Seleção da cidade e carregamento do clima atual** | T-07, T-08, T-10, T-14, T-17, T-18, T-23, T-27, T-28 | T-32, T-33, T-34, T-36, T-37, T-38 | Completa |
| **RF3 — Previsão de 5 dias** | T-09, T-10, T-14, T-24, T-28 | T-32, T-33, T-36, T-37, T-38, T-40 | Completa |
| **RF4 — Alternância entre Celsius e Fahrenheit** | T-05, T-25, T-28 | T-31, T-36, T-37, T-38 | Completa |
| **RF5 — Estados de carregamento, vazio e erro** | T-02, T-11, T-12, T-15, T-17, T-21, T-22, T-27, T-28 | T-33, T-34, T-35, T-37, T-39, T-40 | Completa |
| **RF6 — Contexto geográfico dos resultados** | T-07, T-13, T-20, T-27 | T-32, T-36, T-37, T-38, T-39 | Completa |

### Requisitos sem tarefa correspondente

Nenhum requisito funcional da spec ficou sem tarefa correspondente. Os seis
requisitos (`RF1` a `RF6`) possuem tarefas de implementação e de teste.

## Prioridade e tamanho relativo

`P0` representa o caminho mínimo necessário para demonstrar o produto; `P1`
representa requisitos importantes, qualidade e cobertura de aceitação; `P2`
representa melhorias ou verificações que podem ser adiadas sem bloquear a
primeira fatia demonstrável. O tamanho é relativo: `P` (pequeno), `M` (médio)
ou `G` (grande).

| Tarefa | Prioridade | Tamanho | Justificativa resumida |
| --- | --- | --- | --- |
| T-01 | P0 | P | Contratos básicos da aplicação. |
| T-02 | P0 | P | Estados e erros usados no fluxo principal. |
| T-03 | P0 | P | Validação bloqueia entradas inválidas. |
| T-04 | P0 | P | Sanitização necessária antes da busca. |
| T-05 | P0 | P | Conversão necessária para a unidade da UI. |
| T-06 | P1 | M | Mapeamento de descrições meteorológicas. |
| T-07 | P0 | M | Adapta resultados de cidade ao modelo interno. |
| T-08 | P0 | P | Adapta o clima atual ao modelo interno. |
| T-09 | P0 | M | Valida e transforma os cinco dias. |
| T-10 | P0 | M | Impede sucesso com payload incompleto. |
| T-11 | P0 | M | Base de rede compartilhada pelos services. |
| T-12 | P0 | M | Normaliza HTTP e JSON antes da UI. |
| T-13 | P0 | M | Habilita busca real de cidades. |
| T-14 | P0 | M | Habilita carregamento real do forecast. |
| T-15 | P0 | M | Orquestra a busca e seus estados. |
| T-16 | P1 | P | Retry da busca após falha. |
| T-17 | P0 | M | Orquestra a consulta meteorológica. |
| T-18 | P1 | P | Retry e preservação da cidade. |
| T-19 | P0 | P | Entrada visível para iniciar a jornada. |
| T-20 | P0 | M | Seleção visível de uma cidade. |
| T-21 | P0 | P | Feedback visual de loading e vazio. |
| T-22 | P1 | M | Feedback de erro e ação de retry. |
| T-23 | P0 | M | Exibe o clima atual. |
| T-24 | P0 | M | Exibe a previsão de cinco dias. |
| T-25 | P1 | P | Controle de unidade da apresentação. |
| T-26 | P0 | P | Inicializa a aplicação executável. |
| T-27 | P0 | M | Primeira integração visível de busca e seleção. |
| T-28 | P0 | G | Integra forecast, estados e unidade no App. |
| T-29 | P0 | M | Habilita a apresentação visual consistente. |
| T-30 | P1 | P | Protege regras da busca com testes. |
| T-31 | P1 | P | Protege a conversão de unidade com testes. |
| T-32 | P2 | M | Amplia cobertura de mapeamento e normalização. |
| T-33 | P1 | G | Garante services sem dependência da API real. |
| T-34 | P1 | M | Garante transições corretas dos hooks. |
| T-35 | P1 | M | Garante estados loading, erro e vazio. |
| T-36 | P1 | M | Garante apresentação de dados e unidade. |
| T-37 | P1 | M | Garante a jornada integrada da tela. |
| T-38 | P1 | G | Valida o fluxo principal em desktop e mobile. |
| T-39 | P1 | M | Valida falhas, vazio e retry no navegador. |
| T-40 | P1 | M | Corrige foco, overflow e adaptação visual. |
| T-41 | P1 | M | Fecha a validação automatizada do MVP. |

## Sequência de entrega em fatias verticais

As fatias abaixo atravessam tipos, dados, estado e UI para produzir um
resultado observável ao final de cada etapa. A primeira fatia não espera toda a
suíte de testes para colocar uma tela utilizável em funcionamento.

### Fatia 1 — Buscar e listar cidades

**Objetivo visível:** o usuário abre a aplicação, digita uma cidade e vê até
cinco resultados com contexto regional.

**Tarefas:** T-01, T-02, T-03, T-04, T-07, T-11, T-12, T-13, T-15, T-19,
T-20, T-21, T-26, T-27, T-29.

### Fatia 2 — Selecionar cidade e mostrar clima atual

**Objetivo visível:** selecionar um resultado carrega e exibe temperatura,
condição e contexto da cidade escolhida.

**Tarefas:** T-08, T-10, T-14, T-17, T-18, T-22, T-23, T-28.

### Fatia 3 — Completar previsão e unidade

**Objetivo visível:** a tela exibe cinco dias e permite alternar entre Celsius
e Fahrenheit sem nova busca.

**Tarefas:** T-05, T-06, T-09, T-24, T-25, T-28.

### Fatia 4 — Proteger o caminho principal com testes

**Objetivo verificável:** regras, services, hooks, componentes e integração têm
feedback rápido contra regressões.

**Tarefas:** T-30, T-31, T-33, T-34, T-35, T-36, T-37.

### Fatia 5 — Validar navegador e cenários de falha

**Objetivo verificável:** o fluxo principal funciona em desktop/mobile e os
estados vazio, erro e retry são exercitados com fixtures.

**Tarefas:** T-38, T-39.

### Fatia 6 — Endurecer e fechar o MVP

**Objetivo de entrega:** corrigir problemas de layout/acessibilidade e concluir
lint, build, testes unitários e E2E.

**Tarefas:** T-32, T-40, T-41.