import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', {static: true}) input: ElementRef;
  @Input() type = 'text';
  @Input() label: string;

  get canShowTouchedErrorMessage(): boolean {
    return this.isControlTouched 
      && this.controlDir?.control.invalid;
  }

  get canShowDirtyErrorMessage(): boolean {
    return this.isControlDirty
      && this.controlDir?.control.invalid;
  }

  get inputValidationClass(): string | null {
    if (!this.isControlTouched) return null;

    return this.isControlValid
      ? 'is-valid'
      : 'is-invalid';
  }

  get isControlStatusPending(): boolean {
    return this.controlDir?.control?.status === 'PENDING';
  }

  get isControlTouched(): boolean {
    return this.controlDir?.control?.touched;
  }

  get isControlDirty(): boolean {
    return this.controlDir?.control?.dirty;
  }

  get isControlValid(): boolean {
    return this.controlDir?.control?.valid;
  }

  get isRequiredError(): boolean {
    return this.controlDir?.control?.errors?.required;
  }

  get isPatternError(): boolean {
    return this.controlDir?.control?.errors?.pattern;
  }

  get isEmailExistsError(): boolean {
    return this.controlDir?.control?.errors?.emailExists;
  }

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
   }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator 
      ? [control.validator]
      : [];
    control.setValidators(validators);

    const asyncValidators = control.asyncValidator
      ? [control.asyncValidator]
      : [];
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
  }

  onChange(event: any) { }

  onTouched() { }
  
  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
