# Next.js Firebase Twitter-Like Application

## Project Overview

This project is a Twitter-like application built using Next.js and Firebase. Users can sign up, log in, post short messages (tweets), view their own posts, view other users, and follow/unfollow other users. The main features include:

- User Authentication (Sign Up, Login)
- Posting Messages
- Viewing User Posts
- Following and Unfollowing Users
- User Feed Display

## Tech Stack

- **Next.js**: A React framework for building server-side rendered applications.
- **Firebase**: A platform by Google for developing mobile and web applications. Used here for authentication and database services.
  - Firebase Auth: For user authentication.
  - Firebase Firestore: For storing user data and posts.

## Project Structure
```
└───app
    ├───firebase
    ├───home
    │   ├───feed
    │   ├───profile
    │   └───users
    ├───login
    └───sign-up
```


## Setup and Installation

### Prerequisites

- Node.js and npm/yarn installed on your machine.
- Firebase project set up (you can create one at [Firebase Console](https://console.firebase.google.com/)).

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/navneet1395/tweetx.git
   cd tweetx
   ```
2. **Install Dependedecy**
    ```bash
    npm install
     or
    yarn install ```
3. **Set up Firebase:**

    By creating a .env file with the firebase keys 

4. **Run the development server:**
    
    ```bash
    npm run dev
    or
    yarn dev
     ```

    Open http://localhost:3000 with your browser to see the result.


## Usage
- Sign Up: Create a new account.
- Log In: Access your account.
- Post Messages: Write short posts.
- View Posts: See your own posts and posts from users you follow.
- Follow/Unfollow: Manage the users you follow.

## Design Choices
- Next.js
    - Server-Side Rendering: Provides improved performance and SEO benefits.
    - File-based Routing: Simplifies the creation of routes within the application.
- Firebase
    - Authentication: Provides secure and easy-to-use user authentication.
    - Firestore: A flexible, scalable database for storing user data and posts.
- React-Firebase-Hooks
    -Used for integrating Firebase with React components, providing hooks for authentication and Firestore operations.