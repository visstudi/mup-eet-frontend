"use strict";

let currentItemId = 0;

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Deactivate previous marker
        document
          .querySelectorAll(".carousel-marker")
          [currentItemId].classList.remove("marker-active");

        // Get current item id
        currentItemId =
          parseInt(entry.target.firstElementChild.getAttribute("alt")) - 1;

        // Activate current marker
        document
          .querySelectorAll(".carousel-marker")
          [currentItemId].classList.add("marker-active");
      }
    });
  },
  {
    root: document.querySelector(".carousel"),
    rootMargin: "0px",
    scrollMargin: "0px",
    threshold: 0.75,
  },
);

document.querySelectorAll(".carousel-item").forEach((element) => {
  if (element) {
    observer.observe(element);
  }
});
