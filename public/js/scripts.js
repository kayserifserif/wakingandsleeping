var mymap = L.map('mapid').setView([24.870956, 15.1004003], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/{tilesize}/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 3,
    username: 'mapbox',
    style_id: 'satellite-streets-v11',
    tilesize: 512,
    // zoomOffset: -1,
    // default public token
    accessToken: 'pk.eyJ1IjoiYm9va3dvcm1naXJsOTEwIiwiYSI6ImNrYXR2ZXY5dzBma2EyeG40MmQ0ZW43eDgifQ.VnZgfo25UKyn7CiuzTQCkg'
}).addTo(mymap);