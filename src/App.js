import data from './data';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [images, setImages] = useState(data);
  const [sortedImages, setSortedImages] = useState(images);

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  function sortImages() {
    setSortedImages(prevState => shuffle(prevState));
  }

  const [score, setScore] = useState(0);
  const [isOver, setIsOver] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  let bestScore = JSON.parse(localStorage.getItem('score')) || 0;

  useEffect(() => {
    if (isOver) {
      if (!localStorage.getItem('score')) {
        localStorage.setItem('score', JSON.stringify(score));
      } else {
        const prevScore = localStorage.getItem('score');
        if (score > prevScore) {
          localStorage.setItem('score', JSON.stringify(score));
          setMessage('New Best Score!');
        } else {
          setMessage('You clicked on an image twice!');
        }
        setIsVisible(true);
      }
      setScore(0);
      setIsOver(false);
    }
  }, [isOver, score]);

  function handleClick(item) {
    if (item.isClicked) {
      setIsOver(true);
      setSortedImages(prevImages =>
        prevImages.map(image => {
          return { ...image, isClicked: false };
        })
      );
    } else {
      setSortedImages(prevImages =>
        prevImages.map(image => {
          return image.id === item.id ? { ...image, isClicked: true } : image;
        })
      );
      setScore(prevScore => prevScore + 1);
      sortImages();
    }
    setIsVisible(false);
  }

  return (
    <div className='App'>
      <header>
        {isVisible && <div className='popup'>{message}</div>}
        <div>
          <h1>Memory Game</h1>
          <p>Get points by clicking on each image once!</p>
        </div>
        <div>
          <h3 className='score'>Score: {score}</h3>
          <h3 className='best-score'>Best Score: {bestScore}</h3>
        </div>
      </header>
      <div className='image-container'>
        {sortedImages.map(image => (
          <img
            src={image.url}
            alt='illustration'
            key={image.id}
            onClick={() => handleClick(image)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
