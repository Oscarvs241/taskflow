import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { subscribeToTasks, updateTask, deleteTask, addTask } from "./firebase/taskService";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  // 🔄 Synchronisation Firebase en temps réel
  useEffect(() => {
    const unsubscribe = subscribeToTasks((fetchedTasks) => {
      setTasks(fetchedTasks);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Thème
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // 📝 Handlers CRUD
  const handleAddTask = async (newTask) => {
    try {
      await addTask(newTask);
    } catch (error) {
      console.error("Erreur ajout tâche:", error);
      alert("Erreur lors de l'ajout de la tâche");
    }
  };

  // ✅ Toggle amélioré (optimiste + Firebase)
  const handleToggleTask = async (id) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    const newCompleted = !taskToToggle.completed;

    try {
      // Mise à jour optimiste (immédiate dans l'UI)
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, completed: newCompleted } : task
        )
      );

      // Mise à jour dans Firebase
      await updateTask(id, { completed: newCompleted });

      console.log(`✅ Tâche ${id} mise à jour : ${newCompleted ? 'Terminée' : 'En cours'}`);
    } catch (error) {
      console.error("❌ Erreur toggle tâche:", error);
      
      // Annuler la mise à jour optimiste en cas d'erreur
      setTasks(prevTasks => [...prevTasks]);
      alert("Erreur lors de la mise à jour. Vérifiez votre connexion.");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Supprimer cette tâche ?")) return;
    
    try {
      await deleteTask(id);
    } catch (error) {
      console.error("Erreur suppression tâche:", error);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader">Chargement depuis Firebase...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home tasks={tasks} />} />
          <Route 
            path="/tasks" 
            element={
              <Tasks 
                tasks={tasks} 
                onToggle={handleToggleTask} 
                onDelete={handleDeleteTask} 
                onAdd={handleAddTask} 
              />
            } 
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;