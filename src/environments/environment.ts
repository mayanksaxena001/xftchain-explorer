// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let baseUrl = 'https://api.xftchain.club/'; 
let infuraURL = 'https://mainnet.infura.io/v3/bd04aa365dfb4509a573a8ccdd6b3b50';
export const environment = {
  production: false,
  baseUrl, infuraURL
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
