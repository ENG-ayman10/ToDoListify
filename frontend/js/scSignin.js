const validUsername = "admin";
const validPassword = "1234";

document
  .getElementById("signInBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === validUsername && password === validPassword) {
      Swal.fire({
        icon: "success",
        title: "Login Successful ✅",
        text: "Welcome back!",
        confirmButtonText: "OK",
        confirmButtonColor: "#efb700",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed ❌",
        text: "Incorrect username or password.",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#d33",
      });
    }
  });
