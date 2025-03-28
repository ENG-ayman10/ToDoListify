const storedPassword = "123456789";
const openModal = document.getElementById("openModal");
const cancelModal = document.getElementById("cancelModal");
const modal = document.getElementById("modal");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const nextStep = document.getElementById("nextStep");
const newPasswordModal = document.getElementById("newPasswordModal");
const closeNewPasswordModal = document.getElementById("closeNewPasswordModal");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const submitNewPassword = document.getElementById("submitNewPassword");

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

//for appear/disappear arrow
const inputs = document.querySelectorAll(".input-field");

inputs.forEach((input) => {
  const arrow = input.parentElement.querySelector("span");

  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      arrow.style.display = "none";
    } else {
      arrow.style.display = "block";
    }
  });
});

//for appear/disappear eye
document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.classList.remove("fa-eye-slash");
      eyeIcon.classList.add("fa-eye");
    } else {
      passwordInput.type = "password";
      eyeIcon.classList.remove("fa-eye");
      eyeIcon.classList.add("fa-eye-slash");
    }
  });

// Proceed to the next modal when clicking "Next"
nextStep.addEventListener("click", (event) => {
  event.preventDefault();
  const password = passwordInput.value.trim();

  if (password === storedPassword) {
    Swal.fire({
      icon: "success",
      title: "✅ Password is correct",
      text: "you will be redirected to the next modal.",
      confirmButtonText: "OK",
      confirmButtonColor: "#efb700",
      allowOutsideClick: false,
      allowEscapeKey: false,
      timer: null,
    }).then(() => {
      modal.classList.add("hidden");
      newPasswordModal.classList.remove("hidden");
      newPasswordModal.classList.add("flex");
    });
    // Here, you can open the second modal
  } else {
    Swal.fire({
      icon: "error",
      title: "❌ Invalid Password",
      text: "Please Enter a Valid Password",
      confirmButtonText: "Try Again",
      confirmButtonColor: "#d33",
      allowOutsideClick: false,
      allowEscapeKey: false,
      timer: null,
    });
  }
});

// Handle new password submission
submitNewPassword.addEventListener("click", function () {
  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (newPassword.length < 8) {
    Swal.fire({
      icon: "error",
      title: "⚠️ Weak Password",
      text: "Password must be at least 8 characters long!",
      confirmButtonText: "Try Again",
      confirmButtonColor: "#d33",
    });
  } else if (newPassword !== confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "❌ Passwords Do Not Match",
      text: "Please ensure both passwords are the same!",
      confirmButtonText: "Try Again",
      confirmButtonColor: "#d33",
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "✅ Password Updated",
      text: "Your password has been successfully updated!",
      confirmButtonText: "OK",
      confirmButtonColor: "#efb700",
    }).then(() => {
      newPasswordModal.classList.add("hidden");
    });
  }
});

// Close new password modal
closeNewPasswordModal.addEventListener("click", function () {
  newPasswordModal.classList.add("hidden");
});
