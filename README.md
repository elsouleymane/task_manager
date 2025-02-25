# task_manager

This is a task manager app for a technical test, built with Angular (front-end) and Django (back-end).

## Prerequisites

- Docker
- Docker Compose

## Running the Application

To build and run the application using Docker, follow these steps:



1. **Build the Docker image**: Open a terminal in the root of your repository and run:

    ```sh
    docker build -t task_manager_app .
    ```

2. **Run the Docker container**: Once the image is built, run the container with:

    ```sh
    docker run -p 3000:3000 -p 8000:8000 task_manager_app
    ```

    This command will map port 3000 on your host to port 3000 in the container for the front-end, and port 8000 on your host to port 8000 in the container for the back-end.

3. **Access the application**:
    - Front-end: Open a web browser and navigate to `http://localhost:3000`
    - Back-end: Open a web browser and navigate to `http://localhost:8000`

## Project Structure

- `front/`: Contains the Angular front-end application.
- `back/`: Contains the Django back-end application.

