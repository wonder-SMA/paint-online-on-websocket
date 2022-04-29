import Tool from './Tool';
import canvasStore from '../store/canvasStore';

class Circle extends Tool {
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
    this.ctx.beginPath();
    let coords = [...this.getCoords(e)];
    this.startX = coords[0];
    this.startY = coords[1];
    this.saved = this.canvas.toDataURL();
  }

  handleMouseUp() {
    canvasStore.setMouseDown(false);
    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'circle',
        x: this.startX,
        y: this.startY,
        w: this.width
      }
    }));
  }

  handleMouseMove(e) {
    if (canvasStore.mouseDown) {
      let currentX = [...this.getCoords(e)][0];
      this.width = currentX - this.startX;
      this.draw(this.startX, this.startY, this.width);
    }
  }

  draw(x, y, w) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.arc(x, y, Math.abs(w), 0, Math.PI + (Math.PI * x) / 2);
      this.ctx.fill();
      this.ctx.stroke();
    };
  }

  static staticDraw(ctx, x, y, w) {
    ctx.beginPath();
    ctx.arc(x, y, Math.abs(w), 0, Math.PI + (Math.PI * x) / 2);
    ctx.fill();
    ctx.stroke();
  }
}

export default Circle;