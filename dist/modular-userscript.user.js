// ==UserScript==
// @name         Modular Userscript
// @namespace    https://example.com/modular-userscript
// @version      1.0.0
// @description  A collection of JavaScript modules that can be individually toggled by the user.
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @author       equmaq
// @match        https://example.com/*
// @run-at       document-end
// ==/UserScript==

// src/modular-userscript/modules/example-function.js
var example_function_default = {
  key: "exampleFunctionEnabled",
  type: "function",
  title: "Example Function Module",
  description: "Marks the page when this example function module is enabled.",
  enabledByDefault: false,
  run({ document: document2 }) {
    document2.documentElement.dataset.exampleFunctionModule = "enabled";
  }
};

// src/modular-userscript/modules/example-style.js
var example_style_default = {
  key: "exampleStyleEnabled",
  type: "style",
  title: "Example Style Module",
  description: "Adds a reusable highlight class as a styling example.",
  enabledByDefault: false,
  run({ document: document2 }) {
    const style = document2.createElement("style");
    style.textContent = ".example-module-highlight { outline: 2px solid currentColor; }";
    document2.head.append(style);
  }
};

// src/modular-userscript/modules/index.js
var modules_default = [
  example_function_default,
  example_style_default
];

// src/modular-userscript/dialog-assets.js
var dialogHtml = '<form method="dialog" class="modular-userscript">\n  <div class="modular-userscript-body">\n    <header class="modular-userscript-header">\n      <p class="modular-userscript-intro">{{INTRO}}</p>\n      <h2>Modular Userscript</h2>\n      <p>Choose which modules should be active. Changes are saved immediately and applied upon reload.</p>\n    </header>\n    {{SECTIONS}}\n  </div>\n  <footer class="modular-userscript-footer">\n    <small>Open this menu again from the userscript manager menu.</small>\n    <button type="submit" value="apply" class="button--primary button">Apply</button>\n  </footer>\n</form>\n';
var dialogCss = ".modular-userscript-dialog {\n  --dialog-background: #ffffff;\n  --dialog-border: #d0d7de;\n  --dialog-text: #24292f;\n  --dialog-muted: #57606a;\n  --dialog-accent: #0969da;\n  --dialog-surface: #f6f8fa;\n  max-width: min(92vw, 800px);\n  width: fit-content;\n  border: 1px solid var(--dialog-border);\n  border-radius: 7px;\n  padding: 0;\n  overflow: hidden;\n  color: var(--dialog-text);\n  background: var(--dialog-background);\n  box-shadow: 0 16px 40px rgba(31, 35, 40, .18);\n}\n\n.modular-userscript-dialog::backdrop {\n  background: rgba(31, 35, 40, .32);\n}\n\n.modular-userscript {\n  font: 14px/1.45 system-ui, sans-serif;\n  color: var(--dialog-text);\n}\n\n.modular-userscript-body {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 14px;\n  padding: 18px;\n}\n\n.modular-userscript-header {\n  grid-column: 1 / -1;\n}\n\n.modular-userscript h2 {\n  margin: 0 0 4px;\n  color: var(--dialog-text);\n}\n\n.modular-userscript p {\n  margin: 4px 0;\n}\n\n.modular-userscript-intro {\n  color: var(--dialog-accent);\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: bold;\n}\n\n.modular-userscript-section {\n  display: grid;\n  gap: 10px;\n  align-content: start;\n}\n\n.modular-userscript-section h3 {\n  margin: 0;\n  color: var(--dialog-muted);\n  font-size: 12px;\n  text-transform: uppercase;\n}\n\n.modular-userscript-module {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  width: 340px;\n  padding: 12px 14px;\n  border: 1px solid var(--dialog-border);\n  border-radius: 8px;\n  background: var(--dialog-surface);\n}\n\n.modular-userscript-module span {\n  display: grid;\n  gap: 2px;\n}\n\n.modular-userscript-module small,\n.modular-userscript-footer small {\n  color: var(--dialog-muted);\n}\n\n.modular-userscript-footer {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 12px 16px;\n  border-top: 1px solid var(--dialog-border);\n  background: var(--dialog-surface);\n}\n\n.modular-userscript button {\n  border: 1px solid var(--dialog-accent);\n  border-radius: 6px;\n  padding: 6px 12px;\n  color: #ffffff;\n  background: var(--dialog-accent);\n  cursor: pointer;\n}\n\n@media (max-width: 860px) {\n  .modular-userscript-body {\n    grid-template-columns: 1fr;\n  }\n\n  .modular-userscript-module {\n    width: auto;\n  }\n}\n";

