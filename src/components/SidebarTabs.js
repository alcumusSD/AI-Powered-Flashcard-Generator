import React from 'react';

function SidebarTabs(props)
{
  return (
    <div className="sidebar-panel">
      {props.flashcardSets.map(function(set, index) 
      {
        let bgColor;
        if (props.selectedSet === index)
        {
          bgColor = "#2563eb";
        }
        else
        {
          bgColor = "#1e3c72";
        }
        
        let label;
        if (set.prompt && set.prompt.length > 0) {
          if (set.prompt.length > 10) {
            label = set.prompt.slice(0, 20) + "...";
          } else {
            label = set.prompt;
          }
        } else {
          label = "Set "+ (index + 1);
        }
        return (
          <div
            key={index}
            className="sidebar-set-row"
          >
            <button
              className="main-btn sidebar-set-btn"
              style=
              {{
                background: bgColor
              }}
              onClick={function () 
                {
                props.onSelectSet(index);
              }}
            >
              {label}
            </button>
            <button
              className="main-btn sidebar-delete-btn"
              title="Delete this set"
              onClick={function () {
                props.onDeleteSet(index);
              }}
            >
              ✕
            </button>
          </div>
        );
      })}
      <button
        className="main-btn plus-btn"
        onClick={props.onAddSet}
        title="Add new set"
      >
        <span className="plus-sign">+</span>
      </button>
    </div>
  );
}

export default SidebarTabs;