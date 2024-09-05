import { Inject, InjectionToken } from "@angular/core";
import { ENV } from "./app-tokens";
import { connectStorageEmulator, FirebaseStorage, getStorage, ref, uploadBytesResumable, UploadTask } from "firebase/storage";
import { getApp } from "firebase/app";
import { die } from "../log.util";

export const STORAGE_EMULATOR_PORT = 9199;

export const STORAGE = new InjectionToken('Firebase storage', {
  providedIn: 'root',
  factory: () => {
      return getBkStorage();
  } 
});

export function uploadToFirebaseStorage(path: string, file: File): UploadTask {
  console.log('shared/util/storage.uploadToFirebaseStorage: path: ', path, ' file: ', file);
  const _storage = getBkStorage();
  const _ref = ref(_storage, path);
  console.log('shared/util/storage.uploadToFirebaseStorage: _ref: ', _ref);
  return uploadBytesResumable(_ref, file);
}

// all apps are using the same storage bucket from bkaiser-org.appspot.com
// you need to grant access to the bucket for the app you are using with gsutil tool
// gsutil -m acl ch -r -u service-<project number>@gcp-sa-firebasestorage.iam.gserviceaccount.com gs://bkaiser-org.appspot.com
// see: https://firebase.google.com/docs/storage/web/start?_gl=1*1mibu5l*_up*MQ..*_ga*OTYxNzQxOTMxLjE3MjU1MjMzNTQ.*_ga_CW55HF8NVT*MTcyNTUyMzM1NC4xLjAuMTcyNTUyMzM1NC4wLjAuMA..
export function getBkStorage(): FirebaseStorage {
  try {
    const _firebaseApp = getApp();
    const _storage = getStorage(_firebaseApp, 'gs://bkaiser-org.appspot.com');
    console.log('shared/util/storage.getBkStorage(): ', _storage);
  
    const _env = Inject(ENV);
    if (_env.useEmulators) {
      connectStorageEmulator(_storage, 'localhost', STORAGE_EMULATOR_PORT);
    }
    return _storage;  
  }
  catch(_ex) {
    die('shared/util/storage.getBkStorage(): ERROR: ' + JSON.stringify(_ex));
  }
}