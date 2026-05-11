import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocalStorage } from "./hooks/useLocalStorage";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import About from "./pages/About";

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addTask = (title, category, priority, dueDate) => {
    const newTask = {
      id: Date.now(),
      title,
      category,
      priority: priority || 'normal',
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <BrowserRouter>
    <Loader />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home tasks={tasks} />} />
          <Route 
            path="/tasks" 
            element={
              <Tasks 
                tasks={tasks} 
                onToggle={toggleTask} 
                onDelete={deleteTask} 
                onAdd={addTask} 
              />
            } 
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;