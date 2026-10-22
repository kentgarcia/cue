import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { loadPresentationFonts } from "./presentation/fonts";
import "./styles/index.css";

const root = createRoot(document.getElementById("root")!);

async function startPresentation() {
  root.render(
    <div className="font-loading" role="status">
      Opening your next chapter…
    </div>,
  );
  try {
    await loadPresentationFonts();
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch {
    root.render(
      <div className="font-loading" role="alert">
        <p>The presentation font couldn’t load.</p>
        <button onClick={() => void startPresentation()}>Try again</button>
      </div>,
    );
  }
}

void startPresentation();
