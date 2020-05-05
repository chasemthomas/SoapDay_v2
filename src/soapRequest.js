import "./styles.css";
import { showRequest } from "./index.js";
import { showResponse } from "./index.js";

// Pretty XML Format
let format = require("xml-formatter");

// Ace editor instances
let requestEditor = ace.edit("requestArea");
let responseEditor = ace.edit("responseArea");

// HTML Selectors
const suv = document.getElementById("suv").value;
const password = document.getElementById("password").value;
const username = document.getElementById("username").value;
const webService = document.getElementById("wsDropdown").value;
const operation = document.getElementById("opDropdown").value;
// const requestArea = document.getElementById("requestArea").value;
// const responseArea = document.getElementById("responseArea").innerText;
// const resetButton = document.getElementById("reset");
// const submitButton = document.getElementById("submit");

// Soap variables
const proxyurl = "https://cors-anywhere.herokuapp.com/";

let url =
  "https://i-" +
  suv +
  ".workdaysuv.com/ccx/service/super/" +
  webService +
  "/v33.0";

// Input bodyText to request area. For Testing.
let bodyText =
  '<bsvc:Get_Purchase_Items_Request bsvc:version="v33.0"><bsvc:Request_References><bsvc:Purchase_Item_Reference bsvc:Descriptor=""><bsvc:ID bsvc:type="wid">c5484e4ea52610e2d5127574b8f149b4</bsvc:ID></bsvc:Purchase_Item_Reference></bsvc:Request_References></bsvc:Get_Purchase_Items_Request>';
requestEditor
  .getSession()
  .setValue(format(bodyText, { collapseContent: true }));

// This code is needed when user pastes into request area ??
let body = requestEditor.getSession().getValue();
requestEditor.getSession().on("change", function() {
  body = requestEditor.getSession().getValue();
});

// Takes in user-defined values from UI. Returns Xml Envelope to send to server
function envelope(username, password, body) {
  let xml =
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
  return xml;
}

// Send
function soapRequest() {
  // Create XML output envelope
  let xmlOutput = envelope(username, password, body);

  // Start new XML request
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

  // Get response from server and post in response area
  xhr.onload = function() {
    let results = xhr.responseText;
    let status = xhr.status;
    let statusText = xhr.statusText;
    console.log("Status: " + status + " " + statusText);
    // responseArea.innerText = results;
    let formattedXml = format(results, { collapseContent: true });
    responseEditor.getSession().setValue(formattedXml);
    showResponse();
  };

  xhr.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
  xhr.setRequestHeader("SOAPAction", "POST");
  xhr.setRequestHeader("Content-Length", xmlOutput.toString().length);

  // Submit the XML rquest
  xhr.send(xmlOutput);
}

function consoleTests() {
  console.log("\n\nSUV:\n" + suv);
  console.log("\n\nPassword:\n" + password);
  console.log("\n\nURL:\n" + url);
  console.log("\n\nCombined URL:\n" + proxyurl + url);
  console.log("\n\nWeb Service:\n" + webService);
  console.log("\n\nOperation:\n" + operation);
  console.log("\n\nBody\n" + body);
  let xmlOutput = envelope(username, password, body);
  console.log("\n\nEnvelope:\n" + format(xmlOutput, { collapseContent: true }));
}

// submit button Action
document.getElementById("submit").onclick = function() {
  consoleTests();
  soapRequest();
};
