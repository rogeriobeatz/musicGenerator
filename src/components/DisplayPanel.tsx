import React from 'react';

interface DisplayPanelProps {
  seed: number;
  scale: string;
  root: string;
  bpm: number;
  evolutionPhase: string;
  color?: string;
}

const DisplayPanel: React.FC<DisplayPanelProps> = ({
  seed,
  scale,
  root,
  bpm,
  evolutionPhase,
  color = '#f59e0b' // Âmbar por padrão
}) => {
  return (
    <div className="relative w-full max-w-md mx-auto bg-gray-800 rounded-lg overflow-hidden">
      {/* Tela do display com efeito de LCD */}
      <div className="p-4 bg-gradient-to-b from-gray-700 to-gray-800 border-4 border-gray-700 rounded-lg">
        <div className="bg-gray-200 dark:bg-gray-900 bg-opacity-90 p-4 rounded-md shadow-inner text-gray-800 dark:text-gray-200 font-mono">
          {/* Cabeçalho do display */}
          <div className="flex justify-between items-center mb-3 text-xs opacity-70 border-b border-gray-400 dark:border-gray-600 pb-1">
            <div>SYNTH-INFINITE</div>
            <div>{new Date().toLocaleTimeString().slice(0, 5)}</div>
          </div>
          
          {/* Informação principal */}
          <div className="mb-4">
            <div className="text-2xl font-bold mb-1 text-center" style={{ color }}>
              {root} {scale}
            </div>
            <div className="text-4xl font-bold text-center mb-2">
              {bpm} <span className="text-sm">BPM</span>
            </div>
          </div>
          
          {/* Informações secundárias */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-300 dark:bg-gray-800 p-2 rounded">
              <div className="text-xs opacity-70">SEED</div>
              <div className="font-bold truncate">{seed}</div>
            </div>
            <div className="bg-gray-300 dark:bg-gray-800 p-2 rounded">
              <div className="text-xs opacity-70">FASE</div>
              <div className="font-bold truncate">{evolutionPhase}</div>
            </div>
          </div>
          
          {/* Indicadores visuais */}
          <div className="mt-3 flex justify-between items-center">
            <div className="flex space-x-1">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${
                    evolutionPhase === 'Clímax' || Math.random() > 0.6 
                      ? 'bg-green-500' 
                      : 'bg-gray-400 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs opacity-70">v2.0</div>
          </div>
        </div>
      </div>
      
      {/* Reflexos e detalhes visuais */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-white bg-opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300 dark:bg-gray-700 bg-opacity-20 pointer-events-none" />
    </div>
  );
};

export default DisplayPanel;
