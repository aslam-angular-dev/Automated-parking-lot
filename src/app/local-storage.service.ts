import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Subject, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  // key that is used to access the data in local storage
  STORAGE_KEY = 'parking_slots';
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }
  public storeOnLocalStorage(parkingSlots: Array<Object>): void {
    this.storage.set(this.STORAGE_KEY, parkingSlots);
    console.log(this.storage.get(this.STORAGE_KEY) || 'LocaL storage is empty');
  }
  public getDataFromLocalStorage() {
    return this.storage.get(this.STORAGE_KEY) || null;
  }

  userData: BehaviorSubject<string> = new BehaviorSubject(null);
}
