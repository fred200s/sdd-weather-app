# Ambiguidades e Lacunas do Briefing da Weather App

## Visão Geral

O briefing apresenta uma proposta funcional básica, mas ainda deixa muitos pontos críticos sem definição. Sem respostas claras, o produto pode ser entregue com suposições incompatíveis com as necessidades dos usuários, com a estratégia de negócio e com a viabilidade técnica. Abaixo está a análise de ambiguidades e lacunas, com uma pergunta em aberto para cada item e o impacto de seguir sem resposta.

## 1) Escopo do produto

### 1.1. O que exatamente significa “aplicação de previsão do tempo”?
Pergunta em aberto: a solução deve ser uma aplicação web simples, um PWA, ou um app de celular nativo? 
Impacto: se não for definida a forma de entrega, o time pode desenvolver uma solução no canal errado, gerando retrabalho, custo adicional e experiência inconsistente para o usuário.

### 1.2. O produto é apenas um consultor de clima ou também deve oferecer experiências avançadas?
Pergunta em aberto: a aplicação deve incluir apenas clima atual e previsão de 5 dias, ou também recursos como radar, alertas severos, mapas, índice UV, sensação térmica, qualidade do ar e histórico?
Impacto: sem esse limite, o time pode criar um escopo expandido demais, aumentando custo, tempo de desenvolvimento e complexidade sem garantia de valor para o usuário.

## 2) Usuário e público-alvo

### 2.1. Quem é o usuário principal?
Pergunta em aberto: a aplicação é para público geral, viajantes, pessoas que se deslocam diariamente, turistas ou usuários com foco em trabalho ao ar livre?
Impacto: sem conhecer o público principal, a interface, os dados exibidos e a prioridade de funcionalidades podem estar desalinhados com a necessidade real do cliente.

### 2.2. Qual é o contexto de uso principal?
Pergunta em aberto: o usuário acessa a aplicação em momentos de planejamento diário, em viagem, em trânsito ou em contexto de emergência?
Impacto: a interface pode não priorizar os casos de uso mais relevantes, reduzindo utilidade e aderência ao produto.

## 3) Pesquisa e localização

### 3.1. Como a busca por cidade deve funcionar?
Pergunta em aberto: a busca deve permitir digitar somente nome da cidade, ou também país, estado, código postal, coordenadas ou geolocalização automática?
Impacto: sem definir a lógica de busca, o produto pode devolver resultados ambíguos, frustrar o usuário e reduzir a confiança na aplicação.

### 3.2. O que acontece em cidades com nomes repetidos?
Pergunta em aberto: como o sistema deve lidar com cidades com o mesmo nome em países diferentes?
Impacto: se não houver clareza, usuários podem selecionar a cidade errada e tomar decisões baseadas em dados incorretos.

### 3.3. A geolocalização deve ser automática?
Pergunta em aberto: a aplicação deve localizar o usuário automaticamente e sugerir a cidade mais próxima, ou deve depender apenas da busca manual?
Impacto: sem resposta, a aplicação pode ficar menos útil em cenários de uso rápido e móvel, e perder competitividade em comparação com apps de clima existentes.

## 4) Dados climáticos e qualidade de informação

### 4.1. Quais dados meteorológicos são essenciais?
Pergunta em aberto: além da temperatura e descrição do clima, o produto precisa mostrar umidade, vento, sensação térmica, chance de chuva, pressão atmosférica, índice UV ou outros indicadores?
Impacto: se os dados não forem definidos, cada membro da equipe pode interpretar de forma diferente o que é “previsão do tempo”, gerando inconsistência na entrega.

### 4.2. Qual é a fonte de dados autorizada?
Pergunta em aberto: a aplicação utilizará Open-Meteo, outra API pública ou uma solução paga/comercial?
Impacto: sem essa definição, há risco de escolher uma API incompatível com requisitos de qualidade, cobertura geográfica, latência ou custo.

### 4.3. Qual é a qualidade esperada dos dados?
Pergunta em aberto: o produto precisa ser preciso para uso casual, ou também para uso de decisão crítica em atividades sensíveis?
Impacto: a qualidade da resposta pode variar muito e a interface pode transmitir falsa sensação de precisão sem que a expectativa do usuário tenha sido definida.

## 5) Experiência de uso e interface

### 5.1. Quais elementos devem aparecer na tela principal?
Pergunta em aberto: a página inicial deve mostrar apenas clima atual e previsão, ou também uma lista de cidades favoritedas, pesquisa recente e informações extras?
Impacto: sem essa definição, o layout pode ser incompleto, pouco útil ou excessivamente carregado, prejudicando a usabilidade.

### 5.2. Como a alternância de Celsius/Fahrenheit deve funcionar?
Pergunta em aberto: a unidade deve ser configurada globalmente, por sessão, por cidade ou por preferência do usuário persistida?
Impacto: sem essa definição, o usuário pode perceber inconsistência na exibição e a experiência se torna confusa.

### 5.3. Como será tratada a experiência em mobile?
Pergunta em aberto: o app deve ser um site responsivo, um PWA instalável ou um app nativo para mobile?
Impacto: sem isso, pode haver incompatibilidade entre a experiência pretendida e as capacidades reais do produto, além de custo e esforço inadequados.

