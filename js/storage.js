export function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

export function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

export function safeStorageRemove(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

export function parseStoredJson(key) {
  var raw = safeStorageGet(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    safeStorageRemove(key);
    return null;
  }
}

export function createPersistenceScheduler(options) {
  var delay = options && typeof options.delay === "number" ? options.delay : 500;
  var save = options && typeof options.save === "function" ? options.save : function () {
    return false;
  };
  var timerId = null;
  var dirty = false;

  function clearTimer() {
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  }

  function flushMatchSave(flushOptions) {
    var shouldForce = Boolean(flushOptions && flushOptions.immediate);
    var shouldSave = dirty || shouldForce;

    clearTimer();
    if (!shouldSave) {
      return false;
    }
    dirty = false;
    return Boolean(save(flushOptions || {}));
  }

  function markMatchDirty() {
    dirty = true;
    clearTimer();
    timerId = window.setTimeout(function () {
      timerId = null;
      flushMatchSave();
    }, delay);
  }

  function discardPendingSave() {
    dirty = false;
    clearTimer();
  }

  return {
    markMatchDirty: markMatchDirty,
    flushMatchSave: flushMatchSave,
    discardPendingSave: discardPendingSave
  };
}
