# Plano Técnico — Weather App

## Architecture

O projeto será uma Single Page Application cliente-only, construída com React + TypeScript e Vite. A arquitetura será deliberadamente simples, com separação em camadas funcionais para manter o MVP fácil de evoluir sem introduzir complexidade desnecessária.

### Visão arquitetural

- Apresentação (`components`): componentes React responsáveis por renderizar dados, receber eventos e expor estados acessíveis. Não conhecem URLs, `fetch` nem detalhes do payload da Open-Meteo.
- Orquestração e estado (`hooks`): coordena busca, seleção de cidade, carregamento, retry, erro e unidade ativa. Consome services e entrega dados já prontos para a apresentação.
- Acesso a dados (`services`): encapsula chamadas HTTP, parâmetros dos endpoints, timeout e normalização das respostas da Open-Meteo para os contratos internos.
- Funções puras (`lib`): concentra validação, conversão de temperatura, mapeamento de códigos WMO e transformações determinísticas. Não acessa React, rede ou estado global.

### Direção das dependências

As dependências devem fluir para baixo: `components -> hooks -> services/lib`. Os módulos de `lib` não dependem das outras camadas, e os componentes não devem chamar a Open-Meteo diretamente. Os tipos compartilhados ficam em `types` e podem ser importados por qualquer camada sem conter lógica de execução.

### Decisões principais

- O estado interno da aplicação permanece em Celsius; conversão para Fahrenheit acontece apenas na camada de apresentação.
- Não haverá backend próprio; a API externa será consumida diretamente pelo cliente.
- A experiência principal será orientada a uma única jornada: buscar cidade, escolher resultado, visualizar clima atual e previsão de 5 dias.
- O controle de estados será explícito: idle, loading, empty, success e error.

### Estrutura lógica

1. Usuário digita texto de busca.
2. A aplicação valida a entrada e dispara consulta de geocoding.
3. A lista de resultados é exibida com contexto geográfico.
4. O usuário seleciona um item e a aplicação busca clima atual e previsão.
5. O estado da tela é renderizado conforme o payload recebido.
6. Se a unidade for alterada, o componente de apresentação reprocessa apenas os valores visuais sem nova busca.

### Justificativa da separação

- Componentes focados em UI podem ser testados com Testing Library usando estados e callbacks controlados, sem depender da rede.
- Hooks podem ser testados verificando transições de estado com services simulados por contrato, sem renderizar a aplicação inteira.
- Services podem ser testados com respostas HTTP controladas, garantindo URL, parâmetros, timeout e rejeição de payloads inválidos.
- Funções em `lib` podem ser testadas como funções puras, cobrindo casos-limite de validação, arredondamento, conversão e códigos meteorológicos sem mocks.
- A separação permite trocar a API ou reorganizar a interface sem misturar mudanças de infraestrutura com regras de apresentação.

## Tech Stack

- React 19 para renderização e composição de UI.
- TypeScript em modo estrito para contratos de dados e segurança de tipos.
- Vite como ferramenta de build e dev server.
- Tailwind CSS para estilização com tema dark glassmorphism.
- Vitest + Testing Library para testes unitários e de integração.
- Playwright para testes end-to-end da jornada principal.
- Open-Meteo como fonte de dados, sem API key.

### Observações de stack

- Não será necessário Redux, Zustand ou qualquer biblioteca de estado global, pois o escopo é pequeno e os dados circulam em poucos níveis de componentes.
- A ausência de backend elimina a necessidade de autenticação, persistência server-side e infraestrutura adicional.

## Project Structure

A estrutura proposta mantém os módulos pequenos, explicita a arquitetura em camadas e evita over-engineering.

- src/
  - App.tsx
  - main.tsx
  - components/
    - SearchBar.tsx
    - SearchResults.tsx
    - WeatherSummary.tsx
    - ForecastList.tsx
    - UnitToggle.tsx
    - EmptyState.tsx
    - ErrorState.tsx
    - LoadingState.tsx
  - hooks/
    - useCitySearch.ts
    - useWeatherQuery.ts
  - services/
    - openMeteoService.ts
    - httpClient.ts
  - lib/
    - temperature.ts
    - weatherCode.ts
    - validation.ts
    - weatherMapper.ts
  - types/
    - weather.ts
  - styles/
    - index.css

