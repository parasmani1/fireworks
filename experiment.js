class Experiment {
  // Group Details
  static rollNos = '102103439,102103441,102103442'
  static names = 'Super Kings(Parasmani, Saksham, Digvijay Singh Sidhu)'

  canvasSel = "#myCanvas";

  run() {
    this.runFireworks();
    canvasSetup(this.canvasSel);
  }

  runFireworks() {
    const fireworks = new Fireworks(this.canvasSel);
    fireworks.run();
  }
}
