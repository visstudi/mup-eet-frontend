document.addEventListener("DOMContentLoaded", () => {
  const route = JSON.parse(sessionStorage.getItem('selectedRoute'));
  if (!route) {
    location.href = './routes.html';
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
  document.querySelector("#route-data p:first-child").textContent = `Маршрут №${route.name}`;
  document.querySelector("#route-data p:last-child").textContent = `${route.fromStation} — ${route.toStation}`;

  if (!route.state) {
    const alertBox = document.createElement("div");
    alertBox.className = "route-alert";
    const reason = route.reason || "Причина выясняется";
    alertBox.innerHTML = `<b>Прервано движение по маршруту ${route.name}</b>${reason}`;
    document.getElementById("route-about").after(alertBox);
  }

  const priceLabels = document.querySelectorAll(".price p:first-child");
  const priceValues = document.querySelectorAll(".price p:last-child");
  if (route.routeType === 0) {
    priceLabels[0].textContent = "по карте";
    priceLabels[1].textContent = "наличкой";
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
    const currentSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const scheduleWithSeconds = route.scheduleTable.map(row => ({
      ...row,
      startSec: row.startRange.split(':').reduce((acc, time) => (60 * acc) + +time, 0),
      endSec: row.endRange ? row.endRange.split(':').reduce((acc, time) => (60 * acc) + +time, 0) : null
    }));

    scheduleWithSeconds.forEach((row, index) => {
      const tr = document.createElement("tr");
      const startTime = row.startRange.slice(0, 5);
      const endTime = row.endRange ? ` - ${row.endRange.slice(0, 5)}` : "";
      const annotation = row.annotation ? ` (${row.annotation})` : "";
      const interval = row.interval === -1 ? "дежурный" : `${row.interval} мин.`;

      tr.innerHTML = `<td>${startTime}${endTime}${annotation}</td><td>${interval}</td>`;

      let isActive = false;
      if (row.endSec) {
        if (currentSec >= row.startSec && currentSec <= row.endSec) isActive = true;
      } else {
        const nextRow = scheduleWithSeconds[index + 1];
        if (currentSec >= row.startSec && (!nextRow || currentSec < nextRow.startSec)) {
          isActive = true;
        }
      }

      if (isActive) tr.classList.add("active");
      tbody.appendChild(tr);
    });
  }
});