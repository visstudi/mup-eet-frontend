"use strict";

const root = document.getElementsByTagName("html")[0];

const logo = document.getElementsByClassName("logo")[1];

const themeSwitchIcon = document.getElementById("dark-mode-icon");

const userPrefersDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function enableTheme(theme) {
  root.setAttribute("theme", theme);
  logo.setAttribute("src", `../assets/icons/logo-${theme}.svg`);
  themeSwitchIcon.setAttribute(
    "src",
    `../assets/icons/switch-mode-${theme}.svg`,
  );
  localStorage.setItem("selected-theme", theme);
}

function toggleTheme() {
  root.getAttribute("theme") === "dark"
    ? enableTheme("light")
    : enableTheme("dark");
}

document
  .getElementById("dark-mode-button")
  .addEventListener("click", (event) => {
    toggleTheme();
  });

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    enableTheme(event.matches ? "dark" : "light");
  });

/* Prefer selected-theme saved in localStorage over user's preferred theme */
if (userPrefersDarkMode && localStorage.getItem("selected-theme") === null) {
  enableTheme("dark");
} else {
  enableTheme(localStorage.getItem("selected-theme"));
}
