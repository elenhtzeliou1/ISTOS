// handling register form logic
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

    // saving only non-sensitive fields (not storing passwords)
    const fields = [
      "firstName",
      "lastName",
      "userName",
      "email",
      "dob",
      "interest",
      "level",
      "newsletter",
    ];

    // local storage restore
    fields.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const saved = localStorage.getItem("reg_" + id);
      if (saved === null) return;

      if (el.type === "checkbox") el.checked = saved === "true";
      else el.value = saved;
    });

    // restore goal radio
    const savedGoal = localStorage.getItem("reg_goal");
    if (savedGoal) {
      const radio = form.querySelector(
        `input[name="goal"][value="${
          CSS?.escape ? CSS.escape(savedGoal) : savedGoal
        }"]`
      );
      if (radio) radio.checked = true;
    }

    // localStorage save
    fields.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const save = () => {
        if (el.type === "checkbox") {
          localStorage.setItem("reg_" + id, String(el.checked));
        } else {
          localStorage.setItem("reg_" + id, el.value);
        }
      };

      el.addEventListener("input", save);
      el.addEventListener("change", save);
    });

    // save goal radio 
    form.querySelectorAll('input[name="goal"]').forEach((r) => {
      r.addEventListener("change", () => {
        if (r.checked) localStorage.setItem("reg_goal", r.value);
      });
    });

    // Modal helpers
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

    function prettyGoal(v) {
      switch (v) {
        case "exam-prep":
          return "Exam preparation";
        case "portfolio":
          return "Build a portfolio";
        case "career":
          return "Career growth";
        case "curiosity":
          return "Learn out of curiosity";
        default:
          return "—";
      }
    }

    function renderSummary(rows) {
      // safe render (no innerHTML with user input)
      modalContent.textContent = "";
      rows.forEach(([label, value]) => {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = label + ": ";
        p.appendChild(strong);
        p.appendChild(document.createTextNode(value || "—"));
        modalContent.appendChild(p);
      });
    }

    //Submit 
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Running HTML5 validation (required/type=email/pattern/etc)
      if (!form.reportValidity()) return;

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
      const level = document.getElementById("level")?.value || "";
      const newsletter = !!document.getElementById("newsletter")?.checked;

      const goal =
        form.querySelector('input[name="goal"]:checked')?.value || "";

      // Extra safety checks 
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

      if (modalTitle) modalTitle.textContent = "Review Your Information";

      renderSummary([
        ["Name", fullName],
        ["Username", userName],
        ["Email", email],
        ["Preferred Category", interest],
        ["Experience Level", level],
        ["Learning Goal", prettyGoal(goal)],
        ["Newsletter", newsletter ? "Yes" : "No"],
      ]);

      finalSubmit.style.display = "inline-block";
      modal.classList.add("active");
      document.body.classList.add("no-scroll");
    });

    //Final Confirmation
    finalSubmit.addEventListener("click", () => {
      fields.forEach((id) => localStorage.removeItem("reg_" + id));
      localStorage.removeItem("reg_goal");

      form.reset();

      if (modalTitle) modalTitle.textContent = "Registration Successful!";

      modalContent.textContent = "";
      const p1 = document.createElement("p");
      p1.textContent = "Your account has been created successfully.";
      const p2 = document.createElement("p");
      p2.textContent = "Welcome to InfoHub!";
      modalContent.appendChild(p1);
      modalContent.appendChild(p2);

      finalSubmit.style.display = "none";

      setTimeout(() => {
        closeModal();
      }, 1500);
    });
  }

  window.RegisterForm = { init };
})();
