import React, { useState, useEffect } from "react";
import "./Post.css";
import firebase from "firebase";
import { db } from "./firebase";
import Avatar from "@material-ui/core/Avatar";

function Post({ postId,user, userName, imageUrl, caption }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      userName: user.displayName,
      timestamp:firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar className="post_avatar" src="" alt="userAvatar" />
        <h3>{userName}</h3>
      </div>

      {/* image */}
      <img className="post_img" src={imageUrl} alt="post " />
      <h4 className="post_text">
        <strong>{userName}</strong> {caption}
      </h4>

      <div className="post_comments">
        {comments.map((comment) => (
          <p>
            <b>{comment.userName} </b> {comment.text}
          </p>
        ))}
      </div>

      <form className="post_commentBox">
        <input
          className="post_input"
          type="text"
          placeholder="your comment here"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="post_button"
          disabled={!comment}
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default Post;
