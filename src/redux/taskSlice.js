import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: JSON.parse(localStorage.getItem("tasks")) || [],
  reducers: {
    addTask: (state, action) => {
      state.push(action.payload);
      localStorage.setItem("tasks", JSON.stringify(state));
    },
    editTask: (state, action) => {
      const index = state.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
      localStorage.setItem("tasks", JSON.stringify(state));
    },
    deleteTask: (state, action) => {
      const updatedTasks = state.filter((task) => task.id !== action.payload);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    },
    reorderTasks: (state, action) => {
      localStorage.setItem("tasks", JSON.stringify(action.payload));
      return action.payload;
    },
  },
});

export const { addTask, editTask, deleteTask, reorderTasks } = taskSlice.actions;
export default taskSlice.reducer;
