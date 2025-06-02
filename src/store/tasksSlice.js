import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Load tasks from localStorage
const loadTasks = () => {
  try {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
};

// Save tasks to localStorage
const saveTasks = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
};

// Initial state for tasks
const initialState = {
  tasks: loadTasks(),
};

// Create slice for tasks
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      saveTasks(state.tasks);
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      saveTasks(state.tasks);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
        saveTasks(state.tasks);
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      saveTasks(state.tasks);
    },
  },
});

// Export actions for use in components
export const { setTasks, addTask, updateTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;

// Fetch tasks from localStorage
export const fetchTasks = () => async (dispatch) => {
  try {
    const tasks = loadTasks();
    dispatch(setTasks(tasks));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to fetch tasks");
  }
};

// Add a task to localStorage
export const addTaskToFirebase = (task) => async (dispatch) => {
  try {
    const id = Date.now().toString();
    const newTask = { id, ...task };
    const tasks = loadTasks();
    tasks.push(newTask);
    saveTasks(tasks);
    dispatch(addTask(newTask));
  } catch (error) {
    console.error("Error adding task:", error);
    toast.error("Failed to add task");
  }
};

// Update a task in localStorage
export const updateTaskInFirebase = (task) => async (dispatch) => {
  try {
    const tasks = loadTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...task };
      saveTasks(tasks);
      dispatch(updateTask(task));
    }
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task");
  }
};

// Delete a task from localStorage
export const deleteTaskFromFirebase = (id) => async (dispatch) => {
  try {
    const tasks = loadTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasks(updatedTasks);
    dispatch(removeTask(id));
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("Failed to delete task");
  }
};
