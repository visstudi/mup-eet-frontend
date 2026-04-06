const dropdownButton = document.getElementsByClassName("dropdown-button")[0];

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

function closeTab(button) {
  button.nextElementSibling.style.maxHeight = `0px`;
  button.nextElementSibling.style.paddingBlock = `0px`;
  button.parentElement.classList.remove("active");
}

function openTab(button) {
  button.nextElementSibling.style.paddingBlock = `min(2.5dvw, 1dvh)`;
  button.nextElementSibling.style.maxHeight = `calc(${button.nextElementSibling.scrollHeight}px + 2*min(2.5dvw, 1dvh))`;
  button.parentElement.classList.add("active");
}

function openTabAndScroll(id) {
  openTab(document.getElementById(id).firstElementChild);
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function toggleTab(button) {
  if (button.parentElement.classList.contains("active")) {
    closeTab(button);
  } else {
    openTab(button);
  }
}

document.querySelectorAll(".tab button").forEach((button) => {
  button.addEventListener("click", function () {
    toggleTab(button);
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

document
  .getElementsByTagName("textarea")[0]
  .addEventListener("input", function () {
    autoResize(this);
  });

window.addEventListener("resize", (event) => {
  resizeDropdownElements();
});

resizeDropdownElements();
