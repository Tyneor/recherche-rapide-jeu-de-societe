import { storage } from "../storage";
import Popup from "../popup/Popup.svelte";

// Side panel
// https://developer.chrome.com/docs/extensions/reference/sidePanel/

function render() {
  const target = document.getElementById("app");

  if (target) {
    storage.get().then(({ history }) => {
      new Popup({
        target,
        props: { history },
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", render);
