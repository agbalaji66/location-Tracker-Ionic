// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  
  production: false,
  firebase :{
  apiKey: "AIzaSyBwNcloO_q0NqLnsq_85rFa3KAhnJzwbv0",
    authDomain: "locationtrackerpro-4d5e5.firebaseapp.com",
    databaseURL: "https://locationtrackerpro-4d5e5.firebaseio.com",
    projectId: "locationtrackerpro-4d5e5",
    storageBucket: "locationtrackerpro-4d5e5.appspot.com",
    messagingSenderId: "291598802989",
    appId: "1:291598802989:web:02767cb7bcb345df2998a4"
  }
  
  
};
export const snapshotToArray = snapshot => {
  let returnArray=[];
  snapshot.forEach(element=>{
      let item= element.val();
      item.key=element.key;
      returnArray.push(item);
  }
      );

  return returnArray;
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
