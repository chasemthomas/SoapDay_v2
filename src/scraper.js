import "./styles.css";
import { baseUrl } from "./urls.js";
import { wsUrl } from "./urls.js";
import { vrsUrl } from "./urls.js";
import { firstOpUrl } from "./urls.js";

// Scraping Modules
const rp = require("request-promise");
const $ = require("cheerio");

// Pretty XML Format
let format = require("xml-formatter");

// Ace editor instances
let requestEditor = ace.edit("requestArea");

/* 
when window loads...scrape webservices and versions,
then populate them into their dropdowns
*/
window.onload = scraper(wsUrl, "wsDropdown");
window.onload = scraper(firstOpUrl, "opDropdown");
window.onload = scraper(vrsUrl, "vrsDropdown");

/* 
Update the Operations List when user selects new web service
*/

// Select the drop down HTML
let webServiceDD = document.getElementById("wsDropdown");
let operationDD = document.getElementById("opDropdown");
let versionDD = document.getElementById("opDropdown");

// Clear The operations field of old, poulate with new
// function updateOperations() {
//   operationDD.innerHTML = "";
//   let operation = document.getElementById("wsDropdown").value;
//   let version = document.getElementById("vrsDropdown").value;
//   let opUrl = baseUrl + operation + "/" + version + "/" + operation + ".html";
//   scraper(opUrl, "opDropdown");
// }

// when the web service dropdown changes, update operations list
webServiceDD.addEventListener("change", () => {
  operationDD.innerHTML = "";
  let webService = document.getElementById("wsDropdown").value;
  let version = document.getElementById("vrsDropdown").value;
  let opUrl = baseUrl + webService + "/" + version + "/" + webService + ".html";
  scraper(opUrl, "opDropdown");
});

/*
Get the XML template when user clicks button
*/

// button HTML selector &  XML Area HTML selector
let btn = document.getElementById("getTemplate");
let xmlResponse = document.getElementById("xmlResponse");

// when user clicks button, update xml Area with template
btn.addEventListener("click", () => {
  let webService = document.getElementById("wsDropdown").value;
  let operation = document.getElementById("opDropdown").value;
  let version = document.getElementById("vrsDropdown").value;
  let xmlUrl =
    baseUrl +
    webService +
    "/" +
    version +
    "/samples/" +
    operation +
    "_Request.xml";

  // scrape xml template
  getXmlTemplate(xmlUrl);
});

function getXmlTemplate(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  // If specified, responseType must be empty string or "document"
  // xhr.responseType = "document";

  // Force the response to be parsed as XML
  xhr.overrideMimeType("text/xml");

  xhr.onload = function() {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      let results = xhr.responseText;
      let status = xhr.status;
      let statusText = xhr.statusText;
      let formattedXml = format(xhr.response, { collapseContent: true });

      console.log("Status: " + status + " " + statusText);
      console.log(xhr.response);

      // clear any text in area
      requestEditor.innerText = "";

      // xmlResponse.innerText = results;
      // xhr.responseText;
      // format(, { collapseContent: true });
      requestEditor.getSession().setValue(formattedXml);
    }
  };

  xhr.send();
}

/* 
Take in the URL to scrape and the dropdown selector to update,
then scrape the list and populate the dropdowns.
*/
function scraper(url, selector) {
  // Initiate Request-Promise / Get the page
  rp(url)
    .then(function(html) {
      // Grab all web service or operations
      const text = $(".typetable a.link", html);
      // Initialize the web service list
      const textList = [];
      // loop through each child in list and add to textList
      for (let i = 0; i < text.length; i++) {
        textList.push($(".typetable a.link", html)[i].children[0].data);
      }
      for (let i = 0; i < textList.length; i++) {
        let option = new Option(textList[i]);
        document.getElementById(selector).add(option);
      }
      // console.log("Scraper successfully ran for " + selector);
    })
    .catch(function(err) {
      console.log("There was a problem with the scraping the " + selector);
    });
}
