import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import './App.scss';
import ToolBar from './components/ToolBar/ToolBar';
import SettingBar from './components/SettingBar/SettingBar';
import Canvas from './components/Canvas/Canvas';

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/:id" element={
          <>
            <ToolBar />
            <SettingBar />
            <Canvas />
          </>
        } />
        <Route path="/*" element={<Navigate to={`f${(+new Date()).toString(16)}`} replace />} />
      </Routes>
    </div>
  );
};

export default App;
