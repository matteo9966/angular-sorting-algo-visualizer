export function iterationAnimation(
  divs: HTMLDivElement[],
  index: number,
  tick: number,
  iterationColor: string
) {
  const rectDiv = divs[index];
  const currentBackground = rectDiv.style.background;
  const keyFrames: KeyframeEffect = new KeyframeEffect(
    rectDiv,
    [{ background: currentBackground }, { background: iterationColor }],
    { duration: tick - 0.1 * tick, easing: 'ease-out' }
  );
  return new Animation(keyFrames, document.timeline);
}
