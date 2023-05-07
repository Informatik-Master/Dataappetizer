import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[visualizationHost]',
})
export class VisualizationHost {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
