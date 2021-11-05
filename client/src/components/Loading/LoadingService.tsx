const LoadingService = {
  loadingFunction: (() => {}) as (text: string) => void,
  unloadingFunction: (() => {}) as () => void,
  list: new Map(),

  register(loading: (text: string) => void, unloading: () => void) {
    this.loadingFunction = loading;
    this.unloadingFunction = unloading;
  },

  unregister() {
    this.loadingFunction = () => {};
    this.unloadingFunction = () => {};
  },

  add(text: string = '') {
    const key = (Math.random().toString(36) + Date.now().toString(36)).substr(2, 10);
    this.list.set(key, true);
    this.loadingFunction(text);
    return key;
  },

  remove(key: string) {
    this.list.delete(key);
    if (this.list.size < 1) {
      this.unloadingFunction();
    }
  },

  removeAll() {
    console.log('Panicked and cleared Loader(s):', this.list);
    this.list.clear();
    this.unloadingFunction();
  },

  setText(text: string) {
    if (this.list.size < 1) {
      console.warn('Loading text was set to ' + text + ' but nothing is loading.');
    }
    this.loadingFunction(text);
    return this.list.size > 0;
  },
};

export default LoadingService;
