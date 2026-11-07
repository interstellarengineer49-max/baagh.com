
/* =========================================
   BAAGH — COUNTRY LIVING
   Main JavaScript
   ========================================= */

"use strict";

/* =========================================
   1. GLOBAL SETTINGS
   ========================================= */

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbxvTAgJKDpqWBbMZGPV6zGoMQdXfTT__fh8FbjtvuXBj_OaN6BjoNESzF2lk3mX-fxT/exec";


/* =========================================
   2. MOBILE NAVIGATION
   ========================================= */

const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");

function setNavigationOpen(isOpen) {
  if (!menuToggle || !navigation) return;

  menuToggle.setAttribute("aria-expanded", String(isOpen));

  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );

  navigation.classList.toggle("is-open", isOpen);

  const navLinks = navigation.querySelectorAll("a");

  if (!window.gsap || reducedMotion) return;

  window.gsap.killTweensOf(navLinks);

  if (isOpen) {
    window.gsap.fromTo(
      navLinks,
      { autoAlpha: 0, y: -7 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.38,
        stagger: 0.055,
        ease: "power2.out",
      }
    );
  }
}

menuToggle?.addEventListener("click", () => {
  const isOpen =
    menuToggle.getAttribute("aria-expanded") !== "true";

  setNavigationOpen(isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    setNavigationOpen(false);
  });
});

document.addEventListener("click", (event) => {
  if (menuToggle?.getAttribute("aria-expanded") !== "true") return;

  if (
    event.target instanceof Element &&
    !event.target.closest(".site-header")
  ) {
    setNavigationOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key !== "Escape" ||
    menuToggle?.getAttribute("aria-expanded") !== "true"
  ) {
    return;
  }

  setNavigationOpen(false);
  menuToggle.focus();
});

window.addEventListener("resize", () => {
  if (
    window.innerWidth > 820 &&
    menuToggle?.getAttribute("aria-expanded") === "true"
  ) {
    setNavigationOpen(false);
  }
});


/* =========================================
   3. ACTIVE SECTION NAVIGATION
   ========================================= */

const sectionLinks = [
  ...document.querySelectorAll('.site-nav a[href^="#"]')
];

const observedSections = sectionLinks
  .map((link) =>
    document.querySelector(link.getAttribute("href"))
  )
  .filter((section) => section instanceof HTMLElement);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const activeSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            b.intersectionRatio - a.intersectionRatio
        )[0]?.target;

      if (!activeSection) return;

      sectionLinks.forEach((link) => {
        if (
          link.getAttribute("href") ===
          `#${activeSection.id}`
        ) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0, 0.1, 0.25, 0.5],
    }
  );

  observedSections.forEach((section) => {
    sectionObserver.observe(section);
  });
}


/* =========================================
   4. BAAGH LIFE ACCORDION
   ========================================= */

const lifeTriggers = [
  ...document.querySelectorAll("[data-life-trigger]")
];

const lifeImage = document.querySelector(
  "[data-life-image] img"
);

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
      {
        height: 0,
        autoAlpha: 0,
      },
      {
        height: "auto",
        autoAlpha: 1,
        duration: 0.48,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(panel, {
            clearProps: "height,opacity,visibility",
          });
        },
      }
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

      gsap.set(panel, {
        clearProps: "height,opacity,visibility",
      });
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
    lifeImage.alt = trigger.dataset.alt || "";

    if (gsap && !reducedMotion) {
      gsap.fromTo(
        lifeImage,
        { autoAlpha: 0.2 },
        {
          autoAlpha: 1,
          duration: 0.55,
          ease: "power2.out",
        }
      );
    }
  };

  if (gsap && !reducedMotion) {
    gsap.killTweensOf(lifeImage);

    gsap.to(lifeImage, {
      autoAlpha: 0.2,
      duration: 0.2,
      onComplete: update,
    });
  } else {
    update();
  }
}

lifeTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const wasOpen =
      trigger.getAttribute("aria-expanded") === "true";

    lifeTriggers.forEach((item) => {
      const panel = document.getElementById(
        item.getAttribute("aria-controls")
      );

      const isCurrent = item === trigger && !wasOpen;

      item.setAttribute(
        "aria-expanded",
        String(isCurrent)
      );

      item.closest(".life-item")?.classList.toggle(
        "is-open",
        isCurrent
      );

      const icon = item.querySelector(".item-icon");

      if (icon) {
        icon.textContent = isCurrent ? "−" : "+";
      }

      if (panel) {
        animatePanel(panel, isCurrent);
      }
    });

    if (!wasOpen) {
      changeLifeImage(trigger);
    }
  });
});


/* =========================================
   5. ENQUIRY FORM ELEMENTS
   ========================================= */

const form = document.querySelector("[data-enquiry-form]");

const feedback = document.querySelector(
  "[data-form-feedback]"
);

const submitButton = form?.querySelector(
  ".submit-button"
);

let isSubmitting = false;


/* =========================================
   6. DATE PICKER CONFIGURATION
   ========================================= */

const visitDateField = form?.querySelector(
  '[name="visit-date"]'
);

if (visitDateField) {
  const today = new Date();

  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Prevent customers from selecting past dates.
  visitDateField.min = localToday;
}


