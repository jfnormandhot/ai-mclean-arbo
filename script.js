const translations = {
  fr: {
    navServices: "Services",
    navAbout: "À propos",
    navContact: "Contact",
    eyebrow: "Arboristes certifiés",
    heroTitle: "Des arbres en santé, des propriétés plus sécuritaires.",
    heroText:
      "Nous offrons des services experts d'élagage, d'abattage et d'urgence, avec une approche axée sur la sécurité.",
    ctaQuote: "Obtenir une soumission gratuite",
    cardTitle: "Urgence tempête 24/7",
    cardText:
      "Intervention rapide pour branches cassées, arbres dangereux et nettoyage après tempête.",
    cardLink: "Demander une assistance immédiate",
    servicesTitle: "Nos services",
    service1Title: "Élagage d'arbres",
    service1Text:
      "Améliorez la santé, la structure et l'apparence de vos arbres grâce à un élagage précis.",
    service2Title: "Abattage d'arbres",
    service2Text:
      "Retrait sécuritaire d'arbres dangereux ou indésirables pour les espaces résidentiels et commerciaux.",
    service3Title: "Essouchage",
    service3Text:
      "Éliminez les souches et récupérez votre espace extérieur rapidement et proprement.",
    aboutTitle: "Pourquoi choisir Mclean Arboriste",
    aboutText:
      "Nous sommes entièrement assurés, formés en sécurité et engagés envers des pratiques durables de soin des arbres. Chaque projet est réalisé avec professionnalisme, prix transparents et respect de votre propriété.",
    contactTitle: "Demandez une consultation",
    contactText:
      "Parlez-nous de vos arbres et nous vous répondrons dans les 24 heures.",
    sendBtn: "Envoyer la demande",
    sendingBtn: "Envoi en cours...",
    namePlaceholder: "Votre nom",
    emailPlaceholder: "Votre courriel",
    cityPlaceholder: "Votre ville",
    messagePlaceholder: "Décrivez votre projet",
    formSuccess: "Merci, votre demande a été envoyée.",
    formError:
      "Une erreur est survenue. Veuillez réessayer ou nous appeler directement.",
    formValidation: "Veuillez remplir tous les champs obligatoires.",
  },
  en: {
    navServices: "Services",
    navAbout: "About",
    navContact: "Contact",
    eyebrow: "Certified arborists",
    heroTitle: "Healthy trees, safer properties.",
    heroText:
      "We provide expert pruning, tree removal, and emergency services with a safety-first approach.",
    ctaQuote: "Get a free quote",
    cardTitle: "24/7 Storm Emergency",
    cardText:
      "Fast response for broken limbs, dangerous trees, and post-storm cleanup.",
    cardLink: "Request immediate assistance",
    servicesTitle: "Our Services",
    service1Title: "Tree Pruning",
    service1Text:
      "Improve tree health, structure, and appearance with precision pruning.",
    service2Title: "Tree Removal",
    service2Text:
      "Safe removal of hazardous or unwanted trees in residential and commercial spaces.",
    service3Title: "Stump Grinding",
    service3Text:
      "Eliminate stumps and reclaim your outdoor space quickly and cleanly.",
    aboutTitle: "Why Choose Mclean Arboriste",
    aboutText:
      "We are fully insured, safety trained, and committed to sustainable tree care practices. Every project is handled with professionalism, transparent pricing, and respect for your property.",
    contactTitle: "Request a Consultation",
    contactText:
      "Tell us about your trees and we will get back to you within 24 hours.",
    sendBtn: "Send request",
    sendingBtn: "Sending...",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    cityPlaceholder: "Your city",
    messagePlaceholder: "Describe your project",
    formSuccess: "Thanks, your request has been sent.",
    formError: "Something went wrong. Please try again or call us directly.",
    formValidation: "Please fill in all required fields.",
  },
};

const defaultLanguage = "fr";
const langToggle = document.getElementById("langToggle");
const translatableNodes = document.querySelectorAll("[data-i18n]");
const translatablePlaceholders = document.querySelectorAll("[data-i18n-placeholder]");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function applyLanguage(language) {
  const dict = translations[language];
  if (!dict) return;

  document.documentElement.lang = language;

  translatableNodes.forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (key && dict[key]) {
      node.textContent = dict[key];
    }
  });

  translatablePlaceholders.forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    if (key && dict[key]) {
      node.setAttribute("placeholder", dict[key]);
    }
  });

  localStorage.setItem("preferredLanguage", language);
  langToggle.textContent = language === "fr" ? "English" : "Francais";
}

function toggleLanguage() {
  const current = document.documentElement.lang || defaultLanguage;
  const next = current === "fr" ? "en" : "fr";
  applyLanguage(next);
}

langToggle.addEventListener("click", toggleLanguage);

const saved = localStorage.getItem("preferredLanguage");
applyLanguage(saved === "en" ? "en" : defaultLanguage);

const yearEl = document.getElementById("year");
yearEl.textContent = String(new Date().getFullYear());

function getCurrentLanguage() {
  return document.documentElement.lang === "en" ? "en" : "fr";
}

function setFormStatus(kind, message) {
  formStatus.textContent = message;
  formStatus.classList.remove("error", "success");
  if (kind) {
    formStatus.classList.add(kind);
  }
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const language = getCurrentLanguage();
    const t = translations[language];
    const submitButton = contactForm.querySelector("button[type='submit']");
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const website = String(formData.get("website") || "").trim();

    if (!name || !email || !city || !message) {
      setFormStatus("error", t.formValidation);
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = t.sendingBtn;
    setFormStatus("", "");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, city, message, website, language }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      contactForm.reset();
      setFormStatus("success", t.formSuccess);
    } catch (_error) {
      setFormStatus("error", t.formError);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = t.sendBtn;
    }
  });
}
