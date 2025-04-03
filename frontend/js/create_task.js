import { baseURL } from "./config.js";
document.getElementById("submit").addEventListener("click", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const describe = document.getElementById("describe").value.trim();
    const status = document.getElementById("status").value;
    const priority = document.getElementById("priority").value;
    let accessToken = localStorage.getItem("accessToken");

    const axiosInstance = axios.create({
        baseURL: baseURL,
        withCredentials: true,
      });

    if (!title || !describe || !status || !priority) {
        Swal.fire({
            icon: "warning",
            title: "Missing Fields",
            text: "Please fill in all the fields.",
            confirmButtonColor: "#efb700",
        });
        return;
    } 

    if (title.length < 1 || title.length > 255) {
        Swal.fire({
            icon: "error",
            title: "Invalid Title",
            text: "Title must be between 1 and 255 characters.",
            confirmButtonColor: "#d33",
        });
        return;
    }

    const createTask = async (token) => {
        try {
            const response = await axiosInstance.post(`/api/v1/task/create`, {
                "title": title,
                "body": describe,
                "state": status,
                "priority": priority
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({
                icon: "success",
                title: "Task Created ✅",
                text: "Your task has been created successfully.",
                confirmButtonText: "OK",
                confirmButtonColor: "#efb700",
            }) .then(() => {
                document.getElementById("title").value = "";
                document.getElementById("describe").value = "";
                document.getElementById("status").value = "";
                document.getElementById("priority").value = "";
            })

        } catch (error) {
            if (error.response) {
                const status = error.response.status;

                if (status === 401) {
                    try {
                        const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
                        localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                        accessToken = refreshResponse.data.accessToken;
                        return createTask(accessToken); 
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
                }else if (status === 429) { 
                    Swal.fire({
                        icon: "error",
                        title: "Too Many Requests",
                        text: "You are making too many requests. Please try again later.",
                        confirmButtonColor: "#d33",
                    });
                }else if (status === 500) {
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

    createTask(accessToken);
});
