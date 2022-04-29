import Tool from './Tool';

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

  handleMouseUp() {
    this.mouseDown = false;
  }

  handleMouseDown(e) {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.ctx.moveTo(...this.getCoords(e));
  }

  handleMouseMove(e) {
    if (this.mouseDown) {
      let x = [...this.getCoords(e)][0];
      this.draw(x, x);
    }
  }

  draw(x, y) {
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }
}

export default Line;