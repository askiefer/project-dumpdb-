// Checks the zipcode input box for a valid zipcode (client-side validation)
$(document).ready(function () {

	function validateForm(input) {
	// If userInput is empty or not a number, alert user 
		if (userInput === null || userInput === "" || userInput.isNaN() === true ) {
			alert("Please fill in valid digits");
			return false;
		}
	}

});