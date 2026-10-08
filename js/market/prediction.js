const MarketMindPrediction = (() => {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const classify = (score) => {
    if (score >= 65) return "BULLISH";
    if (score <= 35) return "BEARISH";
    return "NEUTRAL";
  };

  const calculate = (indicators = {}) => {
    let score = 50;
    const factors = [];

    const { currentPrice, sma20, sma50, rsi, macd, momentum, volumeRatio } =
      indicators;

    if (currentPrice !== null && currentPrice !== undefined && sma20 !== null) {
      if (currentPrice > sma20) {
        score += 8;
        factors.push("Price is above the 20-period moving average.");
      } else {
        score -= 8;
        factors.push("Price is below the 20-period moving average.");
      }
    }

    if (currentPrice !== null && currentPrice !== undefined && sma50 !== null) {
      if (currentPrice > sma50) {
        score += 10;
        factors.push("Price is above the 50-period moving average.");
      } else {
        score -= 10;
        factors.push("Price is below the 50-period moving average.");
      }
    }

    if (rsi !== null && rsi !== undefined) {
      if (rsi >= 55 && rsi < 70) {
        score += 8;
        factors.push(
          "RSI indicates positive momentum without an extreme reading.",
        );
      } else if (rsi >= 70) {
        score -= 4;
        factors.push("RSI is elevated and indicates stronger momentum risk.");
      } else if (rsi < 30) {
        score += 4;
        factors.push("RSI is deeply oversold.");
      } else if (rsi < 45) {
        score -= 7;
        factors.push("RSI indicates weaker momentum.");
      } else {
        factors.push("RSI is in a relatively neutral range.");
      }
    }

    if (macd !== null && macd !== undefined) {
      if (macd > 0) {
        score += 8;
        factors.push("MACD is positive.");
      } else if (macd < 0) {
        score -= 8;
        factors.push("MACD is negative.");
      } else {
        factors.push("MACD is around the neutral level.");
      }
    }

    if (momentum !== null && momentum !== undefined) {
      if (momentum > 2) {
        score += 8;
        factors.push("Recent price momentum is positive.");
      } else if (momentum < -2) {
        score -= 8;
        factors.push("Recent price momentum is negative.");
      } else {
        factors.push("Recent price momentum is relatively stable.");
      }
    }

    if (volumeRatio !== null && volumeRatio !== undefined) {
      if (volumeRatio > 1.2) {
        score += 4;
        factors.push("Recent volume is above its short-term average.");
      } else if (volumeRatio < 0.8) {
        score -= 2;
        factors.push("Recent volume is below its short-term average.");
      } else {
        factors.push("Recent volume is close to its short-term average.");
      }
    }

    score = clamp(Math.round(score), 0, 100);

    const signal = classify(score);

    const confidence = Math.round(
      Math.min(95, 50 + Math.abs(score - 50) * 0.9),
    );

    return {
      score,
      signal,
      confidence,
      horizon: "5 trading sessions",
      factors,
    };
  };

  const explanation = (prediction = {}) => {
    if (prediction.signal === "BULLISH") {
      return "The current technical mix is moderately bullish, with support from the available trend and momentum signals.";
    }

    if (prediction.signal === "BEARISH") {
      return "The current technical mix is moderately bearish, with weaker trend and momentum signals affecting the model score.";
    }

    return "The current technical mix is balanced, so the model does not identify a strong directional advantage.";
  };

  return {
    classify,
    calculate,
    explanation,
  };
})();
