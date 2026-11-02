import { defineUserScript } from 'bundlemonkey';
import modules from './modules/index.js';
import { dialogHtml, dialogCss } from './dialog-assets.js';

const SCRIPT_NAME = 'Modular Userscript';
const VERSION = '1.0.0';
const STORAGE_PREFIX = 'modular-userscript';
const STORAGE_KEYS = {
  lastSeenVersion: `${STORAGE_PREFIX}:last-seen-version`,
};

const storage = {
  async get(key, fallback) {
    let get = null;
    if (typeof GM_getValue === 'function') {
      get = (name, value) => Promise.resolve(GM_getValue(name, value));
    } else if (typeof GM !== 'undefined' && typeof GM.getValue === 'function') {
      get = GM.getValue.bind(GM);
    }
    if (get) return get(key, fallback);
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    try { return JSON.parse(value); } catch { return value; }
  },
  async set(key, value) {
    let set = null;
    if (typeof GM_setValue === 'function') {
      set = (name, storedValue) => Promise.resolve(GM_setValue(name, storedValue));
    } else if (typeof GM !== 'undefined' && typeof GM.setValue === 'function') {
      set = GM.setValue.bind(GM);
    }
    if (set) return set(key, value);
    localStorage.setItem(key, JSON.stringify(value));
  },
};

function getContext() {
  return {
    document,
    window,
    location,
  };
}

async function loadModuleState() {
  return Object.fromEntries(await Promise.all(modules.map(async module => {
    const key = `${STORAGE_PREFIX}:${module.key}`;
    return [module.key, Boolean(await storage.get(key, module.enabledByDefault))];
  })));
}

function createDialog(state) {
  const existing = document.getElementById('modular-userscript-dialog');
  if (existing) return existing;

  const dialog = document.createElement('dialog');
  dialog.id = 'modular-userscript-dialog';
  dialog.className = 'modular-userscript-dialog';
  const style = document.createElement('style');
  style.textContent = dialogCss;
  document.head.append(style);

  const sections = ['function', 'style'].map(type => `
    <section class="modular-userscript-section">
      <h3>${type} modules</h3>
      ${modules.filter(module => module.type === type).map(module => `
        <label class="modular-userscript-module iconic iconic--checkbox">
          <input type="checkbox" name="${module.key}" ${state.values[module.key] ? 'checked' : ''}>
          <i aria-hidden="true"></i>
          <span class="iconic-label modular-userscript-module-copy">
            <strong>${module.title}</strong>
            <span>${module.description}</span>
          </span>
        </label>
      `).join('')}
    </section>
  `).join('');

  let intro = '';
  if (state.mode === 'update') {
    intro = `New Version: ${VERSION}!`;
  } else if (state.mode === 'install') {
    intro = `Welcome to ${SCRIPT_NAME}!`;
  }
  dialog.innerHTML = dialogHtml
    .replace('{{INTRO}}', intro)
    .replace('{{SECTIONS}}', sections);
  dialog.addEventListener('close', async () => {
    if (dialog.returnValue !== 'apply') return;
    await Promise.all(modules.map(async module => {
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
  const lastSeenVersion = await storage.get(STORAGE_KEYS.lastSeenVersion, '');
  if (!force && lastSeenVersion === VERSION) return;
  const values = await loadModuleState();
  createDialog({
    values,
    mode: lastSeenVersion ? 'update' : 'install',
  }).showModal();
}

async function main() {
  const values = await loadModuleState();
  const context = getContext();
  modules.forEach(module => {
    if (values[module.key]) module.run(context);
  });

  let register = null;
  if (typeof GM_registerMenuCommand === 'function') {
    register = GM_registerMenuCommand;
  } else if (typeof GM !== 'undefined' && typeof GM.registerMenuCommand === 'function') {
    register = GM.registerMenuCommand.bind(GM);
  }
  register?.(`${SCRIPT_NAME}: Open config`, () => void openDialog(true));
  await openDialog();
  await storage.set(STORAGE_KEYS.lastSeenVersion, VERSION);
}

export default defineUserScript({
  name: SCRIPT_NAME,
  namespace: 'https://example.com/modular-userscript',
  version: VERSION,
  description: 'A collection of JavaScript modules that can be individually toggled by the user.',
  author: 'equmaq',
  match: ['https://example.com/*'],
  runAt: 'document-end',
  grant: ['GM_getValue', 'GM_setValue', 'GM_registerMenuCommand', 'GM.getValue', 'GM.setValue', 'GM.registerMenuCommand'],
  main: () => main(),
});
