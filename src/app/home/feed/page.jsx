"use client";
import React from "react";
import PostFeedComponent from "./postfeedComponent";
import FetchFeedDataComponent from "./fetchfeedDataComponent";
const feedPage = () => {
  return (
    <>
      <PostFeedComponent />
      <FetchFeedDataComponent />
    </>
  );
};

export default feedPage;
