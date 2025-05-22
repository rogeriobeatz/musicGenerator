// SynthEngineAdvanced.ts
// Motor musical avançado com geração de melodias criativas e dinâmicas

import * as Tone from 'tone';

// Definição das escalas musicais
const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11], // Escala maior
  minor: [0, 2, 3, 5, 7, 8, 10], // Escala menor natural
  pentatonic: [0, 2, 4, 7, 9], // Escala pentatônica maior
  blues: [0, 3, 5, 6, 7, 10], // Escala blues
  dorian: [0, 2, 3, 5, 7, 9, 10], // Modo dórico
  phrygian: [0, 1, 3, 5, 7, 8, 10], // Modo frígio
  lydian: [0, 2, 4, 6, 7, 9, 11], // Modo lídio
};

// Nomes das notas
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Progressões de acordes comuns em músicas virais
const VIRAL_PROGRESSIONS = {
  pop: [
    [0, 5, 3, 4], // I-VI-IV-V (muito comum em pop)
    [0, 3, 4, 0], // I-IV-V-I (clássico)
    [0, 3, 5, 4], // I-IV-VI-V (progressão dos 4 acordes)
  ],
  emotional: [
    [0, 5, 3, 4, 0, 5, 1, 4], // I-VI-IV-V-I-VI-II-V (mais longa e emocional)
    [0, 5, 3, 0, 5, 3, 4], // I-VI-IV-I-VI-IV-V (com repetição estratégica)
  ],
  epic: [
    [0, 2, 4, 5], // I-III-V-VI (sensação épica)
    [0, 5, 1, 4, 0], // I-VI-II-V-I (resolução forte)
  ]
};

// Padrões rítmicos para diferentes estilos
const RHYTHM_PATTERNS = {
  simple: [1, 0, 0, 1, 0, 1, 0, 0], // Padrão simples
  medium: [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0], // Médio
  complex: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1], // Complexo
};

// Classe principal do sintetizador avançado
class SynthEngineAdvanced {
  // Declarações de propriedades
  isInitialized: boolean;
  isPlaying: boolean;
  
  // Parâmetros musicais
  params: {
    scale: number;
    root: number;
    octave: number;
    chordComplexity: number;
    bassIntensity: number;
    harmonicTension: number;
    tempo: number;
    rhythmComplexity: number;
    swingFeel: number;
    reverb: number;
    delay: number;
    filter: number;
  };
  
  // Seed para geração procedural
  seed: number;
  
  // Sequências e padrões
  currentPattern: (string | null)[];
  currentChordProgression: string[][];
  currentBassline: string[][];
  
  // Arcos melódicos e evolução
  evolutionStage: number;
  tensionCurve: number[];
  hookPattern: (string | null)[];
  
  // Contadores
  step: number;
  bar: number;
  section: number;
  phrase: number;
  
  // Instrumentos e efeitos
  melodySynth: any;
  chordSynth: any;
  bassSynth: any;
  padSynth: any;
  reverb: any;
  delay: any;
  filter: any;
  loop: any;
  
  // Informações de display
  displayInfo: {
    currentSeed: number;
    currentScale: string;
    currentRoot: string;
    currentBPM: number;
    evolutionPhase: string;
  };

