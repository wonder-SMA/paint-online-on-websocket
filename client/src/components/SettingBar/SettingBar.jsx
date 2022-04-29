import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import classes from './SettingBar.module.scss';
import canvasStore from '../../store/canvasStore';
import toolStore from '../../store/toolStore';

const SettingBar = observer(() => {
  const settingBarRef = useRef();
  const socket = canvasStore.socket;
  const id = canvasStore.sessionId;

  useEffect(() => {
    toolStore.setSettingBarRef(settingBarRef);
  }, []);

  return (
    <div ref={settingBarRef} className={classes['setting-bar']}>
      <div>
        <p>Толщина линии</p>
        <input
          onChange={e => {
            const value = e.target.value;
            socket.send(JSON.stringify({
              method: 'setSetting',
              id,
              setting: 'lineWidth',
              value
            }));
          }}
          type="number"
          value={toolStore.lineWidth}
          min={1}
          max={100}
        />
      </div>
      <div>
        <p>Цвет обводки</p>
        <input
          onChange={e => {
            const value = e.target.value;
            socket.send(JSON.stringify({
              method: 'setSetting',
              id,
              setting: 'strokeColor',
              value
            }));
          }}
          type="color"
          value={toolStore.strokeColor}
        />
      </div>
      <div>
        <p>Цвет заливки</p>
        <input
          onChange={e => {
            const value = e.target.value;
            socket.send(JSON.stringify({
              method: 'setSetting',
              id,
              setting: 'fillColor',
              value
            }));
          }}
          type="color"
          value={toolStore.fillColor}
        />
      </div>
    </div>
  );
});

export default SettingBar;