- tests/
  - unit/
    - openMeteoService.test.ts
    - temperature.test.ts
    - validation.test.ts
  - e2e/
    - weather-flow.spec.ts

### Diretórios de responsabilidade

- components: renderização e interação visual.
- hooks: orquestração de estado e coordenação do fluxo da tela.
- services: acesso HTTP à Open-Meteo, timeout e adaptação de respostas externas.
- lib: funções puras sem efeitos colaterais, como validação, conversão, mapeamento e normalização.
- types: contratos estáticos compartilhados.
- styles: estilos globais e tokens visuais da aplicação.

## Data Model

Os contratos abaixo representam o modelo mínimo necessário para o MVP, priorizando clareza e compatibilidade com os dados da Open-Meteo.

```ts
export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  /** Identificador da cidade no serviço de geocoding. */
  id: number;

  /** Nome da cidade. */
  name: string;

  /** Código ISO do país. */
  countryCode: string;

  /** Nome do país. */
  country: string;

  /** Estado, província ou região, quando disponível. */
  region?: string;

  /** Latitude em graus decimais. */
  latitude: number;

  /** Longitude em graus decimais. */
  longitude: number;

  /** Fuso horário IANA, quando disponível. */
  timezone?: string;
}

export interface CurrentWeather {
  /** Data e hora local da medição. */
  time: string;

  /** Temperatura atual, armazenada em Celsius. */
  temperatureC: number;

  /** Código meteorológico WMO. */
  weatherCode: number;

  /** Velocidade do vento em km/h, quando disponível. */
  windSpeedKmh?: number;
}

export interface ForecastDay {
  /** Data local no formato YYYY-MM-DD. */
  date: string;

  /** Código meteorológico WMO do dia. */
  weatherCode: number;

  /** Temperatura mínima, armazenada em Celsius. */
  temperatureMinC: number;

  /** Temperatura máxima, armazenada em Celsius. */
  temperatureMaxC: number;

  /** Maior probabilidade de precipitação do dia, em percentual. */
  precipitationProbability: number;
}

export interface WeatherData {
  /** Cidade usada como referência para a consulta. */
  city: City;

  /** Condições meteorológicas atuais. */
  current: CurrentWeather;

  /** Hoje mais os quatro dias seguintes, em ordem cronológica. */
  forecast: ForecastDay[];

  /** Unidade usada para apresentar os valores ao usuário. */
  unit: Unit;
}
```

### Regras de modelagem

- Os dados em memória serão normalizados para o formato interno do app.
- A temperatura sempre será armazenada em Celsius; conversão só ocorrerá em renderização.
- O tipo `WeatherData` só deve representar estado de sucesso quando cidade, clima atual e cinco dias de previsão forem válidos.
- `region`, `timezone` e `windSpeedKmh` são opcionais porque podem não estar presentes em todas as respostas da Open-Meteo.

## Data Flow

### Diagrama

```mermaid
flowchart LR
  A[Input de busca] --> B{Texto válido?}
  B -->|Não, vazio ou inválido| E1[Estado empty: orientar nova busca]
  B -->|Sim| C[Service de geocoding]
  C -->|Falha de rede ou payload inválido| E2[Estado error: oferecer retry]
  C -->|Nenhum resultado| E3[Estado empty: cidade não encontrada]
  C -->|Resultados City[]| D[Seleção de cidade]
  D --> F[Service de forecast]
  F -->|Falha de rede ou payload incompleto| E4[Estado error: oferecer retry]
  F -->|WeatherData normalizado| G[Hook de estado]
  G --> H[Componentes de UI]
  H -->|Alterar unidade| G
```

### Fluxo principal

1. Input do usuário em SearchBar.
2. Validação com regras de texto, espaços e limite de 80 caracteres.
3. Chamada ao serviço de geocoding com term search.
4. Resposta recebida e transformada em `City[]`.
5. Lista exibida com contexto regional e país.
6. Seleção da cidade dispara requisição de clima atual + previsão.
7. Dados são normalizados e montados em `WeatherData`.
8. UI renderiza success, empty ou error conforme payload.
9. Toggle de temperatura só altera a apresentação.

### Fluxo de falha

