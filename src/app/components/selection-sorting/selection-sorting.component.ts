import {
  ChangeDetectionStrategy,
  Component,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { SortAnimation } from '../sortAnimation/SortAnimation.component';
import { AnimationQueue } from '@matteo-l-tommasi/sorting-algorithms';
import { SortingService } from 'src/app/core/services/sorting.service';
import { SelectionSortAnimation } from '@matteo-l-tommasi/sorting-algorithms/lib/es5/algorithms/selection-sort';
import { iterationAnimation } from 'src/app/utils/animations/iterationAnimation';
import { animateRectangle } from 'src/app/utils/animations/swapAnimation';
import { hasSameValue } from 'src/app/utils/hasSameValue';

@Component({
  selector: 'app-selection-sorting',
  standalone: true,
  imports: [],
  templateUrl: './selection-sorting.component.html',
  styleUrl: './selection-sorting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionSortingComponent extends SortAnimation {
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
    _renderer: Renderer2
  ): void {
    if (!this.maxValue) return;
    const animationItem = animationQueue[this.queueIndex];
    if (this.queueIndex === animationQueue.length) {
      this.resetDefaultColor();
    }
    if (!animationItem) {
      this.executing = false;
      this.queueIndex = 0;
      this.sortingService.pause();
      return;
    }
    this.executing = true;
    if (animationItem.sortType !== 'selection-sort') {
      return;
    }
    const animationFn = animationItem.animationFn;
    switch (animationFn) {
      case 'iterationAnimation':
        this.resetDefaultColor();
        this.highlightCurrentSortIndex(animationItem);
        this.highilghtIterationIndex(animationItem, tick);
        this.highightMinIndex(animationItem);
        this.highightMinIndex(animationItem);
        break;
      case 'swapAnimation':
        this.resetDefaultColor();
        this.swapAnimation(animationItem, tick);
        break;
    }
    this.queueIndex++;
  }

  sortIndexColor = 'red';

  highlightCurrentSortIndex(animationItem: SelectionSortAnimation) {
    const sortDiv = this.rectangleDivsList[animationItem.sortedIndex];
    if (!sortDiv) return;
    this.renderer.setStyle(sortDiv, 'background', this.sortIndexColor);
  }
  highilghtIterationIndex(animationItem: SelectionSortAnimation, tick: number) {
    iterationAnimation(
      this.rectangleDivsList,
      animationItem.currentIndex,
      tick,
      this.iterationColor
    ).play();
  }

  minindexColor = 'magenta';
  highightMinIndex(animationItem: SelectionSortAnimation) {
    this.renderer.setStyle(
      this.rectangleDivsList[animationItem.minIndex],
      'background',
      this.minindexColor
    );
  }

  async swapAnimation(animationItem: SelectionSortAnimation, tick: number) {
    for (let i = 0; i < animationItem.listStatus.length; i++) {
      const rect = this.rectangleDivsList[i];
      const newValue = animationItem.listStatus[i];
      const haseSameHeight = hasSameValue(rect, newValue);
      if (haseSameHeight) continue;
      (async () => {
        await animateRectangle(
          rect,
          newValue,
          this.maxValue,
          this.containerHeight,
          this.swapColor,
          tick
        );
        this.commitNormalizedHeightToRect(rect, newValue);
        this.updateRectangleTextValue(rect, newValue, this.renderer);
      })();
    }
  }
}
