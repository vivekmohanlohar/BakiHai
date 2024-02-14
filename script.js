document.addEventListener("DOMContentLoaded", function() {
  const addButton = document.getElementById("add-button");
  const clearButton = document.getElementById("clear-button");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const itemCount = document.getElementById("item-count");

  addButton.addEventListener("click", addTodo);
  clearButton.addEventListener("click", clearAll);

  loadTodos();

  function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText !== "") {
      const todoItem = createTodoItem(todoText);
      todoList.appendChild(todoItem);

      playSound("add");
      saveTodoToStorage(todoText);
      updateItemCount(); // Update item count immediately after adding
      todoInput.value = ""; // Clear the textbox after adding the item
    }
  }

  function createTodoItem(todoText) {
    const todoItem = document.createElement("li");
    const textSpan = document.createElement("span");
    textSpan.textContent = todoText;
    textSpan.classList.add("todo-text");
    todoItem.appendChild(textSpan);

    todoItem.classList.add("todo-item");
    todoItem.addEventListener("click", handleItemClick);
    return todoItem;
  }

  function handleItemClick(event) {
    const todoItem = event.currentTarget;
    todoItem.remove();
    playSound("remove");
    updateItemCount();
  }

  function clearAll() {
    const todoItems = document.querySelectorAll(".todo-item");
    todoItems.forEach(item => {
      item.remove();
    });
    playSound("remove");
    todoInput.value = ""; // Clear the textbox after clearing all items
  }

  function saveTodoToStorage(todo) {
    const todos = getStoredTodos();
    todos.push({ text: todo });
    chrome.storage.sync.set({ todos: todos });
  }

  function loadTodos() {
    const todos = getStoredTodos();
    todos.forEach((todo) => {
      const todoItem = createTodoItem(todo.text);
      todoList.appendChild(todoItem);
    });
    updateItemCount();
  }

  function getStoredTodos() {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  }

  function updateItemCount() {
    const incompleteItems = document.querySelectorAll(".todo-item");
    itemCount.textContent = `Items: ${incompleteItems.length}`;
  }

  function playSound(action) {
    const audio = new Audio();
    if (action === "add") {
      audio.src = "sounds/add.mp3";
    } else if (action === "remove") {
      audio.src = "sounds/remove.mp3";
    }
    audio.play();
  }
});