import { makeAutoObservable } from 'mobx';

class ToolStore {
  tool = null;
  settingBarRef = null;
  lineWidth = 1;
  fillColor = '#000000';
  strokeColor = '#000000';

  constructor() {
    makeAutoObservable(this);
  }

  setTool(tool) {
    this.tool = tool;
  }

  setSettingBarRef(ref) {
    this.settingBarRef = ref;
  }

  setLineWidth(width) {
    this.tool.lineWidth = width;
    this.lineWidth = width;
  }

  setFillColor(color) {
    this.tool.fillColor = color;
    this.fillColor = `${color}`;
  }

  setStrokeColor(color) {
    this.tool.strokeColor = color;
    this.strokeColor = `${color}`;
  }
}

export default new ToolStore();