import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
      const validator = (v:string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
    return validator(control.value) ? null : { email: true };
  };
}
