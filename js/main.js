const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setNavigationOpen(isOpen) {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("is-open", isOpen);

  const navLinks = navigation.querySelectorAll("a");
  if (!window.gsap || reducedMotion) return;
  window.gsap.killTweensOf(navLinks);
  if (isOpen) {
    window.gsap.fromTo(navLinks, { autoAlpha: 0, y: -7 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.38,
      stagger: 0.055,
      ease: "power2.out",
    });
  }
}

menuToggle?.addEventListener("click", () => {
  setNavigationOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNavigationOpen(false));
});

document.addEventListener("click", (event) => {
  if (menuToggle?.getAttribute("aria-expanded") !== "true") return;
  if (event.target instanceof Element && !event.target.closest(".site-header")) setNavigationOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || menuToggle?.getAttribute("aria-expanded") !== "true") return;
  setNavigationOpen(false);
  menuToggle.focus();
});

const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter((section) => section instanceof HTMLElement);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const activeSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]?.target;
    if (!activeSection) return;

    sectionLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${activeSection.id}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5] });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 820 && menuToggle?.getAttribute("aria-expanded") === "true") {
    setNavigationOpen(false);
  }
});

const lifeTriggers = [...document.querySelectorAll("[data-life-trigger]")];
const lifeImage = document.querySelector("[data-life-image] img");
let imageRevision = 0;

function animatePanel(panel, isOpen) {
  const gsap = window.gsap;
  if (!gsap || reducedMotion) {
    panel.hidden = !isOpen;
    return;
  }

  gsap.killTweensOf(panel);
  if (isOpen) {
    panel.hidden = false;
    gsap.fromTo(
      panel,
      { height: 0, autoAlpha: 0 },
      {
        height: "auto",
        autoAlpha: 1,
        duration: 0.48,
        ease: "power2.out",
        onComplete: () => gsap.set(panel, { clearProps: "height,opacity,visibility" }),
      },
    );
    return;
  }

  gsap.to(panel, {
    height: 0,
    autoAlpha: 0,
    duration: 0.32,
    ease: "power2.inOut",
    onComplete: () => {
      panel.hidden = true;
      gsap.set(panel, { clearProps: "height,opacity,visibility" });
    },
  });
}

function changeLifeImage(trigger) {
  if (!lifeImage) return;
  const revision = ++imageRevision;
  const gsap = window.gsap;
  const update = () => {
    if (revision !== imageRevision) return;
    lifeImage.src = trigger.dataset.image;
    lifeImage.alt = trigger.dataset.alt;
    if (gsap && !reducedMotion) {
      gsap.fromTo(lifeImage, { autoAlpha: 0.2 }, { autoAlpha: 1, duration: 0.55, ease: "power2.out" });
    }
  };

  if (gsap && !reducedMotion) {
    gsap.killTweensOf(lifeImage);
    gsap.to(lifeImage, { autoAlpha: 0.2, duration: 0.2, onComplete: update });
  } else {
    update();
  }
}

lifeTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const wasOpen = trigger.getAttribute("aria-expanded") === "true";
    lifeTriggers.forEach((item) => {
      const panel = document.getElementById(item.getAttribute("aria-controls"));
      const isCurrent = item === trigger && !wasOpen;
      item.setAttribute("aria-expanded", String(isCurrent));
      item.closest(".life-item")?.classList.toggle("is-open", isCurrent);
      item.querySelector(".item-icon").textContent = isCurrent ? "−" : "+";
      if (panel) animatePanel(panel, isCurrent);
    });

    if (!wasOpen) changeLifeImage(trigger);
  });
});

const form = document.querySelector("[data-enquiry-form]");
const feedback = document.querySelector("[data-form-feedback]");

function validateField(field) {
  const error = field.parentElement.querySelector(".field-error");
  let message = "";

  if (!field.validity.valid) {
    if (field.validity.valueMissing) message = "Please complete this field.";
    else if (field.validity.typeMismatch) message = "Enter a valid email address.";
    else if (field.validity.tooShort) message = "Please enter at least two characters.";
    else message = "Please check this field.";
  }

  if (!message && field.name === "phone" && field.value.trim()) {
    const digits = field.value.replace(/\D/g, "");
    if (!/^[+0-9(). -]+$/.test(field.value) || digits.length < 7 || digits.length > 15) {
      message = "Enter a valid phone number.";
    }
  }

  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (error) error.textContent = message;
  return !message;
}

form?.querySelectorAll("input[required], select[required]").forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") validateField(field);
  });
  field.addEventListener("change", () => validateField(field));
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const requiredFields = [...form.querySelectorAll("input[required], select[required]")];
  const isValid = requiredFields.map(validateField).every(Boolean);

  if (!isValid) {
    feedback.textContent = "Please review the highlighted fields. This preview does not send or store your details.";
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  feedback.textContent = "Your details look complete. This preview is not connected, so no enquiry has been sent or stored.";
});
