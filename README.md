# SignFlow
SignFlow is an interactive web application designed to help users learn the American Sign Language (ASL) alphabet in a fun and engaging way. The app provides two main modes:

# Tech Stack
* HTML5 – Structure of the app

* CSS3 – Styling and layout

* JavaScript – Interactivity and logic

* Roboflow – ASL image recognition and gesture tracking

# Architechture
SignFlow is a fully client-side web application. All logic runs directly in the user's browser, making it lightweight and simple to deploy.

Learn Mode: Users are introduced to each letter of the ASL alphabet with visual guides.

Quiz Mode: Users are prompted with random letters and asked to perform the correct ASL gesture, which is recognized via Roboflow’s image detection model.

The app relies on a pre-trained machine learning model hosted via Roboflow, which performs gesture recognition in real-time using the user’s webcam.
