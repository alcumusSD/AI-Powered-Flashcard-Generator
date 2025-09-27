import React from 'react';
import '../styles.css';

function Flashcard(props) 
{
  const question = props.question;
  const answer = props.answer;
  const isFlipped = props.isFlipped;
  const setIsFlipped = props.setIsFlipped;

  return (
    <div
      className={"card-wrapper" + (isFlipped ? " flipped" : "")}
      onClick={function()
      {
        setIsFlipped(function(f)
        {
          if (f)
          {
            return false;
          }
          else
          {
            return true;
          }
        });
      }}
      tabIndex={0}
      aria-pressed={isFlipped}
    >
      <div className="card-flip-inner">
        {
          (function()
          {
            if (isFlipped === false)
            {
              return (
                <div className="card-front card-flip-face">
                  <p className="flashcard-question">
                    <span className="flashcard-q-label">Q:</span> {question}
                  </p>
                  <div className="flashcard-hint">Click to show answer</div>
                </div>
              );
            }
            else
            {
              return null;
            }
          })()
        }
        {
          (function()
          {
            if (isFlipped=== true)
            {
              return (
                <div className="card-back card-flip-face">
                  <p className="flashcard-answer">
                    <span className="flashcard-a-label">A:</span> {answer}
                  </p>
                  <div className="flashcard-hint">Click to hide answer</div>
                </div>
              );
            }
            else
            {
              return null;
            }
          })()
        }
      </div>
    </div>
  );
}

export default Flashcard;