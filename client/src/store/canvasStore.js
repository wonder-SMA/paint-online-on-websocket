import { makeAutoObservable } from 'mobx';

class CanvasStore {
  canvas = null;
  socket = null;
  sessionId = null;
  username = '';
  undoList = [];
  redoList = [];
  mouseDown = false;

  constructor() {
    makeAutoObservable(this);
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  setUsername(username) {
    this.username = username;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  pushToUndo(data) {
    this.undoList.push(data);
  }

  pushToRedo(data) {
    this.redoList.push(data);
  }

  undo() {
    let ctx = this.canvas.getContext('2d');
    if (this.undoList.length) {
      let dataUrl = this.undoList.pop();
      this.pushToRedo(this.canvas.toDataURL());
      let img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    }
  }

  redo() {
    let ctx = this.canvas.getContext('2d');
    if (this.redoList.length) {
      let dataUrl = this.redoList.pop();
      this.pushToUndo(this.canvas.toDataURL());
      let img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    }
  }

  setMouseDown(mouseDown) {
    this.mouseDown = mouseDown;
  }
}

export default new CanvasStore();