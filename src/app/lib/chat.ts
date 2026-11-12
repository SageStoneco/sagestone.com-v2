import { TIDIO_KEY } from "./env";

let loaded = false;

/** Loads the Tidio chat widget after the page is idle, if VITE_TIDIO_KEY is set. */
export function loadChat() {
  if (loaded || !TIDIO_KEY || typeof window === "undefined") return;
  loaded = true;
  const go = () => {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://code.tidio.co/${TIDIO_KEY}.js`;
    document.body.appendChild(s);
  };
  if ("requestIdleCallback" in window) (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(go);
  else setTimeout(go, 2500);
}
