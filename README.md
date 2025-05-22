# Documentação do Sintetizador Musical Infinito

## Visão Geral
O Sintetizador Musical Infinito é uma aplicação web interativa que permite aos usuários criar e manipular melodias contínuas em tempo real. Utilizando a biblioteca Tone.js, o sintetizador gera música procedural baseada em escalas musicais, garantindo que as melodias sejam sempre harmoniosas e agradáveis de ouvir.

## Funcionalidades Principais

### Geração Musical Contínua
- Melodias infinitas geradas proceduralmente
- Sistema baseado em escalas musicais para garantir harmonia
- Progressões de acordes dinâmicas
- Linhas de baixo complementares
- Variação automática para manter o interesse musical

### Interface Interativa
- 12 knobs de controle divididos em 4 categorias funcionais
- Feedback visual em tempo real
- Design responsivo para diferentes dispositivos
- Controles intuitivos com ajuste preciso

## Controles do Sintetizador

### Melodia
1. **Escala**: Altera o tipo de escala musical (Maior, Menor, Pentatônica, Blues, Dórica, Frígia, Lídia)
2. **Nota Raiz**: Define a nota fundamental da escala (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
3. **Oitava**: Ajusta a altura geral das notas (2-6)

### Harmonia
4. **Complexidade**: Controla a complexidade das progressões de acordes
5. **Baixo**: Ajusta a intensidade e atividade da linha de baixo
6. **Tensão**: Adiciona tensão harmônica através de acordes mais complexos

### Ritmo
7. **Tempo (BPM)**: Controla a velocidade da música (60-180 BPM)
8. **Complexidade**: Ajusta a complexidade rítmica dos padrões
9. **Swing**: Adiciona sensação de swing/groove à música

### Efeitos
10. **Reverb**: Controla a quantidade de reverberação
11. **Delay**: Ajusta o efeito de eco/delay
12. **Filtro**: Modifica o brilho/escuridão do som (100-10000 Hz)

## Como Usar
1. Clique no botão "Iniciar Música" para começar a reprodução
2. Ajuste os knobs para modificar a música em tempo real
3. Experimente diferentes combinações de controles
4. Clique em "Parar Música" para interromper a reprodução

## Dicas para Criar Melodias Interessantes
- Comece com a escala Maior ou Pentatônica para melodias mais agradáveis
- Ajuste a nota raiz para mudar o "clima" da música
- Aumente a complexidade dos acordes gradualmente para criar progressão
- Use o reverb e delay para criar atmosfera
- Experimente diferentes combinações de tempo e swing para criar grooves únicos

## Tecnologias Utilizadas
- React com TypeScript
- Tone.js para síntese e processamento de áudio
- Tailwind CSS para estilização
- Vite como bundler e servidor de desenvolvimento
