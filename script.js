/* IzuTech events: language switch (French first, English available) and contact form. */
(function () {
  "use strict";

  var EN = {
    "skip": "Skip to content",
    "navLabel": "Main navigation",
    "langAria": "Passer en français",
    "nav.how": "How it works",
    "nav.example": "Example",
    "nav.pricing": "Pricing",
    "nav.faq": "Questions",
    "nav.cta": "Get a quote",

    "hero.kicker": "For clubs, associations, schools and companies that run events.",
    "hero.title": "Follow your sign-ups live.",
    "hero.lead": "You keep your Google Form. I connect it to a sign-up counter that updates itself on your website, and to a dashboard for the organisers. No more opening the spreadsheet to see where you stand.",
    "hero.cta": "Get a free quote",
    "hero.secondary": "See a real example",
    "hero.note": "€90 per event. Set up in 2 working days.",

    "counter.aria": "Example counter",
    "counter.tag": "Example",
    "counter.event": "End-of-season party",
    "counter.unit": "signed up",
    "counter.barAria": "127 of 200, 64%",
    "counter.goal": "Goal: 200 people",
    "counter.adults": "Adults",
    "counter.children": "Children",

    "how.title": "How it works",
    "how.s1.t": "You send me the link to your Google Form",
    "how.s1.d": "Don’t have one yet? We create it together. People sign up as usual.",
    "how.s2.t": "I connect the counter and the dashboard",
    "how.s2.d": "Within 2 working days. The counter appears on your website, or on a page I provide if you don’t have one.",
    "how.s3.t": "You share and follow along",
    "how.s3.d": "The numbers update with every new sign-up, on computer and phone.",

    "what.title": "What you get",
    "what.w1.t": "A public counter",
    "what.w1.d": "On your website, it shows the number of sign-ups and, if you like, progress towards your goal. People can see the event taking shape.",
    "what.w2.t": "A dashboard for the organisers",
    "what.w2.d": "Totals by category: adults and children, age groups, teams, meals, depending on what your form asks. It’s reached through a link you share only with your team, and Google doesn’t list it.",
    "what.w3.t": "Your data stays with you",
    "what.w3.d": "Responses stay in your Google Form, in your account. The counter and dashboard show totals only, never names.",

    "example.title": "A real example: Halloween in Carla-Bayle",
    "example.p1": "For its Halloween party in the village, the Coq Carlanais basketball club took family sign-ups through a Google Form.",
    "example.p2": "On the club’s website, a counter showed the number of sign-ups live, split into adults and children. The organisers had their own dashboard, with the number of families and children by age group, to plan sweets, activities and supervision.",
    "example.note": "The club’s website is no longer online.",

    "pricing.title": "Pricing",
    "pricing.lead": "A fixed price, no subscription. The form and the responses remain yours.",
    "pricing.p1.t": "One event",
    "pricing.p1.i1": "Live sign-up counter, with a goal if you like",
    "pricing.p1.i2": "Dashboard for the organisers",
    "pricing.p1.i3": "Connection to your Google Form, or we create the form together",
    "pricing.p1.i4": "Set up within 2 working days",
    "pricing.p1.i5": "Support until the event is over",
    "pricing.p1.unit": "per event",
    "pricing.p2.t": "Season",
    "pricing.p2.d": "For clubs and associations that run several events a year.",
    "pricing.p2.i1": "Up to 6 events over 12 months",
    "pricing.p2.i2": "The counter in your club or association’s colours",
    "pricing.p2.i3": "Support throughout the season",
    "pricing.p2.unit": "for 12 months",
    "pricing.foot": "Need a website to present your event? See <a href=\"https://web.izutech.fr/\">my websites</a>.",

    "faq.title": "Questions",
    "faq.q1": "Do I need to change my form?",
    "faq.a1": "No. You keep your Google Form as it is. Participants see no difference.",
    "faq.q2": "What if I don’t have a website?",
    "faq.a2": "I provide a simple page with the counter and the sign-up link, to share on social media or by message.",
    "faq.q3": "Who can see the dashboard?",
    "faq.a3": "The people you give the link to. Google doesn’t list it, and it only shows totals. If you need to see names, we add protected access.",
    "faq.q4": "Does it work with tools other than Google Forms?",
    "faq.a4": "The service is built for Google Forms. For another tool, let’s talk: I’ll tell you honestly whether it’s possible.",

    "contact.title": "Planning an event?",
    "contact.lead": "Tell me what it is, the date, and what you’d like to follow. I’ll reply within one working day.",
    "contact.or": "Would you rather talk it through?",
    "contact.call": "Book a 30-minute call",
    "contact.mail": "By email:",

    "form.name": "Your name",
    "form.email": "Your email",
    "form.org": "Club, association or company",
    "form.optional": "(optional)",
    "form.message": "Your event",
    "form.messagePh": "For example: basketball tournament on 14 June, about 150 players, we’d like to follow sign-ups by team.",
    "form.submit": "Send my request",
    "form.sending": "Sending…",
    "form.ok": "Thank you. Your request is on its way. You’ll hear from me within one working day.",
    "form.err": "Sending didn’t work. Please write to me directly at contact@izutech.fr.",
    "form.missing": "Please fill in your name, a valid email and your event.",

    "footer.where": "Sign-up counters and dashboards for your events. Pau, France.",
    "footer.ai": "AI automation for small businesses",
    "footer.web": "Websites for tradespeople and associations",
    "footer.seniors": "Tech help for seniors (in French)",
    "footer.legal": "Legal notice and privacy (in French)",

    "meta.title": "IzuTech · Live sign-up counter for your events",
    "meta.description": "Connect your Google Form to a live sign-up counter and an organisers’ dashboard. €90 per event, set up in 2 working days. Based in Pau, France."
  };

  var FR_EXTRA = {
    "langAria": "Switch to English",
    "navLabel": "Navigation principale",
    "form.sending": "Envoi en cours…",
    "form.ok": "Merci. Votre demande est bien partie. Je vous réponds sous 24 h ouvrées.",
    "form.err": "L'envoi n'a pas fonctionné. Écrivez-moi directement à contact@izutech.fr.",
    "form.missing": "Merci d'indiquer votre nom, un email valide et votre événement."
  };

  var STORE_KEY = "izutech-events-lang";
  var FR = {};
  var current = "fr";

  function store(get, value) {
    try {
      if (get) return window.localStorage.getItem(STORE_KEY);
      window.localStorage.setItem(STORE_KEY, value);
    } catch (e) { return null; }
    return null;
  }

  // French is the page's own text; capture it once so we can switch back.
  function captureFrench() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (!(k in FR)) FR[k] = el.innerHTML;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      FR[el.getAttribute("data-i18n-placeholder")] = el.getAttribute("placeholder");
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      FR[el.getAttribute("data-i18n-alt")] = el.getAttribute("alt");
    });
    FR["meta.title"] = document.title;
    var md = document.querySelector('meta[name="description"]');
    if (md) FR["meta.description"] = md.getAttribute("content");
    Object.keys(FR_EXTRA).forEach(function (k) { FR[k] = FR_EXTRA[k]; });
  }

  function t(key) {
    var dict = current === "en" ? EN : FR;
    return dict[key] != null ? dict[key] : (FR[key] || "");
  }

  function apply(lang) {
    current = lang === "en" ? "en" : "fr";
    var dict = current === "en" ? EN : FR;
    document.documentElement.lang = current;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n-placeholder")];
      if (v != null) el.setAttribute("placeholder", v);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n-alt")];
      if (v != null) el.setAttribute("alt", v);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n-aria")];
      if (v != null) el.setAttribute("aria-label", v);
    });
    if (dict["meta.title"]) document.title = dict["meta.title"];
    var md = document.querySelector('meta[name="description"]');
    if (md && dict["meta.description"]) md.setAttribute("content", dict["meta.description"]);
    var btn = document.getElementById("lang-toggle");
    if (btn) btn.textContent = current === "en" ? "FR" : "EN";
  }

  // French unless the visitor asked for English, or their device is set to a language other than French.
  function initialLanguage() {
    var param = null;
    try { param = new URLSearchParams(window.location.search).get("lang"); } catch (e) {}
    if (param === "en" || param === "fr") return param;
    var saved = store(true);
    if (saved === "en" || saved === "fr") return saved;
    var langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || "fr"];
    var primary = String(langs[0] || "fr").toLowerCase();
    return primary.indexOf("fr") === 0 ? "fr" : "en";
  }

  function setupForm() {
    var form = document.getElementById("lead-form");
    if (!form) return;
    var status = document.getElementById("form-status");
    var submit = document.getElementById("f-submit");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      var name = form.elements.name, email = form.elements.email, task = form.elements.message;
      var bad = false;
      [name, email, task].forEach(function (f) {
        var invalid = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.setAttribute("aria-invalid", invalid ? "true" : "false");
        if (invalid) bad = true;
      });
      if (bad) { status.textContent = t("form.missing"); status.classList.add("err"); return; }

      submit.disabled = true;
      var label = submit.textContent;
      submit.textContent = t("form.sending");
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("status " + r.status);
          form.reset();
          status.textContent = t("form.ok");
          status.classList.add("ok");
        })
        .catch(function () {
          status.textContent = t("form.err");
          status.classList.add("err");
        })
        .finally(function () { submit.disabled = false; submit.textContent = label; });
    });
  }

  function init() {
    captureFrench();
    apply(initialLanguage());
    var btn = document.getElementById("lang-toggle");
    if (btn) btn.addEventListener("click", function () {
      var next = current === "en" ? "fr" : "en";
      apply(next);
      store(false, next);
    });
    setupForm();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
