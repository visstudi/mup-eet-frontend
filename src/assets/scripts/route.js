document.addEventListener("DOMContentLoaded", () => {
  const route = JSON.parse(sessionStorage.getItem("selectedRoute"));
  if (!route) {
    location.href = "./routes.html";
    return;
  }

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r} ${g} ${b}`;
  };

  const rgb = hexToRgb(route.color);
  const section = document.getElementById("route-main-section");
  section.style.setProperty("--section-accent-color", rgb);

  document.querySelector(".routes-tab-number").textContent = route.name;
  document.querySelector("#route-data p:first-child").textContent =
    `Маршрут №${route.name}`;
  document.querySelector("#route-data p:last-child").textContent =
    `${route.fromStation} — ${route.toStation}`;

  if (!route.state) {
    const alertBox = document.createElement("div");
    alertBox.id = "route-alert";
    alertBox.innerHTML = `<p>Прервано движение по маршруту ${route.name}</p>`;
    if (route.reason) {
      alertBox.innerHTML += `<p>${route.reason}</p>`;
    }
    document.getElementById("route-about").after(alertBox);
  }

  const priceLabels = document.querySelectorAll(".price p:first-child");
  const priceValues = document.querySelectorAll(".price p:last-child");
  if (route.routeType === 0) {
    priceLabels[0].textContent = "по карте";
    priceLabels[1].textContent = "наличные";
  } else {
    priceLabels[0].textContent = "по городу";
    priceLabels[1].textContent = "межгород";
  }
  priceValues[0].textContent = `${route.priceLow}₽`;
  priceValues[1].textContent = `${route.priceHigh}₽`;

  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";

  if (!route.scheduleTable || route.scheduleTable.length === 0) {
    tbody.innerHTML = `<tr><td colspan="2" style="text-align: center; padding: 20px;">Расписания пока нет</td></tr>`;
  } else {
    const now = new Date();
    const currentSec =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const scheduleWithSeconds = route.scheduleTable.map((row) => ({
      ...row,
      startSec: row.startRange
        .split(":")
        .reduce((acc, time) => 60 * acc + +time, 0),
      endSec: row.endRange
        ? row.endRange.split(":").reduce((acc, time) => 60 * acc + +time, 0)
        : null,
    }));

    let activeIndex = scheduleWithSeconds.findIndex((row, index) => {
      if (row.endSec) {
        return currentSec >= row.startSec && currentSec <= row.endSec;
      } else {
        const nextRow = scheduleWithSeconds[index + 1];
        return currentSec >= row.startSec && (!nextRow || currentSec < nextRow.startSec);
      }
    });

    if (activeIndex === -1) {
      activeIndex = scheduleWithSeconds.findIndex(row => row.startSec > currentSec);
    }

    if (activeIndex === -1) {
      activeIndex = 0;
    }

    scheduleWithSeconds.forEach((row, index) => {
      const tr = document.createElement("tr");
      const startTime = row.startRange.slice(0, 5);
      const endTime = row.endRange ? ` - ${row.endRange.slice(0, 5)}` : "";
      const annotation = row.annotation ? ` (${row.annotation})` : "";
      const interval =
        row.interval === -1 ? "дежурный" : `${row.interval} мин.`;

      tr.innerHTML = `<td>${startTime}${endTime}${annotation}</td><td>${interval}</td>`;

      if (index === activeIndex) {
        tr.classList.add("active");
      }
      
      tbody.appendChild(tr);
    });
  }

  if (route.yandexMapLink) {
    const container = document.getElementById("map-container");
    
    const urlParams = new URLSearchParams(route.yandexMapLink.split('?')[1]);
    const um = urlParams.get('um');

    if (um) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.charset = "utf-8";
      script.async = true;

      script.src = `https://api-maps.yandex.ru/services/constructor/1.0/js/?um=${um}&width=100%&height=100%&lang=ru_RU&scroll=true`;

      container.appendChild(script);
    }
  } else {
    document.getElementById("route-map").style.display = "none";
  }
});
