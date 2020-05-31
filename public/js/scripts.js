const publicToken = "pk.eyJ1IjoiYm9va3dvcm1naXJsOTEwIiwiYSI6ImNrYXR2ZXY5dzBma2EyeG40MmQ0ZW43eDgifQ.VnZgfo25UKyn7CiuzTQCkg";

var mymap = L.map('mymap', {
  zoomControl: false,
  scrollWheelZoom: false
}).setView([24.870956, 15.1004003], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/{tilesize}/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, \
    <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, \
    Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 3,
  username: 'mapbox',
  style_id: 'dark-v10',
  tilesize: 512,
  // zoomOffset: -1,
  // default public token
  accessToken: publicToken
}).addTo(mymap);

var socket = io();
socket.on('tweet', function (tweet) {
  console.log(tweet.text);
  console.log(tweet.latlng);
  console.log(tweet.eventtype);

  var eventcolor = (tweet.eventtype) ? "#F6BB42" : "#4A89DC"; // yellow and blue
  // var eventcolor = "#f6bb42";
  // var circle = L.circle([51.508, -0.11], {
  var circle = L.circle([tweet.latlng["lat"], tweet.latlng["lng"]], {
    radius: 50000,
    color: eventcolor,
    fillOpacity: 1.0
  })
    .addTo(mymap)
    // .bindPopup("Good morning good morning good morning alsdkfjlskfj dlag jalsdg alsd g", {
    .bindPopup(tweet.text, {
      maxWidth: 100,
      maxHeight: 18,
      closeButton: false,
      autoClose: false,
      closeOnEscapeKey: false,
      closeOnClick: false,
      className: "popup"
    })
    .openPopup();
  (async () => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    circle.togglePopup();
    circle.remove();
  })();
});