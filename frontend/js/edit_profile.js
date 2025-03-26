const openModal = document.getElementById("openModal");
const cancelModal = document.getElementById("cancelModal");
const modal = document.getElementById("modal");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const nextStep = document.getElementById("nextStep");

// Prevent page reload when clicking the button
openModal.addEventListener("click", (event) => {
  event.preventDefault(); // ⬅️ Prevent data loss due to page reload
  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

// Close the modal without clearing the input fields
cancelModal.addEventListener("click", () => {
  modal.classList.remove("flex");
  modal.classList.add("hidden");
});

// Toggle password visibility
togglePassword.addEventListener("click", () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

// Proceed to the next modal when clicking "Next"
nextStep.addEventListener("click", () => {
  const password = passwordInput.value.trim();

  if (password.length >= 6) {
    alert("✅ Password is correct, you will be redirected to the next modal.");
    // Here, you can open the second modal
  } else {
    alert("❌ Password must be at least 6 characters long!");
  }
});
