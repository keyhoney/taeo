import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Bus, Star, Heart, Sparkles, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

interface Task {
  id: number;
  name: string;
  emoji: string;
  completed: boolean;
}

export default function App() {
  const [totalMinutes, setTotalMinutes] = useState(20);
  const [remainingMinutes, setRemainingMinutes] = useState(20);
  const [isRunning, setIsRunning] = useState(false);
  const [isSet, setIsSet] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: '씻기', emoji: '🛁', completed: false },
    { id: 2, name: '밥 먹기', emoji: '🍚', completed: false },
    { id: 3, name: '간식 먹기', emoji: '🍪', completed: false },
    { id: 4, name: '옷 갈아입기', emoji: '👕', completed: false },
    { id: 5, name: '양치하기', emoji: '🪥', completed: false },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && remainingMinutes > 0) {
      interval = setInterval(() => {
        setRemainingMinutes(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingMinutes]);

  useEffect(() => {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === tasks.length && isSet) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 5000);
    }
  }, [tasks, isSet]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsSet(false);
    setRemainingMinutes(totalMinutes);
    setTasks(prev => prev.map(task => ({ ...task, completed: false })));
    setCelebrating(false);
  };

  const startTimer = () => {
    setIsSet(true);
    setIsRunning(true);
  };

  const adjustTime = (delta: number) => {
    if (!isSet) {
      const newTime = Math.max(1, Math.min(60, totalMinutes + delta));
      setTotalMinutes(newTime);
      setRemainingMinutes(newTime);
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = isSet ? ((totalMinutes - remainingMinutes) / totalMinutes) * 100 : 0;
  const timeRatio = isSet ? remainingMinutes / totalMinutes : 1;

  // Generate visual blocks for time representation
  const totalBlocks = 10;
  const filledBlocks = Math.ceil(timeRatio * totalBlocks);

  // Celebration particles
  const celebrationEmojis = ['🎉', '🌟', '🎊', '✨', '🌈', '💫', '🎈', '🏆'];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 p-4 md:p-8">
      {/* Celebration Overlay */}
      {celebrating && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-yellow-200 bg-opacity-30 animate-pulse" />
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <div className="text-3xl font-bold text-green-600 bg-white px-6 py-3 rounded-full shadow-lg">
              잘했어요! 🐘
            </div>
          </div>
          {celebrationEmojis.map((emoji, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-ping"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s',
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 bg-white rounded-3xl p-6 shadow-lg border-4 border-amber-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sun className="w-10 h-10 text-amber-500 animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-bold text-amber-600">
              즐거운 등원 준비!
            </h1>
            <Cloud className="w-8 h-8 text-sky-400" />
          </div>
          <div className="flex items-center justify-center gap-2 text-lg md:text-xl">
            <Bus className="w-8 h-8 text-green-600" />
            <span className="font-bold text-green-700 bg-green-100 px-4 py-1 rounded-full">
              🐘 코끼리 2코스 버스
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">자연과학유치원</p>
        </div>

        {/* Time Setting / Visual Timer */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-sky-300 mb-6">
          {!isSet ? (
            /* Time Setting Mode */
            <div className="text-center">
              <h2 className="text-xl font-bold text-sky-600 mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                남은 시간을 설정해주세요
                <Sparkles className="w-6 h-6" />
              </h2>
              
              {/* Visual blocks preview */}
              <div className="flex justify-center gap-2 mb-6">
                {Array.from({ length: totalBlocks }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-12 md:w-8 md:h-16 rounded-lg transition-all duration-300 bg-gradient-to-b from-sky-400 to-sky-500 shadow-md"
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => adjustTime(-5)}
                  className="w-14 h-14 bg-amber-400 hover:bg-amber-500 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
                >
                  <Minus className="w-8 h-8 text-white" />
                </button>
                
                <div className="bg-gradient-to-b from-sky-100 to-sky-200 rounded-2xl px-8 py-4 shadow-inner">
                  <span className="text-5xl md:text-6xl font-bold text-sky-600">
                    {totalMinutes}
                  </span>
                  <span className="text-xl text-sky-500 ml-2">분</span>
                </div>
                
                <button
                  onClick={() => adjustTime(5)}
                  className="w-14 h-14 bg-amber-400 hover:bg-amber-500 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
                >
                  <Plus className="w-8 h-8 text-white" />
                </button>
              </div>

              <button
                onClick={startTimer}
                className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 mx-auto"
              >
                <Play className="w-6 h-6 fill-current" />
                시작하기!
              </button>
            </div>
          ) : (
            /* Timer Running Mode */
            <div className="text-center">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${isRunning ? 'bg-amber-400 text-amber-800' : 'bg-green-400 text-green-800'}`}
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isRunning ? '잠깐!' : '다시 시작'}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full font-bold flex items-center gap-2 hover:bg-gray-300"
                >
                  <RotateCcw className="w-5 h-5" />
                  처음으로
                </button>
              </div>

              {/* Visual Time Blocks */}
              <h2 className="text-lg font-bold text-sky-600 mb-3">
                🕐 남은 시간 (색깔이 다 사라지기 전에 준비해요!)
              </h2>
              <div className="flex justify-center gap-2 mb-4">
                {Array.from({ length: totalBlocks }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-16 md:w-8 md:h-20 rounded-lg transition-all duration-700 shadow-md ${i < filledBlocks ? 'bg-gradient-to-b from-sky-400 to-sky-500' : 'bg-gray-200 border-2 border-dashed border-gray-300'}`}
                  />
                ))}
              </div>

              {/* Large time display */}
              <div className="mb-4">
                <div className={`inline-block px-8 py-4 rounded-2xl ${remainingMinutes <= 5 ? 'bg-red-100 animate-pulse' : 'bg-sky-100'}`}>
                  <span className={`text-6xl md:text-7xl font-bold ${remainingMinutes <= 5 ? 'text-red-500' : 'text-sky-600'}`}>
                    {remainingMinutes}
                  </span>
                  <span className={`text-2xl ml-2 ${remainingMinutes <= 5 ? 'text-red-400' : 'text-sky-500'}`}>
                    분
                  </span>
                </div>
                {remainingMinutes <= 5 && (
                  <p className="text-red-500 font-bold mt-2 animate-bounce">
                    ⚠️ 버스가 곧 와요! 빨리빨리!
                  </p>
                )}
              </div>

              {/* Progress bar with bus */}
              <div className="relative h-12 bg-gradient-to-r from-green-200 to-green-300 rounded-full overflow-hidden shadow-inner">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                  style={{ left: `${Math.min(progress, 92)}%` }}
                >
                  <div className="text-4xl animate-bounce">🚌</div>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-3xl">
                  🏫
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                버스가 출발지점에서 유치원까지 가고 있어요!
              </p>
            </div>
          )}
        </div>

        {/* Task Checklist */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-pink-300">
          <h2 className="text-xl font-bold text-pink-600 mb-4 text-center flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            해야 할 일을 하나씩 확인해요!
            <Star className="w-6 h-6 text-amber-400" />
          </h2>

          {/* Progress indicator with animals */}
          <div className="flex justify-center items-center gap-1 mb-6">
            {tasks.map((task, i) => (
              <React.Fragment key={task.id}>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 shadow-md ${task.completed ? 'bg-green-400 scale-110' : 'bg-gray-200'}`}>
                  {task.completed ? '✅' : task.emoji}
                </div>
                {i < tasks.length - 1 && (
                  <div className={`w-4 md:w-8 h-2 rounded transition-all duration-500 ${tasks[i].completed ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Task Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks.map((task, index) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                disabled={!isSet}
                className={`p-4 rounded-2xl text-left transition-all duration-300 transform hover:scale-102 ${task.completed ? 'bg-gradient-to-r from-green-100 to-green-200 border-4 border-green-400 shadow-lg' : isSet ? 'bg-gradient-to-r from-pink-50 to-amber-50 border-4 border-pink-200 hover:border-pink-400 shadow-md' : 'bg-gray-100 border-4 border-gray-200 opacity-50 cursor-not-allowed'}`}
              >
                <div className="flex items-center gap-3">
                  {/* Order number */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${task.completed ? 'bg-green-400 text-white' : 'bg-pink-300 text-pink-700'}`}>
                    {index + 1}
                  </div>
                  
                  {/* Emoji */}
                  <div className={`text-4xl transition-all duration-300 ${task.completed ? 'scale-125' : ''}`}>
                    {task.emoji}
                  </div>
                  
                  {/* Task name */}
                  <div className="flex-1">
                    <span className={`text-lg md:text-xl font-bold ${task.completed ? 'text-green-600 line-through' : 'text-gray-700'}`}>
                      {task.name}
                    </span>
                  </div>
                  
                  {/* Checkmark */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${task.completed ? 'bg-green-500 scale-110' : 'bg-gray-200'}`}>
                    {task.completed ? (
                      <span className="text-white text-xl font-bold">✓</span>
                    ) : (
                      <span className="text-gray-400">○</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Completion Message */}
          {isSet && (
            <div className="mt-6 text-center">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xl font-bold transition-all duration-500 ${completedTasks === tasks.length ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg animate-pulse' : completedTasks > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                {completedTasks === tasks.length ? (
                  <>
                    <span className="text-2xl">🎉</span>
                    <span>모두 다 했어요! 버스를 타요!</span>
                    <span className="text-2xl">🚌</span>
                  </>
                ) : (
                  <>
                    <Star className="w-6 h-6" />
                    <span>
                      {tasks.length}개 중 {completedTasks}개 완료! 
                      {completedTasks > 0 && ' 잘하고 있어요! 👍'}
                    </span>
                    <span className="text-2xl ml-2">
                      {completedTasks === 0 && '💪'}
                      {completedTasks === 1 && '🌟'}
                      {completedTasks === 2 && '⭐'}
                      {completedTasks === 3 && '🌈'}
                      {completedTasks === 4 && '🎊'}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Encouragement Messages */}
        <div className="mt-6 bg-gradient-to-r from-amber-100 to-pink-100 rounded-3xl p-6 shadow-lg border-4 border-amber-200">
          <h3 className="text-center font-bold text-amber-700 mb-3 text-lg">
            💛 오늘도 즐거운 유치원 생활이 기다려요! 💛
          </h3>
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {['🐘', '🦒', '🦁', '🐯', '🐻'].map((animal, i) => (
              <span key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                {animal}
              </span>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-3 text-sm">
            코끼리 2코스 친구들이랑 같이 놀아요! 🎈
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>🚦 타이머를 시작하고 할 일을 하나씩 클릭해보세요!</p>
        </div>
      </div>
    </div>
  );
}