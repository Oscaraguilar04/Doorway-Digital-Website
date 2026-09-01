/**
 * Doorway Digital
 * Header and navigation behavior.
 */

"use strict";

const siteHeader = document.querySelector("[data-site-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navigation = document.querySelector("[data-navigation]");
const navLabel = document.querySelector("[data-nav-label]");
const desktopMedia = window.matchMedia("(min-width: 64rem)");

const setMenuState = (isOpen, restoreFocus = false) => {
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navLabel.textContent = isOpen ? "Close main menu" : "Open main menu";
  navigation.hidden = !isOpen && !desktopMedia.matches;

  if (isOpen) {
    navigation.querySelector("a")?.focus();
  } else if (restoreFocus) {
    navToggle.focus();
  }
};

const syncNavigation = () => {
  setMenuState(false);
  navigation.hidden = !desktopMedia.matches;
};

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  setMenuState(!isOpen, isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a") && !desktopMedia.matches) {
    setMenuState(false, true);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
    setMenuState(false, true);
  }
});

desktopMedia.addEventListener("change", syncNavigation);

const updateHeaderState = () => {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", updateHeaderState, { passive: true });

syncNavigation();
updateHeaderState();
document.documentElement.classList.replace("no-js", "js");
