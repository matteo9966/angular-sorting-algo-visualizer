export async function completedAnimation(
  rects: HTMLDivElement[],
  completedColor: string = 'green',
  tick: number
) {
  const duration: number = (tick * 3) / rects.length;
  for (let rect of rects) {
    const currentBackground = rect.style.background;
    const keyFrames = new KeyframeEffect(
      rect,
      [{ background: currentBackground }, { background: completedColor }],
      { duration, iterations: 1, easing: 'ease-out' }
    );
    const animation = new Animation(keyFrames, document.timeline);
    animation.play();
    await animation.finished;
  }
}