/* =========================================
   7. FORM VALIDATION
   ========================================= */

function validateField(field) {
  const error = field.parentElement.querySelector(
    ".field-error"
  );

  let message = "";

  if (!field.validity.valid) {
    if (field.validity.valueMissing) {
      message = "Please complete this field.";
    } else if (field.validity.typeMismatch) {
      message = "Enter a valid email address.";
    } else if (field.validity.tooShort) {
      message = "Please enter at least two characters.";
    } else {
      message = "Please check this field.";
    }
  }

  if (
    !message &&
    field.name === "phone" &&
    field.value.trim()
  ) {
    const digits = field.value.replace(/\D/g, "");

    if (
      !/^[+0-9(). -]+$/.test(field.value) ||
      digits.length < 7 ||
      digits.length > 15
    ) {
      message = "Enter a valid phone number.";
    }
  }

  if (
    !message &&
    field.name === "visit-date" &&
    field.value
  ) {
    const today = new Date();

    const localToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (field.value < localToday) {
      message = "Please choose today or a future date.";
    }
  }

  field.setAttribute(
    "aria-invalid",
    String(Boolean(message))
  );

  if (error) {
    error.textContent = message;
  }

  return !message;
}


/* =========================================
   8. VALIDATION EVENT LISTENERS
   ========================================= */

form
  ?.querySelectorAll("input:not([type='hidden']):not([name='website']), select, textarea")
  .forEach((field) => {

    field.addEventListener("blur", () => {
      if (field.value || field.required) {
        validateField(field);
      }
    });

    field.addEventListener("input", () => {
      if (
        field.getAttribute("aria-invalid") === "true"
      ) {
        validateField(field);
      }
    });

    field.addEventListener("change", () => {
      if (
        field.value ||
        field.required ||
        field.getAttribute("aria-invalid") === "true"
      ) {
        validateField(field);
      }
    });

  });


/* =========================================
   9. RESET FORM VALIDATION
   ========================================= */

function clearFormErrors() {
  if (!form) return;

  form.querySelectorAll("[aria-invalid]").forEach((field) => {
    field.removeAttribute("aria-invalid");
  });

  form.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
  });
}


/* =========================================
   10. GOOGLE SHEETS ENQUIRY SUBMISSION
   ========================================= */

form?.addEventListener("submit", async (event) => {

  event.preventDefault();

  if (!feedback || !submitButton || isSubmitting) {
    return;
  }

  /* Validate required and optional fields */

  const fieldsToValidate = [
    ...form.querySelectorAll(
      "input[required], select[required], input[name='visit-date']"
    ),
  ];

  const isValid = fieldsToValidate
    .map(validateField)
    .every(Boolean);

  if (!isValid) {
    feedback.textContent =
      "Please review the highlighted fields.";

    form.querySelector(
      '[aria-invalid="true"]'
    )?.focus();

    return;
  }

  /* Collect form information */

  const formData = new FormData(form);

  const visitDate = formData.get("visit-date") || "";
  const visitTime = formData.get("visit-time") || "";

  let preferredVisit = "";

  if (visitDate && visitTime) {
    preferredVisit = `${visitDate} at ${visitTime}`;
  } else if (visitDate) {
    preferredVisit = visitDate;
  } else if (visitTime) {
    preferredVisit = visitTime;
  }

  const enquiry = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    interest: formData.get("interest"),

    // Date and time are stored together
    // in the existing Preferred Visit column.
    visit: preferredVisit,

    message: formData.get("message") || "",

    // Spam protection.
    website: formData.get("website") || "",
  };

  /* Honeypot spam protection */

  if (enquiry.website) {
    feedback.textContent =
      "Your enquiry could not be processed.";

    return;
  }

  /* Prevent duplicate submissions */

  isSubmitting = true;
  submitButton.disabled = true;

  submitButton.innerHTML =
    'Sending enquiry...';

  feedback.textContent =
    "Please wait while we process your request.";

  try {

    /*
      Google Apps Script receives JSON
      through a simple text/plain POST.

      no-cors makes the browser response opaque.
      Therefore, a successful fetch resolution
      does not independently confirm spreadsheet insertion.
    */

    await fetch(BACKEND_URL, {
      method: "POST",
      mode: "no-cors",

      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },

      body: JSON.stringify(enquiry),
    });

    /*
      The existing backend uses no-cors.
      The browser cannot read its JSON response.
      This message confirms the request was handed
      to the browser's network layer, not independently
      verified spreadsheet insertion.
    */

    feedback.textContent =
      "Your enquiry has been submitted. Our team will be in touch. If you need immediate assistance, please contact BAAGH directly.";

    // Clear submitted details without reloading the page.
    form.reset();

    // Clear previous validation messages.
    clearFormErrors();

  } catch (error) {

    console.error(
      "BAAGH enquiry submission failed:",
      error
    );

    feedback.textContent =
      "We couldn't send your enquiry. Please check your connection and try again.";

  } finally {

    isSubmitting = false;

    submitButton.disabled = false;

    submitButton.innerHTML =
      'Send enquiry <span aria-hidden="true">↗</span>';

  }

});


/* =========================================
   11. END OF BAAGH MAIN JAVASCRIPT
   ========================================= */
```
