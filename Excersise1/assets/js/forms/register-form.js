// register-form.js
// This file handles:
// 1) Registering a user (save profile to localStorage)
// 2) 'Profile mode' (if a user is already active, show/edit their saved info)
// 3) Showing the active user’s enrollments on the register/profile page
// 4) Reset button: deletes ONLY the active user’s data (profile + enrollments + reviews), but keeps other users' data
//
// Note: localStorage is browser storage. Data stays even after refresh/close, until you clear it or reset.


(function () {
  //LocalStorage keys that are used across the app
  // ih means infohub
  const LS = {
    USERS: "ih_users", // array of saved user profiles
    ACTIVE: "ih_activeUserId", // currently 'logged in' user
    ENROLLMENTS: "ih_enrollments", // array of enrollemnts/course subscriptions user has done  one enrollment: {userId, courseId, enrolledAt}
  };

  // USER: load/save helpers
  // Read all users from localStorage (safe: returns [] if missing/broken)
  function loadUsers() {
    try {
      const raw = localStorage.getItem(LS.USERS);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  // Save all users back to localStorage
  function saveUsers(users) {
    localStorage.setItem(LS.USERS, JSON.stringify(users));
  }

  // Get active user id (string) or "" if none
  function getActiveUserId() {
    const v = localStorage.getItem(LS.ACTIVE);
    return v ? String(v) : "";
  }

  // set active user id (stored as string)
  function setActiveUserId(id) {
    localStorage.setItem(LS.ACTIVE, String(id));
  }

  // find user object by id inside an array
  function findUserById(users, id) {
    return users.find((u) => String(u.id) === String(id)) || null;
  }

  //generate the next user id. never smaller than 1000 so we avoid conflicts
  function nextUserId(users) {
    const max = users.reduce((m, u) => Math.max(m, Number(u.id) || 0), 0);
    return Math.max(1000, max + 1);
  }

  //----------------------//
  //----------------------//
  //----------------------//

  // ENROLMENTS: load and render helpers

  // Read enrollments from local storage
  function loadEnrollments() {
    try {
      const raw = localStorage.getItem(LS.ENROLLMENTS);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  //render enrollments list in register/profile page for the active user
  function renderEnrollmentsForActiveUser() {
    const panel = document.getElementById("enrollments-panel");
    const list = document.getElementById("enrollments-list");
    if (!panel || !list) return;

    const uid = getActiveUserId();

    //always show the panel
    panel.hidden = false;
    list.textContent = "";

    //1. if not register:
    if (!uid) {
      const li = document.createElement("li");
      li.textContent = "You must register in order to enroll to courses!";
      list.appendChild(li);
      return;
    }

    //2. User registered -> load enrollments:
    const enrollments = loadEnrollments()
      .filter((e) => String(e.userId) === String(uid))
      .sort((a, b) => String(b.enrolledAt).localeCompare(String(a.enrolledAt)));

    // Regisered user but no enrollments!
    if (!enrollments.length) {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode("No enrollments yet. "));

      const a = document.createElement("a");
      a.href = "courses.html";
      a.textContent = "Browse Courses";
      li.appendChild(a);

      list.appendChild(li);
      return;
    }

    //Registered user WITH ENROLLMENS! -> Show enrollemnts list
    enrollments.forEach((e) => {
      const li = document.createElement("li");

      //link to course details page
      const a = document.createElement("a");
      a.href = `course-details.html?id=${encodeURIComponent(e.courseId)}`;

      // show title if COURSES exist, otherwise show the courseId
      const courseTitle =
        window.COURSES?.find((c) => String(c.id) === String(e.courseId))
          ?.title || e.courseId;

      a.textContent = courseTitle;

      // show enrollment date
      const small = document.createElement("small");
      const d = e.enrolledAt ? new Date(e.enrolledAt) : null;
      small.textContent =
        d && !Number.isNaN(d.getTime())
          ? ` (enrolled: ${d.toLocaleDateString()})`
          : "";

      li.appendChild(a);
      li.appendChild(small);
      list.appendChild(li);
    });
  }

  // end load enrollments in register / profile page
  //------------------------------------------//
  //------------------------------------------//
  //------------------------------------------//

  //------------ MAIN INIT ------------------ //
  function init() {
    const form = document.getElementById("register-form");
    if (!form) return;

    // Prevent double-binding events if init runs twice
    if (form.dataset.bound === "1") return;
    form.dataset.bound = "1";

    const resetBtn = document.getElementById("reset-account-btn");

    // Switch the page to “Profile mode” when user already exists
    function setProfileModeUI(form, resetBtn) {
      const main = document.querySelector("main.register-container");

      main
        ?.querySelector("h1")
        ?.replaceChildren(document.createTextNode("Your Profile"));

      main
        ?.querySelector("p")
        ?.replaceChildren(
          document.createTextNode(
            "You’re now registered! Here you can update your information and see the courses you’re subscribed to."
          )
        );

      form
        .querySelector('button[type="submit"]')
        ?.replaceChildren(document.createTextNode("Update Profile"));

      // Password fields are not required when updating profile
      document.getElementById("password")?.removeAttribute("required");
      document.getElementById("confirmPassword")?.removeAttribute("required");

      // Show reset button in profile mode
      if (resetBtn) resetBtn.hidden = false;
    }

    // Modal elements used for summary + final confirmation
    const modal = document.getElementById("summary-modal");
    const modalClose = document.getElementById("summary-close");
    const modalContent = document.getElementById("summary-content");
    const finalSubmit = document.getElementById("final-submit");
    const modalTitle = modal ? modal.querySelector("h2") : null;

    // If modal is missing, stop (our flow depends on it)
    if (!modal || !modalContent || !finalSubmit) return;

    // Fields WE save as drafts (reg_* keys) while typing
    // (Passwords are not saved on purpose.)
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

    // ---- Restore existing profile OR restore draft form ----//

    const usersAtLoad = loadUsers();
    const activeId = getActiveUserId();
    const activeUser = activeId ? findUserById(usersAtLoad, activeId) : null;

    if (activeUser) {
      // If a user is active, prefill form from ih_users
      const map = {
        firstName: activeUser.firstName,
        lastName: activeUser.lastName,
        userName: activeUser.userName,
        email: activeUser.email,
        dob: activeUser.dob,
        interest: activeUser.interest,
        level: activeUser.level,
        newsletter: !!activeUser.newsletter,
      };

      Object.entries(map).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.type === "checkbox") el.checked = !!val;
        else el.value = val ?? "";
      });

      // Restore radio goal
      if (activeUser.goal) {
        const radio = form.querySelector(
          `input[name="goal"][value="${activeUser.goal}"]`
        );
        if (radio) radio.checked = true;
      }
      // Update UI to profile mode
      setProfileModeUI(form, resetBtn);
    } else {
      //No active user => restore drafts (reg_*)
      fields.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const saved = localStorage.getItem("reg_" + id);
        if (saved === null) return;

        if (el.type === "checkbox") el.checked = saved === "true";
        else el.value = saved;
      });

      // Restore draft goal radio
      const savedGoal = localStorage.getItem("reg_goal");
      if (savedGoal) {
        const radio = form.querySelector(
          `input[name="goal"][value="${
            CSS?.escape ? CSS.escape(savedGoal) : savedGoal
          }"]`
        );
        if (radio) radio.checked = true;
      }
    }

    // ---- Save drafts to localStorage while user types ----//
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

    // Helper FUNC: save enrollments array
    function saveEnrollments(items) {
      localStorage.setItem(LS.ENROLLMENTS, JSON.stringify(items));
    }
    // ---- Reset account button logic ----
    // Removes ONLY the active user's data (profile + enrollments + reviews) but keeps other users.
    function resetDemoAccount() {
      const ok = confirm(
        "This will delete your saved profile informations, your enrollments and your reviews on this browser.Do you want to continue?"
      );
      if (!ok) return;

      const uid = getActiveUserId();
      if (!uid) return;

      // 1) Remove ONLY this user's reviews
      // (Keeps other users' reviews)
      try {
        const raw = localStorage.getItem("ih_reviews");
        const items = raw ? JSON.parse(raw) : [];
        if (Array.isArray(items)) {
          const kept = items.filter((r) => String(r.userId) !== String(uid));
          localStorage.setItem("ih_reviews", JSON.stringify(kept));
        }
      } catch {}

      // 2) Remove ONLY this user's enrollments
      const enrollments = loadEnrollments();
      const keptEnrollments = enrollments.filter(
        (e) => String(e.userId) !== String(uid)
      );
      saveEnrollments(keptEnrollments);

      // 3) Remove ONLY this user's profile from ih_users
      const users = loadUsers();
      const keptUsers = users.filter((u) => String(u.id) !== String(uid));
      saveUsers(keptUsers);

      // 4) Log out (remove active session)
      localStorage.removeItem(LS.ACTIVE);

      // 5) Clear draft fields (optional)
      fields.forEach((fid) => localStorage.removeItem("reg_" + fid));
      localStorage.removeItem("reg_goal");

      // Refresh nav labels and reload register page
      window.Layout?.refreshAccountUI?.();
      window.location.href = "register.html";
    }
    // Bind reset button once
    if (resetBtn && resetBtn.dataset.bound !== "1") {
      resetBtn.dataset.bound = "1";
      resetBtn.addEventListener("click", resetDemoAccount);
    }

    // Save goal radio selection into reg_goal draft key
    form.querySelectorAll('input[name="goal"]').forEach((r) => {
      r.addEventListener("change", () => {
        if (r.checked) localStorage.setItem("reg_goal", r.value);
      });
    });

    // ----------------------------------//
    // ----------------------------------//
    // ----------------------------------//

    // ------ Modal helpers ------------//
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

    // Pretty labels for summary modal
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
    // Render summary safely (no innerHTML with user input)
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

    // ---- Submit: validate + show summary modal -------- //
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Running HTML5 validation (required/type=email/pattern/etc)
      if (!form.reportValidity()) return;

      // Read current registration form values
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

      // Extra safety checks +over 18 check
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

      const userWantsPasswordChange = Boolean(password || confirm);
      if (userWantsPasswordChange && password !== confirm) {
        alert("Passwords do not match.");
        return;
      }

      if (!level) {
        alert("Please select your experience level.");
        return;
      }

      if (modalTitle) modalTitle.textContent = "Review Your Information";

      // Show review summary in modal
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

    // ---- Final submit: save profile to ih_users and set active user ----
    finalSubmit.addEventListener("click", () => {
      // 1) Read current form values (same way you already do in submit)
      const profile = {
        firstName: (document.getElementById("firstName")?.value || "").trim(),
        lastName: (document.getElementById("lastName")?.value || "").trim(),
        userName: (document.getElementById("userName")?.value || "").trim(),
        email: (document.getElementById("email")?.value || "").trim(),
        dob: document.getElementById("dob")?.value || "",
        interest: document.getElementById("interest")?.value || "",
        level: document.getElementById("level")?.value || "",
        newsletter: !!document.getElementById("newsletter")?.checked,
        goal: form.querySelector('input[name="goal"]:checked')?.value || "",
        updatedAt: new Date().toISOString(),
      };

      // 2) Upsert into ih_users
      const users = loadUsers();
      const activeId = getActiveUserId();
      const existing = activeId ? findUserById(users, activeId) : null;

      let id;
      if (existing) {
        id = existing.id;
        Object.assign(existing, profile);
      } else {
        id = nextUserId(users);
        users.push({ id, createdAt: new Date().toISOString(), ...profile });
      }

      // Save and set active user
      saveUsers(users);
      setActiveUserId(id);

      // Update enrollments panel and UI mode immediately
      renderEnrollmentsForActiveUser();
      setProfileModeUI(form, resetBtn); // instantly changes page without reload

      // Clear draft data since profile is now saved
      fields.forEach((fid) => localStorage.removeItem("reg_" + fid));
      localStorage.removeItem("reg_goal");

      // Show success message in modal
      if (modalTitle) modalTitle.textContent = "Saved!";
      modalContent.textContent = "";
      const p = document.createElement("p");
      p.textContent = "Your profile is saved and active on this browser.";
      modalContent.appendChild(p);

      finalSubmit.style.display = "none";

      // Refresh layout navigation text (Register -> Profile etc.)
      window.Layout?.refreshAccountUI?.();

      // Auto close modal after a short delay
      setTimeout(() => closeModal(), 900);
    });
    // Render enrollments on first load
    renderEnrollmentsForActiveUser();
  }
  // Expose init so app.js can call RegisterForm.init()
  window.RegisterForm = { init };
})();
