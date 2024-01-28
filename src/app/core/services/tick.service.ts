import { Injectable } from '@angular/core';
import { interval, map, Subject, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TickService {
  #tick$$ = new Subject<number>();
  playing = false;
  intervalSub: Subscription | null = null;
  constructor() {}
  play(timeMs: number) {
    if (this.playing) return;
    this.playing = true;

    this.intervalSub = interval(timeMs).pipe(map(()=>500/* TODO: set the value of tick */)).subscribe((t) => this.#tick$$.next(t));
  }
  pause() {
    if (!this.playing) return;
    this.intervalSub?.unsubscribe();
    this.intervalSub = null;
    this.playing = false;
  }

  tick$ = this.#tick$$.asObservable();
}