- Entrada vazia: bloqueio de ação e mensagem informativa.
- API sem resultados: estado empty.
- Falha de rede: estado error com retry.
- Resposta incompleta: rejeição de payload e exibição de erro.

## External APIs

### Open-Meteo — geocoding

Responsável por localizar cidades a partir do texto do usuário.

Endpoint:

`https://geocoding-api.open-meteo.com/v1/search`

Parâmetros relevantes:

- `name`: termo digitado, depois de remover espaços nas extremidades.
- `count=5`: limita a resposta aos cinco resultados previstos pela spec.
- `language=pt`: solicita nomes e contexto em português quando disponíveis.
- `format=json`: define o formato da resposta.

Exemplo resumido de resposta:

```json
{
  "results": [
    {
      "id": 3451190,
      "name": "São Paulo",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "country_code": "BR",
      "country": "Brasil",
      "admin1": "São Paulo",
      "timezone": "America/Sao_Paulo"
    }
  ]
}
```

Mapeamento para `City`:

- `id` -> `City.id`
- `name` -> `City.name`
- `country_code` -> `City.countryCode`
- `country` -> `City.country`
- `admin1` (ou `admin2` como fallback) -> `City.region`
- `latitude` -> `City.latitude`
- `longitude` -> `City.longitude`
- `timezone` -> `City.timezone`

Quando `results` estiver ausente ou vazio, o serviço deve retornar uma lista vazia e a aplicação deve entrar no estado `empty`.

### Open-Meteo — forecast

Responsável por retornar clima atual e previsão de 5 dias.

Endpoint:

`https://api.open-meteo.com/v1/forecast`

Parâmetros relevantes:

- `latitude`: latitude da cidade selecionada.
- `longitude`: longitude da cidade selecionada.
- `current=temperature_2m,weather_code,wind_speed_10m`: dados necessários para o clima atual.
- `daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max`: dados necessários para a previsão diária.
- `temperature_unit=celsius`: mantém a fonte de verdade interna em Celsius.
- `timezone=auto`: retorna datas e horários no fuso da coordenada consultada, evitando deslocamento pelo timezone do navegador.
- `forecast_days=5`: solicita hoje mais os quatro dias seguintes.

Exemplo resumido de resposta:

```json
{
  "timezone": "America/Sao_Paulo",
  "current": {
    "time": "2026-08-12T10:00",
    "temperature_2m": 18.4,
    "weather_code": 3,
    "wind_speed_10m": 12.5
  },
  "daily": {
    "time": ["2026-08-12", "2026-08-13"],
    "weather_code": [3, 61],
    "temperature_2m_max": [22.1, 20.3],
    "temperature_2m_min": [14.2, 13.8],
    "precipitation_probability_max": [20, 65]
  }
}
```

Mapeamento para `CurrentWeather`:

- `current.time` -> `CurrentWeather.time`
- `current.temperature_2m` -> `CurrentWeather.temperatureC`
- `current.weather_code` -> `CurrentWeather.weatherCode`
- `current.wind_speed_10m` -> `CurrentWeather.windSpeedKmh`
- `current.weather_code` também deve ser convertido pelo utilitário de códigos WMO para a descrição exibida na interface.

Mapeamento para `ForecastDay`:

- para cada índice `i` dos arrays `daily`, `daily.time[i]` -> `ForecastDay.date`;
- `daily.weather_code[i]` -> `ForecastDay.weatherCode`;
- `daily.temperature_2m_min[i]` -> `ForecastDay.temperatureMinC`;
- `daily.temperature_2m_max[i]` -> `ForecastDay.temperatureMaxC`;
- `daily.precipitation_probability_max[i]` -> `ForecastDay.precipitationProbability`.

O serviço deve validar que os cinco arrays diários possuem pelo menos cinco posições válidas, datas únicas e ordem cronológica. Caso contrário, deve rejeitar o payload como incompleto em vez de renderizar uma previsão parcial.

Mapeamento para `WeatherData`:

- `City` selecionada no resultado do geocoding -> `WeatherData.city`;
- objeto `current` normalizado -> `WeatherData.current`;
- arrays `daily` transformados em cinco objetos -> `WeatherData.forecast`;
- `unit: 'celsius'` no estado inicial, sem alterar os valores Celsius recebidos pela API -> `WeatherData.unit`.

