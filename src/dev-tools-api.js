import deepDiff from "deep-diff";

export class DevToolsAPI {
  constructor() {
    this.containers = new Map();
    this.listeners = {
      registerContainer: [],
      stateChange: []
    };
  }

  on(event, cb) {
    this.listeners[event].push(cb);
  }

  off(event, cb) {
    this.listeners[event] = this.listeners[event].filter(c => c !== cb);
  }

  registerContainer({ container, name, state }) {
    if (this.containers.has(container)) return;

    const meta = {
      name: container.name,
      state,
      history: []
    };

    this.containers.set(container, meta);
    this.onRegisterContainer({ container: meta, timestamp: Date.now() });
  }

  stateChange({ container, oldState, change, newState }) {
    const meta = this.containers.get(container);
    const diff = deepDiff(oldState, newState);
    const newMeta = Object.assign({}, meta, { state: newState });

    this.containers.set(container, newMeta);

    this.onStateChange({
      container: newMeta,
      timestamp: Date.now(),

      oldState,
      change,
      newState,
      diff
    });
  }

  onRegisterContainer(meta) {
    this.listeners.registerContainer.forEach(cb => cb(meta));
  }

  onStateChange(meta) {
    this.listeners.stateChange.forEach(cb => cb(meta));
  }
}
