"use client";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

const SignIn = () => {
  const router = useRouter();
  const [signInWithEmailAndPassword, user, loading, signInError] =
    useSignInWithEmailAndPassword(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Form validation
    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }
    try {
      await signInWithEmailAndPassword(email, password);
      sessionStorage.setItem("user", true);
      // If sign-in is successful, you can optionally redirect to another page
      router.push("/home/feed"); // Redirect to home page after successful sign-in
    } catch (error) {
      console.error("Sign-in error:", error);
      alert("Failed to sign in. Please check your email and password.");
    }
  };

  return (
    <>
      <nav>
        <h1 className="textPrimaryColor  text-xl font-bold">TweetX</h1>
      </nav>
      <main>
        <div className="flex">
          <div className="flex-1 px-12 py-4">
            <button
              className="button-bordered mb-2"
              onClick={() => router.push("/sign-up")}
            >
              Create Account
            </button>
            <h2 className="text-2xl font-bold mt-4">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div>
                <label htmlFor="email" hidden>
                  Email
                </label>
                <input type="email" name="email" placeholder="Email" />
              </div>
              <div>
                <label htmlFor="password" hidden>
                  Password
                </label>
                <input type="password" name="password" placeholder="Password" />
              </div>
              <div className="flex justify-between gap-2">
                <div>Forgot Password ?</div>
                <button type="submit" className=" button-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1">
            <Image src="/Sign up.png" alt="signin" width={500} height={500} />
          </div>
        </div>
      </main>
    </>
  );
};

export default SignIn;
