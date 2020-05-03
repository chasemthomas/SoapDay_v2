import "./styles.css";
import { showRequest } from "./index.js";
import { showResponse } from "./index.js";

// HTML Selectors
const suv = document.getElementById("suv").value;
const password = document.getElementById("password").value;
const username = document.getElementById("username").value;
// const username = "superuser";
const requestArea = document.getElementById("requestArea");
const responseArea = document.getElementById("responseArea");
// const resetButton = document.getElementById("reset");
const submitButton = document.getElementById("submit");

// Soap variables
const proxyurl = "https://cors-anywhere.herokuapp.com/";

// const url = "https://www.dataaccess.com/webservicesserver/numberconversion.wso";
// const xml =
//   '<?xml version="1.0" encoding="UTF-8"?><soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:web="http://www.dataaccess.com/webservicesserver/"><soap:Header/><soap:Body><web:NumberToWords><web:ubiNum>100</web:ubiNum></web:NumberToWords></soap:Body></soap:Envelope>';

let url =
  "https://i-" +
  suv +
  ".workdaysuv.com/ccx/service/super/Resource_Management/v33.0";

let body =
  '<bsvc:Get_Purchase_Items_Request bsvc:version="v33.0"><bsvc:Request_References><bsvc:Purchase_Item_Reference bsvc:Descriptor=""><bsvc:ID bsvc:type="wid">c5484e4ea52610e2d5127574b8f149b4</bsvc:ID></bsvc:Purchase_Item_Reference></bsvc:Request_References></bsvc:Get_Purchase_Items_Request>';

// requestArea.innerText = body;

let envelope =
  '<soapenv:Envelope xmlns:bsvc="urn:com.workday/bsvc" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
  '<soapenv:Header><wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"' +
  ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
  '<wsse:UsernameToken wsu:Id="UsernameToken-23E1199614B5CDD57F15475147704931"><wsse:Username>' +
  username +
  "@super" +
  '</wsse:Username><wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' +
  password +
  "</wsse:Password></wsse:UsernameToken></wsse:Security><bsvc:Workday_Common_Header></bsvc:Workday_Common_Header></soapenv:Header><soapenv:Body>" +
  body +
  "</soapenv:Body></soapenv:Envelope>";

// requestArea.value.trim()

let format = require("xml-formatter");
let formattedXml = format(envelope);

let responseEditor = ace.edit("responseArea");
responseEditor.setTheme("ace/theme/textmate");
responseEditor.getSession().setValue(formattedXml);

// functions
function soapRequest() {
  let xhr = new XMLHttpRequest();

  // Event listeners for XMLHttpRequest Status
  xhr.addEventListener("progress", updateProgress);
  xhr.addEventListener("error", transferFailed);

  // Start the XMLHttpRequest process
  xhr.open("POST", proxyurl + url);

  // progress on transfers from the server to the client (downloads)
  function updateProgress(oEvent) {
    if (oEvent.lengthComputable) {
      var percentComplete = (oEvent.loaded / oEvent.total) * 100;
      console.log(percentComplete + " percent complete");
    } else {
      // console.log("Unable to compute progress information since the total size is unknown");
    }
  }

  function transferFailed(evt) {
    console.log("An error occurred while transferring the file.");
  }

  xhr.onload = function() {
    let results = xhr.responseText;
    let status = xhr.status;
    let statusText = xhr.statusText;
    console.log("Status: " + status + " " + statusText);
    // responseArea.innerText = results;
    responseEditor.setValue(results);
    showResponse();
  };

  xhr.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
  xhr.setRequestHeader("SOAPAction", "POST");
  xhr.setRequestHeader("Content-Length", envelope.toString().length);

  xhr.send(envelope);
}

function tests() {
  console.log("SUV: " + suv);
  console.log("Password: " + password);
  console.log("URL: " + url);
  console.log("Combined URL:\n" + proxyurl + url);
  console.log("Body\n" + body);
  console.log("Envelope:\n" + envelope);
}

// reset button action
// resetButton.onclick = function() {
//   requestArea.innerText = "";
//   responseArea.innerText = "";
// };

// submit button Action
document.getElementById("submit").onclick = function() {
  soapRequest();
  tests();
};
