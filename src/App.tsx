import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import Knob from './components/Knob';
import DisplayPanel from './components/DisplayPanel';
import SynthEngineAdvanced from './lib/SynthEngineAdvanced';

// Cores para os diferentes grupos de knobs
const COLORS = {
  melody: '#6366f1', // Indigo
  harmony: '#8b5cf6', // Violeta
  rhythm: '#ec4899', // Rosa
  effects: '#f59e0b', // Âmbar
};

function App() {
  // Estado para controlar se o sintetizador está tocando
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Referência para o motor de sintetizador
  const synthRef = useRef<SynthEngineAdvanced | null>(null);
  
  // Estados para os 12 knobs, agrupados por função
  const [knobValues, setKnobValues] = useState({
    // Knobs de melodia
    scale: 0, // Tipo de escala (maior, menor, etc)
    root: 0, // Nota raiz da escala
    octave: 4, // Oitava base
    
    // Knobs de harmonia
    chordComplexity: 0.3, // Complexidade dos acordes
    bassIntensity: 0.5, // Intensidade do baixo
    harmonicTension: 0.2, // Tensão harmônica
    
    // Knobs de ritmo
    tempo: 120, // BPM
    rhythmComplexity: 0.4, // Complexidade rítmica
    swingFeel: 0.1, // Quantidade de swing
    
    // Knobs de efeitos
    reverb: 0.3, // Quantidade de reverberação
    delay: 0.2, // Quantidade de delay
    filter: 2000, // Frequência do filtro
  });
  
  // Estado para informações do display
  const [displayInfo, setDisplayInfo] = useState({
    currentSeed: Math.floor(Math.random() * 1000000),
    currentScale: 'Maior',
    currentRoot: 'C',
    currentBPM: 120,
    evolutionPhase: 'Início'
  });
  
  // Inicializa o motor de sintetizador
  useEffect(() => {
    // Cria uma instância do motor de sintetizador avançado
    synthRef.current = new SynthEngineAdvanced();
    
    // Configura o intervalo para atualizar as informações do display
    const displayUpdateInterval = setInterval(() => {
      if (synthRef.current && isPlaying) {
        setDisplayInfo({
          currentSeed: synthRef.current.displayInfo.currentSeed,
          currentScale: synthRef.current.displayInfo.currentScale,
          currentRoot: synthRef.current.displayInfo.currentRoot,
          currentBPM: synthRef.current.displayInfo.currentBPM,
          evolutionPhase: synthRef.current.displayInfo.evolutionPhase
        });
      }
    }, 500);
    
    // Limpa quando o componente é desmontado
    return () => {
      clearInterval(displayUpdateInterval);
      if (isPlaying && synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, [isPlaying]);
  
  // Função para atualizar o valor de um knob específico
  const updateKnobValue = (knob: string, value: number) => {
    setKnobValues(prev => ({
      ...prev,
      [knob]: value
    }));
    
    // Atualiza o parâmetro no motor de sintetizador
    if (synthRef.current) {
      synthRef.current.updateParam(knob, value);
    }
  };
  
  // Função para iniciar/parar a reprodução
  const togglePlayback = async () => {
    if (!isPlaying) {
      // Inicializa o contexto de áudio se necessário
      await Tone.start();
      
      // Inicia o motor de sintetizador
      if (synthRef.current) {
        await synthRef.current.start();
      }
      
      setIsPlaying(true);
    } else {
      // Para o motor de sintetizador
      if (synthRef.current) {
        synthRef.current.stop();
      }
      
      setIsPlaying(false);
    }
  };
  
  // Função para randomizar todos os knobs
  const randomizeAllKnobs = () => {
    if (synthRef.current) {
      synthRef.current.randomizeAllKnobs();
      
      // Atualiza os valores dos knobs na interface
      setKnobValues({
        scale: synthRef.current.params.scale,
        root: synthRef.current.params.root,
        octave: synthRef.current.params.octave,
        chordComplexity: synthRef.current.params.chordComplexity,
        bassIntensity: synthRef.current.params.bassIntensity,
        harmonicTension: synthRef.current.params.harmonicTension,
        tempo: synthRef.current.params.tempo,
        rhythmComplexity: synthRef.current.params.rhythmComplexity,
        swingFeel: synthRef.current.params.swingFeel,
        reverb: synthRef.current.params.reverb,
        delay: synthRef.current.params.delay,
        filter: synthRef.current.params.filter
      });
      
      // Atualiza o display
      setDisplayInfo({
        currentSeed: synthRef.current.displayInfo.currentSeed,
        currentScale: synthRef.current.displayInfo.currentScale,
        currentRoot: synthRef.current.displayInfo.currentRoot,
        currentBPM: synthRef.current.displayInfo.currentBPM,
        evolutionPhase: synthRef.current.displayInfo.evolutionPhase
      });
    }
  };
  
  // Função para mudar a seed
  const changeSeed = () => {
    if (synthRef.current) {
      const newSeed = Math.floor(Math.random() * 1000000);
      synthRef.current.changeSeed(newSeed);
      
      // Atualiza o display
      setDisplayInfo(prev => ({
        ...prev,
        currentSeed: newSeed,
        evolutionPhase: 'Início'
      }));
    }
  };
  
  // Mapeia os nomes das escalas para exibição
  const scaleNames = ['Maior', 'Menor', 'Pentatônica', 'Blues', 'Dórica', 'Frígia', 'Lídia'];
  
  // Mapeia os nomes das notas para exibição
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 bg-opacity-70 rounded-xl p-6 shadow-2xl border border-gray-700">
          {/* Cabeçalho com título */}
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Sintetizador Musical Infinito
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">
              Gerador de melodias infinitas com controles dinâmicos
            </p>
          </header>
          
          {/* Display e controles principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Display do sintetizador */}
            <div className="md:col-span-2">
              <DisplayPanel 
                seed={displayInfo.currentSeed}
                scale={displayInfo.currentScale}
                root={displayInfo.currentRoot}
                bpm={displayInfo.currentBPM}
                evolutionPhase={displayInfo.evolutionPhase}
                color={COLORS.melody}
              />
            </div>
            
            {/* Botões de controle principal */}
            <div className="flex flex-col justify-center space-y-4">
              <button
                onClick={togglePlayback}
                className={`px-6 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 ${
                  isPlaying 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                {isPlaying ? 'Parar Música' : 'Iniciar Música'}
              </button>
              
              <button
                onClick={randomizeAllKnobs}
                className="px-6 py-3 rounded-lg font-bold transition-all bg-indigo-600 hover:bg-indigo-700"
              >
                Randomizar Knobs
              </button>
              
              <button
                onClick={changeSeed}
                className="px-6 py-3 rounded-lg font-bold transition-all bg-amber-600 hover:bg-amber-700"
              >
                Nova Seed
              </button>
            </div>
          </div>
          
          {/* Seção de Melodia */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Melodia</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <Knob
                  min={0}
                  max={6}
                  value={knobValues.scale}
                  onChange={(value) => updateKnobValue('scale', value)}
                  label="Escala"
                  color={COLORS.melody}
                />
                <div className="mt-1 text-xs text-gray-400">
                  {scaleNames[Math.round(knobValues.scale)]}
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <Knob
                  min={0}
                  max={11}
                  value={knobValues.root}
                  onChange={(value) => updateKnobValue('root', value)}
                  label="Nota Raiz"
                  color={COLORS.melody}
                />
                <div className="mt-1 text-xs text-gray-400">
                  {noteNames[Math.round(knobValues.root)]}
                </div>
              </div>
              
              <Knob
                min={2}
                max={6}
                value={knobValues.octave}
                onChange={(value) => updateKnobValue('octave', value)}
                label="Oitava"
                color={COLORS.melody}
              />
            </div>
          </div>
          
          {/* Seção de Harmonia */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-violet-300">Harmonia</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <Knob
                min={0}
                max={1}
                value={knobValues.chordComplexity}
                onChange={(value) => updateKnobValue('chordComplexity', value)}
                label="Complexidade"
                color={COLORS.harmony}
              />
              <Knob
                min={0}
                max={1}
                value={knobValues.bassIntensity}
                onChange={(value) => updateKnobValue('bassIntensity', value)}
                label="Baixo"
                color={COLORS.harmony}
              />
              <Knob
                min={0}
                max={1}
                value={knobValues.harmonicTension}
                onChange={(value) => updateKnobValue('harmonicTension', value)}
                label="Tensão"
                color={COLORS.harmony}
              />
            </div>
          </div>
          
          {/* Seção de Ritmo */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-pink-300">Ritmo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <Knob
                min={60}
                max={180}
                value={knobValues.tempo}
                onChange={(value) => updateKnobValue('tempo', value)}
                label="Tempo (BPM)"
                color={COLORS.rhythm}
              />
              <Knob
                min={0}
                max={1}
                value={knobValues.rhythmComplexity}
                onChange={(value) => updateKnobValue('rhythmComplexity', value)}
                label="Complexidade"
                color={COLORS.rhythm}
              />
              <Knob
                min={0}
                max={1}
                value={knobValues.swingFeel}
                onChange={(value) => updateKnobValue('swingFeel', value)}
                label="Swing"
                color={COLORS.rhythm}
              />
            </div>
          </div>
          
          {/* Seção de Efeitos */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amber-300">Efeitos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <Knob
                min={0}
                max={1}
                value={knobValues.reverb}
                onChange={(value) => updateKnobValue('reverb', value)}
                label="Reverb"
                color={COLORS.effects}
              />
              <Knob
                min={0}
                max={1}
                value={knobValues.delay}
                onChange={(value) => updateKnobValue('delay', value)}
                label="Delay"
                color={COLORS.effects}
              />
              <Knob
                min={100}
                max={10000}
                value={knobValues.filter}
                onChange={(value) => updateKnobValue('filter', value)}
                label="Filtro"
                color={COLORS.effects}
              />
            </div>
          </div>
          
          {/* Rodapé com informações */}
          <footer className="text-center text-gray-500 mt-8">
            <p className="text-sm">Sintetizador Musical Infinito v2.0</p>
            <p className="text-xs mt-1">Desenvolvido com Tone.js e React</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
