"use client";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user] = useAuthState(auth);
  const userSession = sessionStorage.getItem("user");
  const router = useRouter();
  if (!user && !userSession) {
    router.push("/login");
  } else {
    router.push("/home/feed");
  }
  console.log(user);
  return (
    <>
      <nav className=" flex  gap-2 justify-around items-center">
        <h1 className="textPrimaryColor  text-xl font-bold ">TweetX</h1>
        <div className="flex gap-4  font-bold text-slate-300">
          <div className=" hover:text-[#ff738c] cursor-pointer ">Feed</div>
          <div className=" hover:text-[#ff738c] cursor-pointer ">Users</div>
          <div className=" hover:text-[#ff738c] cursor-pointer ">Profile</div>
        </div>
      </nav>
      <main>Home Page of TweetX</main>
    </>
  );
}
