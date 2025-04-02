const delete_account_btn = document.getElementById("delete_account");
const logOut_btn = document.getElementById("logOut");
let email = document.getElementById("email");
let username = document.getElementById("username");
const accessToken = localStorage.getItem("accessToken");
const baseURL = "https://todolistify-backend.up.railway.app";

email.textContent=localStorage.getItem("email");
username.textContent=localStorage.getItem("username");



// Delete User Account
delete_account_btn.addEventListener("click", async () => {
    // Check the confirmation
    const confirmDelete = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone. Your account and all data will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete my account",
        cancelButtonText: "Cancel"
    });

    if (!confirmDelete.isConfirmed) {
        return;
    }

    const { value: password } = await Swal.fire({
        title: "Enter Your Password",
        input: "password",
        inputPlaceholder: "Your Password",
        inputAttributes: { autocapitalize: "off" },
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel"
    });

    if (!password) {
        return;
    }

    try {
        await axios.delete(`${baseURL}/api/v1/user/delete`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            data: { password } 
        });

        Swal.fire({
            icon: "success",
            title: "Account deleted ✅",
            text: "Your account has been deleted successfully.",
            confirmButtonText: "OK",
            confirmButtonColor: "#efb700"
        }).then(() => {
            localStorage.removeItem("accessToken"); 
            window.location.href = "/src/HTML/welcome.html";
        });

    } catch (error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axios.get(`${baseURL}/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    return delete_account_btn.click(); 
                } catch (refreshError) {
                    Swal.fire({
                        icon: "error",
                        title: "Session Expired",
                        text: "You have to log in again.",
                        confirmButtonColor: "#d33"
                    }).then(() => {
                        window.location.href = "/src/HTML/welcome.html";
                    });
                }
            } else if (status === 403) {
                Swal.fire({
                    icon: "error",
                    title: "Forbidden",
                    text: "You are not authorized to delete this account.",
                    confirmButtonColor: "#d33"
                });
            } else if (status === 404) {
                Swal.fire({
                    icon: "error",
                    title: "User Not Found",
                    text: "This account does not exist.",
                    confirmButtonColor: "#d33"
                });
            } else if (status === 500) {
                Swal.fire({
                    icon: "error",
                    title: "Server Error",
                    text: "Something went wrong. Please try again later.",
                    confirmButtonColor: "#d33"
                });
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: "Please check your internet connection and try again.",
                confirmButtonColor: "#d33"
            });
        }
    }
});

// Handle LogOut Button
logOut_btn.addEventListener("click", async () => {
    const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel"
    });

    // إذا لم يؤكد المستخدم تسجيل الخروج، يتم الخروج من الدالة
    if (!isConfirmed) {
        return;
    }

    try {
        await axios.post(`${baseURL}/api/v1/user/logout`, null, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        localStorage.removeItem("accessToken");

        window.location.href = "/index.html";
    }
    catch (error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axios.get(`${baseURL}/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    return delete_account_btn.click(); 
                } catch (refreshError) {
                    Swal.fire({
                        icon: "error",
                        title: "Session Expired",
                        text: "You have to log in again.",
                        confirmButtonColor: "#d33"
                    }).then(() => {
                        window.location.href = "/src/HTML/welcome.html";
                    });
                }
            }else if (status === 429) {
                Swal.fire({
                    icon: "error",
                    title: "Too Many Requests",
                    text: "You are making too many requests. Please try again later.",
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
});


