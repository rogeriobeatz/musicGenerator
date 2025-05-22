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

// Classe principal do sintetizador
class SynthEngine {
  // Declarações de propriedades
  isInitialized: boolean;
  isPlaying: boolean;
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
  currentPattern: (string | null)[];
  currentChordProgression: string[][];
  currentBassline: string[][];
  step: number;
  bar: number;
  section: number;
  melodySynth: any;
  chordSynth: any;
  bassSynth: any;
  reverb: any;
  delay: any;
  filter: any;
  loop: any;

  constructor() {
    // Inicializa o estado
    this.isInitialized = false;
    this.isPlaying = false;
    
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
    
    // Contadores
    this.step = 0;
    this.bar = 0;
    this.section = 0;
  }
  
  // Inicializa os instrumentos e efeitos
  async initialize() {
    if (this.isInitialized) return;
    
    // Cria o sintetizador de melodia
    this.melodySynth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.melodySynth.volume.value = -10;
    
    // Cria o sintetizador de acordes
    this.chordSynth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.chordSynth.volume.value = -15;
    
    // Cria o sintetizador de baixo
    this.bassSynth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.8, release: 1.5 }
    }).toDestination();
    this.bassSynth.volume.value = -8;
    
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
  }
  
  // Atualiza um parâmetro
  updateParam(param: string, value: number) {
    if (this.params[param as keyof typeof this.params] !== undefined) {
      this.params[param as keyof typeof this.params] = value;
      
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
    // Obtém a escala atual
    const scaleType = Object.keys(SCALES)[Math.floor(this.params.scale)];
    const scale = SCALES[scaleType as keyof typeof SCALES] || SCALES.major;
    const root = Math.floor(this.params.root);
    
    // Gera progressão de acordes
    this.currentChordProgression = this.generateChordProgression(scale, root);
    
    // Gera linha de baixo
    this.currentBassline = this.generateBassline(scale, root);
    
    // Gera padrão melódico
    this.currentPattern = this.generateMelodicPattern(scale, root);
  }
  
  // Gera uma progressão de acordes baseada na escala
  generateChordProgression(scale: number[], root: number) {
    // Progressões comuns baseadas na complexidade
    const simpleProgressions = [
      [0, 5, 3, 4], // I-VI-IV-V
      [0, 3, 4, 0], // I-IV-V-I
      [0, 5, 1, 4], // I-VI-II-V
    ];
    
    const complexProgressions = [
      [0, 5, 1, 2, 3, 4], // I-VI-II-III-IV-V
      [0, 2, 5, 1, 3, 4], // I-III-VI-II-IV-V
      [0, 3, 5, 4, 2, 5, 0], // I-IV-VI-V-III-VI-I
    ];
    
    // Seleciona uma progressão baseada na complexidade
    let progression;
    if (this.params.chordComplexity < 0.5) {
      progression = simpleProgressions[Math.floor(Math.random() * simpleProgressions.length)];
    } else {
      progression = complexProgressions[Math.floor(Math.random() * complexProgressions.length)];
    }
    
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
      
      bassline.push(pattern);
    });
    
    return bassline;
  }
  
  // Gera um padrão melódico baseado na escala
  generateMelodicPattern(scale: number[], root: number) {
    const pattern: (string | null)[] = [];
    const patternLength = 8 + Math.floor(this.params.rhythmComplexity * 8); // 8-16 notas
    
    // Gera notas aleatórias da escala
    for (let i = 0; i < patternLength; i++) {
      // Probabilidade de nota vs. pausa
      if (Math.random() > 0.2) { // 80% chance de nota
        // Seleciona um grau aleatório da escala
        const degree = Math.floor(Math.random() * scale.length);
        // Determina a oitava (variação baseada na complexidade)
        const octaveVariation = Math.random() > 0.7 ? 1 : 0;
        const note = this.getNote(scale, root, degree, this.params.octave + octaveVariation);
        pattern.push(note);
      } else {
        // Pausa
        pattern.push(null);
      }
    }
    
    return pattern;
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
        
        // Toca o acorde atual
        const chord = this.currentChordProgression[this.section];
        this.chordSynth.triggerAttackRelease(chord, "2n", time);
        
        // Toca a nota do baixo
        const bassNote = this.currentBassline[this.section][0];
        this.bassSynth.triggerAttackRelease(bassNote, "4n", time);
      } else if (this.params.bassIntensity > 0.3 && this.currentBassline[this.section].length > 1) {
        // Toca notas adicionais do baixo em outros compassos
        const bassIndex = Math.min(this.bar, this.currentBassline[this.section].length - 1);
        const bassNote = this.currentBassline[this.section][bassIndex];
        this.bassSynth.triggerAttackRelease(bassNote, "8n", time);
      }
    }
    
    // Toca a melodia
    if (this.currentPattern.length > 0) {
      // Índice da nota atual, considerando swing
      let noteIndex = this.step % this.currentPattern.length;
      
      // Aplica swing (atrasa notas em tempos pares)
      const swingOffset = (noteIndex % 2 === 1) ? this.params.swingFeel * 0.1 : 0;
      
      // Toca a nota da melodia, se houver
      const note = this.currentPattern[noteIndex];
      if (note !== null) {
        // Duração baseada na complexidade rítmica
        const duration = this.params.rhythmComplexity < 0.5 ? "16n" : "32n";
        this.melodySynth.triggerAttackRelease(note, duration, time + swingOffset);
      }
    }
    
    // Regenera padrões ocasionalmente para variação
    if (this.step === 0 && this.bar === 0 && Math.random() < 0.3) {
      this.generatePatterns();
    }
  }
}

export default SynthEngine;
