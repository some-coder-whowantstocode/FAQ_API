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
- Server-Side Rendering (SSR) for improved performance and SEO.
- Docker containerization for consistent deployment and scalability.
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
    1.  Fill in the **Question (English)** and **Answer (English)** fields.
    2.  Click on **Add FAQ**.
    3.  The Hindi and Bengali translations will be automatically generated when you save the FAQ.

*   **Get all FAQ:**
    1.  click on the **Reload Button** on the top right of the page to left of the **Delete all**.
    2.  It will bring FAQS based on page size.

*   **Edit an FAQ:**
    1.  Click on **edit icon** of an existing FAQ to edit it.
    2.  An **Update FAQ** will popup right below **Add FAQ** fill question and answer then click on **update FAQ**.

*   **Remove an FAQ:**
    1.  Click on **Delete icon** of an existing FAQ to delete it.
    2.  It will automatically delete it after sometime due to creating it in limited time a responsive loading is not added so wait for sometime or simply reload the page.

*   **Remove All FAQs:**
    1. Click the **Delete All** button at the top right corner right beside **Reload button**.

*   **Access with Pagination:**
    1. A input box is on the top of page with **default value** of **10** you can adjust it for pagination and then hit **Reload button**.
    2. At the bottom of the FAQs, you will see two buttons, **prev** and **next**. The size will be dynamically generated from each retrieval of users to avoid using too many resources and ensure accuracy..

*   **Change Language:**
    1. On the top there is a drop box with options for hindi english and bn.

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
