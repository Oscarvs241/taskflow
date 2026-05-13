import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

const TASKS_COLLECTION = "tasks";

// ✅ Ajouter une tâche
export const addTask = async (task) => {
  try {
    const taskData = {
      title: String(task.title || ""),
      category: String(task.category || "Personnel"),
      priority: String(task.priority || "normal"),
      dueDate: task.dueDate || null,
      completed: Boolean(task.completed) || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData);
    console.log("✅ Tâche ajoutée:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ Erreur ajout tâche:", error);
    return { success: false, error: error.message };
  }
};

// ✅ Modifier une tâche (CORRIGÉ)
export const updateTask = async (id, updates) => {
  try {
    // S'assurer que l'ID est une chaîne valide
    const taskId = String(id).trim();
    
    if (!taskId) {
      throw new Error("ID de tâche invalide");
    }

    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    // Nettoyer les valeurs undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await updateDoc(taskRef, updateData);
    console.log("✅ Tâche mise à jour:", taskId);
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur mise à jour:", error);
    return { success: false, error: error.message };
  }
};

// ✅ Supprimer une tâche
export const deleteTask = async (id) => {
  try {
    const taskId = String(id).trim();
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
    console.log("✅ Tâche supprimée:", taskId);
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur suppression:", error);
    return { success: false, error: error.message };
  }
};

// ✅ Écouter les tâches en temps réel
export const subscribeToTasks = (callback) => {
  try {
    const q = query(
      collection(db, TASKS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("📋 Tâches récupérées en temps réel:", tasks.length);
      callback(tasks);
    }, (error) => {
      console.error("❌ Erreur synchronisation:", error);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error("❌ Erreur subscription:", error);
    return () => {};
  }
};