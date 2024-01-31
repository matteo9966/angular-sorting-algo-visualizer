import {
  ChangeDetectionStrategy,
  Component,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { SortAnimation } from '../sortAnimation/SortAnimation.component';
import {
  AnimationQueue,
  SortingAnimation,
} from '@matteo-l-tommasi/sorting-algorithms';
import { SortingService } from 'src/app/core/services/sorting.service';
import { iterationAnimation } from 'src/app/utils/animations/iterationAnimation';
import { animateRectangle } from 'src/app/utils/animations/swapAnimation';

@Component({
  selector: 'app-insertion-sorting',
  standalone: true,
  imports: [],
  templateUrl: './insertion-sorting.component.html',
  styleUrl: './insertion-sorting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsertionSortingComponent extends SortAnimation {
  constructor(
    renderer: Renderer2,
    sortingService: SortingService,
    viewContainer: ViewContainerRef
  ) {
    super(renderer, sortingService, viewContainer);
  }

  override animate(
    tick: number,
    animationQueue: AnimationQueue,
    renderer: Renderer2
  ) {
    if (!this.maxValue) return;
    const animationItem = animationQueue[this.queueIndex];
    if (!animationItem) {
      this.executing = false;
      this.queueIndex = 0;
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
          animationItem.currentIndex,
          renderer
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
          animationItem.currentIndex,
          renderer
        );

        this.insertionSortGrowAnimation(
          animationItem,
          this.rectangleDivsList,
          this.maxValue,
          tick,
          renderer
        );
        break;

      case 'settleAnimation':
        this.resetDefaultColor();
        this.highlightCurrentInsertionIndex(
          this.rectangleDivsList,
          animationItem.currentIndex,
          renderer
        );
        this.insertionSortSettleAnimation(
          animationItem,
          this.rectangleDivsList,
          this.maxValue,
          tick,
          renderer
        );
        break;

      default:
        break;
    }
    this.queueIndex++;
  }
  currentDivListHighlightColor = 'purple';
  highlightCurrentInsertionIndex(
    divsList: HTMLDivElement[],
    index: number,
    renderer: Renderer2
  ) {
    const currentDiv = divsList[index];
    if (!currentDiv) return;
    renderer.setStyle(
      currentDiv,
      'background',
      this.currentDivListHighlightColor
    );
  }

  iterationRectangleAnimation(
    divs: HTMLDivElement[],
    index: number,
    tick: number,
    iterationColor: string
  ) {
    return iterationAnimation(divs, index, tick, iterationColor);
  }

  async insertionSortGrowAnimation(
    animation: SortingAnimation,
    rectDivs: HTMLDivElement[],
    maxValue: number,
    tick: number,
    renderer: Renderer2
  ) {
    if (animation.sortType !== 'insertion-sort') return;
    const index2 = animation.iterationIndex + 1;
    const nextHeight2 = animation.listStatus[index2];
    await animateRectangle(
      rectDivs[index2],
      nextHeight2,
      maxValue,
      this.containerHeight,
      this.swapColor,
      tick
    ),
      this.commitNormalizedHeightToRect(rectDivs[index2], nextHeight2);
    this.updateRectangleTextValue(rectDivs[index2], nextHeight2, renderer);
  }

  async insertionSortSettleAnimation(
    animation: SortingAnimation,
    rectDivs: HTMLDivElement[],
    maxValue: number,
    tick: number,
    renderer: Renderer2
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
      animation.listStatus[animation.iterationIndex],
      renderer
    );
  }
}
