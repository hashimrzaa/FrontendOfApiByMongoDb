// TodoApp.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box } from '@mui/material';
import { Delete, Edit, Save } from '@mui/icons-material';

const apiUrl = 'http://localhost:3000';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${apiUrl}/todos`);
      const todosData = await response.json();
      setTodos(todosData);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!todoText) return;

    try {
      const response = await fetch(`${apiUrl}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: todoText }),
      });

      if (response.ok) {
        fetchTodos();
        setTodoText('');
      } else {
        console.error('Failed to add todo');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTodos();
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditClick = (id, text) => {
    setEditTodoId(id);
    setEditTodoText(text);
  };

  const handleSaveClick = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editTodoText }),
      });

      if (response.ok) {
        fetchTodos();
        setEditTodoId(null);
        setEditTodoText('');
      } else {
        console.error('Failed to save todo');
      }
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  };

  return (

    <Container maxWidth="lr" style={{ marginTop: '20px' }}>
      <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',gap:'20px'}}>
      <TextField
        fullWidth
        label="Enter todo"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button variant="contained" color="primary" onClick={addTodo} >
        Add Todo
      </Button>
      </Box>
      <List style={{ marginTop: '20px' }}>
        {todos.map((todo) => (
          <ListItem key={todo._id}>
            {editTodoId === todo._id ? (
              <>
                <TextField
                  fullWidth
                  value={editTodoText}
                  onChange={(e) => setEditTodoText(e.target.value)}
                />
                <IconButton edge="end" aria-label="save" onClick={() => handleSaveClick(todo._id)}>
                  <Save />
                </IconButton>
              </>
            ) : (
              <>
                <ListItemText primary={todo.text} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(todo._id, todo.text)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo._id)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TodoApp;
