// Checks the zipcode input box for a valid zipcode (client-side validation)
$(document).ready(function () {

function validateForm() {
    var userInput = document.forms["zipcode"].value;
    // If userInput is empty or not a number, alert user 
    if (userInput === null || userInput === "" || userInput.isNaN() === true ) {
        alert("Please fill in a valid zipcode");
        return false;
    }
}

});