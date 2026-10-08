const MarketMindCharts = (() => {
  let candles = [];
  let range = "1M";

  const getLimit = () => {
    switch (range) {
      case "1W":
        return 5;

      case "1M":
        return 22;

      case "3M":
        return 66;

      case "1Y":
        return 100;

      default:
        return 22;
    }
  };

  const getVisibleCandles = () =>
    candles.slice(Math.max(0, candles.length - getLimit()));

  const getPaths = (values, width, height, padding) => {
    const min = Math.min(...values);

    const max = Math.max(...values);

    const spread = max - min || 1;

    const points = values.map((value, index) => {
      const x =
        padding +
        (index / Math.max(values.length - 1, 1)) * (width - padding * 2);

      const y =
        height - padding - ((value - min) / spread) * (height - padding * 2);

      return {
        x,
        y,
      };
    });

    const line = points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(
            2,
          )}`,
      )
      .join(" ");

    const area = `${line} L ${width - padding} ${
      height - padding
    } L ${padding} ${height - padding} Z`;

    return {
      line,
      area,
      min,
      max,
    };
  };

  const updateAxes = (min, max, visible) => {
    const yAxis = document.querySelector(".chart-y-axis");

    const xAxis = document.querySelector(".chart-x-axis");

    if (yAxis) {
      const steps = 4;

      yAxis.innerHTML = "";

      for (let i = 0; i <= steps; i++) {
        const value = max - ((max - min) / steps) * i;

        const span = document.createElement("span");

        span.textContent = Number.isFinite(value)
          ? value.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })
          : "—";

        yAxis.appendChild(span);
      }
    }

    if (xAxis) {
      xAxis.innerHTML = "";

      const labels = visible.filter(
        (_, index) =>
          index === 0 ||
          index === Math.floor(visible.length / 2) ||
          index === visible.length - 1,
      );

      labels.forEach((candle) => {
        const span = document.createElement("span");

        span.textContent = candle.date;

        xAxis.appendChild(span);
      });
    }
  };

  const render = () => {
    const line = document.querySelector("#chartLine");

    const area = document.querySelector("#chartArea");

    const loading = document.querySelector("#chartLoading");
    const empty = document.querySelector("#chartEmpty");

    if (loading) {
      loading.hidden = true;
    }

    if (!line || !area || !candles.length) {
      if (empty) {
        empty.hidden = false;
      }

      return;
    }

    if (empty) {
      empty.hidden = true;
    }

    const visible = getVisibleCandles();

    const values = visible.map((candle) => Number(candle.close));

    if (!values.length) {
      return;
    }

    const width = 1000;
    const height = 360;
    const padding = 20;

    const paths = getPaths(values, width, height, padding);

    line.setAttribute("d", paths.line);

    area.setAttribute("d", paths.area);

    updateAxes(paths.min, paths.max, visible);
  };

  const setupControls = () => {
    document.querySelectorAll(".chart-range").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll(".chart-range")
          .forEach((item) => item.classList.remove("active"));

        button.classList.add("active");

        range = button.dataset.range || button.textContent.trim();

        render();
      });
    });
  };

  const update = (nextCandles = [], nextRange) => {
    if (nextRange) {
      range = nextRange;
    }

    candles = Array.isArray(nextCandles) ? nextCandles : [];

    render();
  };

  const init = () => {
    setupControls();
  };

  return {
    init,
    update,
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  MarketMindCharts.init();
});
