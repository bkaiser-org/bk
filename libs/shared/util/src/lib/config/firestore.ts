import { Inject, InjectionToken } from "@angular/core";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { UploadTask, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { ENV } from "./app-tokens";

export const FIRESTORE_EMULATOR_PORT = 8080;

export const FIRESTORE = new InjectionToken('Firebase firestore', {
  providedIn: 'root',
  factory: () => {
    const firestore = getFirestore();
    const _env = Inject(ENV);
    if (_env.useEmulators) {
      connectFirestoreEmulator(firestore, 'localhost', FIRESTORE_EMULATOR_PORT);
    } 
    return firestore;
  }
});


export function uploadToFirebaseStorage(_path: string, file: File): UploadTask {
  return uploadBytesResumable(ref(getStorage(), _path), file);
}