document.addEventListener("DOMContentLoaded", () => {
  const vacanciesContainer = document.querySelector(
    "#jobs-section .tabs-container",
  );
  const jobsInfoParagraph = document.querySelector("#jobs-info p");
  const API_BASE_URL = "5.3.250.90:5153";

  const scheduleMap = {
    0: "сменный",
    1: "5/2",
    2: "по графику",
  };

  function formatSalary(v) {
    const min = v.salaryMin?.toLocaleString("ru-RU");
    const max = v.salaryMax?.toLocaleString("ru-RU");
    switch (v.salaryType) {
      case 0:
        return `${min} руб.`;
      case 1:
        return `от ${min} руб.`;
      case 2:
        return `от ${min} до ${max} руб.`;
      case 3:
        return `сдельная`;
      default:
        return "по договоренности";
    }
  }

  function createVacancyTab(vacancy) {
    const tab = document.createElement("div");
    tab.className = "tab";

    let detailsHtml = `
      Зарплата: ${formatSalary(vacancy)}<br />
      Режим работы: ${scheduleMap[vacancy.workSchedule] || "не указан"}<br />
      Требования: ${vacancy.requirements || "не указаны"}
    `;
    if (vacancy.additionalInfo) {
      detailsHtml += `<br />Описание: ${vacancy.additionalInfo}`;
    }

    tab.innerHTML = `
      <button class="tab-button">
        <p>${vacancy.profession}</p>
        <svg viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.85436 7.40548C4.08889 7.13187 4.50081 7.10019 4.77442 7.33471L10.4398 12.1907L16.1051 7.33471C16.3787 7.10019 16.7907 7.13187 17.0252 7.40548C17.2597 7.67909 17.228 8.09102 16.9544 8.32554L10.8644 13.5455C10.6201 13.755 10.2595 13.755 10.0151 13.5455L3.92514 8.32554C3.65153 8.09102 3.61984 7.67909 3.85436 7.40548Z" />
        </svg>
      </button>
      <p class="tab-text">${detailsHtml}</p>
    `;

    const button = tab.querySelector(".tab-button");
    const content = tab.querySelector(".tab-text");

    button.addEventListener("click", () => {
      const isActive = tab.classList.contains("active");

      document.querySelectorAll("#jobs-section .tab").forEach((otherTab) => {
        if (otherTab !== tab) {
          otherTab.classList.remove("active");
          const otherContent = otherTab.querySelector(".tab-text");
          if (otherContent) {
            otherContent.style.maxHeight = "0px";
            otherContent.style.paddingBlock = "0px";
          }
        }
      });

      if (isActive) {
        content.style.maxHeight = "0px";
        content.style.paddingBlock = "0px";
      } else {
        content.style.paddingBlock = "min(2.5dvw, 1dvh)";
        content.style.maxHeight = `calc(${content.scrollHeight}px + 2*min(2.5dvw, 1dvh))`;
      }
      tab.classList.toggle("active");
    });

    return tab;
  }

  async function fetchVacancies() {
    try {
      const response = await fetch(`${API_BASE_URL}/Vacancy/get`);
      const data = await response.json();
      vacanciesContainer.innerHTML = "";

      if (!data.vacancies || data.vacancies.length === 0) {
        if (jobsInfoParagraph) jobsInfoParagraph.style.display = "none";

        vacanciesContainer.innerHTML = `
          <div class="no-vacancies-wrapper">
            <svg class="no-vacancies-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5.5H5C3.34315 5.5 2 6.84315 2 8.5V18.5C2 20.1569 3.34315 21.5 5 21.5H19C20.6569 21.5 22 20.1569 22 18.5V8.5C22 6.84315 20.6569 5.5 19 5.5ZM5 7.5H19C19.5523 7.5 20 7.94772 20 8.5V9.5H4V8.5C4 7.94772 4.44772 7.5 5 7.5ZM19 19.5H5C4.44772 19.5 4 19.0523 4 18.5V11.5H20V18.5C20 19.0523 19.5523 19.5 19 19.5ZM10 14.5H14V16.5H10V14.5Z"/>
              <path d="M15 2.5H9V4.5H15V2.5Z"/>
            </svg>
            <p class="no-vacancies-text">Вакансий<br>пока нет</p>
          </div>
        `;
        return;
      }

      if (jobsInfoParagraph) jobsInfoParagraph.style.display = "block";

      data.vacancies.sort((a, b) => a.id - b.id);
      data.vacancies.forEach((v) =>
        vacanciesContainer.appendChild(createVacancyTab(v)),
      );
    } catch (e) {
      console.error("Ошибка API:", e);
      vacanciesContainer.innerHTML =
        '<p class="no-vacancies-text">Ошибка загрузки данных</p>';
    }
  }

  fetchVacancies();
});
