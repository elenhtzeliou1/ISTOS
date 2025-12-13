(function () {
  function init() {
    const form = document.getElementById("register-form");
    if (!form) return;
    if (form.dataset.bound === "1") return;
    form.dataset.bound = "1";

    const modal = document.getElementById("summary-modal");
    const modalClose = document.getElementById("summary-close");
    const modalContent = document.getElementById("summary-content");
    const finalSubmit = document.getElementById("final-submit");
    const modalTitle = modal ? modal.querySelector("h2") : null;

    if (!modal || !modalContent || !finalSubmit) return;

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

    fields.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const saved = localStorage.getItem("reg_" + id);
      if (saved === null) return;

      if (el.type === "checkbox") el.checked = saved === "true";
      else el.value = saved;
    });

    fields.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const save = () => {
        if (el.type === "checkbox")
          localStorage.setItem("reg_" + id, String(el.checked));
        else localStorage.setItem("reg_" + id, el.value);
      };

      el.addEventListener("input", save);
      el.addEventListener("change", save);
    });

    function closeModal() {
      modal.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }

    modalClose?.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active"))
        closeModal();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const firstName = (
        document.getElementById("firstName")?.value || ""
      ).trim();
      const lastName = (
        document.getElementById("lastName")?.value || ""
      ).trim();
      const fullName = `${firstName} ${lastName}`.trim();

      const userName = (
        document.getElementById("userName")?.value || ""
      ).trim();
      const email = (document.getElementById("email")?.value || "").trim();
      const dob = document.getElementById("dob")?.value || "";
      const password = document.getElementById("password")?.value || "";
      const confirm = document.getElementById("confirmPassword")?.value || "";
      const interest = document.getElementById("interest")?.value || "";
      const goals = (document.getElementById("goals")?.value || "").trim();
      const newsletter = !!document.getElementById("newsletter")?.checked;
      const level = document.getElementById("level")?.value || "";

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
      )
        age--;

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

      if (modalTitle) modalTitle.textContent = "Review Your Information";

      modalContent.innerHTML = `
        <p><strong>Name:</strong> ${fullName || "—"}</p>
        <p><strong>Username:</strong> ${userName || "—"}</p>
        <p><strong>Email:</strong> ${email || "—"}</p>
        <p><strong>Preferred Category:</strong> ${interest || "—"}</p>
        <p><strong>Experience Level:</strong> ${level || "—"}</p>
        <p><strong>Goals:</strong> ${goals || "—"}</p>
        <p><strong>Newsletter:</strong> ${newsletter ? "Yes" : "No"}</p>
      `;

      finalSubmit.style.display = "inline-block";
      modal.classList.add("active");
      document.body.classList.add("no-scroll");
    });

    finalSubmit.addEventListener("click", () => {
      fields.forEach((id) => localStorage.removeItem("reg_" + id));
      form.reset();

      if (modalTitle) modalTitle.textContent = "Registration Successful!";

      modalContent.innerHTML = `
        <p>Your account has been created successfully.</p>
        <p>Welcome to InfoHub!</p>
      `;

      finalSubmit.style.display = "none";

      setTimeout(() => {
        modal.classList.remove("active");
        document.body.classList.remove("no-scroll");
      }, 1500);
    });
  }

  window.RegisterForm = { init };
})();