  constructor() {
    // Inicializa o estado
    this.isInitialized = false;
    this.isPlaying = false;
    
    // Seed inicial aleatória
    this.seed = Math.floor(Math.random() * 1000000);
    
    // Parâmetros musicais
    this.params = {
      scale: 0, // Tipo de escala (0-6)
      root: 0, // Nota raiz (0-11)
      octave: 4, // Oitava base (2-6)
      chordComplexity: 0.3, // Complexidade dos acordes (0-1)
      bassIntensity: 0.5, // Intensidade do baixo (0-1)
      harmonicTension: 0.2, // Tensão harmônica (0-1)
      tempo: 120, // BPM (60-180)
      rhythmComplexity: 0.4, // Complexidade rítmica (0-1)
      swingFeel: 0.1, // Quantidade de swing (0-1)
      reverb: 0.3, // Quantidade de reverberação (0-1)
      delay: 0.2, // Quantidade de delay (0-1)
      filter: 2000, // Frequência do filtro (100-10000)
    };
    
    // Sequências e padrões
    this.currentPattern = [];
    this.currentChordProgression = [];
    this.currentBassline = [];
    this.hookPattern = [];
    
    // Arcos melódicos e evolução
    this.evolutionStage = 0;
    this.tensionCurve = this.generateTensionCurve();
    
    // Contadores
    this.step = 0;
    this.bar = 0;
    this.section = 0;
    this.phrase = 0;
    
    // Informações de display
    this.displayInfo = {
      currentSeed: this.seed,
      currentScale: this.getScaleName(this.params.scale),
      currentRoot: NOTE_NAMES[this.params.root],
      currentBPM: this.params.tempo,
      evolutionPhase: 'Início'
    };
  }
  
  // Gera uma curva de tensão para o arco melódico
  generateTensionCurve(): number[] {
    const curveLength = 32; // 8 compassos de 4 tempos
    const curve: number[] = [];
    
    // Usa a seed para gerar uma curva pseudo-aleatória mas consistente
    const seededRandom = this.seededRandom.bind(this);
    this.resetRandomSeed();
    
    // Gera pontos de controle para a curva
    const controlPoints = [
      { x: 0, y: 0.2 + seededRandom() * 0.2 }, // Início
      { x: curveLength * 0.3, y: 0.4 + seededRandom() * 0.3 }, // Primeiro pico
      { x: curveLength * 0.5, y: 0.3 + seededRandom() * 0.2 }, // Vale
      { x: curveLength * 0.7, y: 0.6 + seededRandom() * 0.4 }, // Pico principal
      { x: curveLength * 0.9, y: 0.4 + seededRandom() * 0.3 }, // Descida
      { x: curveLength - 1, y: 0.2 + seededRandom() * 0.2 }, // Final
    ];
    
    // Interpola entre os pontos de controle
    for (let i = 0; i < curveLength; i++) {
      // Encontra os pontos de controle entre os quais interpolar
      let p1 = controlPoints[0];
      let p2 = controlPoints[controlPoints.length - 1];
      
      for (let j = 0; j < controlPoints.length - 1; j++) {
        if (i >= controlPoints[j].x && i <= controlPoints[j + 1].x) {
          p1 = controlPoints[j];
          p2 = controlPoints[j + 1];
          break;
        }
      }
      
      // Interpola linearmente
      const t = (i - p1.x) / (p2.x - p1.x);
      const value = p1.y + t * (p2.y - p1.y);
      
      curve.push(value);
    }
    
    return curve;
  }
  
