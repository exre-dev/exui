import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App"

const root = document.getElementById("root")!
if (root.dataset.shareRoute) {
  history.replaceState(null, "", `${import.meta.env.BASE_URL}${root.dataset.shareRoute}`)
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
