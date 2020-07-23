const token = "pk.eyJ1IjoiYm9va3dvcm1naXJsOTEwIiwiYSI6ImNrYXR2Z2o3azBrbWIyeHB0ZnJxa2Zqc3kifQ.8FZb1SBrTX55wr11JWNxKw";

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
  accessToken: token
}).addTo(mymap);

let alert = document.getElementById("alert");
let isPinsEphemeral;
let toggleRadios = document.getElementsByClassName("toggle-radio");
for (let toggleRadio of toggleRadios) {
  if (toggleRadio.checked) {
    isPinsEphemeral = (toggleRadio.value === "ephemeral");
  }
  toggleRadio.addEventListener("click", (event) => {
    isPinsEphemeral = (toggleRadio.value === "ephemeral");
    if (isPinsEphemeral) {
      alert.textContent = "Tweets will appear and fade."
      let pins = document.getElementsByClassName("leaflet-interactive");
      for (let pin of pins) {
        pin.remove();
      }
      let popups = document.getElementsByClassName("leaflet-popup");
      for (let popup of popups) {
        popup.remove();
      }
    } else {
      alert.textContent = "Tweets will appear and stay."
    }
    alert.classList.add("visible");
    setTimeout(() => { alert.classList.remove("visible"); }, 2000);
  });
}

var socket = io();
socket.on('tweet', function (tweet) {
  // console.log(tweet.text);
  // console.log(tweet.latlng);
  // console.log(tweet.eventtype);

  var eventcolor = (tweet.eventtype) ? "#F6BB42" : "#4A89DC"; // yellow and blue
  var circle = L.circle([tweet.latlng["lat"], tweet.latlng["lng"]], {
    radius: 50000,
    color: eventcolor,
    fillOpacity: 1.0
  })
    .addTo(mymap)
    .bindPopup(tweet.text, {
      maxWidth: 200,
      maxHeight: 36,
      closeButton: false,
      autoClose: false,
      closeOnEscapeKey: false,
      closeOnClick: false,
      className: "popup"
    })
    .openPopup();
  (async () => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    if (isPinsEphemeral) {
      circle.togglePopup();
      circle.remove();
    }
  })();
});