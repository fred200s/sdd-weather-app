# Especificação do Produto — Weather App

## Overview

A Weather App é uma aplicação web responsiva para consulta de clima por cidade, com foco em rapidez, clareza e uso em smartphones e desktops. O produto permite ao usuário buscar uma cidade, visualizar as condições atuais do clima e consultar a previsão dos próximos 5 dias, considerando hoje + 4 dias.

O escopo inicial do produto é centrado em uma experiência simples e direta: busca por cidade, clima atual, previsão de 5 dias e troca de unidade de temperatura. A aplicação não exige autenticação, não persiste dados no servidor e não coleta informações pessoais além do conteúdo necessário para a consulta de clima.

As decisões de produto já fechadas definem os pilares do MVP:

- Fonte de dados: Open-Meteo, sem API key.
- Definição de “5 dias”: hoje + 4 dias.
- Unidade padrão: Celsius (°C).
- Interface em português do Brasil.
- Sem autenticação e sem armazenamento em backend.

## Functional Requirements

### RF1 — Busca de cidade por nome
O sistema deve permitir que o usuário insira o nome de uma cidade e inicie a busca por correspondências válidas.

Regras de negócio:
- a busca deve ignorar espaços em branco antes e depois do valor informado;
- a busca deve bloquear valores vazios ou compostos apenas por espaços;
- a entrada deve aceitar letras, números, acentos, hífens e espaços, mas deve tratar caracteres inválidos de forma segura;
- o sistema deve limitar a entrada a um tamanho máximo de 80 caracteres para evitar abuso e inconsistência;
- a busca deve retornar até 5 resultados relevantes ordenados por melhor correspondência ao termo informado.

### RF2 — Seleção da cidade e carregamento do clima atual
O sistema deve permitir que o usuário escolha uma cidade válida e carregue as condições meteorológicas atuais dessa localidade.

Regras de negócio:
- cada resultado de geocoding deve incluir no mínimo: nome da cidade, país e, quando disponível, estado/região;
- após a seleção, a aplicação deve fazer uma requisição de clima para as coordenadas da cidade escolhida;
- o clima atual deve incluir, no mínimo: data/hora, temperatura atual, código do clima e descrição textual associada;
- se a cidade selecionada não possuir dados suficientes, o sistema deve apresentar erro em vez de renderizar dados incompletos.

### RF3 — Previsão de 5 dias
O sistema deve apresentar a previsão do clima para os próximos 5 dias, considerando hoje + 4 dias, em ordem cronológica.

Regras de negócio:
- a previsão deve ser exibida como uma sequência de 5 registros;
- o primeiro item deve corresponder ao dia atual;
- cada item da previsão deve incluir no mínimo: data, código do clima, temperatura máxima, temperatura mínima e probabilidade de precipitação;
- a lista deve manter a mesma ordem lógica em desktop e mobile;
- a previsão deve ser exibida sem duplicidade de datas e sem deslocamento por timezone do navegador.

### RF4 — Alternância entre Celsius e Fahrenheit
O sistema deve permitir que o usuário alterne entre °C e °F sem recarregar a página ou executar outra busca.

Regras de negócio:
- a unidade padrão inicial deve ser Celsius;
- a conversão deve ocorrer somente na camada de apresentação;
- ao trocar a unidade, todas as temperaturas visíveis na tela devem refletir a nova escala imediatamente;
- a unidade ativa deve ser persistida apenas no estado da sessão atual, sem depender de backend.

### RF5 — Estados de carregamento, vazio e erro
O sistema deve informar explicitamente o usuário sobre o estado da operação.

Estados esperados:
- idle: tela inicial sem busca executada;
- loading: indicador de carregamento visível durante a busca ou carregamento do clima;
- empty: nenhum resultado encontrado para a busca;
- error: falha de rede, timeout, resposta inválida ou dados incompletos;
- success: dados válidos renderizados com clima atual e previsão.

