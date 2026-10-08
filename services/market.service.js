const MarketMindMarketService = (() => {
  const symbolMap = {
    RELIANCE: "RELIANCE.BSE",
    TCS: "TCS.BSE",
    INFY: "INFY.BSE",
    HDFCBANK: "HDFCBANK.BSE",
    ICICIBANK: "ICICIBANK.BSE",
    ITC: "ITC.BSE",

    AAPL: "AAPL",
    APPLE: "AAPL",
    TSLA: "TSLA",
    TESLA: "TSLA",
    MSFT: "MSFT",
    MICROSOFT: "MSFT",
    GOOGL: "GOOGL",
    GOOGLE: "GOOGL",
    AMZN: "AMZN",
    AMAZON: "AMZN",
    NVDA: "NVDA",
    NVIDIA: "NVDA",
    META: "META",
    FACEBOOK: "META",
  };

  const cache = new Map();

  const CACHE_TIME = 10 * 60 * 1000;

  const normalizeSymbol = (symbol) => {
    const value = String(symbol || "")
      .trim()
      .toUpperCase();

    if (!value) {
      throw new Error("Stock symbol is required.");
    }

    return symbolMap[value] || value;
  };

  const request = async (symbol, options = {}) => {
    const normalized = normalizeSymbol(symbol);
    const forceRefresh = Boolean(options.forceRefresh);

    const cached = cache.get(normalized);

    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TIME) {
      return cached.data;
    }

    if (!window.MarketMindSupabase) {
      throw new Error("Supabase is not initialized.");
    }

    const { data, error } = await window.MarketMindSupabase.functions.invoke(
      "market-data",
      {
        body: {
          symbol: normalized,
        },
      },
    );

    if (error) {
      if (error.status === 429) {
        throw new Error(
          "Market data provider rate limit reached. Please try again later.",
        );
      }

      throw new Error(error.message || "Market data request failed.");
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    if (!Array.isArray(data?.data) || !data.data.length) {
      throw new Error("No market data was returned.");
    }

    cache.set(normalized, {
      timestamp: Date.now(),
      data,
    });

    return data;
  };

  const getDailyHistory = async (symbol) => {
    const data = await request(symbol);

    const candles = data.data;

    return {
      symbol: data.symbol,
      candles,
      latest: data.latest ?? candles[candles.length - 1],
      previous:
        data.previous ??
        (candles.length > 1 ? candles[candles.length - 2] : null),
      source: data.source || "Alpha Vantage",
      freshness: data.freshness || "daily",
    };
  };

  const getQuote = async (symbol) => {
    const history = await getDailyHistory(symbol);

    const latest = history.latest;
    const previous = history.previous;

    if (!latest) {
      throw new Error("No latest market price available.");
    }

    const price = Number(latest.close);

    const previousClose = Number(previous?.close ?? price);

    const change = price - previousClose;

    const changePercent =
      previousClose !== 0 ? (change / previousClose) * 100 : 0;

    return {
      symbol: history.symbol,
      price,
      change,
      changePercent,
      volume: Number(latest.volume || 0),
      previousClose,
      source: history.source,
    };
  };

  const search = async (keywords) => {
    const query = String(keywords || "")
      .trim()
      .toUpperCase();

    if (!query) {
      return [];
    }

    return Object.entries(symbolMap)
      .filter(([name]) => name.includes(query))
      .map(([name, symbol]) => ({
        symbol,
        name,
        type: "Equity",
        region: "India",
        currency: "INR",
      }));
  };

  const clearCache = () => {
    cache.clear();
  };

  return {
    normalizeSymbol,
    getDailyHistory,
    getQuote,
    search,
    clearCache,
  };
})();
