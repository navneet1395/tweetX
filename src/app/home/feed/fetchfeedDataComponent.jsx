// components/FetchfeedDataComponent.js
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  getFirestore,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { app, auth } from "@/app/firebase/config";
import PostCardComponent from "./postCardComponent";
const FetchfeedDataComponent = () => {
  const [posts, setPosts] = useState([]);
  const [user] = useAuthState(auth);
  const firestore = getFirestore(app);

  const FetchfeedDataComponentQuery = user
    ? query(
        collection(firestore, "posts"),
        // where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      )
    : null;

  const [postsSnapshot, loadingPosts, error] = useCollection(
    FetchfeedDataComponentQuery
  );

  useEffect(() => {
    if (postsSnapshot) {
      const FetchfeedDataComponent = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(FetchfeedDataComponent);
    }
  }, [postsSnapshot]);

  if (loadingPosts) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  console.log(posts);

  return (
    <div className="overflow-y-auto h-100">
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <PostCardComponent post={post} />
      ))}
    </div>
  );
};

export default FetchfeedDataComponent;
