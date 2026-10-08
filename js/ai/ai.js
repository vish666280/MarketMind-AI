const MarketMindAI = (() => {
  const analyze = async (signals = {}) => {
    if (typeof MarketMindAIService === "undefined") {
      return {
        text: "AI service is currently unavailable.",
        fallback: true,
      };
    }

    return MarketMindAIService.analyze(signals);
  };

  return {
    analyze,
  };
})();