  // Gerador de números pseudo-aleatórios baseado em seed
  seededRandom(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  
  // Reseta o gerador para a seed atual
  resetRandomSeed(): void {
    this.seed = this.displayInfo.currentSeed;
  }
  
  // Muda a seed e regenera todos os padrões
  changeSeed(newSeed?: number): void {
    this.displayInfo.currentSeed = newSeed || Math.floor(Math.random() * 1000000);
    this.seed = this.displayInfo.currentSeed;
    this.tensionCurve = this.generateTensionCurve();
    this.evolutionStage = 0;
    this.generatePatterns();
    this.displayInfo.evolutionPhase = 'Início';
  }
  
  // Randomiza todos os knobs
  randomizeAllKnobs(): void {
    this.resetRandomSeed();
    
    this.params.scale = Math.floor(this.seededRandom() * 7);
    this.params.root = Math.floor(this.seededRandom() * 12);
    this.params.octave = Math.floor(this.seededRandom() * 3) + 3; // 3-5
    this.params.chordComplexity = this.seededRandom();
    this.params.bassIntensity = this.seededRandom();
    this.params.harmonicTension = this.seededRandom();
    this.params.tempo = 80 + Math.floor(this.seededRandom() * 100); // 80-180
    this.params.rhythmComplexity = this.seededRandom();
    this.params.swingFeel = this.seededRandom() * 0.5; // 0-0.5
    this.params.reverb = this.seededRandom();
    this.params.delay = this.seededRandom();
    this.params.filter = 500 + this.seededRandom() * 9500; // 500-10000
    
    // Atualiza o display
    this.displayInfo.currentScale = this.getScaleName(this.params.scale);
    this.displayInfo.currentRoot = NOTE_NAMES[this.params.root];
    this.displayInfo.currentBPM = this.params.tempo;
    
    // Regenera padrões
    this.generatePatterns();
    
    // Atualiza parâmetros em tempo real
    if (this.isInitialized) {
      Tone.Transport.bpm.value = this.params.tempo;
      this.reverb.wet.value = this.params.reverb;
      this.delay.wet.value = this.params.delay;
      this.filter.frequency.value = this.params.filter;
    }
  }
  
  // Obtém o nome da escala a partir do índice
  getScaleName(index: number): string {
    const scaleNames = ['Maior', 'Menor', 'Pentatônica', 'Blues', 'Dórica', 'Frígia', 'Lídia'];
    return scaleNames[Math.min(index, scaleNames.length - 1)];
  }
  
  // Inicializa os instrumentos e efeitos
  async initialize() {
    if (this.isInitialized) return;
    
    // Cria o sintetizador de melodia
    this.melodySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle8'
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();
    this.melodySynth.volume.value = -10;
    
    // Cria o sintetizador de acordes
    this.chordSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.05,
        decay: 0.2,
        sustain: 0.4,
        release: 1.5
      }
    }).toDestination();
    this.chordSynth.volume.value = -15;
    
    // Cria o sintetizador de baixo
    this.bassSynth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.8, release: 1.5 }
    }).toDestination();
    this.bassSynth.volume.value = -8;
    
    // Cria o sintetizador de pad (para texturas)
    this.padSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 1.5,
        decay: 0.5,
        sustain: 0.8,
        release: 3
      }
    }).toDestination();
    this.padSynth.volume.value = -20;
    
    // Efeitos
    this.reverb = new Tone.Reverb(3).toDestination();
    this.delay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
    this.filter = new Tone.Filter(2000, "lowpass").toDestination();
    
    // Conecta os instrumentos aos efeitos
    this.melodySynth.disconnect();
    this.melodySynth.connect(this.filter);
    this.filter.connect(this.delay);
    this.delay.connect(this.reverb);
    
    this.chordSynth.disconnect();
    this.chordSynth.connect(this.filter);
    this.filter.connect(this.reverb);
    
    this.bassSynth.disconnect();
    this.bassSynth.connect(this.filter);
    
    this.padSynth.disconnect();
    this.padSynth.connect(this.reverb);
    
    // Configura o loop principal
    this.loop = new Tone.Loop((time) => {
      this.playStep(time);
    }, "16n").start(0);
    
    // Configura o tempo
    Tone.Transport.bpm.value = this.params.tempo;
    
    this.isInitialized = true;
  }
  
  // Inicia a reprodução
  async start() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    // Gera os padrões iniciais
    this.generatePatterns();
    
    // Inicia o transporte
    Tone.Transport.start();
    this.isPlaying = true;
  }
  
  // Para a reprodução
  stop() {
    Tone.Transport.stop();
    this.isPlaying = false;
    this.step = 0;
    this.bar = 0;
    this.section = 0;
    this.phrase = 0;
    this.evolutionStage = 0;
    this.displayInfo.evolutionPhase = 'Início';
  }
  
  // Atualiza um parâmetro
  updateParam(param: string, value: number) {
    if (this.params[param as keyof typeof this.params] !== undefined) {
      this.params[param as keyof typeof this.params] = value;
      
      // Atualiza o display se necessário
      if (param === 'scale') {
        this.displayInfo.currentScale = this.getScaleName(value);
      } else if (param === 'root') {
        this.displayInfo.currentRoot = NOTE_NAMES[Math.floor(value)];
      } else if (param === 'tempo') {
        this.displayInfo.currentBPM = value;
      }
      
      // Atualiza parâmetros em tempo real
      switch (param) {
        case 'tempo':
          Tone.Transport.bpm.value = value;
          break;
        case 'reverb':
          this.reverb.wet.value = value;
          break;
        case 'delay':
          this.delay.wet.value = value;
          break;
        case 'filter':
          this.filter.frequency.value = value;
          break;
        case 'scale':
        case 'root':
        case 'chordComplexity':
        case 'harmonicTension':
          // Regenera padrões quando parâmetros harmônicos mudam
          this.generatePatterns();
          break;
      }
    }
  }
  
  // Gera os padrões musicais baseados nos parâmetros atuais
  generatePatterns() {
    this.resetRandomSeed();
    
    // Obtém a escala atual
    const scaleType = Object.keys(SCALES)[Math.floor(this.params.scale)];
    const scale = SCALES[scaleType as keyof typeof SCALES] || SCALES.major;
    const root = Math.floor(this.params.root);
    
    // Gera progressão de acordes
    this.currentChordProgression = this.generateChordProgression(scale, root);
    
    // Gera linha de baixo
    this.currentBassline = this.generateBassline(scale, root);
    
    // Gera padrão melódico principal
    this.currentPattern = this.generateMelodicPattern(scale, root);
    
    // Gera padrão de hook (gancho melódico)
    this.hookPattern = this.generateHookPattern(scale, root);
  }
  
  // Gera uma progressão de acordes baseada na escala e na seed
  generateChordProgression(scale: number[], root: number) {
    this.resetRandomSeed();
    
    // Seleciona um tipo de progressão baseado na complexidade
    let progressionType: 'pop' | 'emotional' | 'epic';
    const complexity = this.params.chordComplexity;
    
    if (complexity < 0.33) {
      progressionType = 'pop';
    } else if (complexity < 0.66) {
      progressionType = 'emotional';
    } else {
      progressionType = 'epic';
    }
    
    // Seleciona uma progressão específica
    const progressions = VIRAL_PROGRESSIONS[progressionType];
    const progressionIndex = Math.floor(this.seededRandom() * progressions.length);
    const progression = progressions[progressionIndex];
    
    // Converte os graus da escala em acordes reais
    return progression.map(degree => {
      // Obtém as notas do acorde (tríade)
      const chordNotes = [
        this.getNote(scale, root, degree, this.params.octave),
        this.getNote(scale, root, degree + 2, this.params.octave),
        this.getNote(scale, root, degree + 4, this.params.octave)
      ];
      
      // Adiciona a sétima se a tensão harmônica for alta
      if (this.params.harmonicTension > 0.5) {
        chordNotes.push(this.getNote(scale, root, degree + 6, this.params.octave));
      }
      
      return chordNotes;
    });
  }
  
  // Gera uma linha de baixo baseada na progressão de acordes
  generateBassline(scale: number[], root: number) {
    const bassline: string[][] = [];
    const progression = this.currentChordProgression || this.generateChordProgression(scale, root);
    
    // Para cada acorde na progressão
    progression.forEach(chord => {
      // Nota fundamental do acorde (uma oitava abaixo)
      const fundamental = chord[0].slice(0, -1) + (parseInt(chord[0].slice(-1)) - 1);
      
      // Padrão básico: fundamental no primeiro tempo
      const pattern: string[] = [fundamental];
      
      // Adiciona notas adicionais baseadas na intensidade do baixo
      if (this.params.bassIntensity > 0.3) {
        // Adiciona a quinta
        const fifthIndex = (scale.indexOf(root) + 7) % scale.length;
        const fifth = this.getNote(scale, root, fifthIndex, this.params.octave - 1);
        pattern.push(fifth);
      }
      
      if (this.params.bassIntensity > 0.6) {
        // Adiciona caminhada cromática ou diatônica
        const nextFundamental = progression[(progression.indexOf(chord) + 1) % progression.length][0];
        const walkingNote = this.getWalkingBassNote(fundamental, nextFundamental);
        pattern.push(walkingNote);
      }
      
      // Adiciona variação rítmica baseada na complexidade
      if (this.params.rhythmComplexity > 0.7 && this.seededRandom() > 0.5) {
        const extraNote = this.getNote(scale, root, Math.floor(this.seededRandom() * scale.length), this.params.octave - 1);
        pattern.push(extraNote);
      }
      
      bassline.push(pattern);
    });
    
    return bassline;
  }
  
  // Gera um padrão melódico baseado na escala
  generateMelodicPattern(scale: number[], root: number) {
    const pattern: (string | null)[] = [];
    
    // Determina o comprimento do padrão baseado na complexidade
    const baseLength = 8;
    const complexityFactor = Math.floor(this.params.rhythmComplexity * 8);
    const patternLength = baseLength + complexityFactor;
    
    // Seleciona um padrão rítmico base
    let rhythmPattern: number[];
    if (this.params.rhythmComplexity < 0.3) {
      rhythmPattern = RHYTHM_PATTERNS.simple;
    } else if (this.params.rhythmComplexity < 0.7) {
      rhythmPattern = RHYTHM_PATTERNS.medium;
    } else {
      rhythmPattern = RHYTHM_PATTERNS.complex;
    }
    
    // Gera notas baseadas no padrão rítmico e na escala
    for (let i = 0; i < patternLength; i++) {
      const rhythmIndex = i % rhythmPattern.length;
      
      // Se o padrão rítmico indica uma nota
      if (rhythmPattern[rhythmIndex] === 1 || this.seededRandom() > 0.7) {
        // Seleciona um grau da escala com preferência para notas fortes
        let degree;
        const r = this.seededRandom();
        
        if (r < 0.6) {
          // Notas fortes da escala (tônica, terça, quinta)
          const strongDegrees = [0, 2, 4];
          degree = strongDegrees[Math.floor(this.seededRandom() * strongDegrees.length)];
        } else {
          // Outras notas da escala
          degree = Math.floor(this.seededRandom() * scale.length);
        }
        
        // Determina a oitava (variação baseada na posição no padrão)
        const positionInPattern = i / patternLength;
        const tensionAtPosition = this.getTensionAtPosition(positionInPattern);
        
        // Maior tensão = maior probabilidade de notas mais altas
        const octaveVariation = this.seededRandom() > (1 - tensionAtPosition) ? 1 : 0;
        
        const note = this.getNote(scale, root, degree, this.params.octave + octaveVariation);
        pattern.push(note);
      } else {
        // Pausa
        pattern.push(null);
      }
    }
    
    return pattern;
  }
  
  // Gera um padrão de hook (gancho melódico) - curto e memorável
  generateHookPattern(scale: number[], root: number) {
    const hookLength = 4; // Hooks curtos são mais memoráveis
    const pattern: (string | null)[] = [];
    
    // Reseta a seed para consistência
    this.resetRandomSeed();
    
    // Prefere notas fortes da escala para hooks
    const strongDegrees = [0, 2, 4]; // Tônica, terça, quinta
    
    // Gera um padrão rítmico simples para o hook
    for (let i = 0; i < hookLength; i++) {
      if (i === 0 || i === hookLength - 1 || this.seededRandom() > 0.3) {
        // Primeira e última nota são sempre presentes, outras têm 70% de chance
        const degreeIndex = Math.floor(this.seededRandom() * strongDegrees.length);
        const degree = strongDegrees[degreeIndex];
        const note = this.getNote(scale, root, degree, this.params.octave);
        pattern.push(note);
      } else {
        pattern.push(null);
      }
    }
    
    return pattern;
  }
  
  // Obtém o valor de tensão para uma posição relativa no padrão
  getTensionAtPosition(position: number): number {
    // Mapeia a posição para o índice na curva de tensão
    const index = Math.floor(position * this.tensionCurve.length);
    return this.tensionCurve[Math.min(index, this.tensionCurve.length - 1)];
  }
  
  // Obtém uma nota específica da escala
  getNote(scale: number[], root: number, degree: number, octave: number) {
    // Normaliza o grau para o tamanho da escala
    const normalizedDegree = ((degree % scale.length) + scale.length) % scale.length;
    // Calcula a nota MIDI
    const noteValue = (root + scale[normalizedDegree]) % 12;
    // Ajusta a oitava se necessário
    const adjustedOctave = octave + Math.floor((root + scale[normalizedDegree]) / 12);
    // Retorna a nota no formato de string (ex: "C4")
    return NOTE_NAMES[noteValue] + adjustedOctave;
  }
  
  // Obtém uma nota de caminhada para o baixo
  getWalkingBassNote(currentNote: string, nextNote: string) {
    // Extrai o nome da nota e a oitava
    const currentName = currentNote.slice(0, -1);
    const currentOctave = parseInt(currentNote.slice(-1));
    const nextName = nextNote.slice(0, -1);
    const nextOctave = parseInt(nextNote.slice(-1));
    
    // Índices das notas
    const currentIndex = NOTE_NAMES.indexOf(currentName);
    const nextIndex = NOTE_NAMES.indexOf(nextName);
    
    // Calcula a diferença (considerando oitavas)
    const currentMidi = currentIndex + (currentOctave * 12);
    const nextMidi = nextIndex + (nextOctave * 12);
    
    // Escolhe uma nota intermediária
    let walkingMidi;
    if (currentMidi < nextMidi) {
      walkingMidi = currentMidi + 1;
    } else if (currentMidi > nextMidi) {
      walkingMidi = currentMidi - 1;
    } else {
      // Se forem iguais, move cromáticamente
      walkingMidi = currentMidi + (Math.random() > 0.5 ? 1 : -1);
    }
    
    // Converte de volta para nome de nota
    const walkingIndex = walkingMidi % 12;
    const walkingOctave = Math.floor(walkingMidi / 12);
    return NOTE_NAMES[walkingIndex] + walkingOctave;
  }
  
  // Avança o estágio de evolução da música
  advanceEvolutionStage() {
    this.evolutionStage = (this.evolutionStage + 1) % 4;
    
    // Atualiza a fase de evolução no display
    const phases = ['Início', 'Desenvolvimento', 'Clímax', 'Resolução'];
    this.displayInfo.evolutionPhase = phases[this.evolutionStage];
    
    // Regenera alguns padrões para criar variação
    if (this.evolutionStage === 1 || this.evolutionStage === 2) {
      // Mantém a progressão de acordes, mas varia a melodia
      const scaleType = Object.keys(SCALES)[Math.floor(this.params.scale)];
      const scale = SCALES[scaleType as keyof typeof SCALES] || SCALES.major;
      const root = Math.floor(this.params.root);
      
      this.currentPattern = this.generateMelodicPattern(scale, root);
    }
  }
  
  // Toca um passo do sequenciador
  playStep(time: number) {
    // Incrementa o contador de passos
    this.step = (this.step + 1) % 16;
    
    // Atualiza o contador de compassos a cada 16 passos
    if (this.step === 0) {
      this.bar = (this.bar + 1) % 4;
      
      // Atualiza o contador de seções a cada 4 compassos
      if (this.bar === 0) {
        this.section = (this.section + 1) % this.currentChordProgression.length;
        
        // Atualiza o contador de frases a cada ciclo completo da progressão
        if (this.section === 0) {
          this.phrase = (this.phrase + 1) % 4;
          
          // Avança o estágio de evolução a cada 4 frases
          if (this.phrase === 0) {
            this.advanceEvolutionStage();
          }
        }
        
        // Toca o acorde atual
        const chord = this.currentChordProgression[this.section];
        
        // Duração baseada na tensão atual
        const tensionAtCurrentBar = this.tensionCurve[(this.bar + this.section * 4) % this.tensionCurve.length];
        const chordDuration = tensionAtCurrentBar > 0.5 ? "2n" : "1n";
        
        this.chordSynth.triggerAttackRelease(chord, chordDuration, time);
        
        // Toca a nota do baixo
        const bassNote = this.currentBassline[this.section][0];
        this.bassSynth.triggerAttackRelease(bassNote, "4n", time);
        
        // Toca pad em momentos específicos da evolução
        if (this.evolutionStage === 2 && this.section === 0) { // Durante o clímax
          const padChord = chord.slice(0, 3); // Usa apenas tríade para o pad
          this.padSynth.triggerAttackRelease(padChord, "2m", time);
        }
      } else if (this.params.bassIntensity > 0.3 && this.currentBassline[this.section].length > 1) {
        // Toca notas adicionais do baixo em outros compassos
        const bassIndex = Math.min(this.bar, this.currentBassline[this.section].length - 1);
        const bassNote = this.currentBassline[this.section][bassIndex];
        
        // Duração baseada na intensidade do baixo
        const bassDuration = this.params.bassIntensity > 0.7 ? "8n" : "4n";
        this.bassSynth.triggerAttackRelease(bassNote, bassDuration, time);
      }
    }
    
    // Toca a melodia
    if (this.currentPattern.length > 0) {
      // Decide se toca o padrão principal ou o hook
      let patternToUse: (string | null)[];
      
      // Durante o clímax ou em momentos específicos, usa o hook para reforçar a memorabilidade
      if ((this.evolutionStage === 2 && this.bar === 0) || 
          (this.section === 0 && this.step < 8 && this.seededRandom() > 0.7)) {
        patternToUse = this.hookPattern;
      } else {
        patternToUse = this.currentPattern;
      }
      
      // Índice da nota atual, considerando swing
      let noteIndex = this.step % patternToUse.length;
      
      // Aplica swing (atrasa notas em tempos pares)
      const swingOffset = (noteIndex % 2 === 1) ? this.params.swingFeel * 0.1 : 0;
      
      // Toca a nota da melodia, se houver
      const note = patternToUse[noteIndex];
      if (note !== null) {
        // Duração baseada na complexidade rítmica e estágio de evolução
        let duration: string;
        
        if (this.evolutionStage === 2) { // Clímax - notas mais curtas e intensas
          duration = this.params.rhythmComplexity < 0.5 ? "16n" : "32n";
        } else if (this.evolutionStage === 3) { // Resolução - notas mais longas
          duration = this.params.rhythmComplexity < 0.5 ? "8n" : "16n";
        } else { // Outros estágios
          duration = this.params.rhythmComplexity < 0.5 ? "16n" : "8n";
        }
        
        // Volume baseado na tensão atual
        const tensionAtCurrentStep = this.tensionCurve[(this.step + this.section * 16) % this.tensionCurve.length];
        const velocity = 0.5 + tensionAtCurrentStep * 0.5;
        
        this.melodySynth.triggerAttackRelease(note, duration, time + swingOffset, velocity);
      }
    }
    
    // Regenera padrões ocasionalmente para variação
    if (this.step === 0 && this.bar === 0 && this.section === 0 && Math.random() < 0.3) {
      this.generatePatterns();
    }
  }
}

export default SynthEngineAdvanced;
