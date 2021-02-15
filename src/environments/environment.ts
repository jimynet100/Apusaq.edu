// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: 'http://10.4.77.187',
  apiUrl: 'http://localhost:5000/api/',
  //apiUrl: 'http://backdynamo.indratools.com/dynamo_back/api/',
  apiSeguridadUrl: 'http://localhost/SeguridadWs/aut/',
  apiReporteUrl: 'http://172.28.12.179/jasperserver/rest_v2/reports/reports/AUTOMATIZADOR/',//':5080/jasperserver/rest_v2/reports/reports/AUTOMATIZADOR/',
  usarLogin:true,
  uploadServer:'http://192.168.111.136/dynamo'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
