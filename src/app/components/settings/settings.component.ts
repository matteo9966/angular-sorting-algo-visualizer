import { JsonPipe } from '@angular/common';
import { withJsonpSupport } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SortingService } from 'src/app/core/services/sorting.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  sortingService = inject(SortingService);
  LOWER_BOUND = 1;
  UPPER_BOUND = 100;
  MAX_SIZE = 50;
  formValue = signal<{
    minValue: number;
    size: number;
    maxValue: number;
    generatedSequence: number[];
  }>({
    minValue: this.LOWER_BOUND,
    maxValue: this.UPPER_BOUND,
    size: this.MAX_SIZE,
    generatedSequence: [],
  });
  //TODO STORE THE CONFIG SOMEWHERE => environment.json ?

  generateRandomSequence() {
    if (
      this.formValue().minValue < this.LOWER_BOUND ||
      this.formValue().maxValue > this.UPPER_BOUND ||
      this.formValue().size > this.MAX_SIZE
    ) {
      return;
    }

    this.formValue.update((s) => ({
      ...s,
      generatedSequence: this.sortingService.createSequence(
        this.formValue().size,
        this.formValue().minValue,
        this.formValue().maxValue
      ),
    }));
  }

  createAnimations() {}
}
