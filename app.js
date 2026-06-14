
let biggestIndex = 1
function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
}
setInterval(updateTime, 1000);

const movablediv = document.getElementById("movable-div")

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
  document.getElementById(element.id + "-content").classList.add("expanded-content")
}

function unexpandWindow(element) {
  element.classList.remove("expanded")
  document.getElementById(element.id + "header").classList.remove("expanded-header")
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


movabledivclose.addEventListener("click", function() {
  closeWindow(movablediv)
})

document.getElementById("movable-div-expand").addEventListener("click", function() {
  if (movablediv.expandedmovablediv === false) {
    expandWindow(movablediv)
    movablediv.expandedmovablediv = true
  }
  else {unexpandWindow(movablediv); movalblediv.expandedmovablediv = false}
})

document.getElementById("weather-bar").addEventListener("click", function() {
  openWindow(movablediv)
})

document.getElementById("weatherappicon").addEventListener("click", function() {
  openWindow(movablediv)
})


navigator.geolocation.getCurrentPosition(pos => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=wind_speed_10m,wind_direction_10m`;
  fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);

        const windSpeed = data.hourly.wind_speed_10m[0];
        const windDirection = data.hourly.wind_direction_10m[0];

        console.log("Windsnelheid:", windSpeed, "km/u");
        console.log("Windrichting:", windDirection, "°");
      })
      .catch(error => console.error(error));

});
function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
}
function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () =>
    handleWindowTap(element)
  )
}
