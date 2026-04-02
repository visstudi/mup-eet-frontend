// Маска для телефона
      const element = document.getElementById('request-phone');
      const maskOptions = {
        mask: '+{7}(000)000-00-00',
        lazy: false,  
        placeholderChar: '_'
      };
      const mask = IMask(element, maskOptions);

      // Вид обращения
      document.addEventListener('DOMContentLoaded', () => {
      const dropdown = document.querySelector('.dropdown');
      const button = dropdown.querySelector('.dropdown-button');
      const content = dropdown.querySelector('.dropdown-content');
      const choiceText = document.getElementById('dropdown-choice');
      const hiddenInput = document.getElementById('request-type-input');
      const items = content.querySelectorAll('div');

      button.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('active');
      });

      items.forEach((item) => {
        item.addEventListener('click', () => {
          const selectedValue = item.textContent.trim();
          
          choiceText.textContent = selectedValue; 
          hiddenInput.value = selectedValue;     
          
          content.style.maxHeight = "0px"; 
          dropdown.classList.remove('active');
          
          const dateBlock = document.getElementById('request-datetime').parentElement;
          const numberBlock = document.getElementById('request-number').parentElement;

          if (selectedValue === "Предложение" || selectedValue === "Вакансия") {
            dateBlock.style.display = "none";
            numberBlock.style.display = "none";
          } 
          else {
            dateBlock.style.display = "flex"; 
            numberBlock.style.display = "flex";
          }
        });
        });

        document.addEventListener('click', (e) => {
          if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
          }
        });
      });

      // Валидация формы
      const API_BASE_URL = '';

      const feedbackForm = document.querySelector('form');

      feedbackForm.addEventListener('submit', async (e) => {
          e.preventDefault();

          const fullName = document.getElementById('request-name').value.trim();
          const phone = mask.unmaskedValue.trim();
          const bortNumber = document.getElementById('request-number').value.trim() || "0000";
          const title = document.getElementById('request-subject').value.trim();
          const description = document.getElementById('request-text').value.trim();

          const typeText = document.getElementById('request-type-input').value;
          const typeMap = { "Жалоба": 0, "Предложение": 1, "Вакансия": 2, "Другое": 3 };
          const typeValue = typeMap[typeText] ?? 0;

          const dateValue = document.getElementById('request-datetime').value;
          const incidentTime = dateValue ? Math.floor(new Date(dateValue).getTime() / 1000) : 0;

          const payload = {
              fullName: fullName,
              phone: phone,
              type: typeValue,
              bortNumber: bortNumber,
              incidentTime: incidentTime,
              incidentRoute: null,
              title: title || "Без темы", 
              description: description || "Без описания"
          };

          console.log("Отправка объекта:", payload);

          try {
              const response = await fetch(`${API_BASE_URL}/Form/create`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json' 
                  },
                  body: JSON.stringify(payload) 
              });

              if (response.ok) {
                  alert('Обращение успешно отправлено!');
                  feedbackForm.reset();
                  mask.value = '';
              } else {
                  const errorJson = await response.json();
                  console.error("Детали ошибки:", errorJson);
                  alert('Ошибка сервера: ' + JSON.stringify(errorJson.errors || errorJson.title));
              }
          } catch (err) {
              alert('Сетевая ошибка: ' + err.message);
          }
      });