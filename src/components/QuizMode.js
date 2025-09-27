import React from 'react';

function QuizMode(props)
{
  var buttons = [];
  for (var index = 0; index < props.options.length; index++)
  {
    (function(option, index) {
      let btnClass = "main-btn";
      if (props.answered)
      {
        if (option ===props.answer)
        {
          btnClass+= " quiz-correct";
        }
        else
        {
          btnClass+= " quiz-wrong";
        }
      }
      buttons.push(
        <button
          key={index}
          className={btnClass}
          disabled={props.answered}
          onClick={function() 
            {
            props.onAnswer(option);
          }}
        >
          {option}
        </button>
      );
    })(props.options[index], index);
  }

  return (
    <div>
      <h2>Quiz Mode</h2>
      <div className="quiz-question">
        Q: {props.question}
      </div>
      <div>
        {buttons}
      </div>
      {props.answered && (
        <button
          className="main-btn"
          onClick={props.onNext}
        >
          Next
        </button>
      )}
      <div className="quiz-score">Score: {props.score}/{props.total}</div>
      <button className="main-btn" onClick={props.onExit}>Exit Quiz</button>
    </div>
  );
}

export default QuizMode;