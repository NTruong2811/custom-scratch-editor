// src/components/BlocklyEditor.js

import React, { useEffect, useRef } from 'react';
import Blockly from 'scratch-blocks';

import viMessages from 'scratch-l10n/editor/blocks/vi.json';
Blockly.ScratchMsgs.setLocale('vi', viMessages);


const toolboxXml = `
<xml id="toolbox" style="display: none">
  {/* Đã đổi tên category sang tiếng Việt cho nhất quán */}
  <category name="Sự kiện" colour="#FFD500" secondaryColour="#CC9900">
    <block type="event_whenflagclicked"></block>
  </category>
  <category name="Chuyển động" colour="#4C97FF" secondaryColour="#3373CC">
    <block type="motion_movesteps"><value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>
    <block type="motion_turnright"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block>
    <block type="motion_setrotationstyle">
        <value name="STYLE">
            <shadow type="text">
                <field name="TEXT">left-right</field>
            </shadow>
        </value>
    </block>
    <block type="motion_xposition"></block>
    <block type="motion_yposition"></block>
    <block type="motion_direction"></block>
  </category>
  <category name="Hiển thị" colour="#9966FF" secondaryColour="#774DCB">
    <block type="looks_say"><value name="MESSAGE"><shadow type="text"><field name="TEXT">Xin chào!</field></shadow></value></block>
  </category>
</xml>
`;

const BlocklyEditor = ({ onWorkspaceChangeJson, vm }) => {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);

  // Hàm chuyển đổi block sang format SB3 (không thay đổi)
  const blockToSb3 = (block) => {
    const blockData = {
      opcode: block.type,
      next: block.getNextBlock() ? block.getNextBlock().id : null,
      parent: block.getParent() ? block.getParent().id : null,
      inputs: {},
      fields: {},
      shadow: false,
      topLevel: !block.getParent()
    };
    if (blockData.topLevel) {
      const xy = block.getRelativeToSurfaceXY();
      blockData.x = xy.x;
      blockData.y = xy.y;
    }
    const inputList = block.inputList;
    for (let i = 0; i < inputList.length; i++) {
      const input = inputList[i];
      if (input.connection && input.connection.targetConnection) {
        const targetBlock = input.connection.targetBlock();
        if (targetBlock) {
          blockData.inputs[input.name] = [1, targetBlock.id];
        }
      }
    }
    Object.keys(block.getFieldMap ? block.getFieldMap() : {}).forEach(fieldName => {
      const field = block.getField(fieldName);
      if (field && field.getValue) {
        blockData.fields[fieldName] = [field.getValue()];
      }
    });
    if (block.type === 'math_number' && block.getField('NUM')) {
      blockData.fields['NUM'] = [block.getField('NUM').getValue()];
    }
    if (block.type === 'text' && block.getField('TEXT')) {
      blockData.fields['TEXT'] = [block.getField('TEXT').getValue()];
    }
    return blockData;
  };

  // Effect 1: Chỉ chạy một lần để khởi tạo workspace
  useEffect(() => {
    if (blocklyDiv.current) {
      workspace.current = Blockly.inject(blocklyDiv.current, {
        media: 'media/', 
        toolbox: toolboxXml,
        zoom: { controls: true, wheel: true, startScale: 0.75 },
        sounds: false
      });
    }
    return () => {
      if (workspace.current) {
        workspace.current.dispose();
      }
    }
  }, []);

  // Effect 2: Chạy mỗi khi `vm` thay đổi để kết nối chúng lại với nhau
  useEffect(() => {
    const customListener = (event) => {
        if (event.type === Blockly.Events.UI || event.isUiEvent || event.type === 'Bubble') {
            return;
        }
        if (onWorkspaceChangeJson) {
            try {
                const blocks = {};
                const allBlocks = workspace.current.getAllBlocks(false);
                allBlocks.forEach(block => {
                    blocks[block.id] = blockToSb3(block);
                });
                onWorkspaceChangeJson({ blocks });
            } catch (error) {
                console.error('Error converting blocks:', error);
            }
        }
    };

    if (vm && workspace.current) {

      console.log(vm);
      

      // THÊM ĐẦY ĐỦ CÁC LISTENER CẦN THIẾT TỪ VM
      workspace.current.addChangeListener(vm.blockListener);
      workspace.current.addChangeListener(vm.flyoutBlockListener);
      workspace.current.addChangeListener(vm.monitorBlockListener); // Listener quan trọng nhất!

      // Thêm listener tùy chỉnh của chúng ta
      workspace.current.addChangeListener(customListener);
    }

    // Cleanup: Gỡ listener tùy chỉnh ra khi effect chạy lại hoặc component unmount
    return () => {
        if (workspace.current) {
            workspace.current.removeChangeListener(customListener);
        }
    }
  }, [vm, onWorkspaceChangeJson]);


  return <div ref={blocklyDiv} style={{ height: '100%', width: '100%' }} />;
};

export default BlocklyEditor;