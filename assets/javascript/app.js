// add global variables
var trainLine = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// add jQuery global variables
var sdTrain = $("#train-line");
var sdTrainDestination = $("#train-destination");

// form validation for Time using jQuery Mask plugin
var sdTrainTime = $("#train-time").mask("00:00");
var sdTimeFreq = $("#time-freq").mask("00");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDTanZ6F_P89q2mBrjZa8TfzYjQCxZKPAs",
    authDomain: "fir-intro-a874f.firebaseapp.com",
    databaseURL: "https://fir-intro-a874f.firebaseio.com",
    projectId: "fir-intro-a874f",
    storageBucket: "",
    messagingSenderId: "299127530077",
    appId: "1:299127530077:web:597fb666e73deb35"
};

firebase.initializeApp(config);

var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {

    //  add local variables to store data from firebase
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    // compute difference in time from now and the first train using timestamp, store in var + convert to mins
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    // get remainder of time by using moderator with the frequency & time difference, store in var
    trainRemainder = trainDiff % frequency;

    // subtract the remainder from the frequency, store in var
    minutesTillArrival = frequency - trainRemainder;

    // add minutesTillArrival to now, to find next train & convert to standard time format
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    // append to table of trains, inside tbody, with a new row of the train data
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();
});

// function to call the button event, and store the values in the input form
var storeInputs = function(event) {
    // prevent from from reseting
    event.preventDefault();

    // get & store input values
    trainLine = sdTrain.val().trim();
    trainDestination = sdTrainDestination.val().trim();
    trainTime = moment(sdTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = sdTimeFreq.val().trim();

    // add to firebase databse
    database.ref("/trains").push({
        name: trainLine,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    //  empty form once submitted
    sdTrain.val("");
    sdTrainDestination.val("");
    sdTrainTime.val("");
    sdTimeFreq.val("");
};

// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function(event) {
    // form validation - if empty - alert
    if (sdTrain.val().length === 0 || sdTrainDestination.val().length === 0 || sdTrainTime.val().length === 0 || sdTimeFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        // if form is filled out, run function
        storeInputs(event);
    }
});

// Calls storeInputs function if enter key is clicked
$('form').on("keypress", function(event) {
    if (event.which === 13) {
        // form validation - if empty - alert
        if (sdTrain.val().length === 0 || sdTrainDestination.val().length === 0 || sdTrainTime.val().length === 0 || sdTimeFreq === 0) {
            alert("Please Fill All Required Fields");
        } else {
            // if form is filled out, run function
            storeInputs(event);
        }
    }
});