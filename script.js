(function () {
  const META = {
    ru: {
      title: "Максим Куликов — PHP backend, тимлид",
      description: "Максим Куликов — PHP backend-разработчик и тимлид. REST API, Laravel, команда.",
    },
    en: {
      title: "Maxim Kulikov — PHP backend, team lead",
      description: "Maxim Kulikov — PHP backend developer and team lead. REST API, Laravel, and team leadership.",
    },
  };

  const ANNOUNCE = {
    ru: "Язык: русский",
    en: "Language: English",
  };

  const THEME_COLORS = {
    light: "#f4f2ef",
    dark: "#121110",
  };

  const THEME_ANNOUNCE = {
    ru: { light: "Тема: светлая", dark: "Тема: тёмная" },
    en: { light: "Theme: light", dark: "Theme: dark" },
  };

  function applyDocumentMeta(lang) {
    const m = META[lang] || META.ru;
    document.title = m.title;
    const desc = document.getElementById("site-description");
    if (desc) desc.setAttribute("content", m.description);
  }

  function syncLangButtons(lang) {
    document.querySelectorAll(".lang-switch__btn").forEach((btn) => {
      const l = btn.getAttribute("data-set-lang");
      btn.setAttribute("aria-pressed", l === lang ? "true" : "false");
    });
  }

  function announceTheme(theme) {
    const lang = document.documentElement.lang === "en" ? "en" : "ru";
    const live = document.getElementById("theme-live");
    if (!live) return;
    const msg = THEME_ANNOUNCE[lang][theme];
    if (!msg) return;
    live.textContent = msg;
    setTimeout(() => {
      live.textContent = "";
    }, 1500);
  }

  function syncThemeButtons(theme) {
    document.querySelectorAll(".theme-switch__btn").forEach((btn) => {
      const t = btn.getAttribute("data-set-theme");
      btn.setAttribute("aria-pressed", t === theme ? "true" : "false");
    });
  }

  function setTheme(theme, { announce = false } = {}) {
    if (theme !== "light" && theme !== "dark") return;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
    const tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute("content", THEME_COLORS[theme]);
    syncThemeButtons(theme);
    if (announce) announceTheme(theme);
  }

  function setLang(lang, { announce = false } = {}) {
    if (lang !== "ru" && lang !== "en") lang = "ru";
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("lang", lang);
    } catch (e) {}
    applyDocumentMeta(lang);
    syncLangButtons(lang);
    if (announce) {
      const live = document.getElementById("lang-live");
      if (live) {
        live.textContent = ANNOUNCE[lang];
        setTimeout(() => {
          live.textContent = "";
        }, 1500);
      }
    }
  }

  function initLang() {
    const current = document.documentElement.lang === "en" ? "en" : "ru";
    applyDocumentMeta(current);
    syncLangButtons(current);

    document.querySelectorAll(".lang-switch__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-set-lang");
        if (next === "ru" || next === "en") setLang(next, { announce: true });
      });
    });
  }

  function initTheme() {
    const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    syncThemeButtons(cur);

    document.querySelectorAll(".theme-switch__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-set-theme");
        if (next === "light" || next === "dark") setTheme(next, { announce: true });
      });
    });
  }

  function initNavHighlight() {
    const links = document.querySelectorAll(".site-nav__link");
    const sections = document.querySelectorAll("main section[id]");

    function setActive(id) {
      links.forEach((link) => {
        link.classList.toggle("nav-active", link.getAttribute("href") === `#${id}`);
      });
    }

    if (!sections.length) return;

    setActive("hero");

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { root: null, rootMargin: "-18% 0px -42% 0px", threshold: [0, 0.15, 0.35, 0.55, 0.75, 1] }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  function initNavScroll() {
    document.querySelectorAll('.site-nav__link[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (history.replaceState) history.replaceState(null, "", id);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLang();
    initTheme();
    initNavHighlight();
    initNavScroll();
  });
})();
