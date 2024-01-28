import {
  ChangeDetectionStrategy,
  Component,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { SortingComponent } from '../sorting/sorting.component';
import { SortComponent } from '../sortAnimation/sort.component';
import { SortAnimation } from 'src/app/components/sortAnimation/SortAnimation.component';
import { AnimationQueue } from '@matteo-l-tommasi/sorting-algorithms';
import { SortingService } from 'src/app/core/services/sorting.service';
import { iterationAnimation } from 'src/app/utils/animations/iterationAnimation';
import { animateRectangle } from 'src/app/utils/animations/swapAnimation';
import { hasSameValue } from 'src/app/utils/hasSameValue';

@Component({
  selector: 'app-bubble-sorting',
  standalone: true,
  imports: [],
  templateUrl: './bubble-sorting.component.html',
  styleUrl: './bubble-sorting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleSortingComponent extends SortAnimation {
  constructor(
    private _renderer2: Renderer2,
    private _sorting: SortingService,
    private _viewContainer: ViewContainerRef
  ) {
    super(_renderer2, _sorting, _viewContainer);
  }

  override animate(
    tick: number,
    animationQueue: AnimationQueue,
    renderer: Renderer2
  ) {
    const animationItem = animationQueue[this.queueIndex];
    if (!animationItem) {
      this.executing = false;
      this.queueIndex = 0;
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
        this.bubbleSortSwapRectanglesAnimation(
          animationItem.listStatus,
          tick,
          renderer
        );
        break;

      default:
        break;
    }
    this.queueIndex++;
  }

  iterationRectangleAnimation(
    divs: HTMLDivElement[],
    index: number,
    tick: number,
    iterationColor: string
  ) {
    return iterationAnimation(divs, index, tick, iterationColor);
  }

  bubbleSortSwapRectanglesAnimation(
    element: number[],
    tick: number,
    renderer: Renderer2
  ) {
    if (!element) {
      return;
    }
    for (let j = 0; j < element.length; j++) {
      const rectDiv = this.rectangleDivsList[j];
      const value = element[j];
      this.bubbleSortSwapRectangleAnimation(rectDiv, value, tick);
      this.updateRectangleTextValue(rectDiv, value, renderer);
    }
  }

  async bubbleSortSwapRectangleAnimation(
    rectDiv: HTMLDivElement,
    value: number,
    tick: number
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
      tick
    );
    this.commitNormalizedHeightToRect(rectDiv, value);
  }
}
