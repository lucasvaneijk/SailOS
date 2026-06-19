const days = ['sunday', 'monday', 'tuesday', 'wensday', 'thursday', 'friday', 'saterday'];
let biggestIndex = 1
let currentMap = null; 
let drawingMode = false;
let drawnPoints = [];
let currentPolyline = null;
let drawnLines = [];
let drawnMarkers = [];

function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
}
setInterval(updateTime, 1000);

function getData() {
  const input = document.getElementById("place-input").value
  
  fetch(`https://nominatim.openstreetmap.org/search?q=${input}&format=json`)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        document.getElementById("weather-result").innerText = "Location not found";
        return;
      }

      const lat = data[0].lat;
      const lon = data[0].lon;

  

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,cloud_cover,weather_code&models=best_match`;
      fetch(url)
        .then(response => response.json())
        .then(data => {

          
          const windSpeed = data.hourly.wind_speed_10m[0];
          const windDirection = data.hourly.wind_direction_10m[0];
          
          const container = document.getElementById("weather-result");
          const fragment = document.createDocumentFragment();
          const currentDay = (new Date().getDay())
          for (let i = 0; i < 168; i++) {
            if (i % 24 === 0) {
              const p = document.createElement("p")
              p.textContent = days[(i / 24 + currentDay) % 7]
              fragment.appendChild(p)
            }
            const div = document.createElement("div");
            div.textContent = `${data.hourly.time[i].substring(11, 16)}, ${data.hourly.temperature_2m[i]}C°, ${Math.round((data.hourly.wind_speed_10m[i] * 0.539957) * 1)}-${Math.round((data.hourly.wind_gusts_10m[i] * 0.539957) * 1)} knots, ${data.hourly.wind_direction_10m[i]}°`;
            fragment.appendChild(div);
          }

          container.appendChild(fragment);
        })
        .catch(error => console.error(error));
    });

}



const movablediv = document.getElementById("movable-div")
movablediv.left = undefined
movablediv.top = undefined
const map = document.getElementById("map-page-div")

dragElement(map)
addWindowTapHandling(map)
dragElement(movablediv)
addWindowTapHandling(movablediv)
movablediv.expandedmovablediv = false
const expandmovablediv = document.getElementById("movable-div-expand")

function closeWindow(element) {
    element.style.display = "none"
}

function openWindow(element) {
  element.style.display = "flex"
  biggestIndex++;
  element.style.zIndex = biggestIndex;

}

function expandWindow(element) {
  element.classList.add("expanded")
  const header = document.getElementById(element.id + "header")
  header.classList.add("expanded-header")
  if (document.getElementById(element.id + "-content")) {document.getElementById(element.id + "-content").classList.add("expanded-content")}
  element.expandedmovablediv = true
  element.top = element.style.top
  element.left = element.style.left
  element.style.top = "0px"
  element.style.left = "0px"

}

function unexpandWindow(element) {
  element.classList.remove("expanded")
  document.getElementById(element.id + "header").classList.remove("expanded-header")
  element.expandedmovablediv = false
  dragElement(element)
  element.style.left = element.left
  element.style.top = element.top

}
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    
    if (elmnt.expandedmovablediv) {
      unexpandWindow(elmnt);
      elmnt.style.top = (elmnt.style.top - (e.clientY - elmnt.style.top)) + "px";
      elmnt.style.left = (elmnt.style.left - (e.clientX - elmnt.style.top)) + "px";
      document.onmouseup = closeDragElement;
    }
    
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

const movabledivclose = document.querySelector("#movable-div-close")
map.expanded = false

movabledivclose.addEventListener("click", function() {
  closeWindow(movablediv)
})
document.getElementById("map-page-divclose").addEventListener("click", function() {
  closeWindow(map)
})
document.getElementById("map-page-divexpand").addEventListener("click", function() {
  if (map.expanded === true) {
    unexpandWindow(map)
    document.getElementById("map-page-div").classList.remove("expanded")
    map.expanded = false
  }
  else {expandWindow(map); document.getElementById("map-page-div").classList.add("expanded"); map.expanded = true}
})
document.getElementById("mapappicon").addEventListener("click", function() {
  openWindow(map)
})
document.getElementById("movable-div-expand").addEventListener("click", function() {
  if (movablediv.expandedmovablediv === false) {
    expandWindow(movablediv)
  }
  else {unexpandWindow(movablediv);}
})

document.getElementById("weather-bar").addEventListener("click", function() {
  openWindow(movablediv)
})

document.getElementById("weatherappicon").addEventListener("click", function() {
  openWindow(movablediv)
})



function initMap() {
  const input = document.getElementById("input-map").value;
  
  if (!input) {
    return;
  }
  

  
  fetch(`https://nominatim.openstreetmap.org/search?q=${input}&format=json`)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        return;
      }

      const lat = data[0].lat;
      const lon = data[0].lon;


      if (currentMap) {
        currentMap.setView([lat, lon], 12);

        currentMap.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            currentMap.removeLayer(layer);
          }
        });
      } else {

        currentMap = L.map('map').setView([lat, lon], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(currentMap);
      }

      L.marker([lat, lon])
        .addTo(currentMap)
        .bindPopup(input)
        .openPopup();
    })
    .catch(error => console.error(error));
}



function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
}
function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () =>
    handleWindowTap(element)
  )
}

document.getElementById("draw-btn").addEventListener("click", function() {
  drawingMode = !drawingMode;
  this.classList.toggle("active");
  
  if (currentMap) {
    if (drawingMode) {
      currentMap.dragging.disable();
      drawnPoints = [];
    } else {
      currentMap.dragging.enable();
      if (currentPolyline) {
        drawnLines.push(currentPolyline);
        currentPolyline = null;
      }
    }
  }
});

document.getElementById("clear-btn").addEventListener("click", function() {
  if (currentMap) {

    drawnMarkers.forEach(marker => currentMap.removeLayer(marker));
    drawnMarkers = [];
    
  
    drawnLines.forEach(line => currentMap.removeLayer(line));
    drawnLines = [];


    if (currentPolyline) {
      currentMap.removeLayer(currentPolyline);
      currentPolyline = null;
    }
    
    drawnPoints = [];
  }
});

const originalInitMap = window.initMap;
window.initMap = function() {
  originalInitMap.call(this);
  
  if (currentMap) {
    currentMap.on('click', function(e) {
      if (drawingMode) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        drawnPoints.push([lat, lng]);
        

        const marker = L.circleMarker([lat, lng], {radius: 3, color: 'red'}).addTo(currentMap);
        drawnMarkers.push(marker);
        

        if (currentPolyline) {
          currentMap.removeLayer(currentPolyline);
        }
        
        currentPolyline = L.polyline(drawnPoints, {
          color: 'red',
          weight: 2,
          dashArray: '5, 5'
        }).addTo(currentMap);
      }
    });
  }
};
