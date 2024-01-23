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
  AnimationQueue,
  SortingAnimation,
} from '@matteo-l-tommasi/sorting-algorithms';
import { iterationAnimation } from 'src/app/utils/animations/iterationAnimation';
import {
  animateRectangle,
  createRectangleAnimation,
} from 'src/app/utils/animations/swapAnimation';
import { calculateNormailizedHeight } from 'src/app/utils/calculateNormalizedHeight';
import { hasSameValue } from 'src/app/utils/hasSameValue';

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
  // renderer = inject(Renderer2);
  sortingService = inject(SortingService);
  status: Actions = 'pause';
  executing = false;
  currentStepIndex = 0;
  rectangleDivsList: HTMLDivElement[] = [];
  maxValue: number | null = null;
  currentIndex = 0;
  #animationQueue: AnimationQueue = [];
  queueIndex = 0;

  @Input()
  set animationQueue(animationQueue: AnimationQueue) {
    console.log(animationQueue);
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
  @Input({ required: true }) sortingAlgorithm!: SortingAnimation['sortType'];

  ngOnInit() {
    //this can olso change dinamically
    switch (this.sortingAlgorithm) {
      case 'bubble-sort':
        this.animationFunction = this.animate;
        break;
      case 'insertion-sort':
        this.animationFunction = this.animateInsertionSort;
        break;

      default:
        break;
    }
  }

  animationFunction(_tick: number, _animationQueue: AnimationQueue) {}

  constructor(private renderer: Renderer2) {
    this.sortingService.tick$.subscribe((tick) => {
      this.animationFunction(tick, this.animationQueue);
    });
  }

  animate(tick: number, animationQueue: AnimationQueue) {
    const animationItem = animationQueue[this.queueIndex];
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
        this.bubbleSortSwapRectanglesAnimation(animationItem.listStatus);
        break;

      default:
        break;
    }
    this.queueIndex++;
  }

  animateInsertionSort(tick: number, animationQueue: AnimationQueue) {
    if (!this.maxValue) return;
    const animationItem = animationQueue[this.queueIndex];
    if (!animationItem) {
      this.executing = false;
      this.queueIndex = 0;
      this.sortingService.pause();
      return;
    }
    this.executing = true;
    if (animationItem.sortType !== 'insertion-sort') return;

    const animationFn = animationItem.animationFn;
    switch (animationFn) {
      case 'iterationAnimation':
        this.resetDefaultColor();
        this.highlightCurrentInsertionIndex(
          this.rectangleDivsList,
          animationItem.currentIndex
        );
        this.iterationRectangleAnimation(
          this.rectangleDivsList,
          animationItem.iterationIndex,
          tick,
          this.iterationColor
        ).play();

        break;
      case 'growAnimation':
        this.resetDefaultColor();
        this.highlightCurrentInsertionIndex(
          this.rectangleDivsList,
          animationItem.currentIndex
        );

        this.insertionSortGrowAnimation(
          animationItem,
          this.rectangleDivsList,
          this.maxValue,
          tick
        );
        break;

      case 'settleAnimation':
        this.resetDefaultColor();
        this.highlightCurrentInsertionIndex(
          this.rectangleDivsList,
          animationItem.currentIndex
        );
        this.insertionSortSettleAnimation(
          animationItem,
          this.rectangleDivsList,
          this.maxValue,
          tick
        );
        break;

      default:
        break;
    }
    this.queueIndex++;
  }

  currentDivListHighlightColor = 'purple';
  highlightCurrentInsertionIndex(divsList: HTMLDivElement[], index: number) {
    const currentDiv = divsList[index];
    if (!currentDiv) return;
    this.renderer.setStyle(
      currentDiv,
      'background',
      this.currentDivListHighlightColor
    );
  }

  ngAfterViewInit(): void {
    // this.rectangleDivsList = this.createRectangles(this.sortingSequence[0]);
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

  async insertionSortGrowAnimation(
    animation: SortingAnimation,
    rectDivs: HTMLDivElement[],
    maxValue: number,
    tick: number
  ) {
    if (animation.sortType !== 'insertion-sort') return;
    // const index1 = animation.currentIndex;
    const index2 = animation.iterationIndex + 1;
    // const nextHeight1 = animation.listStatus[index1];
    const nextHeight2 = animation.listStatus[index2];
    // console.log({ index1, index2, nextHeight1, nextHeight2 });
    await Promise.all([
      // animateRectangle(
      // rectDivs[index1],
      // nextHeight1,
      // maxValue,
      // this.containerHeight,
      // this.swapColor,
      // tick
      // ),
      animateRectangle(
        rectDivs[index2],
        nextHeight2,
        maxValue,
        this.containerHeight,
        this.swapColor,
        tick
      ),
    ]);
    // this.commitNormalizedHeightToRect(rectDivs[index1], nextHeight1);
    // this.updateRectangleTextValue(rectDivs[index1], nextHeight1);
    this.commitNormalizedHeightToRect(rectDivs[index2], nextHeight2);
    this.updateRectangleTextValue(rectDivs[index2], nextHeight2);
  }

  async insertionSortSettleAnimation(
    animation: SortingAnimation,
    rectDivs: HTMLDivElement[],
    maxValue: number,
    tick: number
  ) {
    if (animation.sortType !== 'insertion-sort') return;
    await animateRectangle(
      rectDivs[animation.iterationIndex],
      animation.listStatus[animation.iterationIndex],
      maxValue,
      this.containerHeight,
      'blue',
      tick
    );

    this.commitNormalizedHeightToRect(
      rectDivs[animation.iterationIndex],
      animation.listStatus[animation.iterationIndex]
    );
    this.updateRectangleTextValue(
      rectDivs[animation.iterationIndex],
      animation.listStatus[animation.iterationIndex]
    );
  }

  bubbleSortSwapRectanglesAnimation(element: number[]) {
    if (!element) {
      return;
    }
    for (let j = 0; j < element.length; j++) {
      const rectDiv = this.rectangleDivsList[j];
      const value = element[j];
      this.bubbleSortSwapRectangleAnimation(rectDiv, value);
      this.updateRectangleTextValue(rectDiv, value);
    }
  }

  async bubbleSortSwapRectangleAnimation(
    rectDiv: HTMLDivElement,
    value: number
  ) {
    if (!this.maxValue) return;
    const hasSameHeight = hasSameValue(rectDiv, value);
    if (hasSameHeight) return;
    await animateRectangle(
      rectDiv,
      value,
      this.maxValue,
      this.containerHeight,
      this.swapColor,
      this.animationSpeed
    );
    this.commitNormalizedHeightToRect(rectDiv, value);
  }

  iterationRectangleAnimation(
    divs: HTMLDivElement[],
    index: number,
    tick: number,
    iterationColor: string
  ) {
    return iterationAnimation(divs, index, tick, iterationColor);
  }

  //this function is for the bubblesort
  async animateRectangle(rectDiv: HTMLDivElement, value: number) {
    if (!this.maxValue) return;
    await animateRectangle(
      rectDiv,
      value,
      this.maxValue,
      this.containerHeight,
      this.swapColor,
      this.animationSpeed
    );

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
}
