const STORAGE_KEY = 'dunk_mobile_state_v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore write errors in private/incognito environments
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