Mensagens esperadas:
- busca vazia: “Digite o nome de uma cidade”;
- sem resultado: “Nenhuma cidade encontrada”;
- falha de rede: “Não foi possível carregar os dados do clima”;
- timeout: “A requisição demorou demais. Tente novamente.”

### RF6 — Contexto geográfico dos resultados
Quando houver mais de uma cidade com o mesmo nome, o sistema deve apresentar contexto suficiente para que o usuário identifique a localização correta.

Regras de negócio:
- cada resultado deve exibir nome da cidade e contexto regional, preferencialmente estado/região e país;
- o sistema deve priorizar resultados com correspondência exata ao termo digitado;
- a cidade selecionada deve refletir exatamente o contexto apresentado na lista; não deve haver ambiguidade visual entre itens semelhantes.

## User Stories

### Como pessoa ocupada em planejamento diário, quero pesquisar uma cidade e ver o clima atual para decidir rapidamente como me vestir antes de sair de casa.

### Como viajante em deslocamento, quero comparar o clima de diferentes cidades para planejar melhor a minha viagem e escolher o destino mais adequado.

### Como usuário de desktop em planejamento de rotina, quero visualizar a previsão de 5 dias para organizar compromissos e atividades com antecedência.

### Como usuário de celular, quero alternar entre Celsius e Fahrenheit para entender a temperatura no formato que eu prefiro sem repetir a busca.

### Como usuário que depende de feedback claro, quero receber mensagens de resultado vazio e erro para entender quando a busca falhou ou não encontrou uma cidade.

### Como usuário em busca de precisão, quero ver o contexto regional da cidade nos resultados para selecionar a localidade correta quando houver cidades com nomes repetidos.

### Como pessoa ocupada, quero consultar rapidamente a previsão dos próximos dias em uma sequência clara para decidir se preciso levar guarda-chuva ou roupa mais leve.

## Traceability Matrix

| User Story | Requisitos funcionais relacionados | Acceptance Criteria | NFRs relevantes |
| --- | --- | --- | --- |
| Como pessoa ocupada em planejamento diário, quero pesquisar uma cidade e ver o clima atual para decidir rapidamente como me vestir antes de sair de casa. | RF1, RF2, RF5 | RF1-1, RF1-2, RF1-3, RF2-1, RF2-2, RF5-1, RF5-2 | NFR1, NFR2, NFR3, NFR5 |
| Como viajante em deslocamento, quero comparar o clima de diferentes cidades para planejar melhor a minha viagem e escolher o destino mais adequado. | RF1, RF2, RF6 | RF1-2, RF1-3, RF2-1, RF6-1, RF6-2 | NFR1, NFR2, NFR3, NFR5 |
| Como usuário de desktop em planejamento de rotina, quero visualizar a previsão de 5 dias para organizar compromissos e atividades com antecedência. | RF3, RF5 | RF3-1, RF3-2, RF3-3, RF5-1, RF5-3 | NFR1, NFR2, NFR3, NFR7 |
| Como usuário de celular, quero alternar entre Celsius e Fahrenheit para entender a temperatura no formato que eu prefiro sem repetir a busca. | RF4 | RF4-1, RF4-2, RF4-3 | NFR1, NFR3, NFR5 |
| Como usuário que depende de feedback claro, quero receber mensagens de resultado vazio e erro para entender quando a busca falhou ou não encontrou uma cidade. | RF1, RF5 | RF1-3, RF1-4, RF5-2, RF5-3 | NFR1, NFR4, NFR5 |
| Como usuário em busca de precisão, quero ver o contexto regional da cidade nos resultados para selecionar a localidade correta quando houver cidades com nomes repetidos. | RF1, RF6 | RF1-2, RF1-3, RF6-1, RF6-2 | NFR1, NFR4, NFR5 |
| Como pessoa ocupada, quero consultar rapidamente a previsão dos próximos dias em uma sequência clara para decidir se preciso levar guarda-chuva ou roupa mais leve. | RF3, RF5 | RF3-1, RF3-2, RF3-3, RF5-1 | NFR1, NFR2, NFR3, NFR7 |

