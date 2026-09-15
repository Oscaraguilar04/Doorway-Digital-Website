/**
 * Conversion hook. No third-party pixels.
 * Listeners may subscribe to `acre:track`.
 */

const EVENT = "acre:track";

export function track(name, href = "") {
  document.dispatchEvent(
    new CustomEvent(EVENT, {
      detail: { name, href },
    })
  );
}

export function bindTracking(root = document) {
  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-track]");
    if (!target) return;
    track(target.getAttribute("data-track") || "", target.getAttribute("href") || "");
  });
}
