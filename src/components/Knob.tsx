import React, { useState, useEffect, useRef } from 'react';

interface KnobProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  color?: string;
  size?: number;
}

const Knob: React.FC<KnobProps> = ({
  min,
  max,
  value,
  onChange,
  label,
  color = '#6366f1',
  size = 80
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(value);

  // Normaliza o valor entre 0 e 1
  const normalizedValue = (value - min) / (max - min);
  // Converte para ângulo (135 graus para cada lado a partir do centro)
  const rotation = -135 + normalizedValue * 270;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(value);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calcula a diferença de movimento (invertido para que para cima aumente o valor)
    const deltaY = startY - e.clientY;
    
    // Sensibilidade do knob
    const sensitivity = (max - min) / 200;
    
    // Calcula o novo valor
    let newValue = startValue + deltaY * sensitivity;
    
    // Limita o valor ao intervalo min-max
    newValue = Math.max(min, Math.min(max, newValue));
    
    onChange(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Limpa os event listeners quando o componente é desmontado
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div
        ref={knobRef}
        className="relative cursor-pointer select-none"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
      >
        {/* Círculo base do knob */}
        <div
          className="absolute rounded-full border-2 border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
          style={{
            width: size,
            height: size,
            top: 0,
            left: 0,
          }}
        />
        
        {/* Indicador de posição */}
        <div
          className="absolute rounded-full bg-white dark:bg-gray-600"
          style={{
            width: size * 0.1,
            height: size * 0.1,
            top: size * 0.1,
            left: size / 2 - size * 0.05,
            transformOrigin: `center ${size / 2 - size * 0.1}px`,
            transform: `rotate(${rotation}deg)`,
          }}
        />
        
        {/* Círculo colorido central */}
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            top: size * 0.2,
            left: size * 0.2,
            backgroundColor: color,
            opacity: 0.2 + normalizedValue * 0.8,
          }}
        />
        
        {/* Valor numérico */}
        <div
          className="absolute flex items-center justify-center text-xs font-bold text-gray-800 dark:text-gray-200"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            top: size * 0.2,
            left: size * 0.2,
          }}
        >
          {Math.round(value * 100) / 100}
        </div>
      </div>
      
      {/* Label do knob */}
      <div className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
      </div>
    </div>
  );
};

export default Knob;
