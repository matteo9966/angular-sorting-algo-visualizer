import {
  ChangeDetectionStrategy,
  Component,
  Renderer2,
  ViewChild,
  ElementRef,
  Input,
  inject,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortingService } from 'src/app/services/sorting.service';
import { Actions } from 'src/app/types/actions';
import {
  AnimationElement,
  AnimationQueue,
} from '@matteo-l-tommasi/sorting-algorithms';
import { iterationAnimation } from 'src/app/utils/animations/iterationAnimation';
import {
  animateRectangle,
  createRectangleAnimation,
} from 'src/app/utils/animations/swapAnimation';
import { calculateNormailizedHeight } from 'src/app/utils/calculateNormalizedHeight';

function sleep(time: number) {
  return new Promise((r, _rej) => setTimeout(() => r(null), time));
}

@Component({
  selector: 'app-sorting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortingComponent implements AfterViewInit {
  renderer = inject(Renderer2);
  sortingService = inject(SortingService);
  status: Actions = 'pause';
  executing = false;
  currentStepIndex = 0;
  rectangleDivsList: HTMLDivElement[] = [];
  maxValue: number | null = null;
  currentIndex = 0;
  private _sortingSequence: number[][] = [];

  @Input({ required: true })
  set sortingSequence(sequence: number[][]) {
    this._sortingSequence = sequence;
    this.maxValue = Math.max(...this._sortingSequence[0]);
  }
  get sortingSequence() {
    return this._sortingSequence;
  }

  #animationQueue: AnimationQueue = [];
  queueIndex = 0;

  @Input()
  set animationQueue(animationQueue: AnimationQueue) {
    this.createRectangles;
    this.#animationQueue = animationQueue;
    this.maxValue = Math.max(...(animationQueue[0]?.listStatus || []));
    this.rectangleDivsList = this.createRectangles(
      animationQueue[0]?.listStatus || []
    );
    this.initRectangles(animationQueue[0]?.listStatus || []);
  }
  get animationQueue() {
    return this.#animationQueue;
  }

  @Input() containerHeight: number = 500;
  @Input() defaultRectangleColor = 'white';
  @Input() swapColor = 'magenta';
  @Input() iterationColor = 'green';
  @Input() animationSpeed = 300;

  constructor() {
    this.sortingService.tick$.subscribe((tick) => {
      this.animationSpeed = tick;
      const animationItem = this.animationQueue[this.queueIndex];
      if (!animationItem) {
        this.executing = false;
        this.queueIndex = 0;
        this.sortingService.pause();
        return;
      }
      this.executing = true;
      switch (animationItem.animationFn) {
        case 'itarationAnimation':
          this.iterationRectangleAnimation(
            this.rectangleDivsList,
            animationItem.currentIndex,
            tick,
            this.iterationColor
          ).play();
          break;
        case 'swapAnimation':
          this.animateRectangles(animationItem.listStatus);
          break;

        default:
          break;
      }
      this.queueIndex++;
    });
  }

  ngAfterViewInit(): void {
    this.rectangleDivsList = this.createRectangles(this.sortingSequence[0]);
  }

  @ViewChild('container', { static: true })
  container!: ElementRef<HTMLDivElement>;

  initRectangles(values: number[]) {
    this.rectangleDivsList = this.createRectangles(values);
  }

  createRectangles(values: number[]) {
    const rectangleDivs: HTMLDivElement[] = [];
    this.removeAllRectangles();
    if (!this.maxValue) {
      return [];
    }
    for (const value of values) {
      const rectangle = this.createRectangle(value, this.maxValue);
      this.renderer.appendChild(this.container.nativeElement, rectangle);
      rectangleDivs.push(rectangle);
    }
    return rectangleDivs;
  }

  createRectangle(value: number, maxValue: number) {
    const rectangleHeight = calculateNormailizedHeight(
      this.containerHeight,
      maxValue,
      value
    );
    const rectangle = this.renderer.createElement('div');
    this.updateRectangleTextValue(rectangle, value);
    this.renderer.setStyle(rectangle, 'height', `${rectangleHeight}px`);
    this.renderer.addClass(rectangle, 'rect');
    this.setValueAttribute(rectangle, value);
    return rectangle as HTMLDivElement;
  }

  removeAllRectangles() {
    if (!this.container || !this.container.nativeElement) {
      return;
    }
    while (this.container.nativeElement.firstChild) {
      this.renderer.removeChild(
        this.container.nativeElement,
        this.container.nativeElement.firstChild
      );
    }
  }

  updateRectangleTextValue(rectangle: HTMLDivElement, value: number) {
    if (rectangle.firstChild) {
      this.renderer.removeChild(rectangle, rectangle.firstChild);
    }
    const valueSpan = this.renderer.createElement('span');
    this.renderer.addClass(valueSpan, 'value');
    (<HTMLSpanElement>valueSpan).innerText = String(value);
    this.renderer.appendChild(rectangle, valueSpan);
  }

  animateRectangles(element: number[]) {
    if (!element) {
      return;
    }
    for (let j = 0; j < element.length; j++) {
      const rectDiv = this.rectangleDivsList[j];
      const value = element[j];
      this.animateRectangle(rectDiv, value);
      this.updateRectangleTextValue(rectDiv, value);
    }
  }


  iterationRectangleAnimation(
    divs: HTMLDivElement[],
    index: number,
    tick: number,
    iterationColor: string
  ) {
    return iterationAnimation(divs, index, tick, iterationColor);
  }

  async animateRectangle(rectDiv: HTMLDivElement, value: number) {
    if(!this.maxValue) return
    await animateRectangle(
      rectDiv,
      value,
      this.maxValue,
      this.containerHeight,
      this.swapColor,
      this.animationSpeed
    );
    if (!this.maxValue) return;

    this.commitNormalizedHeightToRect(rectDiv, value);
  }

  resetDefaultColor() {
    this.rectangleDivsList.forEach((div) => {
      this.renderer.setStyle(div, 'background', this.defaultRectangleColor);
    });
  }

  setHeights(divs: HTMLDivElement[], heights: number[]) {
    if (!this.maxValue) return;
    divs.forEach((d, i) => {
      this.renderer.setStyle(
        d,
        'height',
        `${calculateNormailizedHeight(
          this.containerHeight,
          this.maxValue!,
          heights[i]
        )}px`
      );
      this.setValueAttribute(d, heights[i]);
      this.updateRectangleTextValue(d, heights[i]);
    });
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

  hasSameValue(rect: HTMLDivElement, value: number) {
    const currentValue = rect.getAttribute('data-value');
    if (!currentValue) return false;
    return +currentValue === value;
  }

  /**
   * @description update the value of the data attribute used for checking if the div is the same
   * @param rect
   * @param value
   */
  setValueAttribute(rect: HTMLDivElement, value: number) {
    this.renderer.setAttribute(rect, 'data-value', String(value));
  }

  resetHeightsOfRectangles() {
    if (
      !this.rectangleDivsList ||
      !this.sortingSequence[0] ||
      this.rectangleDivsList.length !== this.sortingSequence[0].length
    ) {
      console.error(
        'values are mismatched!',
        'divs number:',
        this.rectangleDivsList.length,
        'sorting sequence length:',
        this.sortingSequence[0].length
      );
    }
    this.setHeights(this.rectangleDivsList, this.sortingSequence[0]);
  }
}
