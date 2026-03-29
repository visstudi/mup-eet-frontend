"use strict";

const root = document.getElementsByTagName("html")[0];
const logo = document.getElementsByClassName("logo")[1];
const themeSwitchButton = document.getElementById("dark-mode-button");
const themeSwitchIcon = document.getElementById("dark-mode-icon");
const userPrefersDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function toggleTheme() {
  if (root.getAttribute("theme") === "dark") {
    root.setAttribute("theme", "light");
    logo.setAttribute("src", "../assets/icons/logo-light.svg");
    themeSwitchIcon.setAttribute("src", "../assets/icons/darkmode.svg");
  } else {
    root.setAttribute("theme", "dark");
    logo.setAttribute("src", "../assets/icons/logo-dark.svg");
    themeSwitchIcon.setAttribute("src", "../assets/icons/lightmode.svg");
  }
}

themeSwitchButton.addEventListener("click", (event) => {
  toggleTheme();
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {});
