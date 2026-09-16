const PROJECT_PASSWORD = "whatpassword";

const gate = document.getElementById("gate");
const gateForm = document.getElementById("gateForm");
const gateInput = document.getElementById("gateInput");
const gateError = document.getElementById("gateError");
const gateClose = document.getElementById("gateClose");

let pendingSlug = null;

document.querySelectorAll("[data-project]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    pendingSlug = link.dataset.project;
    gateError.classList.remove("is-visible");
    gateInput.value = "";
    gate.classList.add("is-open");
    gateInput.focus();
  });
});

function closeGate() {
  gate.classList.remove("is-open");
  pendingSlug = null;
}

gateClose.addEventListener("click", closeGate);
gate.addEventListener("click", (e) => {
  if (e.target === gate) closeGate();
});

gateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (gateInput.value === PROJECT_PASSWORD) {
    sessionStorage.setItem("gateUnlocked", "1");
    window.location.href = `projects/${pendingSlug}.html`;
  } else {
    gateError.classList.add("is-visible");
  }
});

const ruleRows = document.querySelectorAll(".rulelist__row");
if (ruleRows.length) {
  const ruleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          ruleObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  ruleRows.forEach((row) => ruleObserver.observe(row));
}
