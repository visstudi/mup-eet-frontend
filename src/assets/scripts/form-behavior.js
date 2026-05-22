// Маска для телефона
const element = document.getElementById("request-phone");
const maskOptions = {
  mask: "+{7}(000)000-00-00",
  lazy: false,
  placeholderChar: "_",
};
const mask = IMask(element, maskOptions);

// Вид обращения
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.querySelector(".dropdown");
  const button = dropdown.querySelector(".dropdown-button");
  const content = dropdown.querySelector(".dropdown-content");
  const choiceText = document.getElementById("dropdown-choice");
  const hiddenInput = document.getElementById("request-type-input");
  const items = content.querySelectorAll("div");

  button.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.toggle("active");
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const selectedValue = item.textContent.trim();

      choiceText.textContent = selectedValue;
      hiddenInput.value = selectedValue;

      content.style.maxHeight = "0px";
      dropdown.classList.remove("active");

      const dateBlock =
        document.getElementById("request-datetime").parentElement;
      const numberBlock =
        document.getElementById("request-number").parentElement;
      const routeBlock = document.getElementById("request-route").parentElement;

      if (selectedValue === "Предложение" || selectedValue === "Вакансия") {
        dateBlock.style.display = "none";
        numberBlock.style.display = "none";
        routeBlock.style.display = "none";
      } else {
        dateBlock.style.display = "flex";
        numberBlock.style.display = "flex";
        routeBlock.style.display = "flex";
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

const feedbackForm = document.querySelector("form");

window.onCaptchaSuccess = function() {
  document.getElementById("send-request-button").disabled = false;
};

window.onCaptchaExpired = function() {
  document.getElementById("send-request-button").disabled = true;
};

feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const captchaToken = window.smartCaptcha.getResponse();

  if (!captchaToken) {
    alert("Пожалуйста, подтвердите, что вы не робот (пройдите капчу).");
    return; 
  }

  const fullName = document.getElementById("request-name").value.trim();
  const phone = mask.unmaskedValue.trim();
  const bortNumber = document.getElementById("request-number").value.trim() || "0000";
  const title = document.getElementById("request-subject").value.trim();
  const description = document.getElementById("request-text").value.trim();

  const typeText = document.getElementById("request-type-input").value;
  const typeMap = { Жалоба: 0, Предложение: 1, Вакансия: 2, Другое: 3 };
  const typeValue = typeMap[typeText] ?? 0;

  const dateValue = document.getElementById("request-datetime").value;
  const incidentTime = dateValue
    ? Math.floor(new Date(dateValue).getTime() / 1000)
    : 0;

  const payload = {
    fullName: fullName,
    phone: phone,
    type: typeValue,
    bortNumber: bortNumber,
    incidentTime: incidentTime,
    incidentRoute: null,
    title: title || "Без темы",
    description: description || "Без описания",
    smartToken: captchaToken 
  };

  console.log("Отправка объекта:", payload);

  try {
    const response = await fetch(`${API_BASE_URL}/Form/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Обращение успешно отправлено!");
      feedbackForm.reset();
      mask.value = "";
      
      window.smartCaptcha.reset();
      document.getElementById("send-request-button").disabled = true;
    } else {
      const errorJson = await response.json();
      console.error("Детали ошибки:", errorJson);
      alert("Ошибка сервера: " + JSON.stringify(errorJson.errors || errorJson.title));
      
      window.smartCaptcha.reset();
      document.getElementById("send-request-button").disabled = true;
    }
  } catch (err) {
    alert("Сетевая ошибка: " + err.message);
  }
});

function adaptCaptchaForMobile() {
  if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
    const layoutWidth = document.documentElement.clientWidth || 980;
    const screenWidth = window.screen.width;
    
    const scale = layoutWidth / screenWidth;

    if (scale > 1.2) {
      const container = document.getElementById("captcha-container");
      if (container) {
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = "top left";
        
        container.style.width = `${100 / scale}%`;
        container.style.marginBottom = `${100 * (scale - 1)}px`;
      }

      const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
          for (let node of mutation.addedNodes) {
            if (node.nodeType === 1 && node.tagName === "DIV") {
              const iframe = node.querySelector('iframe[src*="smartcaptcha"]');
              if (iframe && !container.contains(node)) {
                node.style.transform = `scale(${scale})`;
                node.style.transformOrigin = "center center";
              }
            }
          }
        }
      });
      
      observer.observe(document.body, { childList: true });
    }
  }
}

document.addEventListener("DOMContentLoaded", adaptCaptchaForMobile);