/**
 * Doorway Digital
 * Navigation, scroll state, reveal motion, sticky work viewer and FAQ.
 * Vanilla JS, no dependencies.
 */

"use strict";

(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  root.classList.replace("no-js", "js");

  /* ---------------------------------------------------------------------
     Navigation
     --------------------------------------------------------------------- */

  const masthead = document.querySelector("[data-masthead]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navigation = document.querySelector("[data-navigation]");
  const navLabel = document.querySelector("[data-nav-label]");
  const desktop = window.matchMedia("(min-width: 64rem)");

  const setMenu = (open, restoreFocus = false) => {
    if (!navToggle || !navigation) return;

    navToggle.setAttribute("aria-expanded", String(open));
    if (navLabel) navLabel.textContent = open ? "Close main menu" : "Open main menu";
    navigation.hidden = !open && !desktop.matches;

    if (open) {
      navigation.querySelector("a")?.focus();
    } else if (restoreFocus) {
      navToggle.focus();
    }
  };

  const syncMenu = () => {
    setMenu(false);
    if (navigation) navigation.hidden = !desktop.matches;
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

  desktop.addEventListener("change", syncMenu);
  syncMenu();

  /* ---------------------------------------------------------------------
     Header state: shadow line on scroll, inversion over dark sections
     --------------------------------------------------------------------- */

  const darkSections = Array.from(document.querySelectorAll('[data-theme="dark"]'));
  let headerTicking = false;

  const updateHeader = () => {
    headerTicking = false;
    if (!masthead) return;

    masthead.classList.toggle("is-stuck", window.scrollY > 8);

    const probe = masthead.getBoundingClientRect().height * 0.6;
    const overDark = darkSections.some((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= probe && rect.bottom > probe;
    });

    masthead.classList.toggle("is-inverted", overDark);
  };

  const requestHeaderUpdate = () => {
    if (headerTicking) return;
    headerTicking = true;
    window.requestAnimationFrame(updateHeader);
  };

  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  window.addEventListener("resize", requestHeaderUpdate);
  updateHeader();

  /* ---------------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------------- */

  const revealSelector = [
    ".section-head",
    ".work-panel article",
    ".presence__copy",
    ".presence__figure",
    ".build-row",
    ".offer__head",
    ".offer__price-card",
    ".offer__detail",
    ".step",
    ".about__portrait",
    ".about__content",
    ".faq__head",
    ".qa",
    ".closing__inner > *:not(.closing__door)",
  ].join(",");

  const revealItems = Array.from(document.querySelectorAll("[data-reveal]")).flatMap(
    (section) => Array.from(section.querySelectorAll(revealSelector))
  );

  const reveal = (item, stagger = true) => {
    if (stagger) {
      const index = Number(item.dataset.revealIndex || 0);
      item.style.transitionDelay = `${Math.min(index, 4) * 70}ms`;
    }
    item.classList.add("is-in");
  };

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => reveal(item, false));
  } else {
    let observerFired = false;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        observerFired = true;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    revealItems.forEach((item) => {
      const siblings = Array.from(item.parentElement?.children || []);
      item.dataset.revealIndex = String(siblings.indexOf(item));

      // Anything already on screen reveals immediately rather than waiting
      // for a scroll that may never happen.
      if (item.getBoundingClientRect().top < window.innerHeight * 0.95) {
        reveal(item);
      } else {
        revealObserver.observe(item);
      }
    });

    // Failsafe: reveal-on-scroll is an enhancement, never a prerequisite for
    // reading the page. If the observer never reports, show everything.
    window.setTimeout(() => {
      if (observerFired) return;
      revealObserver.disconnect();
      revealItems.forEach((item) => reveal(item, false));
    }, 2500);
  }

  /* ---------------------------------------------------------------------
     Fragmented presence: scattered platforms consolidate on entry
     --------------------------------------------------------------------- */

  const orbit = document.querySelector("[data-orbit]");

  if (orbit) {
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      orbit.classList.add("is-consolidated");
    } else {
      const orbitObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            orbit.classList.add("is-consolidated");
            orbitObserver.disconnect();
          });
        },
        { threshold: 0.35 }
      );
      orbitObserver.observe(orbit);
    }
  }

  /* ---------------------------------------------------------------------
     Closing CTA: doorway leaves part on entry
     --------------------------------------------------------------------- */

  const closing = document.querySelector(".closing");

  if (closing) {
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      closing.classList.add("is-open");
    } else {
      const closingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            closing.classList.add("is-open");
            closingObserver.disconnect();
          });
        },
        { threshold: 0.3 }
      );
      closingObserver.observe(closing);
    }
  }

  /* ---------------------------------------------------------------------
     Selected work: sticky viewer follows the active project panel
     --------------------------------------------------------------------- */

  const workCanvas = document.querySelector("[data-work-canvas]");

  if (workCanvas && "IntersectionObserver" in window) {
    const panels = Array.from(workCanvas.querySelectorAll("[data-work-panel]"));
    const shots = Array.from(workCanvas.querySelectorAll("[data-shot]"));

    const setActiveShot = (index) => {
      if (workCanvas.dataset.active === String(index)) return;
      workCanvas.dataset.active = String(index);
      shots.forEach((shot) => {
        shot.classList.toggle("is-active", shot.dataset.shot === String(index));
      });
    };

    const panelObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveShot(entry.target.dataset.workPanel);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    panels.forEach((panel) => panelObserver.observe(panel));
  }

  /* ---------------------------------------------------------------------
     Hero: very subtle pointer parallax on pointer-precise devices
     --------------------------------------------------------------------- */

  const stage = document.querySelector("[data-parallax-stage]");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (stage && finePointer.matches && !reduceMotion.matches) {
    const layers = Array.from(stage.querySelectorAll("[data-parallax]"));
    let frame = null;

    const move = (event) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        const rect = stage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        layers.forEach((layer) => {
          const depth = Number(layer.dataset.parallax) || 1;
          layer.style.translate = `${(-x * depth * 6).toFixed(2)}px ${(-y * depth * 5).toFixed(2)}px`;
        });
      });
    };

    const reset = () => {
      layers.forEach((layer) => {
        layer.style.translate = "0px 0px";
      });
    };

    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerleave", reset);
    layers.forEach((layer) => {
      layer.style.transition = "translate 400ms var(--ease)";
    });
  }

  /* ---------------------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------------------- */

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
})();
