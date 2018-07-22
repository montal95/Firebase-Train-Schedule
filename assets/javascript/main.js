var moment;
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAK67OVWU6MRkVcul9d7hNsUWqIzA3UMgo",
  authDomain: "starterproject-112d6.firebaseapp.com",
  databaseURL: "https://starterproject-112d6.firebaseio.com",
  projectId: "starterproject-112d6",
  storfrequencyBucket: "starterproject-112d6.appspot.com",
  messagingSenderId: "453824226097"
};
firebase.initializeApp(config);
var database = firebase.database();
// Initial Values
var name = "";
var destination = "";
var frequency = 0;
var firstArrival;
var rowCount = 1;

// Capture Button Click and add train
$("#add-train").on("click", function(e) {
  e.preventDefault();
  name = $("#name-input")
    .val()
    .trim();
  destination = $("#destination-input")
    .val()
    .trim();
  frequency = $("#freq-input")
    .val()
    .trim();
  firstArrival = $("#firstArrive-Input").val();
  console.log(firstArrival);
  //prevents the function from going further an pushing the info into the firebase in any form is empty
  if (
    name === "" ||
    destination === "" ||
    frequency === "" ||
    firstArrival.length != 5
  ) {
    alert("Please complete all forms and try again");
    return false;
  }
  // Code for the push
  database.ref().push({
    name: name,
    destination: destination,
    frequency: frequency,
    firstArrival: firstArrival,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
  //clears the inputs after
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#freq-input").val("");
  $("#firstArrive-Input").val("");
  
  //updates the list
  timeUpdate();
});

// Reference Firebase when page loads and train added
function timeUpdate() {
  database.ref().on(
    "value",
    function(snapshot) {
      $("#trainList").empty();
      //Holds My Values
      var sv = snapshot.val();

      //Holds My Keys
      var svKeys = Object.keys(sv);

      console.log(sv[svKeys[0]]);

      console.log("Values ", sv);
      console.log("Keys ", svKeys);

      //dynamically creates each row by looping through the keys
      for (var i = 0; i < svKeys.length; i++) {
        //variable assigned for the firebase arrays
        var currentValue = sv[svKeys[i]];
        console.log(currentValue.firstArrival);

        //variable evaluates the time difference between now and first arrival
        var timeDiff = moment().diff(
          moment(currentValue.firstArrival, "HH:mm"),
          "minutes"
        );

        //Calculates a remainder from the division of the current time difference by the train frequencies
        var timeRemainder = timeDiff % currentValue.frequency;
        console.log(timeDiff);

        //takes the current frequency value and subtracts the remainder to find the time until the next arrival
        var minutesTilTrain = currentValue.frequency - timeRemainder;
        console.log(minutesTilTrain);

        //adds the minutes until the next train to the current time and converts it to the correct format
        var nextTrain = moment()
          .add(minutesTilTrain, "minutes")
          .format("h:mm a");

        //row builder
        var rowBuild = $("<tr>");
        rowBuild.append("<td scope='col'>" + currentValue.name + "</td>");
        rowBuild.append(
          "<td scope='col'>" + currentValue.destination + "</td>"
        );
        rowBuild.append("<td scope='col'>" + currentValue.frequency + "</td>");
        rowBuild.append("<td scope='col'>" + nextTrain + "</td>");
        rowBuild.append("<td scope='col'>" + minutesTilTrain + "</td>");
        $("#trainList").append(rowBuild);
      }

      // Handle the errors
    },
    function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );
}
timeUpdate();

//sets the table to update every minute
setInterval(timeUpdate, 10000);