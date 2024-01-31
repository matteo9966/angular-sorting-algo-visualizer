import { Renderer2, Input, ViewContainerRef } from '@angular/core';
import { AnimationQueue } from '@matteo-l-tommasi/sorting-algorithms';
import { calculateNormailizedHeight } from 'src/app/utils/calculateNormalizedHeight';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SortingService } from '../../core/services/sorting.service';

@Component({
  selector: 'sort-animation',
  standalone: true,
  imports: [],
  template: ``,
})
export abstract class SortAnimation {
  @Input() containerHeight: number = 180;
  defaultRectangleColor = 'var(--default-rectangle-color)';
  swapColor = 'var(--swap-color)';
  iterationColor = 'var(--iteration-color)';

  @Input()
  set animationQueue(animationQueue: AnimationQueue) {
    this.#animationQueue = animationQueue;
    this.maxValue = Math.max(...(animationQueue[0]?.listStatus || []));
    this.rectangleDivsList = this.createRectangles(
      animationQueue[0]?.listStatus || [],
      this.renderer
    );
    this.initRectangles(animationQueue[0]?.listStatus || [], this.renderer);
  }
  get animationQueue() {
    return this.#animationQueue;
  }

  #animationQueue: AnimationQueue = [];
  executing = false;
  queueIndex = 0;
  rectangleDivsList: HTMLDivElement[] = [];
  maxValue!: number;
  container!: HTMLDivElement;

  constructor(
    protected renderer: Renderer2,
    protected sortingService: SortingService,
    protected viewContainerRef: ViewContainerRef
  ) {
    this.sortingService.tick$.subscribe((tick) => {
      this.animate(tick, this.animationQueue, renderer);
    });

    this.initContainer();
  }

  initContainer() {
    this.container = this.viewContainerRef.element.nativeElement;
    this.renderer.addClass(this.container, 'sorting-container');
  }

  abstract animate(
    tick: number,
    animationQueue: AnimationQueue,
    renderer: Renderer2
  ): void;

  updateRectangleTextValue(
    rectangle: HTMLDivElement,
    value: number,
    renderer: Renderer2
  ) {
    if (rectangle.firstChild) {
      renderer.removeChild(rectangle, rectangle.firstChild);
    }
    const valueSpan = renderer.createElement('span');
    renderer.addClass(valueSpan, 'value');
    (<HTMLSpanElement>valueSpan).innerText = String(value);
    renderer.appendChild(rectangle, valueSpan);
  }

  /**
   * @description instead of using animation.commitChanges() I use renderer to apply final styles to the recangle
   */
  commitNormalizedHeightToRect(rectDiv: HTMLDivElement, value: number) {
    if (!this.maxValue) return;
    const normalizedHeigth = calculateNormailizedHeight(
      this.containerHeight,
      this.maxValue,
      value
    );
    this.renderer.setStyle(rectDiv, 'height', `${normalizedHeigth}px`);
    this.setValueAttribute(rectDiv, value);
  }

  /**
   * @description update the value of the data attribute used for checking if the div is the same
   * @param rect
   * @param value
   */
  setValueAttribute(rect: HTMLDivElement, value: number) {
    this.renderer.setAttribute(rect, 'data-value', String(value));
  }

  initRectangles(values: number[], renderer: Renderer2) {
    this.rectangleDivsList = this.createRectangles(values, renderer);
  }

  createRectangles(values: number[], renderer: Renderer2) {
    const rectangleDivs: HTMLDivElement[] = [];
    this.removeAllRectangles(renderer);
    if (!this.maxValue) {
      return [];
    }
    for (const value of values) {
      const rectangle = this.createRectangle(value, this.maxValue, renderer);
      renderer.appendChild(this.container, rectangle);
      rectangleDivs.push(rectangle);
    }
    return rectangleDivs;
  }
  createRectangle(value: number, maxValue: number, renderer: Renderer2) {
    const rectangleHeight = calculateNormailizedHeight(
      this.containerHeight,
      maxValue,
      value
    );
    const rectangle = renderer.createElement('div');
    this.updateRectangleTextValue(rectangle, value, renderer);
    renderer.setStyle(rectangle, 'height', `${rectangleHeight}px`);
    renderer.addClass(rectangle, 'rect');
    this.setValueAttribute(rectangle, value);
    return rectangle as HTMLDivElement;
  }

  removeAllRectangles(renderer: Renderer2) {
    if (!this.container || !this.container) {
      return;
    }
    while (this.container.firstChild) {
      renderer.removeChild(this.container, this.container.firstChild);
    }
  }

  createContainer() {
    this.renderer.createElement('div');
  }

  /**
   * @description removes al background colors from  the rectangles
   */
  resetDefaultColor() {
    this.rectangleDivsList.forEach((div) => {
      this.renderer.setStyle(div, 'background', this.defaultRectangleColor);
    });
  }
}
