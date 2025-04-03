import { baseURL } from "./config.js";

document.getElementById("signInBtn").addEventListener("click", function (event) {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
      //Check Valid Username
    const usernameIsValid = /^[a-z0-9_]{3,50}$/.test(username);
    //Check Valid Password
    const passwordIsValid = /((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(password);
    // API
    const axiosInstance = axios.create({
      baseURL: baseURL,
      withCredentials: true,
    });

    if (!username || !password) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in both username and password.",
        confirmButtonColor: "#d33",
      });
      return;
    } else if (!usernameIsValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Username",
        text: "Username must be 3-50 characters and can only contain lowercase letters, numbers, and underscores.",
        confirmButtonColor: "#d33",
      });
      return;  // ← هذا يمنع استمرار الكود
    }else if (!passwordIsValid) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password ⚠️",
        text: "Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number or symbol.",
        confirmButtonColor: "#efb700",
      });
      return;  // ← هذا يمنع استمرار الكود
    }

    axiosInstance.post(`/api/v1/user/login`, {
      "username": username,
      "password": password
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
        title: "Login Successful ✅",
        text: "Welcome",
        confirmButtonText: "OK",
        confirmButtonColor: "#efb700",
      }) .then(() => {
        window.location.href = "/src/HTML/home.html";
      })

    })
    .catch((error) => {
      console.error("❌ Login Error:", error);

      let errorMessage = "An error occurred. Please try again.";

      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Status Code:", error.response.status);

        if (error.response.status === 400) {
          errorMessage = "Invalid username or password.";
        }else if (error.response.status === 401) {
          errorMessage = "Incorrect password. Please try again.";
       } else if (error.response.status === 429) {
          errorMessage = "Too many login attempts. Please try again later.";
        } else if (error.response.status === 404) {
          errorMessage = "User not found, not registered.";
        } 
        else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed ❌",
        text: errorMessage,
        confirmButtonColor: "#d33",
      }) .then(() => {
        document.getElementById("password").value = "";
      })
    });
  });

