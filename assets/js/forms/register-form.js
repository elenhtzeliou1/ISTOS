document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("register-form");
  const modal = document.getElementById("summary-modal");
  const modalClose = document.getElementById("summary-close");
  const modalContent = document.getElementById("summary-content");
  const finalSubmit = document.getElementById("final-submit");

  // FORM FIELDS TO AUTO-SAVE
  const fields = [
    "fullName", "email", "dob",
    "password", "confirmPassword",
    "interest", "newsletter", "goals"
  ];

  // RESTORE FORM PROGRESS
  fields.forEach(id => {
    const el = document.getElementById(id);
    const saved = localStorage.getItem("reg_" + id);

    if (saved !== null) {
      if (el.type === "checkbox") el.checked = saved === "true";
      else el.value = saved;
    }
  });

  // AUTO-SAVE FORM PROGRESS
  fields.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("input", () => {
      if (el.type === "checkbox") {
        localStorage.setItem("reg_" + id, el.checked);
      } else {
        localStorage.setItem("reg_" + id, el.value);
      }
    });
  });

  // FORM SUBMIT
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const dob = document.getElementById("dob").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;
    const interest = document.getElementById("interest").value;
    const goals = document.getElementById("goals").value.trim();
    const newsletter = document.getElementById("newsletter").checked;

    const levelInput = document.querySelector("input[name='level']:checked");
    const level = levelInput ? levelInput.value : null;

    // VALIDATION
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 18) {
      alert("You must be at least 18 years old.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    if (!level) {
      alert("Please select your experience level.");
      return;
    }

    // FILL SUMMARY POPUP
    modalContent.innerHTML = `
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Preferred Category:</strong> ${interest}</p>
      <p><strong>Experience Level:</strong> ${level}</p>
      <p><strong>Goals:</strong> ${goals}</p>
      <p><strong>Newsletter:</strong> ${newsletter ? "Yes" : "No"}</p>
    `;

    modal.classList.add("active");
    document.body.classList.add("no-scroll");
  });

  modalClose.addEventListener("click", closeModal);

  function closeModal() {
    modal.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }

  finalSubmit.addEventListener("click", () => {
    alert("Your account has been created (client-side only).");

    fields.forEach(id => localStorage.removeItem("reg_" + id));

    closeModal();
    form.reset();
  });
});
