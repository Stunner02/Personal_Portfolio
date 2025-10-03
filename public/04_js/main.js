import { setupGlobals } from '../04_js/engine/bootstrap.js';

const page = (
  document.body?.dataset.page ||
  document.documentElement.dataset.page ||
  ''
).trim().toLowerCase();
console.log(page);

const shellMap = {  // Have shell map called from data if pages > six.
  // home:       () => import('../04_js/pages/home.shell.js'),
  projects:   () => import('../04_js/pages/projects.shell.js'),
  // resume:     () => import('../04_js/pages/resume.shell.js'),
  sma:        () => import('../04_js/pages/sma.shell.js')
};

(async () => {
  await setupGlobals(); // Set up globals from bootstrap

  // Connect page key to shellMap to find import link
  const loadShell = shellMap[page];
  if (!loadShell) { // Error check shell page loading
    console.error(`[main] Unknown page "${page}"`);
    return;
  }

  const mod = await loadShell();
  if (typeof mod.startPage !== 'function') {  // Error check if shell can start its program
    console.error(`[main] "${page}.shell.js" missing startPage() export`);
    return;
  }

  await mod.startPage({pageKey: page}); // shell loads manifest + calls engine
})();
