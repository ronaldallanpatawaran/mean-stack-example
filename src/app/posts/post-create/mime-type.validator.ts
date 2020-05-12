import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof(control.value) === 'string') {
    return of(null);
  }
  const file = control.value as File;
  const frObs = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      const validFileExtensions = [
        'image/png',
        'image/jpeg',
        'image/jpg'
      ]
      const isValid = validFileExtensions.includes(file.type)
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete();
    }
  );
  return frObs;
};
