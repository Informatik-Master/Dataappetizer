export abstract class VisualizationComponent {
  onResize(): void {}
  previewMode = false;

  setMockData(): void {
    this.previewMode = true;
  }
}