### Contrato de normalização

Toda resposta externa deve ser convertida para os tipos internos antes de chegar ao estado da UI. A camada de serviço será responsável por:

- validar presença de campos essenciais;
- mapear códigos meteorológicos para texto legível;
- tratar dados ausentes e incompletos;
- rejeitar resposta que não converja com o contrato mínimo do MVP.

## State Management

A solução mais adequada para esse MVP é o estado local com hooks, sem biblioteca adicional.

### Estratégia

- `App` mantém somente o estado de apresentação compartilhado: a unidade ativa (`Unit`).
- `useCitySearch` mantém o estado da busca: texto digitado, resultados, status da busca e erro associado.
- `useWeatherQuery` mantém o estado meteorológico: cidade selecionada, `WeatherData`, status do carregamento e erro associado.
- Os componentes recebem estado e callbacks por propriedades; não acessam services nem mantêm cópias locais dos dados meteorológicos.

### Estados explícitos

Cada fluxo usa um status discriminado próprio, permitindo que uma busca e o carregamento do clima sejam representados sem estados contraditórios:

```ts
type RequestStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';
```

#### Estado da busca

- `idle`: a tela foi aberta e nenhuma busca foi executada.
- `loading`: a consulta de geocoding está em andamento; resultados antigos não devem ser tratados como resultado da nova consulta.
- `success`: existem de um a cinco objetos `City` válidos para seleção.
- `empty`: a API respondeu sem cidades correspondentes.
- `error`: ocorreu falha de rede, timeout, HTTP ou payload inválido.

#### Estado do clima

- `idle`: nenhuma cidade foi selecionada.
- `loading`: o forecast da cidade selecionada está em andamento.
- `success`: existe `WeatherData` válido com clima atual e exatamente cinco dias de previsão.
- `empty`: não é esperado para forecast; deve ser convertido em `error` se a API não fornecer dados suficientes.
- `error`: ocorreu falha ao carregar ou validar os dados meteorológicos.

O estado `empty` é necessário para a busca, enquanto é preservado no contrato de estados por consistência. Para o clima, uma resposta sem dados ou parcial não deve ser exibida como vazio: deve resultar em erro acionável.

### Conversão de unidade

- A API é consultada com `temperature_unit=celsius`.
- `CurrentWeather.temperatureC`, `ForecastDay.temperatureMinC` e `ForecastDay.temperatureMaxC` permanecem em Celsius durante todo o fluxo.
- A unidade ativa começa como `celsius` e é alterada localmente pelo `UnitToggle`.
- Componentes de apresentação usam funções puras de `lib/temperature.ts` para derivar os valores exibidos:
  - Celsius: `display = valueC`;
  - Fahrenheit: `display = (valueC * 9 / 5) + 32`.
- O resultado deve ser arredondado apenas para exibição, sem substituir o valor Celsius armazenado.
- Alterar a unidade atualiza a renderização de clima atual e previsão imediatamente, sem executar novo request, alterar a cidade ou resetar os status.

### Vantagens

- baixa curva de aprendizado;
- menos dependências;
- simetria com o escopo pequeno;
- fácil manutenção e refatoração.

### Limitações

- não é ideal para crescimento complexo com múltiplas telas;
- para futuras versões com cache global, histórico persistente ou autenticação, a adoção de uma solução mais robusta pode ser necessária.

## Error Handling

O tratamento de erro será padronizado em uma estrutura simples e previsível.

### Categorias de erro

- Entrada inválida: texto vazio, somente espaços, caracteres não suportados.
- Busca sem resultado: geocoding retorna vazio.
- Falha de rede: `fetch` rejeita a chamada, não há conexão ou o navegador não consegue obter uma resposta.
- Erro HTTP/API: a API responde com status não-2xx ou um payload com erro explícito.
- Timeout: a requisição excede o limite definido pelo cliente e é abortada.
- Payload incompleto: ausência de campos essenciais, valores nulos ou tipos inesperados.
- Dados inconsistentes: previsão com menos de cinco dias válidos, datas duplicadas ou arrays diários desalinhados.

### Estratégia por categoria

