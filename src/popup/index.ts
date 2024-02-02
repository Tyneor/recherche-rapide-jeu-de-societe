import Popup from "./Popup.svelte";
import { storage } from "../storage";

// Action popup
// https://developer.chrome.com/docs/extensions/reference/action/

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
