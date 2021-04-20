import { LocalStorageService } from './../local-storage.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { flatten, flattenDeep } from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'app-booking-screen',
  templateUrl: './booking-screen.component.html',
  styleUrls: ['./booking-screen.component.less']
})
export class BookingScreenComponent implements OnInit {
  numberOfCarSlots = 300;
  totalSlots;
  slotData = [];
  openBookingModal: boolean = true;
  bookinghours: string;
  title = 'Automated-parking-lot';
  selectedSlot = {
    slotType: '',
    num: null,
    id: null,
    userName: null,
    mobileNumber: null,
    vechicleNumber: null,
    timeBooked: null,
    booked: false,
    selected: false
  }

  @ViewChild('showPopup') showPopup: ElementRef;
  @ViewChild('showClosePopup') showClosePopup: ElementRef;

  userData: any;
  date: string;
  hours: number;
  ngOnInit() {
    this.getUserInfo();
    this.getAndSetSlotData();
  }
  //Get User info from login
  getUserInfo() {
    this.localStorageService.userData.subscribe((value: string) => {
      if (value) {
        this.userData = value;
        console.log("user" + this.userData);
      }
    },
      (err) => {
        throw err;
      });
  }
  //Get slot data from local storage
  getAndSetSlotData() {
    let localData = this.localStorageService.getDataFromLocalStorage();
    if (localData && localData.length) {
      let data = flattenDeep(localData);
      for (let i = 0; i < data.length; i++) {
        data[i]['selected'] = false;
      }
      this.splitArrays(data);
    }
    else {
      let carData = []
      for (let i = 0; i < this.numberOfCarSlots; i++) {
        carData[i] = {
          slotType: 'car',
          num: i,
          id: `C${i + 1}`,
          userName: null,
          vechicleNumber: null,
          timeBooked: "nill",
          booked: false,
          selected: false
        }
      }
      this.splitArrays(carData)
    }
     //Storing data in local storage
    this.localStorageService.storeOnLocalStorage(this.slotData)
   
  }
  //Arrange the parking formation
  splitArrays(carData) {
    let copyCarData = []
    this.slotData = [];
    while (carData.length) {
      copyCarData.push(carData.splice(0, 10));
    }
    while (copyCarData.length) {
      this.slotData.push(copyCarData.splice(0, 3))
    }
  }
  //Click event for booking
  clickEventHandler(car) {
    let allSlots = flattenDeep(this.slotData)
    const found = allSlots.some(vehicle =>
      vehicle.booked === true && vehicle.vechicleNumber == this.userData.vechicleNumber);
      //Check if user has booked the vechicle beforehand
    if (!found) {
      car.selected = !car.selected;
      this.removeOtherSelections(car);
      if (car.selected && !car.booked) { this.openPopup(car); }
    }
    //Show alert that he/she has booked the slot already
    else if (found && car.vechicleNumber !== this.userData.vechicleNumber) {
      window.alert("You have already booked the slot for your vechicle  " + this.userData.vechicleNumber)
    }
    //Cancelling the same slot when user clicks the same slot he booked,he is allowed to cancel
    else if (car.userName === this.userData.userName && car.vechicleNumber === this.userData.vechicleNumber) {
      this.openCancellationPopup(car)
    }
    //Storing data in local storage
    this.localStorageService.storeOnLocalStorage(this.slotData)
  }
 //For timer in the screen
  constructor(private localStorageService: LocalStorageService) {
    setInterval(() => {
      const currentDate = new Date();
      this.date = currentDate.toLocaleTimeString();
    }, 1000);
  }
  //To remove one selection when other one is clicked
  removeOtherSelections(car) {
    let allSlots = flattenDeep(this.slotData);
    for (let i = 0; i < allSlots.length; i++) {
      if (allSlots[i].id !== car.id) {
        allSlots[i].selected = false
      }
    }
    this.splitArrays(allSlots);
    this.localStorageService.storeOnLocalStorage(this.slotData)
  }
  //To get colours for the slot
  getSlotState(car) {
    if (car) {
      if (car.booked) {
        return 'red';
      }
      else if (car.selected) {
        return 'yellow'
      }
      else return null;
    }
  }

  openPopup(car) {
    this.showPopup.nativeElement.style.display = "block";
    this.selectedSlot = car
  }
  openCancellationPopup(car) {
    this.openPayPopup(car)
  }
  closePopup() {
    var mpopup = document.getElementById('openModalWindow');
    if (mpopup)
      this.showPopup.nativeElement.style.display = "none";
  }
  openPayPopup(car) {
    this.calculateTimeDiff(car)
    this.showClosePopup.nativeElement.style.display = "block";
    this.selectedSlot = car
  }
  //To calculate time diff
  calculateTimeDiff(car) {
    let time = new Date().toLocaleTimeString();
    var startTime = moment(car.timeBooked, "HH:mm:ss a");
    var endTime = moment(time, "HH:mm:ss a");

    // calculate total duration
    var duration = moment.duration(endTime.diff(startTime));

    // duration in hours
    var hours: number;
    hours = (duration.asHours());
    this.hours = hours;
    if (hours < 1) {
      this.bookinghours = 'Less than One hour'
    }
    else {
      let word = `${hours} hours`
    }
  }

  closePayPopup() {
    var mpopup = document.getElementById('openModalWindowPay');
    if (mpopup)
      this.showClosePopup.nativeElement.style.display = "none";
  }
  canelBooking() {
    this.selectedSlot.booked = this.selectedSlot.selected = false;
    var mpopup = document.getElementById('openModalWindowPay');
    if (mpopup)
      this.showClosePopup.nativeElement.style.display = "none";
    this.localStorageService.storeOnLocalStorage(this.slotData)
  }
  //To book and to store in local storage
  book() {
    this.selectedSlot.booked = true;
    this.selectedSlot.userName = this.userData.userName;
    this.selectedSlot.vechicleNumber = this.userData.vechicleNumber;
    this.selectedSlot.mobileNumber = this.userData.mobileNumber;
    let time = new Date().toLocaleTimeString(); // 11:18:48 AM
    this.selectedSlot.timeBooked = time;
    this.localStorageService.storeOnLocalStorage(this.slotData)
    var mpopup = document.getElementById('openModalWindow');
    if (mpopup)
      this.showPopup.nativeElement.style.display = "none";
  }

}
