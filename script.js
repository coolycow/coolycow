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
    initNavHighlight();
    initNavScroll();
  });
})();
