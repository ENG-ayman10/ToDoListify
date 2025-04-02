document.addEventListener('DOMContentLoaded', () => {
    const baseURL = "https://todolistify-backend.up.railway.app";
    let accessToken = localStorage.getItem("accessToken");

    async function checkLoged() {
        try {
            const refreshResponse = await axios.get(`${baseURL}/api/v1/user/refresh`);
            localStorage.setItem("accessToken", refreshResponse.data.accessToken);
            setTimeout(()=> {
                window.location.href = "/src/HTML/home.html"
            }, 2500)
        } catch (refreshError) {
            if (refreshError.response && refreshError.response.status === 401) {
                    setTimeout(()=> {
                        window.location.href = "/src/HTML/welcome.html";
                    }, 2500)
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Server Error",
                        text: "Something went wrong. Please try again later.",
                        confirmButtonColor: "#d33"
                    });
                }
            }
        }

    if(accessToken) {
        checkLoged()
    } else {
        setTimeout(()=> {
            window.location.href = "/src/HTML/welcome.html";
        }, 2500)
    }
})
