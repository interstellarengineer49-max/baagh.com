const gsap = window.gsap;
const scrollTrigger = window.ScrollTrigger;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (gsap && scrollTrigger && !reduceMotion) {
  gsap.registerPlugin(scrollTrigger);

  const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
  hero
    .fromTo(".hero-art", { clipPath: "inset(0 100% 0 0)", scale: 1.035 }, {
      clipPath: "inset(0 0% 0 0)",
      scale: 1,
      duration: 1.5,
      ease: "power2.inOut",
    })
    .fromTo(".site-header .brand", { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.3)
    .fromTo(".site-nav a, .header-visit", { autoAlpha: 0, y: -8 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.06,
    }, 0.62)
    .fromTo(".hero-location", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.92)
    .fromTo(
      ".hero-word",
      { autoAlpha: 0, yPercent: 115 },
      { autoAlpha: 1, yPercent: 0, duration: 0.82, stagger: 0.075, ease: "power3.out" },
      1.18,
    )
    .fromTo(".hero-footer", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.72 }, 2.35)
    .fromTo(".scroll-cue", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55 }, 2.65);

  gsap.to(".scroll-cue b", {
    y: 4,
    duration: 1.25,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  gsap.fromTo(".philosophy-mark", { autoAlpha: 0, y: 14 }, {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "power2.out",
    scrollTrigger: { trigger: ".philosophy", start: "top 78%", once: true },
  });

  const revealSections = document.querySelectorAll(
    ".philosophy-grid, .philosophy-signoff, .life-grid, .offering-grid, .clarity-grid, .details-callout, .farm-grid, .garden-grid, .setting-grid, .visit-grid",
  );

  revealSections.forEach((section) => {
    gsap.fromTo(
      section,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        immediateRender: false,
        scrollTrigger: { trigger: section, start: "top 88%", once: true },
      },
    );
  });

  document.querySelectorAll(".section-heading").forEach((heading) => {
    const eyebrow = heading.querySelector(".eyebrow");
    const title = heading.querySelector("h2");
    const aside = heading.querySelector(":scope > p");
    const entrance = gsap.timeline({
      scrollTrigger: { trigger: heading, start: "top 86%", once: true },
    });

    if (eyebrow) {
      entrance.fromTo(eyebrow, { autoAlpha: 0, x: -12 }, {
        autoAlpha: 1,
        x: 0,
        duration: 0.55,
        ease: "power2.out",
      });
    }
    if (title) {
      entrance.fromTo(title, { autoAlpha: 0, y: 26, clipPath: "inset(0 0 100% 0)" }, {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0 0 0% 0)",
        duration: 0.9,
        ease: "power3.out",
      }, "-=0.2");
    }
    if (aside) {
      entrance.fromTo(aside, { autoAlpha: 0, y: 14 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        ease: "power2.out",
      }, "-=0.45");
    }
  });

  const imageRevealDirections = [
    { from: "inset(0 12% 0 0)", to: "inset(0 0% 0 0)" },
    { from: "inset(0 0 0 12%)", to: "inset(0 0 0 0%)" },
    { from: "inset(12% 0 0 0)", to: "inset(0% 0 0 0)" },
    { from: "inset(0 0 12% 0)", to: "inset(0 0 0% 0)" },
  ];

  document.querySelectorAll(".image-card img").forEach((image, index) => {
    const direction = imageRevealDirections[index % imageRevealDirections.length];
    gsap.fromTo(
      image,
      { clipPath: direction.from, scale: 1.055 },
      {
        clipPath: direction.to,
        scale: 1,
        duration: 1.45,
        ease: "power3.inOut",
        immediateRender: false,
        scrollTrigger: { trigger: image.closest(".image-card"), start: "top 88%", once: true },
      },
    );
  });

  document.querySelectorAll("[data-image-parallax]").forEach((image) => {
    gsap.fromTo(
      image,
      { yPercent: -3 },
      {
        yPercent: 3,
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: image.closest(".image-card"),
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    );
  });

  gsap.utils.toArray(".offer-list, .clarity-list, .footer-bottom nav").forEach((list) => {
    gsap.fromTo(list.children, { autoAlpha: 0, y: 18 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.68,
      stagger: 0.09,
      ease: "power2.out",
      immediateRender: false,
      scrollTrigger: { trigger: list, start: "top 90%", once: true },
    });
  });

  gsap.fromTo(".land-card", { autoAlpha: 0, y: 22, scale: 0.985 }, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: 0.9,
    ease: "power2.out",
    immediateRender: false,
    scrollTrigger: { trigger: ".land-card", start: "top 88%", once: true },
  });

  gsap.utils.toArray(".garden-grid > div, .farm-copy, .setting-copy, .visit-intro").forEach((copy) => {
    const eyebrow = copy.querySelector(".eyebrow");
    const paragraphs = copy.querySelectorAll(":scope > p:not(.eyebrow, .fine-print)");
    if (eyebrow) {
      gsap.fromTo(eyebrow, { autoAlpha: 0, x: -12 }, {
        autoAlpha: 1,
        x: 0,
        duration: 0.55,
        ease: "power2.out",
        immediateRender: false,
        scrollTrigger: { trigger: copy, start: "top 86%", once: true },
      });
    }
    if (paragraphs.length) {
      gsap.fromTo(paragraphs, { autoAlpha: 0, y: 14 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power2.out",
        immediateRender: false,
        scrollTrigger: { trigger: copy, start: "top 78%", once: true },
      });
    }
  });

  gsap.fromTo(".enquiry-form", { autoAlpha: 0, y: 28 }, {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "power2.out",
    immediateRender: false,
    scrollTrigger: { trigger: ".enquiry-form", start: "top 88%", once: true },
  });
}
