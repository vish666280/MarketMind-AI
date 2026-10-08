const MarketMindStorage = {
  set(key, value) {
    localStorage.setItem(`marketmind_${key}`, JSON.stringify(value));
  },

  get(key, fallback = null) {
    const value = localStorage.getItem(`marketmind_${key}`);

    if (value === null) {
      return fallback;
    }

    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  },

  remove(key) {
    localStorage.removeItem(`marketmind_${key}`);
  },
};
