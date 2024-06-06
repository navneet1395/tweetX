"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
import { redirect } from "next/navigation";

export default function Home() {
  const [user] = useAuthState(auth);

  if (!user) {
    redirect("/login");
  } else {
    redirect("/home/feed");
  }
 
}