- Rede: converter a falha para um erro de domínio recuperável, preservar a UI e oferecer retry.
- HTTP/API: não tentar interpretar o payload como sucesso; exibir `Não foi possível carregar os dados do clima` e permitir nova tentativa.
- Timeout: abortar a requisição, usar a mensagem `A requisição demorou demais. Tente novamente.` e manter a última cidade selecionada sem inventar dados novos.
- Resposta parcial ou inválida: rejeitar a resposta na camada `services`/`lib`, não atualizar `WeatherData` e exibir o estado `error`.
- Sem resultados no geocoding: não é erro técnico; atualizar o status da busca para `empty` e exibir `Nenhuma cidade encontrada`.

Os erros devem ser normalizados em uma categoria interna simples, por exemplo `network`, `api`, `timeout`, `invalid-data` e `no-results`, para que a UI não dependa de mensagens ou formatos da Open-Meteo.

### Política da UI

- Nunca renderizar dados parciais como válidos.
- Exibir mensagem humana e direta em português do Brasil.
- Preservar a estabilidade da UI; o erro não deve quebrar o layout geral.
- Ativar retry em ações principais quando a falha for recuperável, repetindo a operação com os mesmos parâmetros.
- Não substituir dados válidos por um payload inválido; quando não houver dados anteriores, exibir o estado de erro no lugar do conteúdo meteorológico.

### Mensagens esperadas

- Digite o nome de uma cidade
- Nenhuma cidade encontrada
- Não foi possível carregar os dados do clima
- A requisição demorou demais. Tente novamente.

## Testing Strategy

A estratégia será orientada pelos critérios de aceite e pela separação de camadas do plano. Vitest cobre regras determinísticas, integração controlada e estados de componentes; Playwright cobre a jornada real no navegador e a adaptação responsiva.

### Vitest

#### Funções puras

Cobrir em isolamento as funções de `lib/`, sem rede ou renderização:

- sanitização e validação de busca, incluindo vazio, espaços, limite de 80 caracteres e caracteres inválidos;
- conversão Celsius/Fahrenheit, incluindo valores negativos, decimais, zero e arredondamento somente para apresentação;
- mapeamento de códigos WMO conhecidos e comportamento para código desconhecido;
- normalização do geocoding para `City`;
- normalização do forecast para `CurrentWeather`, `ForecastDay` e `WeatherData`;
- rejeição de arrays diários com menos de cinco itens, datas duplicadas ou comprimentos desalinhados.

#### Services com mock de `fetch`

Testar `openMeteoService` com `fetch` controlado para verificar comportamento observável, não detalhes da implementação:

- montagem correta das URLs e parâmetros de geocoding e forecast;
- transformação de respostas válidas da Open-Meteo para os tipos internos;
- resposta HTTP não-2xx;
- rejeição de payload JSON inválido ou incompleto;
- falha de rede (`fetch` rejeitado);
- timeout e cancelamento da requisição;
- resposta de geocoding sem resultados;
- retry usando os mesmos parâmetros quando essa ação for acionada pelo fluxo.

Os testes não devem depender da API real, evitando flutuação por rede, latência, limites de uso ou alterações externas.

#### Componentes e hooks

Usar Testing Library para testar a experiência por estado e interação acessível:

- `SearchBar`: envio válido, bloqueio de entrada vazia, limite de caracteres e labels semânticos;
- `SearchResults`: renderização de até cinco cidades, contexto regional e seleção por teclado/click;
- loading: indicador acessível durante busca ou forecast, sem conteúdo parcial apresentado como sucesso;
- empty: mensagem `Nenhuma cidade encontrada` após busca sem resultados;
- error: mensagens de rede, API, timeout e payload inválido, incluindo ação de retry;
- success: clima atual, cinco dias em ordem cronológica e probabilidade de precipitação;
- `UnitToggle`: estado ativo, conversão imediata de todos os valores e ausência de nova chamada de serviço;
- hooks: transições `idle -> loading -> success/empty/error`, preservação da cidade e descarte de resposta inválida.

### Playwright

Playwright deve validar a aplicação montada no navegador, com as chamadas externas interceptadas para tornar os cenários determinísticos.

#### Fluxos E2E

