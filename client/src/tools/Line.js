import Tool from './Tool';
import canvasStore from '../store/canvasStore';

class Line extends Tool {
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
    canvasStore.setMouseDown(true);
    let coords = [...this.getCoords(e)];
    this.startX = coords[0];
    this.startY = coords[1];
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.saved = this.canvas.toDataURL();
  }

  handleMouseUp() {
    canvasStore.setMouseDown(false);
    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'line',
        startX: this.startX,
        startY: this.startY,
        x: this.currentX,
        y: this.currentY
      }
    }));
  }

  handleMouseMove(e) {
    if (canvasStore.mouseDown) {
      let coords = [...this.getCoords(e)];
      this.currentX = coords[0];
      this.currentY = coords[1];
      this.draw(this.currentX, this.currentY);
    }
  }

  draw(x, y) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    };
  }

  static staticDraw(ctx, startX, startY, x, y) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

export default Line;