import { baseURL } from "./config.js";

const gridContainer = document.getElementById("gridContainer");
const logOut_btn = document.getElementById("logOut");
let accessToken = localStorage.getItem("accessToken");

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
  });

// Get Tasks
const getTasks = async (token) => {
    try {
        let response = await axiosInstance.get(`/api/v1/task`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        let data = response.data;

        if (data.length === 0) {
            gridContainer.innerHTML = "<p class='text-gray-500 text-center mt-5'>There are no tasks available.</p>";
        } else {
            gridContainer.innerHTML = data.map((task, index) => `
                <div index="${index}" class="task-container w-[609px] h-[227px] bg-yellow-500 rounded-[52px] shadow-lg p-5 relative animate-slideIn">
                    <h2 class="absolute w-[94px] h-[44px] top-[14px] left-[135px] text-black flex items-center justify-center text-4xl font-extrabold rounded-lg">
                        ${task.title}
                    </h2>
                    <div class="absolute w-full right-4">
                        <a href="/src/HTML/update_task.html?index=${index}&task-id=${task.id}" class="cursor-pointer">
                            <i class="fa-solid fa-pen"></i>
                        </a>
                        <button class="delete_btn cursor-pointer size-3 " task-id="${task.id}">
                            <i class="fa-solid fa-trash size-full"></i>
                        </button>
                    </div>
                    <div class="absolute w-[70px] h-[70px] top-[70px] left-[33px] rounded-full ${getCircleColor(task.state)}"></div>
                    <div class="absolute w-[481px] h-[87px] top-[70px] left-[120px] p-3">
                        <p class="text-gray-800">${task.body}</p>
                    </div>
                    <div class="absolute top-[190px] left-[133px] flex space-x-5">
                        <button class="w-[120px] h-[30px] bg-white text-black text-[19px] font-black italic rounded-lg">
                            ${getState(task.state)}
                        </button>
                        <button class="w-[120px] h-[30px] bg-white text-black text-[19px] font-black italic rounded-lg">
                            ${new Date(task.create_at).toISOString().split("T")[0]}
                        </button>
                        <button class="w-[120px] h-[30px] bg-white text-black text-[19px] font-black italic rounded-lg">
                            ${task.priority}
                        </button>
                    </div>
                </div>
            `).join("");
        }
    } catch (error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    accessToken = refreshResponse.data.accessToken;
                    return getTasks(accessToken);
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
            } else if (status === 404) {
                gridContainer.innerHTML = "<p class='text-gray-500 text-center mt-5'>There are no tasks available.</p>";
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

getTasks(accessToken);

// Function for circle color
function getCircleColor(state) {
    if (state === "IN_PROGRESS") {
        return "bg-yellow-300";
    } else if (state === "TO_DO") {
        return "bg-[#FF0000]";
    } else if (state === "DONE") {
        return "bg-[#008000]";
    }
}

// Function for printing status
function getState(state) {
    if (state === "IN_PROGRESS") {
        return "In Progress";
    } else if (state === "TO_DO") {
        return "UnFinished";
    } else if (state === "DONE") {
        return "Finished";
    }
}

// Handle task deletion
async function deleteTask(id) {
    const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this task? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    });

    if (!isConfirmed) {
        return;
    }

    try {
        await axiosInstance.delete(`/api/v1/task/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        Swal.fire({
            icon: "success",
            title: "Task deleted ✅",
            text: "Your task has been deleted successfully.",
            confirmButtonText: "OK",
            confirmButtonColor: "#efb700",
        }).then(() => {
            getTasks(accessToken); // Reload the tasks after deletion
        });
    } catch (error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    accessToken = refreshResponse.data.accessToken;
                    return deleteTask(accessToken);
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
            } else if (status === 403) {
                Swal.fire({
                    icon: "error",
                    title: "Forbidden",
                    text: "You can not delete a task of another user.",
                    confirmButtonColor: "#d33",
                });
            } else if (status === 404) {
                Swal.fire({
                    icon: "error",
                    title: "Task Not Found",
                    text: "This task does not exist.",
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
}

// Event listener for delete button click on div
gridContainer.addEventListener("click", (event) => {
    if (event.target && event.target.matches("button.delete_btn")) {
        const taskId = event.target.getAttribute("task-id");
        console.log("Delete button clicked for task ID:", taskId);
        deleteTask(taskId);
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
        await axiosInstance.post(`/api/v1/user/logout`, null, {
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
                    const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
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