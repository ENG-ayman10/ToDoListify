import { baseURL } from "./config.js";

document.getElementById("signup").addEventListener("click", function (event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm_password = document
    .getElementById("confirm_password")
    .value.trim();
  // API
  const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
  });
  //Check Name no have any numbers or symbols
  const nameIsValid = /^[a-zA-Z\s]{2,255}$/.test(fullname);
  //Check Valid Username
  const usernameIsValid = /^[a-z0-9_]{3,50}$/.test(username);
  //Check Valid Email
  const emailIsValid =
    /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|mil|info|io|co)$/i.test(email);
  //Check Valid Password
  const passwordIsValid =
    /((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(password);

  if (!fullname || !email || !username || !password || !confirm_password) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill in all the fields.",
      confirmButtonColor: "#efb700",
    });
    return; // ← هذا يمنع استمرار الكود
  } else if (!nameIsValid) {
    Swal.fire({
      icon: "error",
      title: "Invalid Full Name",
      text: "Full name should not contain numbers or symbols.",
      confirmButtonColor: "#d33",
    });
    return; // ← هذا يمنع استمرار الكود
  } else if (!usernameIsValid) {
    Swal.fire({
      icon: "error",
      title: "Invalid Username",
      text: "Username must be 3-50 characters and can only contain lowercase letters, numbers, and underscores.",
      confirmButtonColor: "#d33",
    });
    return; // ← هذا يمنع استمرار الكود
  } else if (!emailIsValid) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address.",
      confirmButtonColor: "#d33",
    });
    return; // ← هذا يمنع استمرار الكود
  } else if (!passwordIsValid) {
    Swal.fire({
      icon: "warning",
      title: "Weak Password ⚠️",
      text: "Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number or symbol.",
      confirmButtonColor: "#efb700",
    });
    return; // ← هذا يمنع استمرار الكود
  } else if (password !== confirm_password) {
    Swal.fire({
      icon: "error",
      title: "Password Mismatch",
      text: "Passwords do not match.",
      confirmButtonColor: "#d33",
    });
    return; // ← هذا يمنع استمرار الكود
  } else {
    axiosInstance
      .post(`/api/v1/user/register`, {
        name: fullname,
        username: username,
        email: email,
        password: password,
        confirmation: confirm_password,
      })
      .then((response) => {
        // Save token to local storage
        localStorage.setItem("accessToken", response.data.accessToken);
        // Save Information to local storage
        localStorage.setItem("user_id", response.data.user.id);
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("create_at", response.data.user.create_at);

        Swal.fire({
          icon: "success",
          title: "Registration Successful 🎉",
          text: "Your account has been created!",
          confirmButtonColor: "#efb700",
        }).then(() => {
          window.location.href = "/src/HTML/sign_in.html";
        });
      })
      .catch((error) => {
        console.error("❌ Error Occurred:");

        if (error.response) {
          const status = error.response.status;

          console.error("Error Response Data:", error.response.data);
          console.error("Status Code:", status);

          if (status === 302) {
            Swal.fire({
              icon: "error",
              title: "Username or Email Taken",
              text: "This username or email is already registered. Try another one!",
              confirmButtonColor: "#d33",
            });
          } else if (status === 400) {
            Swal.fire({
              icon: "warning",
              title: "Invalid Request",
              text: "Please check your inputs and try again.",
              confirmButtonColor: "#efb700",
            });
          } else if (status === 429) {
            Swal.fire({
              icon: "error",
              title: "Too Many Requests",
              text: "You're making too many requests! Try again later.",
              confirmButtonColor: "#d33",
            });
          } else if (status === 500) {
            Swal.fire({
              icon: "error",
              title: "Server Error",
              text: "Something went wrong on our end. Please try again later.",
              confirmButtonColor: "#d33",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Unknown Error",
              text: "An unexpected error occurred. Please try again.",
              confirmButtonColor: "#d33",
            });
          }
        } else if (error.request) {
          console.error("No Response Received:", error.request);
          Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "Couldn't connect to the server. Please check your internet connection.",
            confirmButtonColor: "#d33",
          });
        } else {
          console.error("Request Error:", error.message);
          Swal.fire({
            icon: "error",
            title: "Unexpected Error",
            text: "An error occurred: ${error.message}",
            confirmButtonColor: "#d33",
          });
        }
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

//toggle for password field
document
  .getElementById("togglePassword1")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon1");

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

// toggle for confirm password field
document
  .getElementById("togglePassword2")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("confirm_password");
    const eyeIcon = document.getElementById("eyeIcon2");

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
