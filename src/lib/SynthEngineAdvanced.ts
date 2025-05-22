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
    
    // IMPORTANTE: Inicializa displayInfo ANTES de chamar qualquer método que possa usá-lo
    this.displayInfo = {
      currentSeed: this.seed,
      currentScale: this.getScaleName(this.params.scale),
      currentRoot: NOTE_NAMES[this.params.root],
      currentBPM: this.params.tempo,
      evolutionPhase: 'Início'
    };
    
    // Sequências e padrões
    this.currentPattern = [];
    this.currentChordProgression = [];
    this.currentBassline = [];
    this.hookPattern = [];
    
    // Arcos melódicos e evolução
    this.evolutionStage = 0;
    
    // Contadores
    this.step = 0;
    this.bar = 0;
    this.section = 0;
    this.phrase = 0;
    
    // IMPORTANTE: Agora é seguro chamar este método, pois displayInfo já está inicializado
    this.tensionCurve = this.generateTensionCurve();
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
    // IMPORTANTE: Verificação de segurança adicionada
    if (this.displayInfo && this.displayInfo.currentSeed !== undefined) {
      this.seed = this.displayInfo.currentSeed;
    } else {
      // Fallback seguro
      this.seed = Math.floor(Math.random() * 1000000);
    }
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
      oscillator: { type: 'triangle8' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
    }).toDestination();
    this.melodySynth.volume.value = -10;
    
    // Cria o sintetizador de acordes
    this.chordSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 1.5 }
    }).toDestination();
    this.chordSynth.volume.value = -15;
    
    // Cria o sintetizador de baixo
    this.bassSynth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.8, release: 1.5 }
    }).toDestination();
    this.bassSynth.volume.value = -8;
    
    // Cria o sintetizador de pad
    this.padSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 3 }
    }).toDestination();
    this.padSynth.volume.value = -18;
    
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
  }

  // Atualiza um parâmetro
  updateParam(param: string, value: number) {
    if (this.params[param as keyof typeof this.params] !== undefined) {
      this.params[param as keyof typeof this.params] = value;
      
      // Atualiza parâmetros em tempo real
      switch (param) {
        case 'tempo':
          Tone.Transport.bpm.value = value;
          this.displayInfo.currentBPM = value;
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
          this.displayInfo.currentScale = this.getScaleName(value);
          this.generatePatterns();
          break;
        case 'root':
          this.displayInfo.currentRoot = NOTE_NAMES[value];
          this.generatePatterns();
          break;
        case 'chordComplexity':
        case 'harmonicTension':
        case 'bassIntensity':
        case 'rhythmComplexity':
          // Regenera padrões quando parâmetros musicais mudam
          this.generatePatterns();
          break;
      }
    }
  }

  // Gera os padrões musicais baseados nos parâmetros atuais
  generatePatterns() {
    // Obtém a escala atual
    const scaleType = Object.keys(SCALES)[Math.floor(this.params.scale)];
    const scale = SCALES[scaleType as keyof typeof SCALES] || SCALES.major;
    const root = Math.floor(this.params.root);
    
    // Reseta a seed para consistência
    this.resetRandomSeed();
    
    // Gera progressão de acordes
    this.currentChordProgression = this.generateChordProgression(scale, root);
    
    // Gera linha de baixo
    this.currentBassline = this.generateBassline(scale, root);
    
    // Gera padrão melódico principal
    this.currentPattern = this.generateMelodicPattern(scale, root);
    
    // Gera padrão de gancho (hook) memorável
    this.hookPattern = this.generateHookPattern(scale, root);
  }

  // Gera uma progressão de acordes baseada na escala e complexidade
  generateChordProgression(scale: number[], root: number) {
    // Seleciona o tipo de progressão baseado na complexidade
    let progressionType: 'pop' | 'emotional' | 'epic';
    
    if (this.params.chordComplexity < 0.33) {
      progressionType = 'pop';
    } else if (this.params.chordComplexity < 0.66) {
      progressionType = 'emotional';
    } else {
      progressionType = 'epic';
    }
    
    // Seleciona uma progressão aleatória do tipo escolhido
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
      
      // Adiciona a nona se a tensão harmônica for muito alta
      if (this.params.harmonicTension > 0.8) {
        chordNotes.push(this.getNote(scale, root, degree + 8, this.params.octave + 1));
      }
      
      return chordNotes;
    });
  }

  // Gera uma linha de baixo baseada na progressão de acordes
  generateBassline(scale: number[], root: number) {
    const bassline: string[][] = [];
    const progression = this.currentChordProgression || this.generateChordProgression(scale, root);
    
    // Para cada acorde na progressão
    progression.forEach((chord, index) => {
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
        const nextIndex = (index + 1) % progression.length;
        const nextFundamental = progression[nextIndex][0];
        const walkingNote = this.getWalkingBassNote(fundamental, nextFundamental);
        pattern.push(walkingNote);
      }
      
      // Adiciona variação rítmica para intensidade alta
      if (this.params.bassIntensity > 0.8 && this.params.rhythmComplexity > 0.5) {
        const octaveNote = fundamental.slice(0, -1) + (parseInt(fundamental.slice(-1)) + 1);
        pattern.push(octaveNote);
      }
      
      bassline.push(pattern);
    });
    
    return bassline;
  }

  // Gera um padrão melódico baseado na escala
  generateMelodicPattern(scale: number[], root: number) {
    const pattern: (string | null)[] = [];
    const patternLength = 8 + Math.floor(this.params.rhythmComplexity * 8); // 8-16 notas
    
    // Seleciona um padrão rítmico baseado na complexidade
    let rhythmPattern;
    if (this.params.rhythmComplexity < 0.33) {
      rhythmPattern = RHYTHM_PATTERNS.simple;
    } else if (this.params.rhythmComplexity < 0.66) {
      rhythmPattern = RHYTHM_PATTERNS.medium;
    } else {
      rhythmPattern = RHYTHM_PATTERNS.complex;
    }
    
    // Gera notas baseadas no padrão rítmico e na curva de tensão
    for (let i = 0; i < patternLength; i++) {
      // Usa o padrão rítmico para determinar notas vs. pausas
      const rhythmIndex = i % rhythmPattern.length;
      
      if (rhythmPattern[rhythmIndex] === 1) {
        // Posição na curva de tensão
        const tensionIndex = i % this.tensionCurve.length;
        const tension = this.tensionCurve[tensionIndex];
        
        // Usa a tensão para influenciar a escolha de notas
        let degree;
        if (tension < 0.3) {
          // Baixa tensão: notas estáveis (tônica, terça, quinta)
          degree = [0, 2, 4][Math.floor(this.seededRandom() * 3)];
        } else if (tension < 0.6) {
          // Média tensão: notas da escala
          degree = Math.floor(this.seededRandom() * scale.length);
        } else {
          // Alta tensão: notas mais altas ou dissonantes
          degree = Math.floor(this.seededRandom() * scale.length) + 
                  Math.floor(this.seededRandom() * 2) * scale.length;
        }
        
        // Determina a oitava (variação baseada na tensão)
        const octaveVariation = tension > 0.7 ? 1 : 0;
        const note = this.getNote(scale, root, degree, this.params.octave + octaveVariation);
        
        pattern.push(note);
      } else {
        // Pausa
        pattern.push(null);
      }
    }
    
    return pattern;
  }

  // Gera um padrão de gancho (hook) memorável
  generateHookPattern(scale: number[], root: number) {
    const pattern: (string | null)[] = [];
    const hookLength = 4; // Hooks curtos são mais memoráveis
    
    // Usa notas fortes da escala para o hook (tônica, terça, quinta)
    const strongDegrees = [0, 2, 4];
    
    // Gera um padrão simples e repetitivo
    for (let i = 0; i < hookLength; i++) {
      if (i === hookLength - 1 && this.seededRandom() > 0.7) {
        // 30% de chance de terminar com uma pausa para criar expectativa
        pattern.push(null);
      } else {
        // Seleciona graus fortes para o hook
        const degreeIndex = Math.floor(this.seededRandom() * strongDegrees.length);
        const degree = strongDegrees[degreeIndex];
        
        // Alterna entre oitavas para criar interesse
        const octaveVariation = i % 2 === 0 ? 0 : 1;
        const note = this.getNote(scale, root, degree, this.params.octave + octaveVariation);
        
        pattern.push(note);
      }
    }
    
    return pattern;
  }

  // Obtém uma nota específica da escala
  getNote(scale: number[], root: number, degree: number, octave: number): string {
    // Ajusta o grau para ficar dentro da escala
    const normalizedDegree = degree % scale.length;
    
    // Calcula a nota MIDI
    const noteValue = (root + scale[normalizedDegree]) % 12;
    
    // Ajusta a oitava se necessário
    const octaveAdjustment = Math.floor(degree / scale.length);
    const finalOctave = octave + octaveAdjustment;
    
    // Retorna a nota como string (ex: "C4")
    return NOTE_NAMES[noteValue] + finalOctave;
  }

  // Gera uma nota de caminhada para o baixo
  getWalkingBassNote(currentNote: string, targetNote: string): string {
    const currentNoteName = currentNote.slice(0, -1);
    const currentOctave = parseInt(currentNote.slice(-1));
    
    const targetNoteName = targetNote.slice(0, -1);
    const targetOctave = parseInt(targetNote.slice(-1));
    
    const currentIndex = NOTE_NAMES.indexOf(currentNoteName);
    const targetIndex = NOTE_NAMES.indexOf(targetNoteName);
    
    // Calcula a direção da caminhada
    let walkingIndex;
    if (currentIndex < targetIndex || (currentIndex > targetIndex && targetOctave > currentOctave)) {
      walkingIndex = (currentIndex + 1) % 12;
    } else {
      walkingIndex = (currentIndex - 1 + 12) % 12;
    }
    
    return NOTE_NAMES[walkingIndex] + currentOctave;
  }

  // Executa um passo do sequenciador
  playStep(time: number) {
    if (!this.isPlaying || !this.currentPattern.length) return;
    
    // Avança o contador de passos
    this.step = (this.step + 1) % 16;
    
    // Atualiza o contador de compassos
    if (this.step === 0) {
      this.bar = (this.bar + 1) % 4;
      
      // Atualiza o contador de seções
      if (this.bar === 0) {
        this.section = (this.section + 1) % this.currentChordProgression.length;
        this.phrase = (this.phrase + 1) % 8; // 8 frases = 1 arco completo
        
        // Atualiza o estágio de evolução a cada 8 frases
        if (this.phrase === 0) {
          this.evolutionStage = (this.evolutionStage + 1) % 4;
          
          // Atualiza a fase de evolução no display
          const phases = ['Início', 'Desenvolvimento', 'Clímax', 'Resolução'];
          this.displayInfo.evolutionPhase = phases[this.evolutionStage];
          
          // Regenera padrões para criar evolução
          if (this.evolutionStage !== 0) { // Mantém o padrão inicial para consistência
            this.generatePatterns();
          }
        }
        
        // Toca o acorde atual
        const chord = this.currentChordProgression[this.section];
        this.chordSynth.triggerAttackRelease(chord, "2n", time);
        
        // Toca a nota de baixo
        const bassNote = this.currentBassline[this.section][0];
        this.bassSynth.triggerAttackRelease(bassNote, "4n", time);
        
        // Toca pad em momentos específicos da evolução
        if (this.evolutionStage === 2) { // Durante o clímax
          this.padSynth.triggerAttackRelease(chord, "1m", time);
        }
      }
      
      // Toca notas de baixo adicionais
      if (this.bar === 2 && this.currentBassline[this.section].length > 1) {
        const bassNote = this.currentBassline[this.section][1];
        this.bassSynth.triggerAttackRelease(bassNote, "4n", time);
      }
      
      if (this.bar === 3 && this.currentBassline[this.section].length > 2) {
        const bassNote = this.currentBassline[this.section][2];
        this.bassSynth.triggerAttackRelease(bassNote, "4n", time);
      }
    }
    
    // Seleciona o padrão melódico baseado no estágio de evolução
    let currentMelodicPattern;
    
    // Alterna entre padrão principal e hook baseado na evolução
    if (this.evolutionStage === 0 || this.evolutionStage === 2) {
      // Início e Clímax: usa o padrão principal
      currentMelodicPattern = this.currentPattern;
    } else if (this.evolutionStage === 1) {
      // Desenvolvimento: alterna entre padrão principal e hook
      currentMelodicPattern = this.bar % 2 === 0 ? this.currentPattern : this.hookPattern;
    } else {
      // Resolução: usa principalmente o hook
      currentMelodicPattern = this.bar % 3 === 0 ? this.currentPattern : this.hookPattern;
    }
    
    // Toca a nota da melodia
    const patternIndex = this.step % currentMelodicPattern.length;
    const note = currentMelodicPattern[patternIndex];
    
    if (note) {
      // Aplica swing se necessário
      let swingTime = time;
      if (this.step % 2 === 1) { // Notas em tempos fracos
        swingTime += (this.params.swingFeel * 0.1);
      }
      
      // Ajusta a velocidade baseada na curva de tensão
      const tensionIndex = (this.section * 4 + this.bar) % this.tensionCurve.length;
      const velocity = 0.5 + (this.tensionCurve[tensionIndex] * 0.5);
      
      // Duração da nota baseada na complexidade rítmica
      const duration = this.params.rhythmComplexity < 0.5 ? "16n" : "32n";
      
      this.melodySynth.triggerAttackRelease(note, duration, swingTime, velocity);
    }
  }
}

export default SynthEngineAdvanced;
