import React, { useState, useEffect } from "react";
import axios from "axios";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const API_URL = "https://todo-backend-l5rk.onrender.com/api/todos/";

  // Apply dark mode class to the body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Fetch tasks from the Django backend
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        console.log("Fetched tasks:", response.data); // Debugging
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  // Add a new task
  const addTask = () => {
    if (newTask.trim()) {
      console.log("Adding task:", newTask); // Debugging
      axios
        .post(API_URL, { title: newTask, completed: false })
        .then((response) => {
          console.log("Task added successfully:", response.data); // Debugging
          setTasks([...tasks, response.data]);
          setNewTask("");
        })
        .catch((error) => {
          console.error("Error adding task:", error.response || error.message);
        });
    } else {
      console.log("Task input is empty"); // Debugging
    }
  };

  // Toggle task completion
  const toggleCompletion = (id, completed) => {
    axios
      .patch(`${API_URL}${id}/`, { completed: !completed })
      .then((response) => {
        console.log("Task completion toggled:", response.data); // Debugging
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: response.data.completed } : task
          )
        );
      })
      .catch((error) => {
        console.error("Error toggling completion:", error);
      });
  };

  // Start editing a task
  const startEditing = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, editing: true } : task
      )
    );
  };

  // Save edited task
  const saveEdit = (id, newText) => {
    axios
      .patch(`${API_URL}${id}/`, { title: newText })
      .then((response) => {
        console.log("Task edited successfully:", response.data); // Debugging
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, title: response.data.title, editing: false } : task
          )
        );
      })
      .catch((error) => {
        console.error("Error saving edit:", error);
      });
  };

  // Delete a task
  const deleteTask = (id) => {
    axios
      .delete(`${API_URL}${id}/`)
      .then(() => {
        console.log("Task deleted successfully:", id); // Debugging
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="app-container">
      <div className="container">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
        <h1>To-Do List</h1>
        <div className="input-container">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a task"
            className="task-input"
          />
          <button onClick={addTask} className="add-btn">
            Add
          </button>
        </div>
        <div>
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>
        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id} className={task.completed ? "completed" : ""}>
              {task.editing ? (
                <input
                  type="text"
                  defaultValue={task.title}
                  onBlur={(e) => saveEdit(task.id, e.target.value)}
                  autoFocus
                />
              ) : (
                <span>{task.title}</span>
              )}
              <button onClick={() => toggleCompletion(task.id, task.completed)}>
                ✅
              </button>
              <button onClick={() => startEditing(task.id)}>✏️</button>
              <button onClick={() => deleteTask(task.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;