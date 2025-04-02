const openModal = document.getElementById("openModal");
const cancelModal = document.getElementById("cancelModal");
const modal = document.getElementById("modal");
const togglePassword = document.getElementById("togglePassword");
const nextStep = document.getElementById("nextStep");
const newPasswordModal = document.getElementById("newPasswordModal");
const closeNewPasswordModal = document.getElementById("closeNewPasswordModal");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const submitNewPassword = document.getElementById("submitNewPassword");
const submitNewData = document.getElementById("submitNewData");

// API
const baseURL = "https://todolistify-backend.up.railway.app";
let accessToken = localStorage.getItem("accessToken");

// Set Inputs
document.getElementById("fullname").value = localStorage.getItem("name").trim();
document.getElementById("email").value = localStorage.getItem("email").trim();
document.getElementById("username").value = localStorage.getItem("username").trim();


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
  const password = document.getElementById("password").value.trim();
  
  if (password.value !== "") {
      modal.classList.add("hidden");
      newPasswordModal.classList.remove("hidden");
      newPasswordModal.classList.add("flex");
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
  //Check Valid Password
  const passwordIsValid = /((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(newPassword);

  if (!passwordIsValid) {
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

    console.log("old",document.getElementById("password").value )
    console.log("new",newPassword )
    console.log("new",confirmPassword )

    const modifyPassword = async (token) => {
      try {
          await axios.patch(`${baseURL}/api/v1/user/update/pass`, {
            "oldPassword": document.getElementById("password").value,
            "password": newPassword,
            "confirmation": confirmPassword
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });
    
          Swal.fire({
            icon: "success",
            title: "✅ Password Updated",
            text: "Your password has been successfully updated!",
            confirmButtonText: "OK",
            confirmButtonColor: "#efb700",
          }).then(() => {
            newPasswordModal.classList.add("hidden");
          });
    
      } catch (error) {
          if (error.response) {
              const status = error.response.status;
    
              if (status === 401) {
                  try {
                      const refreshResponse = await axios.get(`${baseURL}/api/v1/user/refresh`);
                      localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                      accessToken = refreshResponse.data.accessToken;
                      return modifyPassword(accessToken); 
                  } catch (refreshError) {
                      if (refreshError.response && refreshError.response.status === 401) {
                          Swal.fire({
                              icon: "error",
                              title: "Session Expired",
                              text: "You have to log in again.",
                              confirmButtonColor: "#d33",
                          }).then(() => {
                              window.location.href = "/src/HTML/welcome.html";
                          });
                      }
                  }
              } else if (status === 400) {
                  Swal.fire({
                      icon: "error",
                      title: "Invalid Request",
                      text: "Please check your input and try again.",
                      confirmButtonColor: "#d33",
                  });
              }else if (status === 403) {
                Swal.fire({
                  icon: "error",
                  title: "Forbidden",
                  text: "You are not authorized to update this account.",
                  confirmButtonColor: "#d33",
                });
              } else if (status === 404) {
                Swal.fire({
                  icon: "error",
                  title: "User Not Found",
                  text: "This account does not exist.",
                  confirmButtonColor: "#d33",
                });
              } else if (status === 500) {
                  Swal.fire({
                      icon: "error",
                      title: "Server Error",
                      text: "Something went wrong. Please try again later.",
                      confirmButtonColor: "#d33",
                  });
              }
          } else {
              Swal.fire({
                  icon: "error",
                  title: "Network Error",
                  text: "Please check your internet connection and try again.",
                  confirmButtonColor: "#d33",
              });
          }
      }
    };
    
    modifyPassword(accessToken);
  }
});

// Handle updated data

submitNewData.addEventListener("click", (e) => {
  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  e.preventDefault();
  if (!fullname || !email || !username) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill in all the fields.",
      confirmButtonColor: "#efb700",
    });
  } else {
    const modifyUserInformation = async (token) => {
      try {
          const response = await axios.patch(`${baseURL}/api/v1/user/update/info`, {
            "name": fullname,
            "username": username,
            "email": email,
          }, {
              headers: { Authorization: `Bearer ${token}` }
          })
            // Save token to local storage
            localStorage.setItem("accessToken", response.data.accessToken);
            // Save Information to local storage
            localStorage.setItem("name", response.data.user.name);
            localStorage.setItem("username", response.data.user.username);
            localStorage.setItem("email", response.data.user.email);
            localStorage.setItem("update_at", response.data.user.update_at);

            Swal.fire({
              icon: "success",
              title: "✅ information Updated",
              text: "Your information has been successfully updated!",
              confirmButtonText: "OK",
              confirmButtonColor: "#efb700",
            })
      } catch (error) {
          if (error.response) {
              const status = error.response.status;
    
              if (status === 401) {
                  try {
                      const refreshResponse = await axios.get(`${baseURL}/api/v1/user/refresh`);
                      localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                      accessToken = refreshResponse.data.accessToken;
                      return modifyUserInformation(accessToken); 
                  } catch (refreshError) {
                      if (refreshError.response && refreshError.response.status === 401) {
                          Swal.fire({
                              icon: "error",
                              title: "Session Expired",
                              text: "You have to log in again.",
                              confirmButtonColor: "#d33",
                          }).then(() => {
                              window.location.href = "/src/HTML/welcome.html";
                          });
                      }
                  }
              } else if (status === 400) {
                  Swal.fire({
                      icon: "error",
                      title: "Invalid Request",
                      text: "Please check your input and try again.",
                      confirmButtonColor: "#d33",
                  });
              }else if (status === 403) {
                Swal.fire({
                  icon: "error",
                  title: "Forbidden",
                  text: "You are not authorized to update this account.",
                  confirmButtonColor: "#d33",
                });
              } else if (status === 404) {
                Swal.fire({
                  icon: "error",
                  title: "User Not Found",
                  text: "This account does not exist.",
                  confirmButtonColor: "#d33",
                });
              } else if (status === 500) {
                  Swal.fire({
                      icon: "error",
                      title: "Server Error",
                      text: "Something went wrong. Please try again later.",
                      confirmButtonColor: "#d33",
                  });
              }
          } else {
              Swal.fire({
                  icon: "error",
                  title: "Network Error",
                  text: "Please check your internet connection and try again.",
                  confirmButtonColor: "#d33",
              });
          }
      }
    };
    
    modifyUserInformation(accessToken);
  }

  }
)

// Close new password modal
closeNewPasswordModal.addEventListener("click", function () {
  newPasswordModal.classList.add("hidden");
});
