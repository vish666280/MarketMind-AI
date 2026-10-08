const MarketMindAnalysisPage = (() => {
  let currentStock = null;
  let currentHistory = null;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const getCurrency = (stock) => {
    const exchange = String(stock?.exchange || "").toUpperCase();

    return ["NASDAQ", "NYSE", "AMEX"].includes(exchange) ? "USD" : "INR";
  };

  const currencySymbol = (currency) => (currency === "USD" ? "$" : "₹");

  const formatPrice = (value, currency) => {
    if (!Number.isFinite(Number(value))) {
      return "—";
    }

    return Number(value).toLocaleString(
      currency === "USD" ? "en-US" : "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );
  };

  const formatPercent = (value) => {
    if (!Number.isFinite(Number(value))) {
      return "—";
    }

    const number = Number(value);

    return `${number >= 0 ? "+" : ""}${number.toFixed(2)}%`;
  };

  const resolveStock = (value) => {
    return MarketMindMarket.setCurrent(value);
  };

  const updateHeader = (stock) => {
    const title = $("#chartTitle");
    const symbol = $("#chartSymbol");
    const exchange = $("#chartExchange");

    if (title) {
      title.textContent = stock.name;
    }

    if (symbol) {
      symbol.textContent = stock.symbol;
    }

    if (exchange) {
      exchange.textContent = stock.exchange;
    }
  };

  const updatePrice = (history, stock) => {
    const latest = history?.latest;
    const previous = history?.previous;

    if (!latest) {
      const price = $("#chartPrice");

      if (price) {
        price.textContent = "—";
      }

      return;
    }

    const currency = getCurrency(stock);
    const symbol = currencySymbol(currency);

    const price = Number(latest.close);
    const previousClose = Number(previous?.close ?? price);

    const change = price - previousClose;

    const changePercent =
      previousClose !== 0 ? (change / previousClose) * 100 : 0;

    const priceElement = $("#chartPrice");
    const changeElement = $("#chartChange");
    const updatedElement = $("#chartUpdated");

    if (priceElement) {
      priceElement.textContent = `${symbol}${formatPrice(price, currency)}`;
    }

    if (changeElement) {
      const changeSign = change >= 0 ? "+" : "-";

      changeElement.textContent = `${changeSign}${symbol}${formatPrice(
        Math.abs(change),
        currency,
      )} (${formatPercent(changePercent)})`;

      changeElement.classList.remove("positive", "negative");

      changeElement.classList.add(change >= 0 ? "positive" : "negative");
    }

    if (updatedElement) {
      updatedElement.textContent = `Updated ${latest.date} · Daily data`;
    }
  };

  const updateIndicators = (indicators, stock) => {
    const currency = getCurrency(stock);
    const symbol = currencySymbol(currency);

    const rsi = $("#rsiValue");
    const macd = $("#macdValue");
    const sma50 = $("#sma50Value");
    const volume = $("#volumeValue");

    const rsiSignal = $("#rsiSignal");
    const macdSignal = $("#macdSignal");
    const sma50Signal = $("#sma50Signal");
    const volumeSignal = $("#volumeSignal");

    if (rsi) {
      rsi.textContent = Number.isFinite(indicators?.rsi)
        ? indicators.rsi.toFixed(1)
        : "—";
    }

    if (rsiSignal) {
      const value = indicators?.rsi;

      rsiSignal.textContent = !Number.isFinite(value)
        ? "—"
        : value >= 70
          ? "High"
          : value <= 30
            ? "Low"
            : "Neutral";
    }

    if (macd) {
      macd.textContent = Number.isFinite(indicators?.macd)
        ? indicators.macd.toFixed(2)
        : "—";
    }

    if (macdSignal) {
      const value = indicators?.macd;

      macdSignal.textContent = !Number.isFinite(value)
        ? "—"
        : value > 0
          ? "Bullish"
          : value < 0
            ? "Bearish"
            : "Neutral";
    }

    if (sma50) {
      sma50.textContent = Number.isFinite(indicators?.sma50)
        ? `${symbol}${formatPrice(indicators.sma50, currency)}`
        : "—";
    }

    if (sma50Signal) {
      const price = indicators?.currentPrice;
      const average = indicators?.sma50;

      sma50Signal.textContent =
        !Number.isFinite(average) || !Number.isFinite(price)
          ? "—"
          : price > average
            ? "Above"
            : price < average
              ? "Below"
              : "At";
    }

    if (volume) {
      volume.textContent = Number.isFinite(indicators?.volumeRatio)
        ? `${indicators.volumeRatio.toFixed(2)}×`
        : "—";
    }

    if (volumeSignal) {
      const ratio = indicators?.volumeRatio;

      volumeSignal.textContent = !Number.isFinite(ratio)
        ? "—"
        : ratio > 1.2
          ? "Strong"
          : "Normal";
    }
  };

  const updatePrediction = (prediction) => {
    if (!prediction) {
      return;
    }

    const signal = $("#predictionSignal");
    const confidence = $("#predictionConfidence");
    const confidenceBar = $("#predictionConfidenceBar");
    const horizon = $("#predictionHorizon");
    const trend = $("#predictionTrend");
    const quality = $("#predictionQuality");
    const score = $("#predictionScore");
    const status = $("#predictionStatus");

    if (signal) {
      signal.textContent = prediction.signal;

      signal.classList.remove("positive", "negative", "neutral");

      signal.classList.add(
        prediction.signal === "BULLISH"
          ? "positive"
          : prediction.signal === "BEARISH"
            ? "negative"
            : "neutral",
      );
    }

    if (confidence) {
      confidence.textContent = `${Math.round(Number(prediction.confidence) || 0)}%`;
    }

    if (confidenceBar) {
      const value = Math.max(
        0,
        Math.min(100, Number(prediction.confidence) || 0),
      );

      confidenceBar.style.width = `${value}%`;
    }

    if (horizon) {
      horizon.textContent = prediction.horizon || "5 trading sessions";
    }

    if (trend) {
      trend.textContent =
        prediction.signal === "BULLISH"
          ? "Positive"
          : prediction.signal === "BEARISH"
            ? "Negative"
            : "Neutral";
    }

    if (quality) {
      const confidenceValue = Number(prediction.confidence) || 0;

      quality.textContent =
        confidenceValue >= 75
          ? "Strong"
          : confidenceValue >= 60
            ? "Moderate"
            : "Limited";
    }

    if (score) {
      score.textContent = `${Number(prediction.score) || 0}/100`;
    }

    if (status) {
      status.textContent = "ANALYZED";
    }
  };

  const updateSentiment = (indicators, prediction) => {
    if (!prediction) {
      return;
    }

    const score = $("#sentimentScore");
    const indicator = $("#sentimentIndicator");
    const momentum = $("#sentimentMomentum");
    const volatility = $("#sentimentVolatility");
    const volume = $("#sentimentVolume");

    const predictionScore = Math.max(
      0,
      Math.min(100, Number(prediction.score) || 0),
    );

    if (score) {
      score.textContent = predictionScore;
    }

    if (indicator) {
      indicator.style.left = `${predictionScore}%`;
    }

    if (momentum) {
      const value = Number(indicators?.momentum);

      momentum.textContent = !Number.isFinite(value)
        ? "Neutral"
        : value > 0
          ? "Positive"
          : value < 0
            ? "Negative"
            : "Neutral";
    }

    if (volatility) {
      const rsi = Number(indicators?.rsi);

      volatility.textContent =
        Number.isFinite(rsi) && (rsi > 70 || rsi < 30) ? "High" : "Normal";
    }

    if (volume) {
      const ratio = Number(indicators?.volumeRatio);

      volume.textContent = !Number.isFinite(ratio)
        ? "—"
        : ratio > 1
          ? "Above avg."
          : "Below avg.";
    }
  };

  const updateAI = async (stock, indicators, prediction) => {
    const status = $("#aiStatus");
    const heading = $("#aiAnalysisHeading");
    const text = $("#aiAnalysisText");

    const factorMomentum = $("#factorMomentum");
    const factorTechnical = $("#factorTechnical");
    const factorVolume = $("#factorVolume");

    if (status) {
      status.textContent = "ANALYZING";
    }

    if (heading) {
      heading.textContent = "Generating market analysis…";
    }

    if (text) {
      text.textContent =
        "Gemini is analyzing the current market signals and technical indicators.";
    }

    if (factorMomentum) {
      factorMomentum.textContent =
        Number(indicators?.momentum ?? 0) >= 0
          ? "Recent price movement is showing upward momentum."
          : "Recent price movement is showing weaker momentum.";
    }

    if (factorTechnical) {
      factorTechnical.textContent =
        prediction?.signal === "BULLISH"
          ? "Technical indicators currently support a positive directional signal."
          : prediction?.signal === "BEARISH"
            ? "Technical indicators currently support a negative directional signal."
            : "Technical indicators are giving mixed or neutral signals.";
    }

    if (factorVolume) {
      factorVolume.textContent =
        Number(indicators?.volumeRatio ?? 0) > 1
          ? "Trading volume is above the recent average."
          : "Trading volume is around or below the recent average.";
    }

    try {
      if (
        typeof MarketMindAI === "undefined" ||
        typeof MarketMindAI.analyze !== "function"
      ) {
        throw new Error("AI service is unavailable.");
      }

      const result = await MarketMindAI.analyze({
        symbol: stock.symbol,
        indicators,
        prediction,
      });

      if (heading) {
        heading.textContent = `${stock.name} — AI market analysis`;
      }

      if (text) {
        text.textContent =
          result?.text || "AI analysis is currently unavailable.";
      }

      if (status) {
        status.textContent = "ANALYZED";
      }
    } catch (error) {
      console.error("AI analysis:", error);

      if (heading) {
        heading.textContent = "AI analysis unavailable";
      }

      if (text) {
        text.textContent = "Gemini analysis could not be generated right now.";
      }

      if (status) {
        status.textContent = "UNAVAILABLE";
      }
    }
  };

  const loadStock = async (value) => {
    let stock;

    try {
      stock = resolveStock(value);
    } catch (error) {
      console.error("Stock resolution:", error);

      const chartPrice = $("#chartPrice");

      if (chartPrice) {
        chartPrice.textContent = "Unavailable";
      }

      return null;
    }

    currentStock = stock;

    updateHeader(stock);

    const chartPrice = $("#chartPrice");
    const chartUpdated = $("#chartUpdated");

    if (chartPrice) {
      chartPrice.textContent = "Loading…";
    }

    try {
      const history = await MarketMindMarketService.getDailyHistory(
        stock.symbol,
      );

      if (!history || !Array.isArray(history.candles)) {
        throw new Error("Invalid market data received.");
      }

      currentHistory = history;

      updatePrice(history, stock);

      const indicators = MarketMindIndicators.calculate(history.candles);

      updateIndicators(indicators, stock);

      const prediction = MarketMindPrediction.calculate(indicators);

      updatePrediction(prediction);

      updateSentiment(indicators, prediction);

      if (
        typeof MarketMindCharts !== "undefined" &&
        typeof MarketMindCharts.update === "function"
      ) {
        MarketMindCharts.update(history.candles);
      }

      await updateAI(stock, indicators, prediction);

      return {
        stock,
        history,
        indicators,
        prediction,
      };
    } catch (error) {
      console.error("Market data:", error);

      if (chartPrice) {
        chartPrice.textContent = "Unavailable";
      }

      const loadingEl = $("#chartLoading");
      const emptyEl = $("#chartEmpty");

      if (loadingEl) {
        loadingEl.hidden = true;
      }

      if (emptyEl) {
        emptyEl.hidden = false;
      }

      if (chartUpdated) {
        chartUpdated.textContent = "Market data unavailable.";
      }

      const predictionStatus = $("#predictionStatus");
      const predictionSignal = $("#predictionSignal");
      const aiStatus = $("#aiStatus");
      const aiHeading = $("#aiAnalysisHeading");
      const aiText = $("#aiAnalysisText");

      if (predictionStatus) {
        predictionStatus.textContent = "NO DATA";
      }

      if (predictionSignal) {
        predictionSignal.textContent = "NO DATA";
      }

      if (aiStatus) {
        aiStatus.textContent = "NO DATA";
      }

      if (aiHeading) {
        aiHeading.textContent = "Market data unavailable";
      }

      if (aiText) {
        aiText.textContent = error?.message || "Unable to load market data.";
      }

      return null;
    }
  };

  const updateWatchlist = async () => {
    const rows = $$(".watchlist-row[data-symbol]");

    for (const row of rows) {
      const symbol = row.dataset.symbol;

      if (!symbol) {
        continue;
      }

      try {
        const stock = resolveStock(symbol);

        const quote = await MarketMindMarketService.getQuote(stock.symbol);

        const currency = getCurrency(stock);
        const symbolSign = currencySymbol(currency);

        const price = row.querySelector(`[data-price-for="${symbol}"]`);

        const change = row.querySelector(`[data-change-for="${symbol}"]`);

        if (price) {
          price.textContent = `${symbolSign}${formatPrice(
            quote.price,
            currency,
          )}`;
        }

        if (change) {
          change.textContent = formatPercent(quote.changePercent);

          change.classList.remove("positive", "negative");

          change.classList.add(
            quote.changePercent >= 0 ? "positive" : "negative",
          );
        }
      } catch (error) {
        console.warn(`Watchlist ${symbol}:`, error);
      }
    }
  };

  const setupSearch = () => {
    const search = $("#searchInput");

    search?.addEventListener("keydown", async (event) => {
      if (event.key !== "Enter") {
        return;
      }

      const value = search.value.trim();

      if (!value) {
        return;
      }

      await loadStock(value);
    });
  };

  const setupWatchlist = () => {
    $$(".watchlist-row[data-symbol]").forEach((button) => {
      button.addEventListener("click", async () => {
        $$(".watchlist-row[data-symbol]").forEach((item) => {
          item.classList.remove("active");
        });

        button.classList.add("active");

        const symbol = button.dataset.symbol;

        const search = $("#searchInput");

        if (search) {
          search.value = symbol;
        }

        await loadStock(symbol);
      });
    });
  };

  const setupSidebar = () => {
    const sidebar = $("#sidebar");
    const overlay = $("#sidebarOverlay");
    const toggle = $("#sidebarToggle");
    const closeButton = $("#sidebarClose");

    toggle?.addEventListener("click", () => {
      sidebar?.classList.add("open");
      overlay?.classList.add("open");
    });

    const close = () => {
      sidebar?.classList.remove("open");
      overlay?.classList.remove("open");
    };

    closeButton?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
  };

  const setupAccount = () => {
    const menu = $("#accountMenu");
    const button = $("#accountButton");

    button?.addEventListener("click", () => {
      if (!menu) {
        return;
      }

      const isOpen = !menu.hasAttribute("hidden");

      if (isOpen) {
        menu.setAttribute("hidden", "");
      } else {
        menu.removeAttribute("hidden");
      }

      button.setAttribute("aria-expanded", String(!isOpen));
    });

    $("#accountLogin")?.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  };

  const setupLogout = () => {
    const logout = async () => {
      try {
        if (
          typeof MarketMindAuthService !== "undefined" &&
          typeof MarketMindAuthService.signOut === "function"
        ) {
          await MarketMindAuthService.signOut();
        }
      } catch (error) {
        console.error("Logout:", error);
      }

      window.location.href = "index.html";
    };

    $("#logoutButton")?.addEventListener("click", logout);

    $("#accountLogout")?.addEventListener("click", logout);
  };

  const setupChartRanges = () => {
    $$(".chart-range").forEach((button) => {
      button.addEventListener("click", () => {
        $$(".chart-range").forEach((item) => {
          item.classList.remove("active");
        });

        button.classList.add("active");

        if (
          currentHistory &&
          typeof MarketMindCharts !== "undefined" &&
          typeof MarketMindCharts.update === "function"
        ) {
          MarketMindCharts.update(currentHistory.candles, button.dataset.range);
        }
      });
    });
  };

  const updateTime = () => {
    const updated = $("#chartUpdated");

    if (!updated || !currentHistory?.latest) {
      return;
    }

    updated.textContent = `Updated ${currentHistory.latest.date} · Daily data`;
  };

  const init = async () => {
    setupSearch();
    setupWatchlist();
    setupSidebar();
    setupAccount();
    setupLogout();
    setupChartRanges();

    await loadStock("RELIANCE");

    await updateWatchlist();

    updateTime();
  };

  return {
    init,
    loadStock,
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  MarketMindAnalysisPage.init();
});
