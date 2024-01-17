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
  currentStepIndex = 0;
  constructor() {
    this.sortingService.status$.subscribe((currentStatus) => {
      if (currentStatus == 'play') {
        // this.animate()
        this.animate2();
      }
      if (currentStatus == 'reset') {
        this.currentIndex = 0;
        this.executing = false;
        console.log('reset')
      }
      this.status = currentStatus;
    });
  }

  rectangleDivsList: HTMLDivElement[] = [];
  ngAfterViewInit(): void {
    this.rectangleDivsList = this.createRectangles(this.sortingSequence[0]);
  }
  @Input({ required: true })
  set sortingSequence(sequence: number[][]) {
    this._sortingSequence = sequence;
    this.maxValue = Math.max(...this._sortingSequence[0]);
  }
  get sortingSequence() {
    return this._sortingSequence;
  }
  @Input()
  containerHeight: number = 500;

  @Input() defaultRectangleColor = 'white';
  @Input() swapColor = 'magenta';
  @Input() animationSpeed = 600;

  @ViewChild('container', { static: true })
  container!: ElementRef<HTMLDivElement>;
  maxValue: number | null = null;

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
    const rectangleHeight = this.calculateNormailizedHeight(
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

  //TODO How can i rewind the logic???
  executing = false; //todo remove and put the centralized playing
  async animate() {
    if (this.executing) return;
    this.executing = true;
    for (const element of this.sortingSequence) {
      this.resetDefaultColor();
      // this.currentStepIndex=i;
      for (let j = 0; j < element.length; j++) {
        const rectDiv = this.rectangleDivsList[j];
        const value = element[j];
        this.animateRectangle(rectDiv, value);
        this.updateRectangleTextValue(rectDiv, value);
      }
      await sleep(this.animationSpeed);
    }
    this.executing = false;
    this.resetDefaultColor();
  }

  currentIndex = 0;
  async animate2() {
    if (this.status === 'pause') {
      return;
    }

    this.resetDefaultColor();
    if (this.currentIndex == this.sortingSequence.length) {
      this.executing = false;
      return;
    }
    this.currentIndex++;
    const nextValues = this.sortingSequence.at(this.currentIndex)!;
    this.animateRectangles(nextValues);
    await sleep(this.animationSpeed);

    this.animate2();
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

  createRectangleAnimation(rect: HTMLDivElement, nextHeight: number) {
    const currentHeight = rect.style.height;

    if (!this.maxValue) {
      return;
    }

    const normalizedHeigth = this.calculateNormailizedHeight(
      this.containerHeight,
      this.maxValue,
      nextHeight
    );

    if (this.hasSameValue(rect, nextHeight)) {
      return null;
    }

    const keyFrames = new KeyframeEffect(
      rect,
      [
        { height: currentHeight, offset: 0, background: this.swapColor },
        {
          height: `${normalizedHeigth}px`,
          offset: 1,
          background: this.swapColor,
        },
      ],
      { duration: this.animationSpeed - 100, iterations: 1, easing: 'ease-out' }
    );
    return new Animation(keyFrames, document.timeline);
  }

  async animateRectangle(rectDiv: HTMLDivElement, value: number) {
    if (!this.maxValue) return;

    const animation = this.createRectangleAnimation(rectDiv, value);
    if (!(animation && this.maxValue)) {
      return;
    }

    animation.play();
    await animation.finished;
    animation.cancel();
    this.commitNormalizedHeightToRect(rectDiv, value);
  }

  resetDefaultColor() {
    this.rectangleDivsList.forEach((div) => {
      this.renderer.setStyle(div, 'background', this.defaultRectangleColor);
    });
  }

  calculateNormailizedHeight(
    containerHeight: number,
    maxValue: number,
    value: number
  ) {
    return (value / maxValue) * containerHeight;
  }

  /**
   * @description instead of using animation.commitChanges() I use renderer to apply final styles to the recangle
   */
  commitNormalizedHeightToRect(rectDiv: HTMLDivElement, value: number) {
    if (!this.maxValue) return;
    const normalizedHeigth = this.calculateNormailizedHeight(
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

  setValueAttribute(rect: HTMLDivElement, value: number) {
    this.renderer.setAttribute(rect, 'data-value', String(value));
  }

  private _sortingSequence: number[][] = [];
}
