document.addEventListener("DOMContentLoaded", async () => {
  const loginButton = document.getElementById("loginButton");

  const mobileLoginButton = document.getElementById("mobileLoginButton");

  const closeLoginModal = document.getElementById("closeLoginModal");

  const loginModal = document.getElementById("loginModal");

  const mobileMenuButton = document.getElementById("mobileMenuButton");

  const mobileNav = document.getElementById("mobileNav");

  const currentYear = document.getElementById("currentYear");

  const openLogin = () => {
    MarketMindUI.openModal(loginModal);
  };

  const closeLogin = () => {
    MarketMindUI.closeModal(loginModal);
  };

  loginButton?.addEventListener("click", openLogin);

  mobileLoginButton?.addEventListener("click", openLogin);

  closeLoginModal?.addEventListener("click", closeLogin);

  loginModal?.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeLogin);
  });

  mobileMenuButton?.addEventListener("click", () => {
    MarketMindUI.toggleMenu(mobileNav, mobileMenuButton);
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");

      mobileMenuButton?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLogin();

      mobileNav?.classList.remove("is-open");

      mobileMenuButton?.setAttribute("aria-expanded", "false");
    }
  });

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
