import React, { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import SidebarTabs from './components/SidebarTabs';
import QuizMode from './components/QuizMode';
import './styles.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from './components/firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

function App() 
{
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [flashcardSets, setFlashcardSets] = useState([]); 
  const [selectedSet, setSelectedSet] = useState(null);  
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [addingNew, setAddingNew] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(function() 
  {
    if (user) 
    {
      loadFlashcardSets(user.uid).then(function(sets) 
      {
        setFlashcardSets(sets);
        if (sets.length> 0) 
        {
          setSelectedSet(0);
        }
      });
    }
  }, [user]);

  useEffect(function() 
  {
    if(user) 
    {
      saveFlashcardSets(user.uid, flashcardSets);
    }
  },     
  [flashcardSets, user]);

  function handleSignUp() 
  {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async function(userCredential) 
      {
        setUser(userCredential.user);
        await saveFlashcardSets(userCredential.user.uid, []);
        setFlashcardSets([]);
      })
      .catch(function(error) {
        alert("Sign up failed: " + error.message);
        setPassword('');
      });
  }

  function handleSignIn() 
  {
    signInWithEmailAndPassword(auth, email, password)
      .then(async function(userCredential) 
      {
        setUser(userCredential.user);
        const sets = await loadFlashcardSets(userCredential.user.uid);
        setFlashcardSets(sets);
      })
      .catch(function(error) 
      {
        alert("Sign in failed: " + error.message);
        setPassword('');
      });
  }

  function handleSignOut() 
  {
    signOut(auth).then(function() 
    {
      setUser(null);
      setEmail('');
      setPassword('');
    });
  }

  async function generateFlashcards() 
  {
    setLoading(true);
    setCurrent(0);
    const response = await fetch('http://localhost:5000/generate', 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    if (data.flashcards && data.flashcards.length > 0) 
    {
      if (flashcardSets.length < 5) 
      {
        const newSets = [...flashcardSets, { prompt, flashcards: data.flashcards }];
        setFlashcardSets(newSets);
         setSelectedSet(newSets.length- 1); 
        setAddingNew(false);
        setPrompt('');
        setCurrent(0);
        if (user) 
        {
          saveFlashcardSets(user.uid, newSets);
        }
      }
    }
    setLoading(false);
  }

  function handleShuffle() 
  {
    const shuffled = [...flashcardSets[selectedSet].flashcards];
    for (let i = shuffled.length - 1; i > 0; i--) 
    {
      const j = Math.floor(Math.random() *(i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const newSets = [...flashcardSets];
    newSets[selectedSet].flashcards = shuffled;
    setFlashcardSets(newSets);
    setCurrent(0); 
    setIsFlipped(false); 
  }

  function handleDeleteCard() 
  {
    const cards = flashcardSets[selectedSet].flashcards;
    if (cards.length === 0) 
    {
      return;
    }
    const confirmDelete = window.confirm("Delete this flashcard?");
    if (!confirmDelete) 
    {
      return;
    }
    const newCards = cards.filter(function(_, idx) 
    { 
      return idx !== current; 
    });
    const newSets = [...flashcardSets];
    newSets[selectedSet].flashcards = newCards;
    setFlashcardSets(newSets);
    setCurrent(function(c) 
    { 
      return Math.max(0, c - 1); 
    });
  }

  function handleDeleteSet(index) 
  {
    const newSets = flashcardSets.filter(function(_, i) 
    {
      return i !== index;
    });
    console.log("Deleting set at index:",index, "New sets:", newSets);
    setFlashcardSets(newSets);
    setSelectedSet(null);
    setCurrent(0);
    setAddingNew(false);
    setQuizMode(false);
  }

  function handlePrev() 
  {
    setCurrent(function(c) { 
      return Math.max(0, c - 1); 
    });
    setIsFlipped(false);
  }

  function handleNext() 
  {
    setCurrent(function(c) 
    { 
      return Math.min(flashcardSets[selectedSet].flashcards.length - 1, c + 1); 
    });
    setIsFlipped(false); 
  }

  if (!user) 
  {
    return (
      <div className="App gradient-bg">
        <div className="container">
          <h1>Sign In to Pro Flashcard Generator</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={function(e) 
            { 
              setEmail(e.target.value); 
            }}
            className="prompt-box"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={function(e) 
            { 
              setPassword(e.target.value); 
            }}
            className="prompt-box"
          />
          <div>
            <button
              onClick={handleSignIn}
              className="main-btn"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="main-btn"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App gradient-bg">
      <div className="main-flex">
        <SidebarTabs
          flashcardSets={flashcardSets}
          selectedSet={selectedSet}
          onSelectSet={function(index) { setSelectedSet(index); setCurrent(0); setAddingNew(false); }}
          onDeleteSet={handleDeleteSet}
          onAddSet={function() 
            { 
              setAddingNew(true); 
              setSelectedSet(null); 
              setPrompt(''); 
              setCurrent(0); 
            }}
        />
        <div className="main-content">
          <div className="container">
            <img
              src="/logo.png"
              alt="Flashcard Maker Logo"
              className="logo"
            />
            <h1>Pro Flashcard Generator</h1>
            <div className="user-bar">
              <span>Logged in as: {user.email}</span>
              <button onClick={handleSignOut} className="main-btn signout-btn">Sign Out</button>
            </div>
            {addingNew && (
              <>
                <textarea
                  value={prompt}
                  onChange={function(e) 
                  { 
                    setPrompt(e.target.value); 
                  }}
                  placeholder="Please Enter your prompt here"
                  rows={4}
                  cols={50}
                  className="prompt-box"
                />
                <br />
                <button
                  onClick={generateFlashcards}
                  disabled={loading|| !prompt.trim()}
                  className="main-btn"
                >
                  {function() 
                  {
                    if (loading) 
                    {
                      return 'Generating...';
                    } 
                    else 
                    {
                      return 'Generate Flashcards';
                    }
                  }()}
                </button>
              </>
            )}
            {selectedSet !== null && flashcardSets[selectedSet] && 
            (
              <div>
                <div className="prompt-label">
                  <strong>Prompt:</strong> {flashcardSets[selectedSet].prompt}
                </div>
                {selectedSet !== null &&
  flashcardSets[selectedSet] &&
  flashcardSets[selectedSet].flashcards &&
  flashcardSets[selectedSet].flashcards.length > 0 && (
    <div className="flashcard-center">
      <Flashcard
        key={current}
        {...flashcardSets[selectedSet].flashcards[current]}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
      />
      <button
        onClick={handleDeleteCard}
        className="delete-btn"
        title="Delete this card"
      >
        Delete Card
      </button>
      <div className="nav-row">
        <button
          onClick={handlePrev}
          disabled={current===0}
          className="nav-btn"
        >
          Prev
        </button>
        <span className="nav-count">
          {current+1} / {flashcardSets[selectedSet].flashcards.length}
        </span>
        <button
          onClick={handleNext}
          disabled={current===flashcardSets[selectedSet].flashcards.length-1}
          className="nav-btn"
        >
          Next
        </button>
      </div>
    </div>
  )}
                <div className="action-row">
                  <button
                    onClick={handleShuffle}
                    className="main-btn"
                  >
                    Shuffle
                </button>
                  <button
                    className="tts-btn"
                    onClick={function () {
                      const card = flashcardSets[selectedSet].flashcards[current];
                      let text = ""
                      if (isFlipped) 
                      {
                      text = "Answer: " + card.answer;
                     } else 
                     {
                      text = "Question: " + card.question;
                    }                      
                    const utterance = new window.SpeechSynthesisUtterance(text);
                      window.speechSynthesis.speak(utterance);
                    }}
                  >
                                                          
                    Speak
                  </button>
                  <button
                    className="main-btn"
                    onClick={function () 
                    {
                      setQuizMode(true);
                      setQuizIndex(0);
                      setQuizScore(0);
                      setQuizAnswered(false);
                      const options = generateOptions(
                        current,
                        flashcardSets[selectedSet].flashcards
                      );
                      setQuizOptions(options);
                    }}
                  >
                    Start Quiz Mode
                  </button>
                </div>
              </div>
            )}
            {quizMode && (
              <QuizMode
                question={flashcardSets[selectedSet].flashcards[quizIndex].question}
                options={quizOptions}
                answered={quizAnswered}
                answer={flashcardSets[selectedSet].flashcards[quizIndex].answer}
                onAnswer={function(option) 
                {
                  setQuizAnswered(true);
                  if (option === flashcardSets[selectedSet].flashcards[quizIndex].answer) 
                  {
                    setQuizScore(function(score) 
                    { 
                      return score +1; 
                    });
                  }
                }}
                onNext={function() 
                {
                  if (quizIndex < flashcardSets[selectedSet].flashcards.length - 1) 
                  {
                    const nextIndex = quizIndex+ 1;
                    setQuizIndex(nextIndex);
                    setQuizOptions(generateOptions(nextIndex, flashcardSets[selectedSet].flashcards));
                    setQuizAnswered(false);
                  } 
                  else 
                  {
                    setQuizMode(false);
                    alert("Quiz finished! Score: " + (quizScore +1) + " / " + flashcardSets[selectedSet].flashcards.length);
                  }
                }}
                score={quizScore}
                total={flashcardSets[selectedSet].flashcards.length}
                onExit={function() 
                { 
                  setQuizMode(false); 
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

async function saveFlashcardSets(userId, sets) 
{
  await setDoc(doc(db, "users", userId), { flashcardSets: sets });
}

async function loadFlashcardSets(userId) 
{
  const docSnap = await getDoc(doc(db, "users", userId));
  if (docSnap.exists()) 
  {
    return docSnap.data().flashcardSets || [];
  }
  return [];
}

function generateOptions(correctIdx, cards) 
{
  const correct = cards[correctIdx].answer;
  const others = [];
  for (let i = 0; i < cards.length; i++) 
  {
    if (i !== correctIdx) 
    {
      others.push(cards[i].answer);
    }
  }
  for (let i = others.length - 1; i > 0; i--) 
  {
    const j = Math.floor(Math.random() *(i + 1));
    const temp = others[i];
    others[i] = others[j];
    others[j] = temp;
  }
  const selectedOthers = others.slice(0, 3);
  const all = [correct, ...selectedOthers];
  for (let i = all.length - 1; i >0; i--) 
  {
    const j = Math.floor(Math.random() *(i + 1));
    const temp = all[i];
    all[i] = all[j];
    all[j] = temp;
  }
  return all;
}

export default App;