### Observações da matriz
- A maioria das histórias depende diretamente de RF1 e RF5, porque a busca, a validação e o feedback ao usuário são os principais pontos de risco de qualidade.
- RF3 e RF4 têm impacto direto em legibilidade, responsividade e consistência de experiência, reforçando NFR1, NFR3 e NFR5.
- A rastreabilidade também orienta a quebra de tarefas por funcionalidade: busca, seleção, clima atual, previsão, unidade e tratamento de erro.

## Acceptance Criteria

### RF1 — Busca de cidade por nome
- Given que o usuário acessa a aplicação e o campo de busca está vazio, when ele tenta enviar a busca sem informar uma cidade, then o sistema deve impedir a ação e manter a interface em estado inicial.
- Given que o usuário informa um valor com espaços em branco no início ou no fim, when a busca é enviada, then o sistema deve remover esses espaços antes da consulta.
- Given que o usuário informa um valor válido, when ele confirma a busca, then o sistema deve retornar até 5 resultados relevantes e cada item deve exibir nome da cidade com contexto geográfico.
- Given que o termo não corresponde a nenhuma cidade, when a requisição é concluída, then o sistema deve exibir o estado de vazio com a mensagem “Nenhuma cidade encontrada”.

### RF2 — Seleção da cidade e carregamento do clima atual
- Given que a busca retornou cidades válidas, when o usuário seleciona uma cidade, then o sistema deve carregar o clima atual para as coordenadas da cidade escolhida.
- Given que a API devolve dados válidos, when o clima atual for carregado, then a interface deve exibir temperatura atual, descrição do clima e nome da cidade selecionada.
- Given que a resposta da API está incompleta ou inválida, when a cidade for selecionada, then o sistema deve exibir mensagem de erro e manter a UI estável.

### RF3 — Previsão de 5 dias
- Given que a cidade foi carregada com sucesso, when a resposta da previsão chega, then o sistema deve renderizar 5 registros em sequência cronológica, começando pelo dia atual.
- Given que a previsão está visível, when o usuário observa a lista, then cada item deve conter data, temperatura mínima, temperatura máxima e probabilidade de precipitação.
- Given que a API retorna menos de 5 dias válidos, when o dado for processado, then o sistema deve rejeitar a resposta como incompleta e mostrar erro em vez de renderizar uma previsão parcial.

### RF4 — Alternância entre Celsius e Fahrenheit
- Given que a aplicação está em Celsius, when o usuário seleciona Fahrenheit, then todas as temperaturas exibidas devem ser convertidas imediatamente para a nova unidade.
- Given que a unidade foi alterada, when a renderização acontecer, then o clima atual e a previsão devem refletir a mesma escala sem nova busca.
- Given que a unidade está ativa, when o componente de seleçao é renderizado, then o botão correspondente deve indicar o estado ativo com atributo acessível ou equivalente visualmente consistente.

### RF5 — Estados de carregamento, vazio e erro
- Given que uma requisição está em andamento, when o sistema processa os dados, then deve exibir um indicador de carregamento acessível.
- Given que a busca não encontra resultado, when a resposta for vazia, then o sistema deve mostrar o estado de vazio com orientação clara ao usuário.
- Given que a API falha, responde com erro HTTP ou excede o tempo limite, when a ação for concluída, then o sistema deve mostrar mensagem de erro e botão de retry.

### RF6 — Contexto geográfico dos resultados
- Given que a busca retorna mais de uma cidade com o mesmo nome, when a lista é exibida, then cada resultado deve incluir contexto geográfico suficiente para distinguir as localidades.
- Given que o usuário seleciona um item, when o clima é carregado, then a cidade exibida deve corresponder ao contexto regional visível na escolha anterior.

## Non-Functional Requirements

