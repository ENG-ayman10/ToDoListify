document.getElementById("signup").addEventListener("click", function (event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  //Check Name no have any numbers or symbols
  const nameIsValid = /^[a-zA-Z\s]+$/.test(fullname);
  //Check Valid Email
  const emailIsValid =
    /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|mil|info|io|co)$/i.test(email);

  if (!fullname || !email || !username || !password) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill in all the fields.",
      confirmButtonColor: "#efb700",
    });
  } else if (!nameIsValid) {
    Swal.fire({
      icon: "error",
      title: "Invalid Full Name",
      text: "Full name should not contain numbers or symbols.",
      confirmButtonColor: "#d33",
    });
  } else if (!emailIsValid) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address.",
      confirmButtonColor: "#d33",
    });
  } else if (password.length < 8) {
    Swal.fire({
      icon: "warning",
      title: "Weak Password ⚠️",
      text: "Your password must be at least 8 characters long.",
      confirmButtonColor: "#efb700",
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "Registration Successful 🎉",
      text: "Your account has been created!",
      confirmButtonColor: "#efb700",
    });
  }
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
