import { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Avatar, Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;
  console.log("its working");

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [email, setEmail] = useState([""]);
  const [pass, setPass] = useState([""]);
  const [userName, setUserName] = useState([""]);
  const [user, setUser] = useState([null]);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // logged out
        setUser(null);
      }
    });
  }, [user]);

  // runs a piece of code at a specific condition
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, pass)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: userName,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };
  const signin = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, pass)
      .catch((error) => alert(error.message));

    setOpenSignin(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_header_img"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt="Instagram"
              />
            </center>
            <Input
              placeholder="userName"
              type="text"
              // value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              // value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              // value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignin} onClose={() => setOpenSignin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_header_img"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt="Instagram"
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              // value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="text"
              // value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <Button type="submit" onClick={signin}>
              Sign in
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app_header">
        <img
          className="app_header_img"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="Instagram"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Log-out</Button>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignin(true)}>Sign-in</Button>
            <Button onClick={() => setOpen(true)}>Sign-up</Button>
          </div>
        )}
      </div>

      <div className="app_post">
        <div className="app_post_left">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              userName={post.userName}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload userName={user.displayName} />
      ) : (
        <h1> sorry you need to login</h1>
      )}
    </div>
  );
}

export default App;
