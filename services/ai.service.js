const MarketMindAIService = (() => {
  const cache = new Map();

  const CACHE_TIME = 15 * 60 * 1000;

  const createCacheKey = (symbol, indicators, prediction) => {
    return JSON.stringify({
      symbol,

      rsi: Number(indicators?.rsi ?? 0).toFixed(2),

      macd: Number(indicators?.macd ?? 0).toFixed(2),

      momentum: Number(indicators?.momentum ?? 0).toFixed(2),

      volumeRatio: Number(indicators?.volumeRatio ?? 0).toFixed(2),

      signal: prediction?.signal || "",

      score: prediction?.score ?? 0,
    });
  };

  const analyze = async ({ symbol, indicators = {}, prediction = {} }) => {
    const key = createCacheKey(symbol, indicators, prediction);

    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
      return cached.data;
    }

    if (!window.MarketMindSupabase) {
      throw new Error("Supabase is not initialized.");
    }

    try {
      const { data, error } = await window.MarketMindSupabase.functions.invoke(
        "ai-analysis",
        {
          body: {
            symbol,
            indicators,
            prediction,
          },
        },
      );

      if (error) {
        if (error.status === 429) {
          throw new Error("AI rate limit reached.");
        }

        throw new Error(error.message || "AI analysis failed.");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.text) {
        throw new Error("AI returned no analysis.");
      }

      const result = {
        text: data.text,
      };

      cache.set(key, {
        timestamp: Date.now(),
        data: result,
      });

      return result;
    } catch (error) {
      console.warn("MarketMind AI:", error);

      return {
        text: createFallbackAnalysis(indicators, prediction),
        fallback: true,
      };
    }
  };

  const createFallbackAnalysis = (indicators = {}, prediction = {}) => {
    const signal = prediction?.signal || "NEUTRAL";

    const momentum = Number(indicators?.momentum ?? 0);

    const rsi = Number(indicators?.rsi ?? 50);

    const volumeRatio = Number(indicators?.volumeRatio ?? 1);

    let trendText = "The current technical mix is balanced.";

    if (signal === "BULLISH") {
      trendText =
        "The current technical mix is showing a positive directional bias.";
    }

    if (signal === "BEARISH") {
      trendText =
        "The current technical mix is showing a negative directional bias.";
    }

    const momentumText =
      momentum > 0
        ? "Recent price momentum is positive."
        : momentum < 0
          ? "Recent price momentum is negative."
          : "Recent price momentum is relatively stable.";

    const rsiText =
      rsi >= 70
        ? "RSI is elevated."
        : rsi <= 30
          ? "RSI is in an oversold range."
          : "RSI is in a relatively neutral range.";

    const volumeText =
      volumeRatio > 1
        ? "Trading volume is above its recent average."
        : "Trading volume is around or below its recent average.";

    return `${trendText} ${momentumText} ${rsiText} ${volumeText} This is an analytical signal, not a guaranteed outcome.`;
  };

  const clearCache = () => {
    cache.clear();
  };

  return {
    analyze,
    clearCache,
  };
})();
