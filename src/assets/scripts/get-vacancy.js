document.addEventListener("DOMContentLoaded", () => {
  const vacanciesContainer = document.querySelector("#jobs-section .tabs-container");
  
  const API_BASE_URL = ""; 

  const scheduleMap = {
    0: "сменный",
    1: "5/2",
    2: "по графику"
  };

  function formatSalary(v) {
    const min = v.salaryMin?.toLocaleString('ru-RU');
    const max = v.salaryMax?.toLocaleString('ru-RU');
    
    switch (v.salaryType) {
      case 0: return `${min} руб.`;
      case 1: return `от ${min} руб.`;
      case 2: return `от ${min} до ${max} руб.`;
      case 3: return `сдельная`;
      default: return "по договоренности";
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
      detailsHtml += `<br />Обязанности: ${vacancy.additionalInfo}`;
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
        vacanciesContainer.innerHTML = "<p class=\"no-vacancies-message\">Открытых вакансий нет.</p>";
        return;
      }

      const sortedVacancies = data.vacancies.sort((a, b) => a.id - b.id);

      sortedVacancies.forEach(vacancy => {
        const vacancyElement = createVacancyTab(vacancy);
        vacanciesContainer.appendChild(vacancyElement);
      });

    } catch (error) {
      console.error("Ошибка при загрузке вакансий:", error);
      vacanciesContainer.innerHTML = "<p>Ошибка загрузки данных. Попробуйте позже.</p>";
    }
  }

  fetchVacancies();
});