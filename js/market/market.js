const MarketMindMarket = (() => {
  let current = {
    symbol: "RELIANCE.BSE",
    name: "RELIANCE INDUSTRIES",
    exchange: "BSE",
  };

  const aliases = {
    RELIANCE: {
      symbol: "RELIANCE.BSE",
      name: "RELIANCE INDUSTRIES",
      exchange: "BSE",
    },

    TCS: {
      symbol: "TCS.BSE",
      name: "TATA CONSULTANCY SERVICES",
      exchange: "BSE",
    },

    INFY: {
      symbol: "INFY.BSE",
      name: "INFOSYS",
      exchange: "BSE",
    },

    HDFCBANK: {
      symbol: "HDFCBANK.BSE",
      name: "HDFC BANK",
      exchange: "BSE",
    },

    ICICIBANK: {
      symbol: "ICICIBANK.BSE",
      name: "ICICI BANK",
      exchange: "BSE",
    },

    ITC: {
      symbol: "ITC.BSE",
      name: "ITC",
      exchange: "BSE",
    },

    AAPL: {
      symbol: "AAPL",
      name: "APPLE INC.",
      exchange: "NASDAQ",
    },

    APPLE: {
      symbol: "AAPL",
      name: "APPLE INC.",
      exchange: "NASDAQ",
    },

    TSLA: {
      symbol: "TSLA",
      name: "TESLA INC.",
      exchange: "NASDAQ",
    },

    TESLA: {
      symbol: "TSLA",
      name: "TESLA INC.",
      exchange: "NASDAQ",
    },

    MSFT: {
      symbol: "MSFT",
      name: "MICROSOFT CORPORATION",
      exchange: "NASDAQ",
    },

    MICROSOFT: {
      symbol: "MSFT",
      name: "MICROSOFT CORPORATION",
      exchange: "NASDAQ",
    },

    GOOGL: {
      symbol: "GOOGL",
      name: "ALPHABET INC.",
      exchange: "NASDAQ",
    },

    GOOGLE: {
      symbol: "GOOGL",
      name: "ALPHABET INC.",
      exchange: "NASDAQ",
    },

    AMZN: {
      symbol: "AMZN",
      name: "AMAZON.COM INC.",
      exchange: "NASDAQ",
    },

    AMAZON: {
      symbol: "AMZN",
      name: "AMAZON.COM INC.",
      exchange: "NASDAQ",
    },

    NVDA: {
      symbol: "NVDA",
      name: "NVIDIA CORPORATION",
      exchange: "NASDAQ",
    },

    NVIDIA: {
      symbol: "NVDA",
      name: "NVIDIA CORPORATION",
      exchange: "NASDAQ",
    },

    META: {
      symbol: "META",
      name: "META PLATFORMS INC.",
      exchange: "NASDAQ",
    },

    FACEBOOK: {
      symbol: "META",
      name: "META PLATFORMS INC.",
      exchange: "NASDAQ",
    },
  };

  const resolve = (value) => {
    const key = String(value || "")
      .trim()
      .toUpperCase();

    if (!key) {
      return { ...current };
    }

    if (aliases[key]) {
      return { ...aliases[key] };
    }

    return {
      symbol: key,
      name: key,
      exchange: "MARKET",
    };
  };

  const setCurrent = (value) => {
    current = resolve(value);
    return { ...current };
  };

  const getCurrent = () => ({
    ...current,
  });

  return {
    resolve,
    setCurrent,
    getCurrent,
  };
})();
