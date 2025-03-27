import React, { useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./redux/store";
import { addTask, deleteTask, reorderTasks } from "./redux/taskSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Container, Card, CardContent, Button, TextField, Typography, Grid, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

const TaskManager = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");

  const addNewTask = () => {
    if (newTask.trim()) {
      dispatch(addTask({ id: Date.now(), title: newTask, priority }));
      setNewTask("");
      setPriority("Medium");
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = [...tasks];
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    dispatch(reorderTasks(reorderedTasks));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right,rgb(93, 154, 234), #B5FFFC)",
      }}
    >
      <Container maxWidth="sm" sx={{ background: "white", padding: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#3f51b5" }}>Task Manager</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={7}>
            <TextField fullWidth label="New Task" value={newTask} onChange={(e) => setNewTask(e.target.value)} variant="outlined" />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <TextField
                select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Button fullWidth variant="contained" color="primary" onClick={addNewTask} startIcon={<AddIcon />} sx={{ height: "100%" }}>Add</Button>
          </Grid>
        </Grid>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ marginTop: "20px" }}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card style={{ margin: "10px 0", padding: "10px", background: "#f9f9f9", borderLeft: `5px solid ${task.priority === "High" ? "red" : task.priority === "Medium" ? "orange" : "green"}` }}>
                          <CardContent>
                            <Typography variant="h6" style={{ fontWeight: "bold" }}>{task.title}</Typography>
                            <Typography variant="body2" color="textSecondary">Priority: {task.priority}</Typography>
                            <Button onClick={() => dispatch(deleteTask(task.id))} color="secondary" startIcon={<DeleteIcon />}>Delete</Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Container>
    </Box>
  );
};

const App = () => (
  <Provider store={store}>
    <TaskManager />
  </Provider>
);

export default App;