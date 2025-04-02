let accessToken = localStorage.getItem("accessToken");
// API
const baseURL = "https://todolistify-backend.up.railway.app";

const params = new URLSearchParams(window.location.search);
const index = params.get("index"); // استرجاع قيمة index من الـ URL
const task_id = params.get("task-id"); // استرجاع قيمة index من الـ URL

const getTasks = async (token) => {
    try {
        let response = await axios.get(`${baseURL}/api/v1/task`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }) 
            let data = response.data;
            document.getElementById("title").value = data[index].title;
            document.getElementById("describe").value = data[index].body;
            document.getElementById("status").value = data[index].state;
            document.getElementById("priority").value = data[index].priority;

    } catch (error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axios.get(`${baseURL}/api/v1/user/refresh`);
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
                Swal.fire({
                    icon: "error",
                    title: "NotFound",
                    text: "There is no tasks.",
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

getTasks(accessToken);

const updateTask = async (task_id, token, title, describe, status, priority) => {
    try{
        await axios.patch(`${baseURL}/api/v1/task/update/${task_id}`, {
            "title": title,
            "body": describe,
            "state": status,
            "priority": priority
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
       
            
            Swal.fire({
                icon: "success",
                title: "Task Updated ✅",
                text: "Your task has been updated successfully.",
                confirmButtonText: "OK",
                confirmButtonColor: "#efb700",
            }) .then(() => {
                window.location.href = "/src/HTML/home.html"
            })
        
    }

    catch (error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axios.get(`${baseURL}/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    accessToken = refreshResponse.data.accessToken;
                    return updateTask(task_id, accessToken, title, describe, status, priority); 
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
                Swal.fire({
                    icon: "error",
                    title: "NotFound",
                    text: "There is no tasks.",
                    confirmButtonColor: "#d33",
                });
            } else if (status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid Request",
                    text: "Please check your input and try again.",
                    confirmButtonColor: "#d33",
                }); 
            } else if (status === 403) {
                Swal.fire({
                    icon: "error",
                    title: "Forbidden",
                    text: "You are trying to update another user task.",
                    confirmButtonColor: "#d33",
                });
            }
            
            else if (status === 500) {
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


document.getElementById("submit").addEventListener("click", async (e) => {
    e.preventDefault();

    let title = document.getElementById("title").value.trim();
    let describe = document.getElementById("describe").value.trim();
    let status = document.getElementById("status").value;
    let priority = document.getElementById("priority").value;

    if(!title || !describe || !status || !priority)
    {
        Swal.fire({
            icon: "warning",
            title: "Missing Fields",
            text: "Please fill in all the fields.",
            confirmButtonColor: "#efb700",
          });
    } else if (title.length < 1 || title.length > 255) {
        Swal.fire({
            icon: "error",
            title: "Invalid Title",
            text: "Title must be between 1 and 255 characters.",
            confirmButtonColor: "#d33",
        });
        return;
    } else {
        updateTask(task_id, accessToken, title, describe, status, priority);
    }
})