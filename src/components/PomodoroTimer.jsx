import React, { useEffect, useState } from "react";
import "../styles/PomodoroTimer.css";
const TIMER_MODES = {
    focus: {
        label: "Focus",
        icon: "🎯",
        duration: 25 * 60,
    },
    short: {
        label: "Short Break",
        icon: "☕",
        duration: 5 * 60,
    },
    long: {
        label: "Long Break",
        icon: "🌿",
        duration: 15 * 60,
    },
};

const PRESETS = [25, 50, 90];

const PomodoroTimer = () => {
    const [mode, setMode] = useState("focus");
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(25 * 60);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        if (!running) return;

        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setRunning(false);
                    alert("🎉 Session completed!");
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [running]);

    const displayMinutes = String(
        Math.floor(seconds / 60)
    ).padStart(2, "0");

    const displaySeconds = String(
        seconds % 60
    ).padStart(2, "0");

    const toggleTimer = () => {
        setRunning((prev) => !prev);
    };

    const resetTimer = () => {
        setRunning(false);

        if (mode === "focus") {
            setSeconds(minutes * 60);
        } else {
            setSeconds(TIMER_MODES[mode].duration);
        }
    };

    const selectPreset = (value) => {
        setMode("focus");
        setMinutes(value);
        setSeconds(value * 60);
        setRunning(false);
    };

    const selectMode = (selectedMode) => {
        setMode(selectedMode);
        setRunning(false);
        setSeconds(TIMER_MODES[selectedMode].duration);
    };

    return (
        <div className="focus-timer-inner">

            {/* HEADER */}
            <div className="focus-timer-header">
                <div className="focus-timer-icon">
                    ◷
                </div>

                <div>
                    <h3>Focus Timer</h3>
                    <p>Stay focused. Get more done.</p>
                </div>
            </div>

            {/* TIMER */}
            <div className="timer-circle">
                <div className="timer-circle-content">

                    <strong>
                        {displayMinutes}:{displaySeconds}
                    </strong>

                    <span>
                        {mode === "focus"
                            ? "Pomodoro"
                            : TIMER_MODES[mode].label}
                    </span>

                    <button
                        type="button"
                        className="timer-play"
                        onClick={toggleTimer}
                        aria-label={
                            running
                                ? "Pause timer"
                                : "Start timer"
                        }
                    >
                        {running ? "❚❚" : "▶"}
                    </button>

                </div>
            </div>

            {/* PRESETS */}
            <div className="timer-presets">
                {PRESETS.map((preset) => (
                    <button
                        key={preset}
                        type="button"
                        className={
                            mode === "focus" &&
                            minutes === preset
                                ? "selected"
                                : ""
                        }
                        onClick={() => selectPreset(preset)}
                    >
                        {preset}:00
                    </button>
                ))}
            </div>

            {/* MODES */}
            <div className="timer-modes">

                {Object.entries(TIMER_MODES).map(
                    ([key, timerMode]) => (
                        <button
                            key={key}
                            type="button"
                            className={`timer-mode ${
                                mode === key ? "active" : ""
                            }`}
                            onClick={() => selectMode(key)}
                        >
                            <span>
                                {timerMode.icon}
                            </span>

                            <small>
                                {timerMode.label}
                            </small>
                        </button>
                    )
                )}

            </div>

            {/* CONTROLS */}
            <div className="timer-controls">

                <button
                    type="button"
                    className="timer-start-button"
                    onClick={toggleTimer}
                >
                    {running ? "Pause" : "Start Focus"}
                </button>

                <button
                    type="button"
                    className="timer-reset-button"
                    onClick={resetTimer}
                >
                    Reset
                </button>

            </div>

        </div>
    );
};

export default PomodoroTimer;