### NFR1 — Usabilidade e simplicidade
A interface deve ser intuitiva, com pouca curva de aprendizado e fluxo principal em poucas etapas: buscar, visualizar e alternar unidade.

### NFR2 — Performance
A aplicação deve carregar os dados principais em tempo aceitável para uso em celular e desktop, com foco em resposta rápida em redes comuns.

### NFR3 — Responsividade
A interface deve adaptar-se a diferentes tamanhos de tela, priorizando o uso em smartphones e mantendo funcionalidade em desktops.

### NFR4 — Acessibilidade
A aplicação deve seguir boas práticas de acessibilidade, incluindo contraste adequado, rótulos semânticos, foco visível e navegação por teclado.

### NFR5 — Confiabilidade
A aplicação deve lidar com falhas temporárias de rede e indisponibilidade da API externa sem quebrar a experiência do usuário.

### NFR6 — Segurança e privacidade
A aplicação deve evitar coleta desnecessária de dados e operar sobre comunicação segura, sem persistência sensível no backend.

### NFR7 — Manutenibilidade
A estrutura do produto deve favorecer manutenção, reutilização de componentes e evolução incremental sem reescrever a base de código.

## Edge Cases

- Busca feita com texto vazio ou apenas espaços.
- Cidade inexistente ou escrita com erro de grafia.
- Múltiplas cidades com o mesmo nome em diferentes países ou estados.
- Falha temporária da API externa.
- Rede instável ou lenta em ambiente móvel.
- Retorno parcial ou incompleto da API.
- Conversão de temperatura em valores decimais ou arredondamento.
- Dados meteorológicos ausentes para algumas métricas em uma resposta válida.
- Cidade conhecida, mas sem região/estado informado pela API.

## Assumptions

- O uso principal do produto será em smartphones, com consultas rápidas e frequentes.
- O MVP não exigirá autenticação de usuário.
- Não haverá armazenamento de histórico em servidor ou backend compartilhado.
- O volume de uso inicial será pequeno e não exigirá infraestrutura complexa.
- A API Open-Meteo será suficiente para atender ao escopo do produto no MVP.
- O produto será usado em português do Brasil e não terá suporte multilíngue na primeira entrega.
- As temperaturas serão armazenadas internamente em Celsius e convertidas apenas na camada de apresentação.

## Risks

- Dependência de uma API externa com risco de indisponibilidade ou latência alta.
- Ambiguidade na cidade selecionada quando existem homônimos em diferentes regiões.
- Perda de confiança do usuário em cenários de falha de rede ou resposta incompleta.
- Problemas de usabilidade em mobile se o layout não for validado desde o início.
- Dificuldade de manter a interface consistente após a evolução do produto.
- Falta de clareza em indicadores meteorológicos se a experiência não for bem definida para dados básicos e secundários.

## Out of Scope

- Autenticação de usuário.
- Persistência de dados no servidor.
- Histórico compartilhado de buscas entre usuários.
- Alertas meteorológicos severos ou notificações push.
- Mapas interativos, radar ou imagens meteorológicas avançadas.
- Qualidade do ar, índice UV, alarme de tempestade e outros módulos avançados.
- Integração com redes sociais ou compartilhamento público de clima.
- Suporte a múltiplos idiomas no MVP.
- Geolocalização automática como requisito obrigatório na primeira entrega.

## Open Questions

- A busca deve aceitar somente nome da cidade ou também estado, país e coordenadas?
- O produto deve sugerir cidades próximas quando não houver resultado exato?
- A aplicação deve salvar histórico local de buscas no navegador?
- A geolocalização automática deve ser ativada por padrão ou opcionalmente?
- Quais métricas meteorológicas são essenciais para a primeira versão além da temperatura e do clima geral?
- Qual é o tempo máximo aceitável para carregamento principal da interface?
- O produto deve evoluir para incluir alertas, radar e qualidade do ar em versões futuras?

