import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PictureService {
  constructor() {}

  public takePicture(): Observable<Photo> {
    // Prepare camera options.
    const options: ImageOptions = {
      quality: 50,
      resultType: CameraResultType.Base64,
      // You could also user Photos (to select from the gallery)
      // or Prompt to let the user decide. Your choice.
      source: CameraSource.Camera,
    };
    // Start taking a picture.
    // The promise will be resolved when the user has snapped and validated the picture.
    // It may be rejected if the user does not take a picture.
    const pictureDataPromise = Camera.getPhoto(options);

    // Convert the promise to an observable and return it.
    return from(pictureDataPromise);
  }

}
