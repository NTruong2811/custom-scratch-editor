// src/components/Stage.js

import React from 'react';

// Hàm helper để dịch opcode thành tên hiển thị tiếng Việt
const getMonitorLabel = (opcode) => {
    switch (opcode) {
        case 'motion_xposition':
            return 'tọa độ x';
        case 'motion_yposition':
            return 'tọa độ y';
        case 'motion_direction':
            return 'hướng';
        default:
            return opcode;
    }
};

// Component con để hiển thị một monitor
const Monitor = ({ monitor }) => {
    // Chỉ hiển thị nếu monitor được bật
    if (!monitor.visible) {
        return null;
    }

    const monitorStyle = {
        position: 'absolute',
        left: `${monitor.x}px`,
        top: `${monitor.y}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        userSelect: 'none', // không cho phép chọn text
    };

    const valueStyle = {
        backgroundColor: '#4C97FF', // Màu của khối Chuyển động
        padding: '2px 6px',
        borderRadius: '4px',
        minWidth: '30px',
        textAlign: 'center',
        fontWeight: 'bold',
    };

    // Làm tròn giá trị số để hiển thị đẹp hơn
    const displayValue = typeof monitor.value === 'number' ? Math.round(monitor.value) : monitor.value;

    return (
        <div style={monitorStyle}>
            <span>{getMonitorLabel(monitor.opcode)}</span>
            <span style={valueStyle}>{displayValue}</span>
        </div>
    );
};


const Stage = ({ character, characterImage, backgroundImage, monitors }) => {
    // Chuyển Map monitors thành một mảng để render
    const monitorList = monitors ? Array.from(monitors.values()) : [];

    return (
        <div className="stage-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <img
                src={characterImage}
                alt="character"
                className="character"
                style={{
                    // Dịch chuyển tâm của ảnh về tọa độ x, y
                    left: `calc(${character.x}px - 50%)`,
                    top: `calc(${character.y}px - 50%)`,
                    transform: `rotate(${character.angle}deg)`,
                }}
            />
            <div className="monitor-layer">
                {monitorList.map(monitor => (
                    <Monitor key={monitor.id} monitor={monitor} />
                ))}
            </div>
        </div>
    );
};

export default Stage;