import { Component, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//import { Geolocation} from '@capacitor/core';
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;
 
declare var google;
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  // Firebase Data
  locations: Observable<any>;
  locationsCollection: AngularFirestoreCollection<any>;
 
  // Map related
  @ViewChild('map',{static:false}) mapElement: ElementRef;
  map: any;
  markers = [];
  latitude: number;
longitude: number;
ref = firebase.database().ref('items/');
 
  // Misc
  isTracking = false;
  watch: string;
  user = null;
  getlocation:any;
  myDate: string;
  result: string;
  item: string;
  speed: number;
 
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.anonLogin();
    this.getLocation();
  }
 
  ionViewWillEnter() {
    this.loadMap();
  }
  
  async getLocation() {
    setInterval(async ()=> {
    const position = await Geolocation.getCurrentPosition();
    
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.speed=position.coords.speed;
    this.myDate= new Date().toString();
    },1000);
    setInterval(()=> 
   {
     if(this.latitude!==undefined && this.longitude!==undefined)
     {
    this.item=this.result;
    this.result="Latitude: " +this.latitude+ " Longitude:" +this.longitude+ " Time: "+this.myDate;
    let newItem = this.ref.push();
    newItem.set(this.result);
     }},60000);
     setInterval(()=> {
      var timeleft = 60;
  var downloadTimer = setInterval(function(){
  document.getElementById("countdown").innerHTML = timeleft + " Time remaining";
  timeleft -= 1;
  if(timeleft <= 0){
    clearInterval(downloadTimer);
    document.getElementById("countdown").innerHTML = "Data added"
  }
  }, 1000);
  },60000);

  }
  // Perform an anonymous login and load data
  anonLogin() {
    this.afAuth.auth.signInAnonymously().then(res => {
      this.user = res.user;
 
      this.locationsCollection = this.afs.collection(
        `locations/${this.user.uid}/track`,
        ref => ref.orderBy('timestamp')
      );
 
      // Make sure we also get the Firebase item ID!
      this.locations = this.locationsCollection.snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
 
      // Update Map marker on every change
      setInterval(async ()=> {
      this.locations.subscribe(locations => {
        this.updateMap(locations);
      });},60000);
    });
  }
 
  // Initialize a blank map
  loadMap() {
    let latLng = new google.maps.LatLng(9.9135169, 78.124059);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
  // Use Capacitor to track our geolocation
startTracking() {
  setInterval(()=>{
  this.isTracking = true;
  this.watch = Geolocation.watchPosition({}, (position, err) => {
    console.log('new position:',position);
    if (position) {
      this.addNewLocation(
        position.coords.latitude,
        position.coords.longitude,
        position.timestamp
      );
    }
  });},60000);
  
}
 
// Unsubscribe from the geolocation watch using the initial ID
stopTracking() {
  Geolocation.clearWatch({ id: this.watch }).then(() => {
    this.isTracking = false;
  });
}
 
// Save a new location to Firebase and center the map
addNewLocation(lat, lng, timestamp) {
  setInterval(()=> 
    {
  this.locationsCollection.add({
    lat,
    lng,
    timestamp
  });
 
  let position = new google.maps.LatLng(lat, lng);
  this.map.setCenter(position);
  this.map.setZoom(15);},60000); 
}
 
// Delete a location from Firebase
deleteLocation(pos) {
  this.locationsCollection.doc(pos.id).delete();
}
 
// Redraw all markers on the map
updateMap(locations) {
  // Remove all current marker
  setInterval(()=>{
  this.markers.map(marker => marker.setMap(null));
  this.markers = [];
 
  for (let loc of locations) {
    let latLng = new google.maps.LatLng(loc.lat, loc.lng);
 
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });
    this.markers.push(marker);
  } },60000);
}
}