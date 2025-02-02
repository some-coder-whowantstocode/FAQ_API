# FAQ Management System

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
  - [Steps](#steps)
  - [Running the Server](#running-the-server)
    - [Option 1: Running without Docker](#option-1-running-without-docker)
    - [Option 2: Running with Docker](#option-2-running-with-docker)
- [Running the Tests](#running-the-tests)
- [API Endpoints](#api-endpoints)
  - [Fetch FAQs](#fetch-faqs)
  - [Create FAQ](#create-faq)
  - [Update FAQ](#update-faq)
  - [Delete One FAQ](#delete-one-faq)
  - [Delete All FAQs](#delete-all-faqs)
- [Admin Panel](#admin-panel)
  - [Access the Admin Panel](#access-the-admin-panel)
  - [FAQ Management](#faq-management)
- [Client Page](#client-page)
- [Contribution Guidelines](#contribution-guidelines)
- [Update FAQ](#update-faq-image)
- [License](#license)

## Overview
This project is a FAQ Management System that allows users to create, read, update, and delete FAQs. It supports multi-language translations, caching for improved performance, and pagination for easy navigation through FAQs.


## Features
- Create, read, update, and delete FAQs.
- Multi-language support for FAQs.
- Fail-safe in case of failure, ensuring that other translations still occur without throwing an error.
- Pagination for easy navigation.
- Efficient data retrieval using MongoDB's aggregation pipeline.
- Caching with Redis for improved performance.
- Comprehensive unit tests for API endpoints.

# Installation

## Steps

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/some-coder-whowantstocode/FAQ_API.git
    cd your-repo-name
    ```

2.  **Set Up Environment Variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=9310
    MONGO_URI=mongodb://localhost:27017/translate
    REDIS_HOST=redis
    REDIS_PORT=6379
    ```

## Running the Server

### Option 1: Running without Docker


1. **Prerequisites**

*   Node.js
*   npm (Node Package Manager)
*   Redis

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Run Redis:**

    Ensure that Redis is running on your machine. If not, you can start it using the following command:

    ```bash
    redis-server
    ```

4.  **Run the Server:**

    ```bash
    npm start
    ```

### Running with Docker

1.  **Build the Docker image:**

    ```bash
    docker-compose build
    ```

2.  **Run the Docker containers:**

    ```bash
    docker-compose up
    ```

3.  **Stop the Docker containers:**

    ```bash
    docker-compose down
    ```

## Running the Tests

```bash
npm test
```

## API Endpoints

### Fetch FAQs

*   **Endpoint:** `/api/get`
*   **Method:** `GET`
*   **Description:** Fetch paginated FAQs with optional language parameter.
*   **Query Parameters:**
    *   `p`: Page number (default: 1)
    *   `len`: Number of FAQs per page (default: 10)
    *   `lang`: Language code (default: 'en')

    ```bash 
    curl -X GET "http://localhost:9310/api/get?p=1&len=10&lang=en"
    ```

### Create FAQ

*   **Endpoint:** `/api/create`
*   **Method:** `POST`
*   **Description:** Create a new FAQ.
*   **Request Body:**

```bash
{
  "question": "Sample Question",
  "answer": "Sample Answer"
}
```
 ```bash 
    curl -X POST "http://localhost:9310/api/create" -H "Content-Type: application/json" -d '{"question": "Sample Question", "answer": "Sample Answer"}'

```

### Update FAQ

*   **Endpoint:** `/api/update/:id`
*   **Method:** `PUT`
*   **Description:** Update an existing FAQ.
*   **Request Body:**

```bash
{
  "question": "Updated Question",
  "answer": "Updated Answer"
}
```
 ```bash 
    curl -X PUT "http://localhost:9310/api/update/609c1c1f2e4e6f06b84a1c1e" -H "Content-Type: application/json" -d '{"question": "Updated Question", "answer": "Updated Answer"}'

```

### Delete One FAQ

*   **Endpoint:** `/api/deleteone/:id`
*   **Method:** `DELETE`
*   **Description:** Delete an existing FAQ by ID.

 ```bash 
    curl -X DELETE "http://localhost:9310/api/deleteone/609c1c1f2e4e6f06b84a1c1e"

```

### Delete All FAQs

*   **Endpoint:** `/api/deleteall`
*   **Method:** `DELETE`
*   **Description:** Delete all FAQs.

 ```bash 
    curl -X DELETE "http://localhost:9310/api/deleteall"
```

# Admin Panel

The admin panel allows you to easily manage FAQs.  Access has been simplified with the removal of the login requirement, making it easier to use. Here's how to use it:

## Access the Admin Panel

Visit `http://localhost:9310/`.

## FAQ Management

The admin panel provides the following functionalities for managing FAQs:

*   **Add an FAQ:**
    1.  Click on **FAQs** → **Add FAQ**.
    2.  Fill in the **Question (English)** and **Answer (English)** fields.
    3.  The Hindi and Bengali translations will be automatically generated when you save the FAQ.

*   **Edit an FAQ:**
    1.  Click on an existing FAQ to edit it.
    2.  You can manually update the translations if needed.

*   **Remove an FAQ:**  (Specific instructions on how to remove an FAQ should be added here.  For example: "Select the FAQ and click the 'Delete' button.")

*   **Remove All FAQs:** (Specific instructions on how to remove all FAQs should be added here. For example: "Click the 'Delete All' button.")

*   **Access with Pagination:** FAQs are displayed with pagination, allowing you to easily navigate through a large number of FAQs.

*   **Change Language:** The admin panel supports changing the displayed language. (Specific instructions on how to change the language should be added here. For example: "Select the desired language from the dropdown menu.")

*   **Update:** (This likely refers to the "Edit an FAQ" functionality described above.  Consider using consistent terminology.)

*   **Delete:** (This likely refers to the "Remove an FAQ" functionality described above. Consider using consistent terminology.)

## Client Page 

![client page](https://raw.githubusercontent.com/some-coder-whowantstocode/FAQ_API/main/assets/clientPage.png)

## Update Faq

![update faq](https://raw.githubusercontent.com/some-coder-whowantstocode/FAQ_API/main/assets/updateFaq.png)

# Contribution Guidelines

1.  **Fork the Repository:**

    ```bash
    git checkout -b feature-branch
    ```

2.  **Make Your Changes and Commit:**

    ```bash
    git commit -m "feat: Add new feature"
    ```

3.  **Push to the Branch:**

    ```bash
    git push origin feature-branch
    ```

4.  **Open a Pull Request:** Open a pull request and describe your changes.


# License

This project is licensed under the MIT License.
