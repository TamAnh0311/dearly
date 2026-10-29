(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const reveals = Array.from(document.querySelectorAll(".reveal"));
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -7% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  const page = document.querySelector(".page");
  const vinePath = document.querySelector(".vine-path");
  const vineLeaves = Array.from(document.querySelectorAll(".vine-leaf"));

  let vineTicking = false;

  function paintVine() {
    vineTicking = false;
    if (!page || !vinePath) return;
    const rect = page.getBoundingClientRect();
    const distance = Math.max(1, rect.height - window.innerHeight);
    const progress = reduced ? 1 : clamp(-rect.top / distance, 0, 1);
    vinePath.style.strokeDashoffset = String(1 - progress * 1.02);

    const leafStep = 0.78 / (vineLeaves.length + 1);
    vineLeaves.forEach((leaf, i) => {
      leaf.classList.toggle("show", progress > 0.04 + i * leafStep);
    });
  }

  function requestVine() {
    if (vineTicking) return;
    vineTicking = true;
    window.requestAnimationFrame(paintVine);
  }

  paintVine();
  window.addEventListener("scroll", requestVine, { passive: true });
  window.addEventListener("resize", requestVine);

  const form = document.getElementById("rsvp-form");
  const success = document.getElementById("rsvp-success");
  const successCopy = document.getElementById("success-copy");
  const letter = document.getElementById("letter");
  const letterHead = letter ? letter.querySelector(".letter-head") : null;
  const nameInput = document.getElementById("name");

  const petalColours = ["#B76E79", "#D9A0A7", "#E8C7C4", "#9AA88B", "#C4A77B"];

  function burstPetals(target) {
    if (!target || reduced) return;
    for (let i = 0; i < 18; i += 1) {
      const petal = document.createElement("span");
      const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.4;
      const distance = 70 + Math.random() * 150;
      petal.className = "petal";
      petal.setAttribute("aria-hidden", "true");
      petal.style.setProperty("--s", `${4 + Math.random() * 5}px`);
      petal.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      petal.style.setProperty("--y", `${Math.sin(angle) * distance * 0.7}px`);
      petal.style.setProperty("--r", `${Math.random() * 540 - 270}deg`);
      petal.style.setProperty("--d", `${0.9 + Math.random() * 0.7}s`);
      petal.style.background = petalColours[i % petalColours.length];
      target.appendChild(petal);
      window.setTimeout(() => petal.remove(), 1900);
    }
  }

  if (form && success && successCopy && letter) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = nameInput ? nameInput.value.trim() : "";
      if (!name) {
        if (nameInput) {
          nameInput.setAttribute("aria-invalid", "true");
          nameInput.focus();
        }
        return;
      }
      if (nameInput) nameInput.removeAttribute("aria-invalid");

      const attending = form.querySelector('input[name="attending"]:checked');
      const guests = document.getElementById("guests");
      const count = guests ? Number.parseInt(guests.value, 10) || 1 : 1;
      const going = !attending || attending.value === "yes";

      successCopy.textContent = going
        ? `Thank you, ${name}. Your reply has been noted for ${count === 1 ? "one guest" : `${count} guests`}. We cannot wait to see you in the garden.`
        : `Thank you, ${name}. You will be missed — we will raise a glass to you and send you photographs from the day.`;

      form.classList.add("is-hidden");
      if (letterHead) letterHead.classList.add("is-hidden");
      success.classList.add("show");
      burstPetals(letter);
    });

    if (nameInput) {
      nameInput.addEventListener("input", () => {
        if (nameInput.value.trim()) nameInput.removeAttribute("aria-invalid");
      });
    }
  }
})();
