import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import classes from './Toolbar.module.scss';
import canvasStore from '../../store/canvasStore';
import toolStore from '../../store/toolStore';

const ToolBar = observer(() => {
  const toolbarRef = useRef();
  const socket = canvasStore.socket;
  const id = canvasStore.sessionId;

  const download = () => {
    const dataUrl = canvasStore.canvas?.toDataURL();
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = canvasStore.sessionId + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    const height = parseInt(getComputedStyle(toolbarRef.current).height);
    if (height > 40 && toolStore.settingBarRef) {
      toolStore.settingBarRef.current.style.top = `${height}px`;
    }
  }, [toolStore.settingBarRef]);

  return (
    <div ref={toolbarRef} className={classes.toolbar}>
      <button
        className={classes.brush}
        onClick={() => {
          socket.send(JSON.stringify({
            method: 'setTool',
            id,
            tool: 'Brush'
          }));
        }}
      />
      <button
        className={classes.rect}
        onClick={() => {
          socket.send(JSON.stringify({
            method: 'setTool',
            id,
            tool: 'Rect'
          }));
        }}
      />
      <button
        className={classes.circle}
        onClick={() => {
          socket.send(JSON.stringify({
            method: 'setTool',
            id,
            tool: 'Circle'
          }));
        }}
      />
      <button
        className={classes.eraser}
        onClick={() => {
          socket.send(JSON.stringify({
            method: 'setTool',
            id,
            tool: 'Eraser'
          }));
        }}
      />
      <button
        className={classes.line}
        onClick={() => {
          socket.send(JSON.stringify({
            method: 'setTool',
            id,
            tool: 'Line'
          }));
        }}
      />
      <div>
        <button
          className={classes.undo}
          onClick={() => canvasStore.undo()}
        />
        <button
          className={classes.redo}
          onClick={() => canvasStore.redo()}
        />
        <button
          className={classes.save}
          onClick={() => download()}
        />
      </div>
    </div>
  );
});

export default ToolBar;
