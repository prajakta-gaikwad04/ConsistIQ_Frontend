import React, { useEffect, useState } from 'react'

const PomodoroTimer = () => {
    const [seconds,setSeconds] = useState(1500);
    const [running,setRunning] =useState(false);

    useEffect(() =>{
        let timer;
        if(running&& seconds>0){
            timer=setInterval(()=>{
                setSeconds(prev=>prev-1);
            },1000);

        }
        if(seconds===0){
            alert("🎉 Focus Session Completed!");

            setRunning(false);
        }
        return()=>clearInterval(timer);
    },[running,seconds]);

    const minutes =
        String(Math.floor(seconds / 60)).padStart(2, "0");

    const secs =
        String(seconds % 60).padStart(2, "0");

    const resetTimer = () => {

        setSeconds(1500);
        setRunning(false);
    };
  return (
    <div className="pomodoro-card">

            <h3>⏱️ Pomodoro Timer</h3>

            <h1>
                {minutes}:{secs}
            </h1>

            <div>

                <button
                    onClick={() => setRunning(true)}
                    className="primary-btn"
                >
                    Start
                </button>

                <button
                    onClick={() => setRunning(false)}
                    className="secondary-btn"
                >
                    Pause
                </button>

                <button
                    onClick={resetTimer}
                    className="primary-btn"
                >
                    Reset
                </button>

            </div>

        </div>

    );
};

export default PomodoroTimer