## 6) Requisitos de funcionalidade e UX

### 6.1. O que acontece quando a busca não encontra resultados?
Pergunta em aberto: a aplicação deve sugerir cidades próximas, mostrar “nenhum resultado encontrado” ou permitir busca por aproximar do nome digitado?
Impacto: se a UX de erro não for definida, o usuário pode ficar sem orientação e abandonar a aplicação.

### 6.2. Como devem aparecer os estados de carregamento e erro?
Pergunta em aberto: a aplicação deve exibir skeletons, spinners, mensagens de falha, retry ou fallback visual?
Impacto: sem essa decisão, a experiência pode parecer instável ou pouco profissional, especialmente em redes lentas ou quando a API falha.

### 6.3. O sistema deve guardar histórico de pesquisa?
Pergunta em aberto: a app deve salvar cidades pesquisadas para facilitar o uso futuro?
Impacto: sem essa definição, o produto pode ignorar uma funcionalidade de conveniência muito valorizada por usuários repetitivos.

## 7) Requisitos não-funcionais

### 7.1. Qual é o nível de desempenho aceitável?
Pergunta em aberto: qual é o tempo máximo aceitável para carregar o clima atual e a previsão de 5 dias?
Impacto: sem esse critério, o time pode entregar uma interface lenta demais e sem um padrão objetivo de qualidade.

### 7.2. Quais padrões de acessibilidade são exigidos?
Pergunta em aberto: o produto precisa respeitar WCAG, ou basta uma boa prática geral de acessibilidade?
Impacto: sem a exigência clara, a aplicação pode ser pouco inclusiva e gerar risco legal, reputação e baixa usabilidade para usuários com deficiência.

### 7.3. Como a aplicação deve se comportar em falhas de rede ou na indisponibilidade da API?
Pergunta em aberto: deve mostrar dados em cache, mensagem de erro amigável ou tentar reconectar automaticamente?
Impacto: sem resposta, a aplicação pode parecer quebrada ou gerar perda de confiança quando a infraestrutura externa falha.

### 7.4. Qual deve ser a estratégia de disponibilidade?
Pergunta em aberto: a aplicação deve ter tolerância a falhas de serviço externo, ou o produto pode ficar indisponível quando a API cair?
Impacto: sem definição, a aplicação pode apresentar falha crítica em situações comuns, afundando a percepção de confiabilidade.

## 8) Segurança e privacidade

### 8.1. A aplicação coleta dados do usuário?
Pergunta em aberto: o produto precisa registrar localização, histórico de busca, IP, preferências de unidade ou cookies?
Impacto: sem responder isso, o time corre risco de desenvolver uma solução com coleta desnecessária, prejudicando privacidade e conformidade.

### 8.2. Há exigência de conformidade regulatória?
Pergunta em aberto: a empresa precisa atender a normas de privacidade, proteção de dados ou regras específicas do mercado em que atua?
Impacto: se isso não for definido, a solução pode ser implementada sem os controles mínimos exigidos, aumentando risco legal e reputacional.

## 9) Estratégia comercial e operação

### 9.1. Qual é a meta de uso inicial?
Pergunta em aberto: a aplicação deve atender poucos usuários em um ambiente interno, ou deve suportar uso público em escala?
Impacto: sem saber a escala, a arquitetura, as integrações e o nível de resiliência podem ser subdimensionados ou exagerados.

### 9.2. Qual é o modelo de custo aceitável?
Pergunta em aberto: a empresa está disposta a pagar por API de clima premium, ou precisa usar soluções gratuitas e com limitações?
Impacto: sem essa clareza, o projeto pode ser inviável operacionalmente após a etapa de protótipo.

### 9.3. Quem é o responsável pela manutenção do produto?
Pergunta em aberto: a solução será mantida por uma equipe interna, por uma agência ou por um time externo?
Impacto: sem definição, o produto pode sair com baixa capacidade de manutenção e pouca sustentabilidade operacional.

## 10) Critérios de sucesso e validação

### 10.1. Como saber se o produto foi bem-sucedido?
Pergunta em aberto: o sucesso da aplicação é medido por número de buscas, retenção, taxa de uso em mobile, satisfação do usuário ou outra métrica?
Impacto: sem KPIs, o time pode entregar algo funcional, mas sem saber se atendia à intenção do negócio.

### 10.2. Qual é a base para aceitar ou rejeitar a versão inicial?
Pergunta em aberto: qual experiência mínima é aceitável na primeira entrega?
Impacto: o time pode trabalhar sob critérios conflitantes, resultando em entregas incompletas ou em retrabalho significativo.

## Resumo executivo

O briefing fornece uma visão inicial de produto, mas deixa de responder pontos críticos de negócio, UX, arquitetura, dados, segurança e monitoramento. Isso cria uma grande chance de interpretação divergente entre stakeholders, time de produto e time técnico. O impacto mais grave é que o projeto pode ser entregue com suposições internas, custo indireto alto, produto pouco útil e baixa confiança do usuário.

Em outras palavras: o briefing descreve o que o produto “parece” precisar, mas não define o que o produto “deve ser”, “para quem”, “em que contexto” e “com quais critérios de qualidade”.
