const MarketMindIndicators = (() => {
  const closes = (candles) =>
    candles.map((c) => Number(c.close)).filter(Number.isFinite);

  const volumes = (candles) =>
    candles.map((c) => Number(c.volume)).filter(Number.isFinite);

  const sma = (values, period) => {
    if (values.length < period) {
      return null;
    }

    const slice = values.slice(values.length - period);

    return slice.reduce((sum, value) => sum + value, 0) / period;
  };

  const ema = (values, period) => {
    if (values.length < period) {
      return null;
    }

    const multiplier = 2 / (period + 1);

    let average =
      values.slice(0, period).reduce((sum, value) => sum + value, 0) / period;

    for (let i = period; i < values.length; i++) {
      average = (values[i] - average) * multiplier + average;
    }

    return average;
  };

  const rsi = (values, period = 14) => {
    if (values.length <= period) {
      return null;
    }

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = values[i] - values[i - 1];

      if (change >= 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }

    let averageGain = gains / period;

    let averageLoss = losses / period;

    for (let i = period + 1; i < values.length; i++) {
      const change = values[i] - values[i - 1];

      const gain = Math.max(change, 0);

      const loss = Math.max(-change, 0);

      averageGain = (averageGain * (period - 1) + gain) / period;

      averageLoss = (averageLoss * (period - 1) + loss) / period;
    }

    if (averageLoss === 0) {
      return 100;
    }

    const rs = averageGain / averageLoss;

    return 100 - 100 / (1 + rs);
  };

  const calculate = (candles = []) => {
    const values = closes(candles);

    const volumeValues = volumes(candles);

    if (!values.length) {
      return {
        currentPrice: null,
        rsi: null,
        sma20: null,
        sma50: null,
        ema12: null,
        ema26: null,
        macd: null,
        momentum: null,
        volume: null,
        volumeAverage: null,
        volumeRatio: null,
      };
    }

    const currentPrice = values[values.length - 1];

    const previousPrice =
      values.length > 1 ? values[values.length - 2] : currentPrice;

    const momentum =
      previousPrice !== 0
        ? ((currentPrice - previousPrice) / previousPrice) * 100
        : 0;

    const sma20Value = sma(values, 20);

    const sma50Value = sma(values, 50);

    const ema12Value = ema(values, 12);

    const ema26Value = ema(values, 26);

    const macd =
      ema12Value !== null && ema26Value !== null
        ? ema12Value - ema26Value
        : null;

    const volumeAverage =
      volumeValues.length >= 20 ? sma(volumeValues, 20) : null;

    const currentVolume = volumeValues.length
      ? volumeValues[volumeValues.length - 1]
      : null;

    const volumeRatio =
      currentVolume !== null && volumeAverage
        ? currentVolume / volumeAverage
        : null;

    return {
      currentPrice,
      rsi: rsi(values),
      sma20: sma20Value,
      sma50: sma50Value,
      ema12: ema12Value,
      ema26: ema26Value,
      macd,
      momentum,
      volume: currentVolume,
      volumeAverage,
      volumeRatio,
    };
  };

  return {
    calculate,
  };
})();
