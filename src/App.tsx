import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import NexusKnob from './components/NexusKnob';
import SynthEngineAdvanced from './lib/SynthEngineAdvanced';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [params, setParams] = useState({
    scale: 0,
    root: 0,
    octave: 4,
    chordComplexity: 0.3,
    bassIntensity: 0.5,
    harmonicTension: 0.2,
    tempo: 120,
    rhythmComplexity: 0.4,
    swingFeel: 0.1,
    reverb: 0.3,
    delay: 0.2,
    filter: 2000
  });
  const [displayInfo, setDisplayInfo] = useState({
    currentSeed: 0,
    currentScale: 'Maior',
    currentRoot: 'C',
    currentBPM: 120,
    evolutionPhase: 'Início'
  });

  const synthRef = useRef<SynthEngineAdvanced | null>(null);

  useEffect(() => {
    synthRef.current = new SynthEngineAdvanced();
    const updateDisplayInfo = () => {
      if (synthRef.current) {
        setDisplayInfo({...synthRef.current.displayInfo});
      }
    };
    
    // Atualiza as informações de display a cada segundo
    const intervalId = setInterval(updateDisplayInfo, 1000);
    
    return () => {
      clearInterval(intervalId);
      if (synthRef.current && synthRef.current.isPlaying) {
        synthRef.current.stop();
      }
    };
  }, []);

  const handlePlayStop = async () => {
    if (!synthRef.current) return;
    
    if (!isPlaying) {
      await synthRef.current.start();
      setIsPlaying(true);
    } else {
      synthRef.current.stop();
      setIsPlaying(false);
    }
  };

  const handleParamChange = (param: string, value: number) => {
    if (!synthRef.current) return;
    
    setParams(prev => ({...prev, [param]: value}));
    synthRef.current.updateParam(param, value);
  };

  const handleRandomize = () => {
    if (!synthRef.current) return;
    
    synthRef.current.randomizeAllKnobs();
    // Atualiza o estado com os novos valores
    setParams({
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
  };

  const handleChangeSeed = () => {
    if (!synthRef.current) return;
    
    synthRef.current.changeSeed();
    setDisplayInfo({...synthRef.current.displayInfo});
  };

  return (
    <div className="synth-container">
      <div className="synth-header">
        <h1>Sintetizador Musical Infinito</h1>
      </div>
      
      <div className="display-panel">
        <div className="display-screen">
          <div className="display-row">
            <span className="display-label">Seed:</span>
            <span className="display-value">{displayInfo.currentSeed}</span>
          </div>
          <div className="display-row">
            <span className="display-label">Escala:</span>
            <span className="display-value">{displayInfo.currentScale}</span>
          </div>
          <div className="display-row">
            <span className="display-label">Nota Raiz:</span>
            <span className="display-value">{displayInfo.currentRoot}</span>
          </div>
          <div className="display-row">
            <span className="display-label">BPM:</span>
            <span className="display-value">{displayInfo.currentBPM}</span>
          </div>
          <div className="display-row">
            <span className="display-label">Fase:</span>
            <span className="display-value">{displayInfo.evolutionPhase}</span>
          </div>
        </div>
      </div>
      
      <div className="controls-section">
        <div className="controls-group">
          <h3>Melodia</h3>
          <div className="knobs-row">
            <NexusKnob
              min={0}
              max={6}
              step={1}
              value={params.scale}
              onChange={(value) => handleParamChange('scale', value)}
              label="Escala"
              color="#4CAF50"
            />
            <NexusKnob
              min={0}
              max={11}
              step={1}
              value={params.root}
              onChange={(value) => handleParamChange('root', value)}
              label="Nota Raiz"
              color="#4CAF50"
            />
            <NexusKnob
              min={2}
              max={6}
              step={1}
              value={params.octave}
              onChange={(value) => handleParamChange('octave', value)}
              label="Oitava"
              color="#4CAF50"
            />
          </div>
        </div>
        
        <div className="controls-group">
          <h3>Harmonia</h3>
          <div className="knobs-row">
            <NexusKnob
              min={0}
              max={1}
              value={params.chordComplexity}
              onChange={(value) => handleParamChange('chordComplexity', value)}
              label="Complexidade"
              color="#2196F3"
            />
            <NexusKnob
              min={0}
              max={1}
              value={params.bassIntensity}
              onChange={(value) => handleParamChange('bassIntensity', value)}
              label="Baixo"
              color="#2196F3"
            />
            <NexusKnob
              min={0}
              max={1}
              value={params.harmonicTension}
              onChange={(value) => handleParamChange('harmonicTension', value)}
              label="Tensão"
              color="#2196F3"
            />
          </div>
        </div>
        
        <div className="controls-group">
          <h3>Ritmo</h3>
          <div className="knobs-row">
            <NexusKnob
              min={60}
              max={180}
              step={1}
              value={params.tempo}
              onChange={(value) => handleParamChange('tempo', value)}
              label="Tempo (BPM)"
              color="#FF9800"
            />
            <NexusKnob
              min={0}
              max={1}
              value={params.rhythmComplexity}
              onChange={(value) => handleParamChange('rhythmComplexity', value)}
              label="Complexidade"
              color="#FF9800"
            />
            <NexusKnob
              min={0}
              max={0.5}
              value={params.swingFeel}
              onChange={(value) => handleParamChange('swingFeel', value)}
              label="Swing"
              color="#FF9800"
            />
          </div>
        </div>
        
        <div className="controls-group">
          <h3>Efeitos</h3>
          <div className="knobs-row">
            <NexusKnob
              min={0}
              max={1}
              value={params.reverb}
              onChange={(value) => handleParamChange('reverb', value)}
              label="Reverb"
              color="#9C27B0"
            />
            <NexusKnob
              min={0}
              max={1}
              value={params.delay}
              onChange={(value) => handleParamChange('delay', value)}
              label="Delay"
              color="#9C27B0"
            />
            <NexusKnob
              min={100}
              max={10000}
              value={params.filter}
              onChange={(value) => handleParamChange('filter', value)}
              label="Filtro"
              color="#9C27B0"
            />
          </div>
        </div>
      </div>
      
      <div className="buttons-row">
        <button 
          className={`play-button ${isPlaying ? 'stop' : 'play'}`}
          onClick={handlePlayStop}
        >
          {isPlaying ? 'Parar Música' : 'Iniciar Música'}
        </button>
        <button className="action-button" onClick={handleRandomize}>
          Randomizar Knobs
        </button>
        <button className="action-button" onClick={handleChangeSeed}>
          Nova Seed
        </button>
      </div>
    </div>
  );
}

export default App;
