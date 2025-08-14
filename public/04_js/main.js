import { setupGlobals } from './bootstrap.js';

const page = document.documentElement.dataset.page; // "home", "projects", "resume"

const shellMap = {
  home:      () => import('./pages/home.shell.js'),
  projects:  () => import('./pages/projects.shell.js'),
  resume:    () => import('./pages/resume.shell.js'),
};

(async () => {
  await setupGlobals();

  const loadShell = shellMap[page];
  if (!loadShell) {
    console.error(`[main] Unknown page "${page}"`);
    return;
  }

  const mod = await loadShell();
  if (typeof mod.startPage !== 'function') {
    console.error(`[main] "${page}.shell.js" missing startPage() export`);
    return;
  }

  await mod.startPage(); // shell loads manifest + calls engine
})();
