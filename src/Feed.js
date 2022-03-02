import React, { useEffect, useState } from 'react';
import './Feed.css';
import CreateIcon from '@mui/icons-material/Create';
import InputOption from './InputOption';
import ImageIcon from '@mui/icons-material/Image';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import Post from './Post';
import { db } from "./firebase";
import { query, collection, orderBy, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import FlipMove from 'react-flip-move';

function Feed() {
  const user = useSelector(selectUser);
  const [refresh, setRefresh] = useState(false);
  const [input, setInput] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // https://firebase.google.com/docs/firestore/quickstart#read_data
    console.log('posts size', posts.length);
    const db_posts = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    onSnapshot(db_posts, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
                  id: doc.id,
                  data: doc.data(),
                }));
      setPosts(posts);
    });
  }, [refresh]);

  const sendPost = (e) => {
    e.preventDefault();

    // https://firebase.google.com/docs/firestore/quickstart#add_data
    addDoc(collection(db, 'posts'), {
      name: user.displayName,
      description: user.email,
      message: input,
      photoUrl: user.photoUrl || '',
      timestamp: serverTimestamp(),
    });

    setInput("");
    setRefresh(!refresh);
  };

  return (
    <div className='feed'>
      <div className='feed__inputContainer'>
        <div className='feed__input'>
            <CreateIcon />
            <form onSubmit={sendPost}>
              <input value={input} onChange={e => setInput(e.target.value)} type='text'/>
              {/* <button onClick={sendPost} type='submit'>Send</button> */}
            </form>
        </div>
        <div className='feed__inputOptions'>
          <InputOption Icon={ImageIcon} title='Photo' color='#70B5F9' />
          <InputOption Icon={SubscriptionsIcon} title='Video' color='#E7a33E' />
          <InputOption Icon={EventNoteIcon} title='Event' color='#C0CBCD' />
          <InputOption Icon={CalendarViewDayIcon} title='Write article' color='#7FC15E' />
        </div>
      </div>

      {/* Posts */}
      <FlipMove>
        {posts.map(({ id, data: { name, description, message, photoUrl } }) => (
          <Post
            key={id}
            name={name}
            description={description}
            message={message}
            photoUrl={photoUrl}
          />
        ))}
      </FlipMove>
    </div>
  )
}

export default Feed;
