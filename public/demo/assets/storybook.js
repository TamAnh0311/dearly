(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(".reveal, .scene");

  /** Reveals sections and starts scene animations when they enter the viewport. */
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  var form = document.getElementById("rsvp-form");
  var success = document.getElementById("rsvp-success");
  var copy = document.getElementById("success-copy");
  if (!form || !success || !copy) return;

  /** Simulates an RSVP submission for the static preview. */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = form.querySelector("#name");
    if (!name.value.trim()) {
      name.focus();
      name.style.borderColor = "var(--accent)";
      return;
    }
    var attending = form.querySelector('input[name="attending"]:checked').value === "yes";
    var guestName = name.value.trim().split(/\s+/)[0];
    copy.textContent = attending
      ? "Thank you, " + guestName + ". Your seat is saved — we cannot wait to celebrate with you."
      : "Thank you for letting us know, " + guestName + ". You will be missed, and we will raise a glass to you.";
    form.classList.add("is-hidden");
    success.classList.add("show");
    success.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  });
})();
