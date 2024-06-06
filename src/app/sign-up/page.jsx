"use client";
import { app, auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Signup = () => {
  const router = useRouter();
  const [createUserWithEmailAndPassword, user, loading, createError] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, updating, NameError] = useUpdateProfile(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    };

    const validate = () => {
      let hasError = false;
      const errors = {};

      if (!formData.name) {
        errors.name = "Name is required";
        hasError = true;
      }
      if (!formData.email) {
        errors.email = "Email is required";
        hasError = true;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email is invalid";
        hasError = true;
      }
      if (!formData.password) {
        errors.password = "Password is required";
        hasError = true;
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
        hasError = true;
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
        hasError = true;
      }

      // Clear previous error messages
      document.querySelectorAll(".error-message").forEach((element) => {
        element.textContent = "";
      });

      // Display new error messages
      Object.keys(errors).forEach((key) => {
        const errorElement = document.querySelector(`#${key}-error`);
        if (errorElement) {
          errorElement.textContent = errors[key];
        }
      });

      return !hasError;
    };

    if (validate()) {
      const auth = getAuth(app);
      const firestore = getFirestore(app);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        await updateProfile({ displayName: formData.name });

        // Save additional user details in Firestore
        await setDoc(doc(firestore, "users", user.uid), {
          username: formData.name,
          email: formData.email,
          createdAt: new Date(),
          following: [],
        });

        alert(`${formData.name} registered successfully`);
        e.target.reset(); // Reset form fields
        // Use router for navigation after successful registration
        // const router = useRouter();
        // router.push("/home/feed");
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <>
      <nav>
        <h1 className="textPrimaryColor  text-xl font-bold">TweetX</h1>
      </nav>
      <main>
        <div className="flex ">
          <div className="flex-1 px-12 py-4 ">
            <button
              className="button-bordered mb-2 "
              onClick={() => router.push("/login")}
            >
              Login
            </button>
            <h2 className="text-2xl font-bold mt-4">Create Account</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div>
                <label htmlFor="name" hidden>
                  Name
                </label>
                <input type="text" name="name" placeholder="Name" />
                <p id="name-error" className="error-message"></p>
              </div>
              <div>
                <label htmlFor="Email" hidden>
                  Email
                </label>
                <input type="email" name="email" placeholder="Email" />
                <p id="email-error" className="error-message"></p>
              </div>
              <div>
                <label htmlFor="password" hidden>
                  Password
                </label>
                <input type="password" name="password" placeholder="Password" />
                <p id="password-error" className="error-message"></p>
              </div>
              <div>
                <label htmlFor="confirmPassword" hidden>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                />
                <p id="confirmPassword-error" className="error-message"></p>
              </div>
              <button type="submit" className="self-end button-primary">
                Signup
              </button>
            </form>
          </div>
          <div className="flex-1 ">
            <Image src="/Sign up.png" alt="signup" width={500} height={500} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Signup;
