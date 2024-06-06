"use client";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  arrayUnion,
  arrayRemove,
  collection,
  doc,
  getFirestore,
  query,
  updateDoc,
} from "firebase/firestore";
import { app, auth } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

const FetchAllUsersComponent = () => {
  const [users, setUsers] = useState([]);
  const firestore = getFirestore(app);
  const [user] = useAuthState(auth);
  const usersQuery = query(collection(firestore, "users"));

  const [usersSnapshot, loadingUsers, error] = useCollection(usersQuery);

  useEffect(() => {
    if (usersSnapshot) {
      const fetchedUsers = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(fetchedUsers);
    }
  }, [usersSnapshot]);

  const toggleFollowUser = async (userIdToFollow) => {
    if (!user) {
      alert("No user is signed in");
      return;
    }

    const userRef = doc(firestore, "users", user.uid);
    const followerUserRef = doc(firestore, "users", userIdToFollow);
    const userDoc = users.find((u) => u.id === user.uid);

    try {
      if (userDoc.following && userDoc.following.includes(userIdToFollow)) {
        // Unfollow user
        await updateDoc(userRef, {
          following: arrayRemove(userIdToFollow),
        });
        await updateDoc(followerUserRef, { followedBy: arrayRemove(user.uid) });
        alert("User Unfollowed");
      } else {
        // Follow user
        await updateDoc(userRef, {
          following: arrayUnion(userIdToFollow),
        });
        await updateDoc(followerUserRef, { followedBy: arrayUnion(user.uid) });
        alert("User Followed");
      }
    } catch (e) {
      alert(`Error updating follow status: ${e.message}`);
    }
    console.log(`Toggled follow status for user: ${userIdToFollow}`);
  };

  if (loadingUsers) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (users.length === 0) {
    console.log("No users found.");
  } else {
    console.log("Users fetched:", users);
  }

  return (
    <div>
      {users.length === 0 && <p>No users found.</p>}
      <ul>
        {users
          .filter((u) => u.id !== user.uid)
          .map((userItem) => (
            <div
              key={userItem.id}
              className=" flex gap-2  p-4 items-center mb-4  border-b  justify-between overflow-hidden"
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
                <div className="font-semibold text-lg">{userItem.username}</div>
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
    </div>
  );
};

export default FetchAllUsersComponent;
