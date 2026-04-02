const dropdownButton =
        document.getElementsByClassName("dropdown-button")[0];

      function autoResize(element) {
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
      }

      function resizeDropdownElements() {
        document.getElementsByClassName("dropdown")[0].style.height =
          `${dropdownButton.scrollHeight}px`;

        document.getElementsByClassName("dropdown-content")[0].style.top =
          `${dropdownButton.scrollHeight / 2}px`;

        document.getElementsByClassName(
          "dropdown-content",
        )[0].children[0].style.height = `${dropdownButton.scrollHeight / 2}px`;
      }

      document.querySelectorAll(".tab button").forEach((button) => {
        button.addEventListener("click", function () {
          if (button.parentElement.classList.contains("active")) {
            button.nextElementSibling.style.maxHeight = `0px`;
            button.nextElementSibling.style.paddingBlock = `0px`;
          } else {
            button.nextElementSibling.style.paddingBlock = `min(2.5dvw, 1dvh)`;
            button.nextElementSibling.style.maxHeight = `calc(${button.nextElementSibling.scrollHeight}px + 2*min(2.5dvw, 1dvh))`;
          }

          button.parentElement.classList.toggle("active");
        });
      });

      dropdownButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (dropdownButton.parentElement.classList.contains("active")) {
          dropdownButton.nextElementSibling.style.maxHeight = `0px`;
        } else {
          dropdownButton.nextElementSibling.style.maxHeight = `${dropdownButton.nextElementSibling.scrollHeight}px`;
        }

        dropdownButton.parentElement.classList.toggle("active");
      });

      ["about", "payment", "jobs", "request"].forEach((sectionName) => {
        document
          .getElementById(sectionName + "-button")
          .addEventListener("click", (event) => {
            document
              .getElementById(sectionName + "-section")
              .scrollIntoView({ behavior: "smooth" });
          });
      });

      document
        .getElementsByTagName("textarea")[0]
        .addEventListener("input", function () {
          autoResize(this);
        });

      window.addEventListener("resize", (event) => {
        resizeDropdownElements();
      });

      resizeDropdownElements();