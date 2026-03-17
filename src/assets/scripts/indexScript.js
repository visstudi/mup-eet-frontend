"use strict";

const tabButtons = document.querySelectorAll(".tab button");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.parentElement.classList.contains("active")) {
      button.nextElementSibling.style.maxHeight = `0px`;
    } else {
      button.nextElementSibling.style.maxHeight = `${button.nextElementSibling.scrollHeight}px`;
    }
    button.parentElement.classList.toggle("active");
  });
});