// src/modular-userscript/index.user.js
var SCRIPT_NAME = "Modular Userscript";
var VERSION = "1.0.0";
var STORAGE_PREFIX = "modular-userscript";
var STORAGE_KEYS = {
  lastSeenVersion: `${STORAGE_PREFIX}:last-seen-version`
};
var storage = {
  async get(key, fallback) {
    let get = null;
    if (typeof GM_getValue === "function") {
      get = (name, value2) => Promise.resolve(GM_getValue(name, value2));
    } else if (typeof GM !== "undefined" && typeof GM.getValue === "function") {
      get = GM.getValue.bind(GM);
    }
    if (get)
      return get(key, fallback);
    const value = localStorage.getItem(key);
    if (value === null)
      return fallback;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  async set(key, value) {
    let set = null;
    if (typeof GM_setValue === "function") {
      set = (name, storedValue) => Promise.resolve(GM_setValue(name, storedValue));
    } else if (typeof GM !== "undefined" && typeof GM.setValue === "function") {
      set = GM.setValue.bind(GM);
    }
    if (set)
      return set(key, value);
    localStorage.setItem(key, JSON.stringify(value));
  }
};
function getContext() {
  return {
    document,
    window,
    location
  };
}
async function loadModuleState() {
  return Object.fromEntries(await Promise.all(modules_default.map(async (module) => {
    const key = `${STORAGE_PREFIX}:${module.key}`;
    return [module.key, Boolean(await storage.get(key, module.enabledByDefault))];
  })));
}
function createDialog(state) {
  const existing = document.getElementById("modular-userscript-dialog");
  if (existing)
    return existing;
  const dialog = document.createElement("dialog");
  dialog.id = "modular-userscript-dialog";
  dialog.className = "modular-userscript-dialog";
  const style = document.createElement("style");
  style.textContent = dialogCss;
  document.head.append(style);
  const sections = ["function", "style"].map((type) => `
    <section class="modular-userscript-section">
      <h3>${type} modules</h3>
      ${modules_default.filter((module) => module.type === type).map((module) => `
        <label class="modular-userscript-module iconic iconic--checkbox">
          <input type="checkbox" name="${module.key}" ${state.values[module.key] ? "checked" : ""}>
          <i aria-hidden="true"></i>
          <span class="iconic-label modular-userscript-module-copy">
            <strong>${module.title}</strong>
            <span>${module.description}</span>
          </span>
        </label>
      `).join("")}
    </section>
  `).join("");
  let intro = "";
  if (state.mode === "update") {
    intro = `New Version: ${VERSION}!`;
  } else if (state.mode === "install") {
    intro = `Welcome to ${SCRIPT_NAME}!`;
  }
  dialog.innerHTML = dialogHtml.replace("{{INTRO}}", intro).replace("{{SECTIONS}}", sections);
  dialog.addEventListener("close", async () => {
    if (dialog.returnValue !== "apply")
      return;
    await Promise.all(modules_default.map(async (module) => {
      const enabled = dialog.querySelector(`[name="${module.key}"]`).checked;
      state.values[module.key] = enabled;
      await storage.set(`${STORAGE_PREFIX}:${module.key}`, enabled);
    }));
    await storage.set(STORAGE_KEYS.lastSeenVersion, VERSION);
    location.reload();
  });
  document.body.append(dialog);
  return dialog;
}
async function openDialog(force = false) {
  const lastSeenVersion = await storage.get(STORAGE_KEYS.lastSeenVersion, "");
  if (!force && lastSeenVersion === VERSION)
    return;
  const values = await loadModuleState();
  createDialog({
    values,
    mode: lastSeenVersion ? "update" : "install"
  }).showModal();
}
async function main() {
  const values = await loadModuleState();
  const context = getContext();
  modules_default.forEach((module) => {
    if (values[module.key])
      module.run(context);
  });
  let register = null;
  if (typeof GM_registerMenuCommand === "function") {
    register = GM_registerMenuCommand;
  } else if (typeof GM !== "undefined" && typeof GM.registerMenuCommand === "function") {
    register = GM.registerMenuCommand.bind(GM);
  }
  register?.(`${SCRIPT_NAME}: Open config`, () => void openDialog(true));
  await openDialog();
  await storage.set(STORAGE_KEYS.lastSeenVersion, VERSION);
}
void (() => main())();
