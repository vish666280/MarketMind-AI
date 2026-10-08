window.MarketMindApp = {
  name: "MarketMind AI",
  version: "1.0.0",

  initialize() {
    document.documentElement.dataset.appReady = "true";
  },
};

document.addEventListener("DOMContentLoaded", () => {
  MarketMindApp.initialize();
});
