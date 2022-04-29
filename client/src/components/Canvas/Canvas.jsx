import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Modal } from 'react-bootstrap';

import classes from './Canvas.module.scss';
import canvasStore from '../../store/canvasStore';
import toolStore from '../../store/toolStore';
import Brush from '../../tools/Brush';
import Rect from '../../tools/Rect';
import Eraser from '../../tools/Eraser';
import Circle from '../../tools/Circle';

const Canvas = observer(() => {
  const [modal, setModal] = useState(true);
  const [isMatch, setIsMatch] = useState(false);
  const canvasRef = useRef();
  const usernameRef = useRef();
  const params = useParams();


  useEffect(() => {
    canvasStore.setCanvas(canvasRef.current);
  }, []);

  useEffect(() => {
    if (canvasStore.username) {
      const socket = new WebSocket('ws://localhost:5000/');
      canvasStore.setSocket(socket);
      canvasStore.setSessionId(params.id);
      toolStore.setTool(new Brush(canvasStore.canvas, socket, params.id));
      socket.onopen = () => {
        socket.send(JSON.stringify({
          method: 'connection',
          id: canvasStore.sessionId,
          username: canvasStore.username
        }));
      };
      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const ctx = canvasRef.current?.getContext('2d');
        switch (msg.method) {
          case 'connection':
            console.log(`The user ${msg.username} has been connected`);
            break;
          case 'setTool':
            handleTool(msg);
            break;
          case 'setSetting':
            handleSetting(msg);
            break;
          case 'draw':
            handleDraw(msg, ctx);
            break;
          case 'finishDrawing':
            ctx.beginPath();
            break;
        }
      };
    }
  }, [canvasStore.username]);

  const handleTool = (msg) => {
    const canvas = canvasStore.canvas;
    const socket = canvasStore.socket;
    const id = canvasStore.sessionId;
    switch (msg.tool) {
      case 'Brush':
        toolStore.setTool(new Brush(canvas, socket, id));
        break;
      case 'Rect':
        toolStore.setTool(new Rect(canvas, socket, id));
        break;
      case 'Circle':
        toolStore.setTool(new Circle(canvas, socket, id));
        break;
      case 'Eraser':
        toolStore.setTool(new Eraser(canvas, socket, id));
        toolStore.setStrokeColor('#ffffff');
        break;
      // case 'Line':
      //   toolStore.setTool(new Line(canvas, socket, id));
      //   break;
    }
  };

  const handleSetting = (msg) => {
    const value = msg.value;
    switch (msg.setting) {
      case 'lineWidth':
        toolStore.setLineWidth(value);
        break;
      case 'fillColor':
        toolStore.setFillColor(value);
        break;
      case 'strokeColor':
        toolStore.setStrokeColor(value);
        break;
    }
  };

  const handleDraw = (msg, ctx) => {
    const figure = msg.figure;
    switch (figure.type) {
      case 'brush':
        if (!canvasStore.mouseDown) {
          Brush.draw(ctx, figure.x, figure.y);
        }
        break;
      case 'rect':
        Rect.staticDraw(ctx, figure.x, figure.y, figure.w, figure.h);
        break;
      case 'circle':
        Circle.staticDraw(ctx, figure.x, figure.y, figure.w);
        break;
      case 'eraser':
        if (!canvasStore.mouseDown) {
          Eraser.draw(ctx, figure.x, figure.y);
        }
        break;
    }
  };

  const handleMouseDown = () => {
    canvasStore.pushToUndo(canvasRef.current?.toDataURL());
  };

  const handleClick = (event) => {
    if ((event.key && event.key !== 'Enter') || isMatch || usernameRef.current?.value.length === 0) return;
    canvasStore.setUsername(usernameRef.current?.value);
    setModal(false);
  };

  const handleInput = (event) => {
    if (!!event.target.value.search(/^[a-z\d]+$/gi)) {
      setIsMatch(true);
    } else {
      setIsMatch(false);
    }
  };

  return (
    <div className={classes.canvas}>
      <Modal
        show={modal}
        onKeyUp={handleClick}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input ref={usernameRef} type="text" onChange={handleInput} />
          {isMatch && <p style={
            {
              margin: '0',
              paddingTop: '1rem',
              color: 'red'
            }
          }>Имя должно содержать минимум 1 букву или цифру</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClick}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        onMouseDown={handleMouseDown}
        ref={canvasRef}
        width={800}
        height={600}
      >
      </canvas>
    </div>
  );
});

export default Canvas;
