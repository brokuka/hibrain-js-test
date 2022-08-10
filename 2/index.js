var formElement = document.forms["formElement"];
var events = ["focusin", "focusout"];

events.forEach((event) => formElement.addEventListener(event, eventHandler));

function eventHandler(e) {
  var activeElement = e.target.classList.contains("focused");

  if (activeElement) return e.target.classList.remove("focused");

  return e.target.classList.add("focused");
}