- busca de uma cidade válida, seleção do resultado e visualização do clima atual;
- renderização da previsão com cinco dias, temperaturas mínima/máxima e precipitação;
- cidade inexistente com empty state;
- falha de rede, resposta HTTP inválida, timeout e payload parcial com mensagens adequadas;
- retry após falha recuperável;
- alternância Celsius/Fahrenheit sem nova requisição;
- cidade homônima com contexto regional suficiente para selecionar o item correto;
- navegação por teclado no fluxo principal e foco visível nos controles.

#### Viewport mobile

Executar os cenários críticos também em pelo menos um viewport mobile representativo, por exemplo `375x667`, e em um viewport desktop, por exemplo `1440x900`:

- garantir que campo de busca, resultados, clima atual, previsão e controles estejam visíveis sem sobreposição ou overflow horizontal;
- verificar que a lista de cinco dias mantém ordem e conteúdo em telas estreitas;
- validar que loading, erro e empty state permanecem legíveis e acionáveis no mobile;
- usar screenshots apenas como apoio para regressão visual pontual, mantendo assertions semânticas como fonte principal do teste.

### Critérios de cobertura mínima

- todas as funções puras de `lib/` devem ter casos para caminho válido e principais bordas;
- todos os estados explícitos (`idle`, `loading`, `success`, `empty` e `error`) devem ser exercitados em testes de componente ou hook;
- services devem cobrir sucesso, falha de rede, HTTP, timeout e payload inválido;
- Playwright deve cobrir a jornada principal em desktop e mobile.

## Risks & Trade-offs

### Riscos principais

- Dependência de API externa: latência, indisponibilidade e variação de payload.
- Ambiguidade geográfica: cidades com mesmo nome em diferentes regiões.
- Dados incompletos: a API pode responder parcialmente ou sem alguns campos esperados.
- Experiência mobile: a conferência visual de legibilidade e acessibilidade será crítica.

### Trade-offs adotados

- Simplicidade sobre funcionalidade avançada: sem backend, sem autenticação, sem cache distribuído.
- Estado local sobre arquitetura pesada: reduz esforço inicial e mantém código mais previsível.
- Celsius como fonte de verdade interna: reduz complexidade e evitar inconsistência de dados.
- Conversão de unidade no cliente: excelente para MVP, mas depende da lógica de renderização estar correta.
- Mock de `fetch` nos testes de service: mantém os testes rápidos e determinísticos, com o custo de não validar a disponibilidade real da Open-Meteo.
- Playwright com requests interceptados: evita E2E instável, mas exige que os fixtures representem fielmente os contratos externos.
- Assertions semânticas sobre screenshots: detectam melhor comportamento e acessibilidade; screenshots ficam reservados para regressões visuais selecionadas.

### Alternativas consideradas

- React Query ou TanStack Query: ofereceria cache, deduplicação e retry prontos, mas adicionaria complexidade antes de o MVP precisar de estado remoto compartilhado.
- Redux ou Zustand: facilitariam um store global, porém o fluxo atual cabe em hooks locais e não exige múltiplos consumidores distantes.
- MSW para interceptação HTTP: é uma alternativa válida para simular requests em vários níveis; foi deixada como evolução caso o número de services e cenários cresça. Para o MVP, mockar `fetch` diretamente mantém a configuração menor.
- Cypress: atenderia aos testes E2E, mas Playwright já está definido no stack e oferece suporte direto aos viewports e interceptação necessários.
- Testes E2E contra a Open-Meteo real: aproximariam o ambiente de produção, mas seriam lentos e sujeitos a indisponibilidade; a integração real deve ser validada manualmente ou em um smoke check separado, fora da suíte determinística.

### Mitigações

- Normalizar toda resposta externa antes de atualizar o estado.
- Exibir contexto regional em todos os resultados de geocoding.
- Tratar falhas com mensagens explícitas e retry funcional.
- Validar a UI em mobile e desktop logo no início do desenvolvimento.

## Conclusão

Este plano preserva o foco do MVP definido pela especificação: busca por cidade, visão do clima atual, previsão de 5 dias, troca de unidade e tratamento claro de estados de erro e vazio. A proposta prioriza simplicidade, contratos sólidos e baixa complexidade operacional, mantendo caminho natural para evoluções futuras sem reescrever a base do app.