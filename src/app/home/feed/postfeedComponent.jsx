"use client";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { redirect } from "next/navigation";
import { auth, app } from "@/app/firebase/config";
const PostfeedComponent = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [user] = useAuthState(auth);
  const firestore = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.feed.value;

    if (!user) {
      // Handle the case where the user is not logged in
      console.error("User is not logged in. Please sign in to post.");
      redirect("/login");
    }

    try {
      await addDoc(collection(firestore, "posts"), {
        userId: user.uid,
        text,
        userId: user.uid,
        displayName: user.displayName,
        timestamp: serverTimestamp(),
      });
      // await updateDoc(doc(firestore, "users", user.uid), {
      //   posts: arrayUnion({
      //     userId: user.uid,
      //     text,
      //     userId: user.uid,
      //     displayName: user.displayName,
      //     timestamp: serverTimestamp(),
      //   }),
      // });
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setFormVisible(false); // Close the form after submission (optional)
    }
  };

  return (
    <div className="my-4">
      <button className="button-primary" onClick={() => setFormVisible(true)}>
        Write
      </button>
      {formVisible && (
        <form onSubmit={handleSubmit}>
          <textarea placeholder="What's on your mind?" required name="feed" />
          <button className="button-bordered" type="submit">
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default PostfeedComponent;
