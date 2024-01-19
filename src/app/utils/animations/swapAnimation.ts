import { calculateNormailizedHeight } from "../calculateNormalizedHeight";
import { hasSameValue } from "../hasSameValue";




export function createRectangleAnimation(
  rect: HTMLDivElement,
  nextHeight: number,
  maxValue: number,
  containerHeight: number,
  swapColor: string,
  tick: number
) {
  const currentHeight = rect.style.height;
  const currentBackground = rect.style.background;

  if (!maxValue) {
    return;
  }

  const normalizedHeigth = calculateNormailizedHeight(
    containerHeight,
    maxValue,
    nextHeight
  );

  if (hasSameValue(rect, nextHeight)) {
    return null;
  }

  const keyFrames = new KeyframeEffect(
    rect,
    [
      { background: currentBackground },
      { background: swapColor, offset: 0.3 },
      { height: currentHeight, background: swapColor },
      {
        height: `${normalizedHeigth}px`,
        offset: 1,
        background: swapColor,
      },
    ],
    {
      duration: tick - tick * 0.1,
      iterations: 1,
      easing: 'ease-out',
    }
  );
  return new Animation(keyFrames, document.timeline);
}

export async function animateRectangle(
  rectDiv: HTMLDivElement,
  value: number,
  maxValue: number,
  containerHeight: number,
  swapColor: string,
  tick: number
) {
  if (!maxValue) return;
  const animation = createRectangleAnimation(
    rectDiv,
    value,
    maxValue,
    containerHeight,
    swapColor,
    tick
  );

  if (!animation) {
    return;
  }
  animation.play();
  await animation.finished;
  animation.cancel();

 
}



