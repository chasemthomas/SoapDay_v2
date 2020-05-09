/*

This file contains urls for scraping calls. 
They are used in index.js

*/

const proxyurl = "https://cors-anywhere.herokuapp.com/";

export const baseUrl =
  proxyurl +
  "https://community.workday.com/sites/default/files/file-hosting/productionapi/";

export const wsUrl = baseUrl + "index.html";

export const vrsUrl = baseUrl + "/versions/index.html";

export const firstOpUrl =
  baseUrl + "Absence_Management/v34.1/Absence_Management.html";
