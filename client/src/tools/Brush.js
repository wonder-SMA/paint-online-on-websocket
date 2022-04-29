import Tool from './Tool';
import canvasStore from '../store/canvasStore';

class Brush extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
  }

  listen() {
    this.canvas.onmouseup = this.handleMouseUp.bind(this);
    this.canvas.onmousedown = this.handleMouseDown.bind(this);
    this.canvas.onmousemove = this.handleMouseMove.bind(this);
  }

  handleMouseDown(e) {
    this.ctx.beginPath();
    this.socket.send(JSON.stringify({
      method: 'finishDrawing',
      id: this.id,
    }));
    canvasStore.setMouseDown(true);
    this.ctx.moveTo(...this.getCoords(e));
  }

  handleMouseUp() {
    canvasStore.setMouseDown(false);
    this.ctx.beginPath();
    this.socket.send(JSON.stringify({
      method: 'finishDrawing',
      id: this.id,
    }));
  }

  handleMouseMove(e) {
    if (canvasStore.mouseDown) {
      let [x, y] = [...this.getCoords(e)];
      this.draw(x, y);
      this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: 'brush',
          x,
          y
        }
      }));
    }
  }

  draw(x, y) {
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  static draw(ctx, x, y) {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

export default Brush;