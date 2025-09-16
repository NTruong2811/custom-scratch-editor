import React from 'react';
import './Stage.css';

// Hàm helper để dịch opcode sang tên hiển thị
const getMonitorLabel = (opcode) => {
  switch (opcode) {
    case 'motion_xposition': return 'tọa độ x';
    case 'motion_yposition': return 'tọa độ y';
    case 'motion_direction': return 'hướng';
    default: return opcode;
  }
};

const Stage = ({ character, characterImage, backgroundImage, monitors }) => {
  const stageStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const characterStyle = {
    left: `${character.x - 20}px`,
    top: `${character.y - 20}px`,
    transform: `rotate(${character.angle}deg)`,
  };

  if (characterImage) {
    characterStyle.backgroundImage = `url(${characterImage})`;
    characterStyle.backgroundSize = 'contain';
    characterStyle.backgroundPosition = 'center';
    characterStyle.backgroundRepeat = 'no-repeat';
    characterStyle.backgroundColor = 'transparent';
    characterStyle.border = 'none';
  }

  return (
    <div className="stage" style={stageStyle}>
      <div
        className={`character ${characterImage ? 'custom-character' : ''}`}
        style={characterStyle}
      />
      <div className="monitors-container">
        {Array.from(monitors.values())
          .filter(monitor => monitor.visible)
          .map(monitor => (
            <div key={monitor.id} className="monitor">
              {getMonitorLabel(monitor.opcode)}: {Math.round(monitor.value)}
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Stage;