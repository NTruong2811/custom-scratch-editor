import React from 'react';
import './Stage.css';

const Stage = ({ character, characterImage, backgroundImage }) => {
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

  // Nếu có ảnh tùy chỉnh, thêm background image
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
    </div>
  );
};

export default Stage;