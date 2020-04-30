import "./normalize.css";
import "./styles.css";

var requestEditor = ace.edit("requestArea");
requestEditor.setTheme("ace/theme/textmate");
requestEditor.getSession().setMode("ace/mode/xml");

var responseEditor = ace.edit("responseArea");
responseEditor.setTheme("ace/theme/textmate");
responseEditor.getSession().setMode("ace/mode/xml");

// request button click handler
let reqBtn = document.getElementById("requestBtn");
reqBtn.addEventListener("click", showRequest, false);
// response button click handler
let respBtn = document.getElementById("responseBtn");
respBtn.addEventListener("click", showResponse, false);

// Hides all tab content
function hideAll() {
  // Declare all variables
  var i, tabcontent, tablinks, btn;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabContent");
  // btn = document.getElementsByClassName("");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tabcontent[i].style.visibility = "hidden";
  }
  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
}

// Shows content in selected tab
function showSelected(content, button) {
  //  Add an "active" class to the button that opened the tab
  document.getElementById(button).className += " active";
  // Show the current tab
  document.getElementById(content).style.visibility = "visible";
  document.getElementById(content).style.display = "block";
}

function showRequest() {
  hideAll();
  showSelected("requestArea", "requestBtn");
}

function showResponse() {
  hideAll();
  showSelected("responseArea", "responseBtn");
}
