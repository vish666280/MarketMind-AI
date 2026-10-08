document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const message = document.getElementById("loginMessage");
  const submitButton = document.getElementById("loginSubmit");
  const signupToggle = document.getElementById("signupToggle");

  if (!form) {
    return;
  }

  let mode = "login";

  const setMessage = (text, type = "error") => {
    if (!message) return;

    message.textContent = text;
    message.dataset.type = type;
    message.hidden = !text;
  };

  const setLoading = (loading) => {
    if (!submitButton) return;

    submitButton.disabled = loading;
    submitButton.textContent = loading
      ? "Please wait..."
      : mode === "login"
        ? "Login"
        : "Create account";
  };

  const updateMode = () => {
    const title = document.getElementById("loginTitle");

    if (title) {
      title.textContent =
        mode === "login" ? "Welcome back" : "Create your account";
    }

    if (signupToggle) {
      signupToggle.textContent =
        mode === "login"
          ? "Create an account"
          : "Already have an account? Login";
    }

    setMessage("");
    setLoading(false);
  };

  signupToggle?.addEventListener("click", () => {
    mode = mode === "login" ? "signup" : "login";
    updateMode();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput?.value.trim();
    const password = passwordInput?.value;

    if (!email || !password) {
      setMessage("Enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (mode === "login") {
        await MarketMindAuthService.signIn(email, password);

        window.location.href = "analysis.html";
        return;
      }

      const result = await MarketMindAuthService.signUp(email, password);

      if (result.session) {
        window.location.href = "analysis.html";
        return;
      }

      setMessage(
        "Account created. Check your email if confirmation is enabled.",
        "success",
      );
    } catch (error) {
      setMessage(error?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  });

  MarketMindAuthService.onAuthStateChange((_event, session) => {
    if (session && window.location.pathname.endsWith("index.html")) {
      const modal = document.getElementById("loginModal");

      if (modal) {
        MarketMindUI.closeModal(modal);
      }
    }
  });
});
