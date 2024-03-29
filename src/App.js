import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import './index.css'; 

const API_BASE = 'http://localhost:4000';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = async () => {
    try {
      const response = await axios.get(API_BASE + '/todos');
      setTodos(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const completeTodo = async id => {
    const data = await fetch(API_BASE + '/todo/complete/' + id).then(res => res.json());

    setTodos(todos => todos.map(todo => {
      if (todo._id === data._id) {
        todo.complete = data.complete;
      }

      return todo;
    }));
  }

  const addTodo = async () => {
    try {
      const response = await axios.post(API_BASE + "/todo/new", {
        text: newTodo
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      setTodos([...todos, response.data]);
      setPopupActive(false);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  const deleteTodo = async id => {
    try {
      await axios.delete(API_BASE + '/todo/delete/' + id);
      setTodos(todos => todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  return (
    <div className="App">
      <h1>Welcome, User</h1>
      <h4>Your tasks</h4>

      <div className="todos">
        {todos.length > 0 ? todos.map(todo => (
          <Draggable key={todo._id}>
            <div className={
              "todo" + (todo.complete ? " is-complete" : "")
            } onClick={() => completeTodo(todo._id)}>
              <div className="checkbox"></div>

              <div className="text">{todo.text}</div>

              <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div>
            </div>
          </Draggable>
        )) : (
            <p>You currently have no tasks</p>
          )}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}><span>X</span></div>
          <div className="content">
            <h3>Add Task</h3>
            <input type="text" className="add-todo-input" onChange={e => setNewTodo(e.target.value)} value={newTodo} />
            <div className="button" onClick={addTodo}>Create Task</div>
          </div>
        </div>
      ) : ''}
    </div>
  )
}

export default App;
