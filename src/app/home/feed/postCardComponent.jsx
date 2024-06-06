import React from "react";

const PostCardComponent = ({ post }) => {
  const getTimeDifference = (timestamp) => {
    const now = Date.now();
    const differenceInMilliseconds = now - timestamp;

    const seconds = Math.floor(differenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} sec ago`;
    } else if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (days < 30) {
      return `${hours} hour ago`;
    } else {
      return `${days} days ago`;
    }
  };
  return (
    <div
      key={post.id}
      className="shadow-lg flex gap-2 rounded-2xl py-2 items-center mb-4 justify-between overflow-hidden"
    >
      <div
        className="border-2  m-2 self-start"
        style={{
          borderRadius: "50%",
          width: "50px ",
          height: "50px",
        }}
      ></div>

      <div className=" w-4/5 ">
        <div className="flex justify-between ">
          <div className="font-semibold text-lg">{post?.displayName}</div>

          <small className="self-end">
            {getTimeDifference(post.timestamp?.toDate())}
          </small>
        </div>
        <p>{post?.text}</p>
      </div>
      <div className="bg-[#ff738c] w-8 h-16 rounded-l-full "></div>
    </div>
  );
};

export default PostCardComponent;
