document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const modal = document.getElementById("summary-modal");
  const modalClose = document.getElementById("summary-close");
  const modalContent = document.getElementById("summary-content");
  const finalSubmit = document.getElementById("final-submit");
  const modalTitle = modal ? modal.querySelector("h2") : null;

  if (!form || !modal || !modalContent || !finalSubmit) {
    console.error("Form or modal elements not found.");
    return;
  }

  // === FIELDS TO AUTO-SAVE (match your HTML IDs) ===
  const fields = [
    "firstName",
    "lastName",
    "userName",
    "email",
    "dob",
    "password",
    "confirmPassword",
    "interest",
    "level",
    "newsletter",
    "goals",
  ];

  // RESTORE FORM PROGRESS
  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const saved = localStorage.getItem("reg_" + id);
    if (saved !== null) {
      if (el.type === "checkbox") {
        el.checked = saved === "true";
      } else {
        el.value = saved;
      }
    }
  });

  // AUTO-SAVE FORM PROGRESS
  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("input", () => {
      if (el.type === "checkbox") {
        localStorage.setItem("reg_" + id, el.checked);
      } else {
        localStorage.setItem("reg_" + id, el.value);
      }
    });
  });

  // === FORM SUBMIT → SHOW SUMMARY MODAL ===
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const fullName = `${firstName} ${lastName}`.trim();

    const userName = document.getElementById("userName").value.trim();
    const email = document.getElementById("email").value.trim();
    const dob = document.getElementById("dob").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;
    const interest = document.getElementById("interest").value;
    const goals = document.getElementById("goals").value.trim();
    const newsletter = document.getElementById("newsletter").checked;

    const levelSelect = document.getElementById("level");
    const level = levelSelect ? levelSelect.value : "";

    // === VALIDATION ===
    if (!dob) {
      alert("Please enter your date of birth.");
      return;
    }

    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dobDate.getDate())
    ) {
      age--;
    }

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

    // === FILL SUMMARY POPUP ===
    if (modalTitle) {
      modalTitle.textContent = "Review Your Information";
    }

    modalContent.innerHTML = `
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Username:</strong> ${userName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Preferred Category:</strong> ${interest}</p>
      <p><strong>Experience Level:</strong> ${level}</p>
      <p><strong>Goals:</strong> ${goals || "—"}</p>
      <p><strong>Newsletter:</strong> ${newsletter ? "Yes" : "No"}</p>
    `;

    // Make sure confirm button is visible on the summary step
    finalSubmit.style.display = "inline-block";

    // OPEN MODAL
    modal.classList.add("active");
    document.body.classList.add("no-scroll");
  });

  // === CLOSE MODAL HELPERS ===
  function closeModal() {
    modal.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }

  // CLOSE MODAL (X button)
  modalClose.addEventListener("click", closeModal);

  // CLOSE MODAL on overlay click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // === FINAL SUBMIT → SUCCESS STATE ===
  finalSubmit.addEventListener("click", () => {
    // Clear saved progress
    fields.forEach((id) => localStorage.removeItem("reg_" + id));
    form.reset();

    // Show success state inside modal
    if (modalTitle) {
      modalTitle.textContent = "Registration Successful 🎉";
    }

    modalContent.innerHTML = `
      <p>Your account has been created successfully.</p>
      <p>Welcome aboard!</p>
    `;

    // Hide the confirm button so they just close the success popup
    finalSubmit.style.display = "none";

    // Optional: auto-close after 1.5s
    setTimeout(() => {
      closeModal();
    }, 1500);
  });
});
