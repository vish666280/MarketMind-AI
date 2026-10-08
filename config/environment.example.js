window.MARKETMIND_CONFIG = {
  supabase: {
    url: "YOUR_SUPABASE_PROJECT_URL",
    publishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
  },

  market: {
    provider: "alphavantage",
    apiKey: "YOUR_ALPHA_VANTAGE_KEY",
    baseUrl: "https://www.alphavantage.co/query",
  },

  ai: {
    enabled: false,
    endpoint: "",
    model: "gemini",
  },

  app: {
    name: "MarketMind AI",
    version: "1.0.0",
    defaultSymbol: "RELIANCE.BSE",
    defaultExchange: "BSE",
  },
};
