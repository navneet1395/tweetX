"use client";
import { useState, useEffect } from "react";
import { app, auth } from "@/app/firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  getFirestore,
  arrayRemove,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import PostCardComponent from "../feed/postCardComponent";

const Profile = () => {
  const [user] = useAuthState(auth);
  const firestore = getFirestore(app);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [postCount, setPostCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchPosts();
      fetchFollowers();
      fetchFollowing();
    }
  }, [user]);

  const fetchUserData = async () => {
    const userDoc = await getDoc(doc(firestore, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setFollowerCount(userData.followedBy?.length || 0);
      setFollowingCount(userData.following?.length || 0);
    }
  };

  const fetchPosts = async () => {
    const postsQuery = query(
      collection(firestore, "posts"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    const postSnapshot = await getDocs(postsQuery);
    const userPosts = postSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(userPosts);
    setPostCount(userPosts.length);
  };

  const fetchFollowers = async () => {
    const userDoc = await getDoc(doc(firestore, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const followerIds = userData.followedBy || [];

      const followerDetails = await Promise.all(
        followerIds.map(async (followerId) => {
          const followerDoc = await getDoc(doc(firestore, "users", followerId));
          return { id: followerDoc.id, ...followerDoc.data() };
        })
      );

      setFollowers(followerDetails);
    }
  };

  const fetchFollowing = async () => {
    const userDoc = await getDoc(doc(firestore, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const followingIds = userData.following || [];

      const followingDetails = await Promise.all(
        followingIds.map(async (followingId) => {
          const followingDoc = await getDoc(
            doc(firestore, "users", followingId)
          );
          return { id: followingDoc.id, ...followingDoc.data() };
        })
      );

      setFollowing(followingDetails);
    }
  };

  const toggleFollowUser = async (userIdToFollow) => {
    if (!user) {
      alert("No user is signed in");
      return;
    }

    const userRef = doc(firestore, "users", user.uid);
    const followerUserRef = doc(firestore, "users", userIdToFollow);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    try {
      if (userData.following && userData.following.includes(userIdToFollow)) {
        // Unfollow user
        await updateDoc(userRef, {
          following: arrayRemove(userIdToFollow),
        });
        await updateDoc(followerUserRef, { followedBy: arrayRemove(user.uid) });
        setFollowing(following.filter((u) => u.id !== userIdToFollow));
        setFollowerCount(followerCount - 1);
        alert("User Unfollowed");
      } else {
        // Follow user
        await updateDoc(userRef, {
          following: arrayUnion(userIdToFollow),
        });
        await updateDoc(followerUserRef, { followedBy: arrayUnion(user.uid) });
        const followedUserDoc = await getDoc(followerUserRef);
        setFollowing([
          ...following,
          { id: userIdToFollow, ...followedUserDoc.data() },
        ]);
        setFollowerCount(followerCount + 1);
        alert("User Followed");
      }
      fetchFollowers();
      fetchFollowing();
    } catch (e) {
      alert(`Error updating follow status: ${e.message}`);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <ul>
            {posts.map((post) => (
              <PostCardComponent key={post.id} post={post} />
            ))}
          </ul>
        );
      case "followers":
        return (
          <ul>
            {followers.map((userItem) => (
              <div
                key={userItem.id}
                className="flex gap-2 p-4 items-center mb-4  justify-between overflow-hidden"
              >
                <div
                  className="border-2 self-start"
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                  }}
                ></div>
                <div className="w-4/5">
                  <div className="font-semibold text-lg">
                    {userItem.username}
                  </div>
                  <div className="text-slate-400 text-sm">
                    Following:{" "}
                    {userItem.following ? userItem.following.length : 0}
                  </div>
                </div>

                <button
                  className="button-primary"
                  onClick={() => toggleFollowUser(userItem.id)}
                >
                  {userItem.followedBy && userItem.followedBy.includes(user.uid)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            ))}
          </ul>
        );
      case "following":
        return (
          <ul>
            {following.map((userItem) => (
              <div
                key={userItem.id}
                className="flex gap-2 p-4 items-center mb-4 justify-between overflow-hidden"
              >
                <div
                  className="border-2 self-start"
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                  }}
                ></div>
                <div className="w-4/5">
                  <div className="font-semibold text-lg ">
                    {userItem.username}
                  </div>
                  <div className="text-slate-400 text-sm">
                    Following:{" "}
                    {userItem.following ? userItem.following.length : 0}
                  </div>
                </div>
                <b>Following</b>
              </div>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {user && (
        <>
          <div className="flex gap-10  my-4 items-center h-[120px]">
            <div
              className="border-2 self-start flex-2"
              style={{
                borderRadius: "50%",
                width: "80px",
                height: "80px",
              }}
            ></div>
            <div className="flex flex-1 flex-col justify-center gap-4">
              <h2 className="font-bold text-xl">{user.displayName}</h2>
              <div className="flex gap-2 text-slate-400">
                <p>Posts: {postCount}</p>
                <p>Followers: {followerCount}</p>
                <p>Following: {followingCount}</p>
              </div>
            </div>
          </div>
          <div className="border-t flex items-start justify-around text-center gap-6 cursor-pointer ">
            <div
              onClick={() => setActiveTab("posts")}
              className={`${
                activeTab === "posts" &&
                "border-t-2 border-slate-800 font-semibold"
              } flex-1 p-4
               `}
            >
              Posts
            </div>
            <div
              className={`${
                activeTab === "followers" &&
                "border-t-2 border-slate-800 font-semibold"
              } flex-1 p-4
               `}
              onClick={() => setActiveTab("followers")}
            >
              Followers
            </div>
            <div
              className={`${
                activeTab === "following" &&
                "font-semibold border-t-2 border-slate-800"
              } flex-1 p-4
               `}
              onClick={() => setActiveTab("following")}
            >
              Following
            </div>
          </div>
          <div>{renderTabContent()}</div>
        </>
      )}
    </div>
  );
};

export default Profile;
