const MarketMindUI = {
  openModal(element) {
    if (!element) return;

    element.classList.add("is-open");
    document.body.classList.add("modal-open");
  },

  closeModal(element) {
    if (!element) return;

    element.classList.remove("is-open");
    document.body.classList.remove("modal-open");
  },

  toggleMenu(element, button) {
    if (!element) return;

    const open = element.classList.toggle("is-open");

    button?.setAttribute("aria-expanded", String(open));
  },
};
