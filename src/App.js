import React, { useState, useEffect } from 'react';
import VM from 'scratch-vm';
import BlocklyEditor from './components/BlocklyEditor';
import Stage from './components/Stage';
import './App.css';

const minimalProjectJson = {
  targets: [
    {
      isStage: true,
      name: 'Stage',
      variables: {},
      lists: {},
      broadcasts: {},
      blocks: {},
      comments: {},
      currentCostume: 0,
      costumes: [
        {
          assetId: 'cd21514d0531fdffb22204e0ec5ed84a',
          name: 'backdrop1',
          md5ext: 'cd21514d0531fdffb22204e0ec5ed84a.svg',
          dataFormat: 'svg',
        },
      ],
      sounds: [],
      volume: 100,
    },
    {
      isStage: false,
      name: 'Sprite1',
      variables: {},
      lists: {},
      broadcasts: {},
      blocks: {},
      comments: {},
      visible: true,
      x: 0,
      y: 0,
      size: 100,
      direction: 90,
      draggable: false,
      rotationStyle: 'all around',
      currentCostume: 0,
      costumes: [
        {
          assetId: 'bcf454acf82e4504149f7ffe07081dbc',
          name: 'costume1',
          md5ext: 'bcf454acf82e4504149f7ffe07081dbc.svg',
          dataFormat: 'svg',
          rotationCenterX: 48,
          rotationCenterY: 50,
        },
      ],
      sounds: [],
      volume: 100,
    },
  ],
  meta: {
    semver: '3.0.0',
  },
};

function App() {
  const [vm, setVm] = useState(null);
  const [blocksJson, setBlocksJson] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [character, setCharacter] = useState({ x: 250, y: 250, angle: 0 });

  // Fixed images
  const characterImage = 'https://beta.aibuddy.vn/assets/dinosaur-DFjzxIj-.png';
  const backgroundImage = 'https://beta.aibuddy.vn/assets/bg-1-e6RwZxal.png';

  useEffect(() => {
    const newVm = new VM();
    setVm(newVm);

    newVm.on('targetsUpdate', (data) => {
        const sprite = data.targetList.find(target => !target.isStage);
        if (sprite && sprite.visible) {
            setCharacter({ x: 250 + sprite.x, y: 250 - sprite.y, angle: sprite.direction - 90 });
        }
    });

    newVm.loadProject(minimalProjectJson).then(() => { newVm.start(); });
    return () => newVm.stopAll();
  }, []);

  const handleRunCode = async () => {
    if (!vm || isRunning || !blocksJson) return;

    try {
        setIsRunning(true);
        const projectToLoad = JSON.parse(JSON.stringify(minimalProjectJson));
        const spriteTarget = projectToLoad.targets.find(t => t.name === 'Sprite1');

        if (spriteTarget && blocksJson.blocks) {
            spriteTarget.blocks = blocksJson.blocks;
        }

        await vm.loadProject(projectToLoad);
        vm.greenFlag();
        vm.runtime.once('PROJECT_RUN_STOP', () => { setIsRunning(false); });
    } catch (e) {
        console.error("Lỗi khi xây dựng hoặc chạy project:", e);
        alert('Đã xảy ra lỗi!');
        setIsRunning(false);
    }
  };

  return (
    <div className="app-container">
      <div className="editor-container">
        <BlocklyEditor onWorkspaceChangeJson={setBlocksJson} />
      </div>
      <div className="controls-container">
        <div className="stage-wrapper">
          <Stage 
            character={character} 
            characterImage={characterImage}
            backgroundImage={backgroundImage}
          />
        </div>
        <button onClick={handleRunCode} className="control-button run-button" disabled={isRunning || !vm}>
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>
    </div>
  );
}

export default App;