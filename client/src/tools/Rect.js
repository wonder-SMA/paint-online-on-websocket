import Tool from './Tool';
import canvasStore from '../store/canvasStore';

class Rect extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
  }

  listen() {
    this.canvas.onmouseup = this.handleMouseUp.bind(this);
    this.canvas.onmousedown = this.handleMouseDown.bind(this);
    this.canvas.onmousemove = this.handleMouseMove.bind(this);
  }

  handleMouseUp(e) {
    canvasStore.setMouseDown(false);
    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'rect',
        x: this.startX,
        y: this.startY,
        w: this.width,
        h: this.height
      }
    }));
  }

  handleMouseDown(e) {
    canvasStore.setMouseDown(true);
    this.ctx.beginPath();
    let coords = [...this.getCoords(e)];
    this.startX = coords[0];
    this.startY = coords[1];
    this.saved = this.canvas.toDataURL();
  }

  handleMouseMove(e) {
    if (canvasStore.mouseDown) {
      let [currentX, currentY] = [...this.getCoords(e)];
      this.width = currentX - this.startX;
      this.height = currentY - this.startY;
      this.draw(this.startX, this.startY, this.width, this.height);
    }
  }

  draw(x, y, w, h) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.rect(x, y, w, h);
      this.ctx.fill();
      this.ctx.stroke();
    };
  }

  static staticDraw(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
  }
}

export default Rect;