Pro Flashcard Generator:

  - Pro Flashcard Generator is a full-stack web application designed to help users create, study, and quiz themselves with AI-generated flashcards. It combines a modern interface with smart automation to enhance studying.

Technologies Used
  - Frontend: React
  - Backend: Flask (Python)

Authentication & Storage: Firebase

AI Integration: Gemini API

Key Features:
  User Authentication
      - Sign up and log in securely with Firebase Authentication.

  Flashcard Sets
      - Create, delete, shuffle, and navigate through personalized flashcard sets.

  AI Flashcard Generation
      - Enter a topic prompt and automatically generate flashcards using the Gemini API.

  Study Mode
      - Flip flashcards to view questions and answers, delete individual cards, shuffle cards and use text-to-speech for auditory learning.

  Quiz Mode
Take quizzes with multiple-choice questions based on your flashcards and receive instant feedback and scoring.

  Persistent Data
Flashcard sets are stored in Firebase Firestore, allowing access across sessions.

How It Works
  - User signs up or logs in using Firebase Authentication.

  - User inputs a prompt or notes to generate flashcards.

  - The React frontend sends the input to a Flask backend.

  - Flask communicates with the Gemini API to generate flashcards.

  - Flashcards are returned to the frontend and saved to Firebase.

  - Users can now study or quiz themselves using the available tools.

Project Structure
frontend/ – Contains React app, UI components, Firebase config, and styles.
backend/ – Contains Python Flask app that connects to the Gemini API and handles flashcard generation.

Use Cases
  - Students automating flashcard creation from class notes.

  - Self-learners looking for AI-generated study materials.

  - Teachers building quick review tools for students.

Summary
Flashcard Maker is a powerful, user-friendly web app combining full-stack development and AI to create a smarter way to study. With authentication and the power of Gemini AI for generating content, it’s a modern study tool focused on productive learning.

