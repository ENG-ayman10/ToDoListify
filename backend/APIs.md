## Index:
- [Description](#description)
- [API Table](#api-table)
- [APIs Description](#apis-description)
    - [User](#user)
        - [Register](#register)
        - [Login](#login)
        - [Refresh](#refresh)
        - [Update Information](#update-user-information)
        - [Update Password](#update-user-password)
        - [Delete](#delete-user)
        - [Logout](#logout)
    - [Task](#task)
        - [Get Tasks](#get-tasks)
        - [Create Task](#create-task)
        - [Update Task](#update-task)
        - [Delete Task](#delete-task)


## Description:
This file contains a detailed description of the API design.

## API Table:
| API                        | HTTP   | For                                             |
|----------------------------|--------|-------------------------------------------------|
| `/api/v1/user/register`    | POST   | Create new user.                                |
| `/api/v1/user/login`       | POST   | Login and verify the user.                      |
| `/api/v1/user/refresh`     | GET    | Verify if user loged in and create new tokens.  |
| `/api/v1/user/update/info` | PATCH  | Update the current user information.            |
| `/api/v1/user/update/pass` | PATCH  | Update the current user password.               |
| `/api/v1/user/delete`      | DELETE | Delete the current user.                        |
| `/api/v1/user/logout`      | POST   | Logout the currrent user and delete the tokens. |
| `/api/v1/task/`            | GET    | Get all task for the current user.              |
| `/api/v1/task/create`      | POST   | Create new task.                                |
| `/api/v1/task/update/{id}` | PATCH  | Update task information.                        |
| `/api/v1/task/delete/{id}` | DELETE | Delete the task.                                |

## APIs Description:

### User:
#### Register:
- API: `POST /api/v1/user/register`
- Description: use to create new user.
- Request body:
    - type: `JSON`
    - Example:
    ```json
    {
        "name": "Mohaned Sherhan (Mr.x)",
        "username": "mohaned2023",
        "email": "mohaned2023@gmail.com",
        "password": "Mohaned2023+",
        "confirmation": "Mohaned2023+"
    }
    ```
    - Body rules:
        - `name`:
            - required.
            - type string.
            - length [2, 255].
        - `username`:
            - required.
            - type string.
            - length [3, 50].
            - consists of `a-z` or `0-9` or `_`.
            - match this pattern `/([a-z0-9_]+)/`.
        - `email`:
            - required.
            - type string.
            - length [5, 255].
            - It must be an email.
        - `password`:
            - required.
            - type string.
            - length [8, 512].
            - consists of `a-zA-Z` and `0-9` and `\w`.
            - match this pattern `/((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/`.  
        - `confirmation`:
            - must match the `password`.
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48",
        "user": {
            "id": 29,
            "name": "Mohaned Sherhan (Mr.x)",
            "username": "mohaned2023",
            "email": "mohaned2023@gmail.com",
            "create_at": "2025-03-19 15:13:46.660422",
            "update_at": "2025-03-19 15:13:46.660422"
        }
    }
    ```
    - Status codes:
        | Status | Name                | Description                                                    |
        |--------|---------------------|----------------------------------------------------------------|
        | 201    | Created             | User created.                                                  |
        | 302    | Found               | Username or Email is found in the database!                    |
        | 400    | BadRequest          | Request body is missing some fields or confirmation not match. |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.                    |
        | 500    | InternalServerError | Backend failure -> submit an issue in github.                  |
---
#### Login:
- API: `POST /api/v1/user/login`
- Description: login.
- Request body:
    - type: `JSON`
    - Example:
    ```json
    {
        "username": "mohaned2023",
        "password": "Mohaned2023+"
    }
    ```
    - Body rules:
        - `username`:
            - required.
            - type string.
            - length [3, 50].
            - consists of `a-z` or `0-9` or `_`.
            - match this pattern `/([a-z0-9_]+)/`.
        - `password`:
            - required.
            - type string.
            - length [8, 512].
            - consists of `a-zA-Z` and `0-9` and `\w`.
            - match this pattern `/((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/`.  
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48",
        "user": {
            "id": 29,
            "name": "Mohaned Sherhan (Mr.x)",
            "username": "mohaned2023",
            "email": "mohaned2023@gmail.com",
            "create_at": "2025-03-19 15:13:46.660422",
            "update_at": "2025-03-19 15:13:46.660422"
        }
    }
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | OK                  | User loged in.                                |
        | 400    | BadRequest          | Request body is missing some fields.          |
        | 401    | Unauthorized        | Invalid password.                             |
        | 404    | NotFound            | User not found, not registered.               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Refresh:
- API: `GET /api/v1/user/refresh`
- Description: Verify if user loged in and create new tokens.
- Request body:
    - Not required
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48",
        "user": {
            "id": 29,
            "name": "Mohaned Sherhan (Mr.x)",
            "username": "mohaned2023",
            "email": "mohaned2023@gmail.com",
            "create_at": "2025-03-19 15:13:46.660422",
            "update_at": "2025-03-19 15:13:46.660422"
        }
    }
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | OK                  | User loged in.                                |
        | 401    | Unauthorized        | Refresh token is expired.                     |
        | 404    | NotFound            | User not found, not registered.               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Update User Information:
- API: `PATCH /api/v1/user/update/info`
- Description: Update the current user information.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - you can update one or more of:
        - name
        - username
        - email
    - type: `JSON`
    - Example:
    ```json
    {
        "name": "Mohaned Sherhan (Mr.x)",
        "username": "mohaned2023",
        "email": "mohaned2023@gmail.com",
    }
    ```
    - Body rules:
        - `name`:
            - required.
            - type string.
            - length [2, 255].
        - `username`:
            - required.
            - type string.
            - length [3, 50].
            - consists of `a-z` or `0-9` or `_`.
            - match this pattern `/([a-z0-9_]+)/`.
        - `email`:
            - required.
            - type string.
            - length [5, 255].
            - It must be an email.
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48",
        "user": {
            "id": 29,
            "name": "Mohaned Sherhan (Mr.x)",
            "username": "mohaned2023",
            "email": "mohaned2023@gmail.com",
            "create_at": "2025-03-19 15:13:46.660422",
            "update_at": "2025-04-22 15:13:46.660422"
        }
    }
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | ok                  | User information updated.                     |
        | 302    | Found               | Username or Email is found in the database!   |
        | 400    | BadRequest          | Invalid body.                                 |
        | 401    | Unauthorized        | Invalid access token.                         |
        | 403    | Forbidden           | User tried to update another account.         |
        | 404    | NotFound            | User not found, not registered.               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Update User Password:
- API: `PATCH /api/v1/user/update/pass`
- Description: Update the current user password.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "oldPassword": "Mohaned2023+",
        "Password": "Mohaned.1.3+1",
        "confirmation": "Mohaned.1.3+1"
    }
    ```
    - Body rules:
        - `password`:
            - required.
            - type string.
            - length [8, 512].
            - consists of `a-zA-Z` and `0-9` and `\w`.
            - match this pattern `/((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/`.  
        - `confirmation`:
            - must match the `password`.
- Response:
    - body Null
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | ok                  | User password updated.                        |
        | 400    | BadRequest          | Invalid body or confirmation not match.       |
        | 401    | Unauthorized        | Invalid access token or invalid password.     |
        | 403    | Forbidden           | User tried to update another account.         |
        | 404    | NotFound            | User not found, not registered.               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Delete User:
- API: `DELETE /api/v1/user/delete`
- Description: Delete the current user.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - required
    - type: `JSON`
    - Example:
    ```json
    {
        "password": "Mohaned2023+"
    }
    ```
- Response:
    - Body Null
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | OK                  | User loged in.                                |
        | 401    | Unauthorized        | Access token is expired or invalid password.  |
        | 403    | Forbidden           | User tried to delete another account.         |
        | 404    | NotFound            | User not found, not registered.               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Logout:
- API: `POST /api/v1/user/logout`
- Description: Logout the currrent user and delete the tokens.
- Request body:
    - Not required
- Response:
    - body Null
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | OK                  | User loged out.                               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---

### Task
#### Get Tasks:
- API: `GET /api/v1/task`
- Description: Get all task for the current user.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - Not required.
- Response:
    - Type: `JSON`
    - Example:
    ```json
    [
        {
            "id": 2120,
            "title": "task title",
            "body": "task body/description",
            "state": "IN_PROGRESS",
            "priority": "LOW",
            "create_at": "2025-03-19 15:13:46.660422",
            "update_at": "2025-03-19 15:13:46.660422"
        }
    ]
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | ok                  | ok.                                           |
        | 401    | Unauthorized        | Invalid access token.                         |
        | 404    | NotFound            | There is no tasks.                            |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Create Task:
- API: `POST /api/v1/task/create`
- Description: Create new task.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "title": "task title",
        "body": "task body/description",
        "state": "IN_PROGRESS",
        "priority": "LOW"
    }
    ```
    - Body rules:
        - `title`:
            - required.
            - type string.
            - length [1, 255].
        - `body`:
            - required.
            - type string.
        - `state`:
            - required.
            - type string.
            - must be one of [`TO_DO`, `IN_PROGRESS`, `DONE`]
        - `priority`:
            - required.
            - type string.
            - must be one of [`HIGH`, `MEDIUM`, `LOW`]
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "id": 2120,
        "title": "task title",
        "body": "task body/description",
        "state": "IN_PROGRESS",
        "priority": "LOW",
        "create_at": "2025-03-19 15:13:46.660422",
        "update_at": "2025-03-19 15:13:46.660422"
    }
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 201    | Created             | Task created.                                 |
        | 400    | BadRequest          | Invalid request body.                         |
        | 401    | Unauthorized        | Invalid access token.                         |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Update Task:
- API: `PATCH /api/v1/task/update/{id}`
    - id is number.
- Description: Update task information.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - required.
    - type: `JSON`
    - you can update one or more of:
        - title
        - body
        - status
        - priority
    - Example:
    ```json
    {
        "title": "task title",
        "body": "task body/description",
        "state": "IN_PROGRESS",
        "priority": "LOW"
    }
    ```
    - Body rules:
        - `title`:
            - required.
            - type string.
            - length [1, 255].
        - `body`:
            - required.
            - type string.
        - `state`:
            - required.
            - type string.
            - must be one of [`TO_DO`, `IN_PROGRESS`, `DONE`]
        - `priority`:
            - required.
            - type string.
            - must be one of [`HIGH`, `MEDIUM`, `LOW`]
- Response:
    - Type: `JSON`
    - Example:
    ```json
    {
        "id": 2120,
        "title": "task title",
        "body": "task body/description",
        "state": "IN_PROGRESS",
        "priority": "LOW",
        "create_at": "2025-03-19 15:13:46.660422",
        "update_at": "2025-04-22 15:13:46.660422"
    }
    ```
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | ok                  | Task updated.                                 |
        | 400    | BadRequest          | Invalid request body.                         |
        | 401    | Unauthorized        | Invalid access token.                         |
        | 403    | Forbidden           | User tried to update another user task.       |
        | 404    | NotFound            | Task not found.                               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---
#### Delete Task:
- API: `DELETE /api/v1/task/delete/{id}`
    - id is number.
- Description: Delete the task.
- Request authorization header:
    - required.
    - type: `JSON`
    - Example:
    ```json
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaGFuZWQyMDIzIiwiaWF0IjoxNzMxNjc1MzM0LCJleHAiOjE3MzE2ODYxMzR9.MEZmEDKvl7giIH7whhWMRoxTK8v4lz8jgDytLPDcm48"
    }
    ```
- Request body:
    - Not required.
- Response:
    - body Null
    - Status codes:
        | Status | Name                | Description                                   |
        |--------|---------------------|-----------------------------------------------|
        | 200    | ok                  | Task Deleted.                                 |
        | 401    | Unauthorized        | Invalid access token.                         |
        | 403    | Forbidden           | User tried to delete another user task.       |
        | 404    | NotFound            | Task not found.                               |
        | 429    | TooManyRequests     | More than 3req/1s or 10req/20s or 30req/1m.   |
        | 500    | InternalServerError | Backend failure -> submit an issue in github. |
---

> By [Mohaned Sherhan (Mr.x)](https://github.com/Mohaned2023)
