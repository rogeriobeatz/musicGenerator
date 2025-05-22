import React, { useEffect, useState } from 'react';
import { Dial } from 'react-nexusui';

interface NexusKnobProps {
  size?: [number, number];
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  color?: string;
}

const NexusKnob: React.FC<NexusKnobProps> = ({
  size = [80, 80],
  min,
  max,
  step = 0.01,
  value,
  onChange,
  label,
  color = '#f5a623'
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (newValue: number) => {
    setInternalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="nexus-knob-container">
      <Dial
        size={size}
        interaction="radial"
        mode="absolute"
        min={min}
        max={max}
        step={step}
        value={internalValue}
        onChange={handleChange}
        onReady={(dial) => {
          // Personalize a aparência do dial
          if (dial.element) {
            const element = dial.element as HTMLElement;
            const circles = element.querySelectorAll('circle');
            if (circles.length > 1) {
              // Círculo de indicação (ativo)
              circles[1].setAttribute('fill', color);
            }
          }
        }}
      />
      <div className="nexus-knob-label">{label}</div>
      <style jsx>{`
        .nexus-knob-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 10px;
        }
        .nexus-knob-label {
          margin-top: 8px;
          font-size: 12px;
          text-align: center;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default NexusKnob;
