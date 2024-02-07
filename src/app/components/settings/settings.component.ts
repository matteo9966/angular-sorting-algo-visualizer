import { JsonPipe } from '@angular/common';
import { withJsonpSupport } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SortingService } from 'src/app/core/services/sorting.service';
import { SequenceValidatorDirective } from 'src/app/core/validators/SequenceValidator';

type FormSettings = {
  minimum: number;
  size: number;
  maximum: number;
  sequence: string;
};
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, JsonPipe, SequenceValidatorDirective],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements AfterViewInit {
  @ViewChild('form') form: NgForm | undefined;

  ngAfterViewInit(): void {
    this.form?.form.valueChanges?.subscribe((value: FormSettings) => {
      this.formValue.set(value);
    });
  }
  sortingService = inject(SortingService);
  LOWER_BOUND = 1;
  UPPER_BOUND = 100;
  MAX_SIZE = 50;
  SEPARATORS = /,/gi;
  formValue = signal<{
    minimum: number;
    size: number;
    maximum: number;
    sequence: string;
  }>({
    minimum: this.LOWER_BOUND,
    maximum: this.UPPER_BOUND,
    size: this.MAX_SIZE,
    sequence: '',
  });

  generateRandomSequence(event: Event) {
    event.preventDefault();
    if (
      this.formValue().minimum < this.LOWER_BOUND ||
      this.formValue().maximum > this.UPPER_BOUND ||
      this.formValue().size > this.MAX_SIZE
    ) {
      return;
    }

    this.formValue.update((s) => ({
      ...s,
      sequence: this.sortingService
        .createSequence(
          this.formValue().size,
          this.formValue().minimum,
          this.formValue().maximum
        )
        .join(','),
    }));
  }

  createAnimations() {
    console.log(this.formValue());
  }
}
