/**
 * Acre & Signal
 * Navigation, scroll chapters, reveals, FAQ, and conversion hooks.
 */

"use strict";

(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  root.classList.replace("no-js", "js");

  /* Navigation ----------------------------------------------------------- */

  const masthead = document.querySelector("[data-masthead]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navigation = document.querySelector("[data-navigation]");
  const navLabel = document.querySelector("[data-nav-label]");
  const desktop = window.matchMedia("(min-width: 64rem)");

  const setMenu = (open, restoreFocus = false) => {
    if (!navToggle || !navigation) return;

    const menuOpen = Boolean(open) && !desktop.matches;

    navToggle.setAttribute("aria-expanded", String(menuOpen));
    if (navLabel) navLabel.textContent = menuOpen ? "Close main menu" : "Open main menu";
    navigation.classList.toggle("is-open", menuOpen);
    navigation.hidden = !menuOpen && !desktop.matches;

    if (restoreFocus && !menuOpen) navToggle.focus();
  };

  navToggle?.addEventListener("click", () => {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true", true);
  });

  navigation?.addEventListener("click", (event) => {
    if (event.target.closest("a") && !desktop.matches) setMenu(false, true);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false, true);
    }
  });

  desktop.addEventListener("change", () => setMenu(false));
  setMenu(false);

  /* Header --------------------------------------------------------------- */

  let headerTicking = false;

  const updateHeader = () => {
    headerTicking = false;
    masthead?.classList.toggle("is-stuck", window.scrollY > 8);
  };

  const requestHeaderUpdate = () => {
    if (headerTicking) return;
    headerTicking = true;
    window.requestAnimationFrame(updateHeader);
  };

  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  updateHeader();

  /* Reveals -------------------------------------------------------------- */

  const heroReveal = [...document.querySelectorAll("[data-hero-in]")];
  const reveal = (item) => {
    item.classList.remove("is-pending");
    item.classList.add("is-in");
  };

  if (reduceMotion.matches) {
    heroReveal.forEach(reveal);
  } else {
    heroReveal.forEach((item) => item.classList.add("is-pending"));
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => heroReveal.forEach(reveal));
    });
  }

  const depth = document.querySelector("[data-hero-depth]");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let depthX = 0;
  let depthY = 0;
  let targetX = 0;
  let targetY = 0;
  let depthFrame = 0;

  const depthEnabled = () =>
    Boolean(depth) && desktop.matches && finePointer.matches && !reduceMotion.matches;

  const resetDepth = () => {
    targetX = 0;
    targetY = 0;
    depthX = 0;
    depthY = 0;
    if (depth) {
      depth.style.setProperty("--hx", "0");
      depth.style.setProperty("--hy", "0");
    }
  };

  const tickDepth = () => {
    depthX += (targetX - depthX) * 0.1;
    depthY += (targetY - depthY) * 0.1;
    depth.style.setProperty("--hx", depthX.toFixed(3));
    depth.style.setProperty("--hy", depthY.toFixed(3));

    if (Math.abs(targetX - depthX) > 0.01 || Math.abs(targetY - depthY) > 0.01) {
      depthFrame = window.requestAnimationFrame(tickDepth);
      return;
    }

    depthFrame = 0;
  };

  const requestDepth = () => {
    if (!depthFrame) depthFrame = window.requestAnimationFrame(tickDepth);
  };

  if (depth) {
    window.addEventListener(
      "pointermove",
      (event) => {
        if (!depthEnabled() || event.pointerType === "touch") return;
        const rect = depth.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        requestDepth();
      },
      { passive: true }
    );

    document.querySelector(".hero")?.addEventListener("pointerleave", () => {
      if (!depthEnabled()) return;
      targetX = 0;
      targetY = 0;
      requestDepth();
    });

    const haltDepth = () => {
      if (depthFrame) window.cancelAnimationFrame(depthFrame);
      depthFrame = 0;
      resetDepth();
    };

    desktop.addEventListener("change", haltDepth);
    finePointer.addEventListener("change", haltDepth);
    reduceMotion.addEventListener("change", haltDepth);
  }

  document.querySelectorAll("[data-reveal]").forEach(reveal);

  const revealHash = () => {
    const target = document.querySelector(location.hash);
    if (!target) return;
    reveal(target);
    target.querySelectorAll("[data-reveal]").forEach(reveal);
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href");
      const target = id && document.querySelector(id);
      if (!target) return;
      reveal(target);
      target.querySelectorAll("[data-reveal]").forEach(reveal);
    });
  });

  window.addEventListener("hashchange", revealHash);
  if (location.hash) revealHash();

  /* Problem chapter ------------------------------------------------------ */

  const problem = document.querySelector("[data-problem]");
  const lines = Array.from(document.querySelectorAll("[data-problem-line]"));
  const beats = Array.from(document.querySelectorAll("[data-problem-beat]"));

  const setProblemLine = (index) => {
    if (!problem) return;
    lines.forEach((line) => {
      line.classList.toggle("is-active", Number(line.dataset.problemLine) === index);
    });
    problem.classList.toggle("is-later", index >= 1);
    problem.classList.toggle("is-yours", index >= 2);
  };

  if (problem) {
    if (reduceMotion.matches || desktop.matches === false || !beats.length) {
      setProblemLine(reduceMotion.matches || !desktop.matches ? 2 : 0);
      if (!desktop.matches || reduceMotion.matches) {
        lines.forEach((line) => line.classList.add("is-active"));
        problem.classList.add("is-later", "is-yours");
      }
    }

    if (desktop.matches && !reduceMotion.matches && "IntersectionObserver" in window && beats.length) {
      const beatObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            setProblemLine(Number(entry.target.dataset.problemBeat));
          });
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
      );
      beats.forEach((beat) => beatObserver.observe(beat));
      setProblemLine(0);

      desktop.addEventListener("change", () => {
        if (!desktop.matches) lines.forEach((line) => line.classList.add("is-active"));
      });
    }
  }

  /* FAQ ------------------------------------------------------------------ */

  document.querySelectorAll("[data-faq-button]").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;

    button.setAttribute("aria-expanded", "false");
    panel.hidden = true;

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));

      if (reduceMotion.matches) {
        panel.hidden = isOpen;
        return;
      }

      if (isOpen) {
        panel.classList.add("is-collapsing");
        const finish = (event) => {
          if (event.propertyName !== "grid-template-rows") return;
          panel.hidden = true;
          panel.classList.remove("is-collapsing");
          panel.removeEventListener("transitionend", finish);
        };
        panel.addEventListener("transitionend", finish);
      } else {
        panel.hidden = false;
        panel.classList.add("is-collapsing");
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => panel.classList.remove("is-collapsing"));
        });
      }
    });
  });

  /* Conversion hooks ----------------------------------------------------- */

  const params = window.location.search;
  if (params) {
    document.querySelectorAll("[data-calendly]").forEach((link) => {
      try {
        const url = new URL(link.href);
        new URLSearchParams(params).forEach((value, key) => {
          if (!url.searchParams.has(key)) url.searchParams.set(key, value);
        });
        link.href = url.toString();
      } catch {
        /* leave original href */
      }
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-track]");
    if (!target) return;
    const name = target.getAttribute("data-track");
    document.dispatchEvent(
      new CustomEvent("acre:track", {
        detail: { name, href: target.getAttribute("href") || "" },
      })
    );
  });
})();
