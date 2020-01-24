/***\
|
| Treehouse Full Stack JavaScript TechDegree Program
| Unit 3: A Dynamic Interactive Form
|
\***/
/*jshint esversion: 6 */ 

// First, let's wait for the page to load

window.addEventListener ('DOMContentLoaded', () => {

    // global variables

    const costDiv = document.createElement ("div"); // div element for cost display
    const costP = document.createElement ("p"); // p element for cost display

    const errorBorderStyle = "1px solid red"; // border style for bad text entry boxes
    let messageTarget; // target for error message placement
    
    // start by giving focus to the name entry field

    document.querySelector ("#name").focus();

    // hide the 'other-job' entry section

    document.querySelector ("div.other-title").style.display = "none";

    // hide the color label and select menu until the user selects a t-shirt design

    document.querySelector ("#colors-js-puns").style.display = "none";

    // add the paragraph to the cost total div, and add the div into the DOM

    costDiv.className = "activity-cost";
    costDiv.style.display = "none"; // only display when an activity has been selected
    costDiv.appendChild (costP);
    document.querySelector ("fieldset.activities").appendChild (costDiv);

    // select credit card processing by default, and hide the "select payment method option"

    document.querySelector ("#payment").value = "credit card";
    document.querySelector ("#payment").firstElementChild.style.display = "none";

    // add error messages into the DOM, but don't display them

    function addMessage (messageTarget, className, message, append) {
        
        const messageSpan = document.createElement ("span"); // create a span element
 
        messageSpan.className = className;
        messageSpan.textContent = message;
        messageSpan.style.color = "red";
        messageSpan.style.display = "none";
        if (!append) {
            messageTarget.parentElement.insertBefore (messageSpan, messageTarget);
        } else {
            messageTarget.parentElement.appendChild (messageSpan);
        }
    }

    // add name error message just above the Email label

    messageTarget = document.querySelector ("#mail").previousElementSibling;
    addMessage (messageTarget, "name-blank-message", "Enter your name", false);
    addMessage (messageTarget, "name-bad-message", "Use letters and spaces only", false);

    // add email error message just above the Job Role label

    messageTarget = document.querySelector ("#title").previousElementSibling;
    addMessage (messageTarget, "email-blank-message", "Enter your email address", false);
    addMessage (messageTarget, "email-bad-message", "Must be valid email address", false);

    // ad shirt error message after the design select element

    messageTarget = document.querySelector ("#design");
    addMessage (messageTarget, "shirt-message", "  Select a t-shirt design", true);

    // add activity error message at the top of the activities list

    messageTarget = document.querySelector ("fieldset.activities label");
    addMessage (messageTarget, "activities-message", "Select at least one activity", false);

    // add credit card number error messages below the text entry field

    messageTarget = document.querySelector ("#cc-num");
    addMessage (messageTarget, "cc-num-blank-message", "Enter a credit card number", true);
    addMessage (messageTarget, "cc-num-bad-message", "Must be 13 to 16 digits", true);

    // add zip code error message below the text entry field

    messageTarget = document.querySelector ("#zip");
    addMessage (messageTarget, "zip-bad-message", "Must be 5 digits", true);
    addMessage (messageTarget, "zip-blank-message", "Enter ZIP code", true);

    // add cvv error message below the text entry field

    messageTarget = document.querySelector ("#cvv");
    addMessage (messageTarget, "cvv-bad-message", "Must be 3 digits", true);
    addMessage (messageTarget, "cvv-blank-message", "Enter CVV", true);

    // add the button error message after the button

    messageTarget = document.querySelector ("button");
    addMessage (messageTarget, "button-message", " Please correct all errors", true);
   
    // function to update the t-shirt info section

    function updateTShirtInfo () {
        
        const designSelect = document.querySelector ("#design");
        
        // If there's a theme selected, display and update the color section
        // and display the correct color choices
    
        if (designSelect.value != "Select Theme") {
            const heartColors = ["tomato", "steelblue", "dimgrey"];
            const punColors = ["cornflowerblue", "darkslategrey", "gold"];
            const colorList = designSelect.value === "js puns"?punColors:heartColors; // select the correct color list
            const colors = document.querySelectorAll ("#color option"); // the colors in the color select element
            const colorSelect = document.querySelector ("#color"); // the color select element

            // display the color section

            document.querySelector ("#colors-js-puns").style.display = "";

            // display the appropriate colors

            for (let i = 0; i < colors.length; i++) {
                colors[i].style.display = "none"; // hide by default
                for (let j = 0; j < colorList.length; j++) {
                    if (colors[i].value === colorList[j]) {
                        colors[i].style.display = ""; // display this color
                        colorSelect.value = colors[i].value; // select this color
                        break; // no need to check any others
                    }

                }
            }
        } else { // no theme selected, hide the color section
            document.querySelector ("#colors-js-puns").style.display = "none";
        }
    }

    // function to update the activities section

    function updateActivities () {
        const activities = document.querySelectorAll ("fieldset.activities input"); // list of activities
        let activityCost = 0; // we will calculate the cost of all selected activities and update the display

        // add the cost of the main conference if that is checked

        if (activities[0].checked) {
            activityCost += parseFloat (activities[0].dataset.cost);
        }

        // start with all scheduled activity input elements enabled

        for (let i =1; i < activities.length; i++) {
            activities[i].disabled = false;
            activities[i].parentElement.style.color = "black"; // label is black
        }

        // loop through the scheduled activities. If an activity is selected, loop through the
        // activities a second time, and disable any other activities offered at the
        // same day and time. We don't need to test the first activity as it is the full conference

        for (let i = 1; i < activities.length; i++) {
            if (activities[i].checked) { // this activity is selected
                activityCost += parseFloat (activities[i].dataset.cost);
                for (let j = 1; j < activities.length; j++) {
                    if (j != i && 
                        activities[i].dataset.dayAndTime === activities[j].dataset.dayAndTime) {
                        activities[j].disabled = true; // disable this checkbox
                        activities[j].parentElement.style.color = "dimgrey"; // label is grey
                    }

                }
            }
        }
        // update the activity cost

        if (activityCost) {
            document.querySelector ("div.activity-cost").style.display = ""; // display the cost div
            document.querySelector ("div.activity-cost p").textContent = "Cost: $" + activityCost;
        } else { // hide the cost display
            document.querySelector ("div.activity-cost").style.display = "none";
        }
    }

    // function to update the payment info section

    function updatePaymentInfo () {

        switch (document.querySelector("#payment").value) {

            case "credit card":
                document.querySelector ("#credit-card").style.display = "";
                document.querySelector ("#paypal").style.display = "none";
                document.querySelector ("#bitcoin").style.display = "none";
                break;

            case "paypal":
                document.querySelector ("#credit-card").style.display = "none";
                document.querySelector ("#paypal").style.display = "";
                document.querySelector ("#bitcoin").style.display = "none";
                break;

            case "bitcoin":
                document.querySelector ("#credit-card").style.display = "none";
                document.querySelector ("#paypal").style.display = "none";
                document.querySelector ("#bitcoin").style.display = "";
                break;

            default: // this should never happen
                alert ("internal error: no payment option detected");
                break;
        }
    }

    // update the display

    updateTShirtInfo ();
    updateActivities ();
    updatePaymentInfo ();

    // validation functions

    function validateName () {
        const nameExp = /^\D+$/; // consists of letters and white space
        const nameElement = document.querySelector ("#name");

        if (nameElement.value === "") {
            nameElement.style.border = errorBorderStyle; // display a border
            document.querySelector (".name-bad-message").style.display = "none"; // hide this message
            document.querySelector (".name-blank-message").style.display = "inline-block"; // display this message
            return false;
        }
        
        if (!nameExp.test (nameElement.value)) {
            nameElement.style.border = errorBorderStyle; // display a border
            document.querySelector (".name-blank-message").style.display = "none"; // display the message
            document.querySelector (".name-bad-message").style.display = "inline-block"; // display the message
            return false;
        }

        nameElement.style.border = ""; // remove the border
        document.querySelector (".name-blank-message").style.display = "none"; // hide the message
        document.querySelector (".name-bad-message").style.display = "none"; // hide the message
        return true; // success!
    }

    function validateEmail () {
        const emailExp = /^\w+@\w+\.\w+/; // email address like: abcd@abcde.abc
        const emailElement = document.querySelector ("#mail");

        if (emailElement.value === "") {
            emailElement.style.border = errorBorderStyle; // display a border
            document.querySelector (".email-blank-message").style.display = "inline-block"; // display the message
            document.querySelector (".email-bad-message").style.display = "none"; // hide the message
            return false;
        }

       if (!emailExp.test (emailElement.value)) {
            emailElement.style.border = errorBorderStyle; // display a border
            document.querySelector (".email-bad-message").style.display = "inline-block"; // display the message
            document.querySelector (".email-blank-message").style.display = "none"; // hide the message
            return false;
        }

        emailElement.style.border = ""; // remove the border
        document.querySelector (".email-bad-message").style.display = "none"; // hide the message
        document.querySelector (".email-blank-message").style.display = "none"; // hide the message
        return true; // success!
    }

    function validateShirtInfo () {
        if (document.querySelector ("#design").value === "Select Theme") {
            document.querySelector (".shirt-message").style.display = ""; // display error message
            return false;
        }
        document.querySelector (".shirt-message").style.display = "none"; // hide error message
        return true;
    }

    function validateActivities () {

        let activitySelected = false;
        const activities = document.querySelectorAll ("fieldset.activities input");
        
        for (let i=0; i < activities.length; i++){
            if (activities[i].checked) {
                activitySelected = true;
                break;
            }
        }
        if (activitySelected) {
            document.querySelector (".activities-message").style.display = "none"; // turn off the message
            return true;
        }
        document.querySelector (".activities-message").style.display = ""; // turn on the message
        return false;
    }

    function validateCreditCard () {
        const ccExp = /^\d{13,16}$/;
        const ccElement = document.querySelector ("#cc-num");

        if (ccElement.value === "") { // blank text entry field
            ccElement.style.border = errorBorderStyle;
            document.querySelector (".cc-num-blank-message").style.display = "inline-block"; // display message
            document.querySelector (".cc-num-bad-message").style.display = "none"; // display message
            return false;
        } else if (ccExp.test (ccElement.value)) { // success
            ccElement.style.border = "";
            document.querySelector (".cc-num-blank-message").style.display = "none"; // hide message
            document.querySelector (".cc-num-bad-message").style.display = "none"; // hide message
            return true;
         } else { // no match
            ccElement.style.border = errorBorderStyle;
            document.querySelector (".cc-num-bad-message").style.display = "inline-block"; // display message
            document.querySelector (".cc-num-blank-message").style.display = "none"; // display message
            return false;
         }
    }

    function validateZipCode () {
        const zipExp = /^\d{5}$/;
        const zipElement = document.querySelector ("#zip");

        if (zipElement.value === "") { // blank
            zipElement.style.border = errorBorderStyle;
            document.querySelector (".zip-blank-message").style.display = "inline-block"; // display message
            document.querySelector (".zip-bad-message").style.display = "none"; // display message
            return false;
        } else if (zipExp.test (zipElement.value)) { // success
            zipElement.style.border = "";
            document.querySelector (".zip-bad-message").style.display = "none"; // hide message
            document.querySelector (".zip-blank-message").style.display = "none"; // hide message
            return true;
         } else { // no match
            zipElement.style.border = errorBorderStyle;
            document.querySelector (".zip-bad-message").style.display = "inline-block"; // display message
            document.querySelector (".zip-blank-message").style.display = "none"; // hide message
            return false;
         }
    }

    function validateCVV () {
        const cvvExp = /^\d{3}$/;
        const cvvElement = document.querySelector ("#cvv");

        if (cvvElement.value === "") { // blank
            cvvElement.style.border = errorBorderStyle;
            document.querySelector (".cvv-blank-message").style.display = "inline-block"; // display message
            document.querySelector (".cvv-bad-message").style.display = "none"; // hide message
            return false;
        } else if (cvvExp.test (cvvElement.value)) { // success
            cvvElement.style.border = "";
            document.querySelector (".cvv-bad-message").style.display = "none"; // hide message
            document.querySelector (".cvv-blank-message").style.display = "none"; // hide message
            return true;
         } else { // no match
            cvvElement.style.border = errorBorderStyle;
            document.querySelector (".cvv-bad-message").style.display = "inline-block"; // display message
            document.querySelector (".cvv-blank-message").style.display = "none"; // hide message
            return false;
         }
    }

    // event listeners

    document.querySelector ("#name").addEventListener ("keyup", () => {
        validateName ();
    });

    document.querySelector ("#mail").addEventListener ("keyup", () => {
        validateEmail ();
    });

    document.querySelector ("#title").addEventListener ("change", () => {
        if (document.querySelector ("#title").value === "other") {
            document.querySelector (".other-title").style.display = ""; // display the other div
        } else {
            document.querySelector (".other-title").style.display = "none"; // hide the other div
        }
    });

    document.querySelector ("#design").addEventListener ("change", () => {
        validateShirtInfo ();
        updateTShirtInfo ();
    });

    document.querySelector ("fieldset.activities").addEventListener ("change", () => {
        validateActivities ();
        updateActivities ();
    });

    document.querySelector ("#payment").addEventListener ("change", () => {
        updatePaymentInfo ();
    });

    document.querySelector ("#cc-num").addEventListener ("keyup", () => {
        validateCreditCard ();
    });

    document.querySelector ("#zip").addEventListener ("keyup", () => {
        validateZipCode ();
    });

    document.querySelector ("#cvv").addEventListener ("keyup", () => {
        validateCVV ();
    });

    document.querySelector ("button").addEventListener ("click", (e) => {
        
        let failed = false;

       // perform each required validation while keeping track of one or more failures

       if (!validateName()) {
            failed = true;
        }
        if (!validateEmail()) {
            failed = true;
        }
        if (!validateShirtInfo()) {
            failed = true;
        } 
        if (!validateActivities()) {
            failed = true;
        } 
        if ((document.querySelector ("#payment").value === "credit card")) {
            if (!validateCreditCard()) {
                failed = true;
            }           
            if (!validateZipCode()) {
                failed = true;
            }           
            if (!validateCVV()) {
                failed = true;
            } 
        }

        // display error message and prevent form submission if there were any validation errors

        if (failed) {   
            document.querySelector (".button-message").style.display = ""; // display the message
            e.preventDefault(); // don't clear the form
        } else {
            document.querySelector (".button-message").style.display = "none"; // hide the message
        }
    });    
});