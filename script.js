// ----------------------------
// Load saved settings on startup
// ----------------------------
window.onload = function () {
    const savedRows = localStorage.getItem("rows");
    const savedCols = localStorage.getItem("cols");
    const savedMode = localStorage.getItem("themeMode");
    const savedTodos = JSON.parse(localStorage.getItem("todoList")) || [];

    // Restore grid inputs
    if (savedRows) document.getElementById("rowsInput").value = savedRows;
    if (savedCols) document.getElementById("colsInput").value = savedCols;

    // Restore theme
    if (savedMode === "dark") {
        document.body.classList.add("dark");
    }

    // Restore todo list
    const todoContainer = document.getElementById("todo-list");
    savedTodos.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task;
        todoContainer.appendChild(li);
    });

    // Restore grid
    if (savedRows && savedCols) {
        createGrid(savedRows, savedCols);
    } else {
        createGrid(25, 25); // default
    }
};

// ----------------------------
// Save grid size
// ----------------------------
document.getElementById("resizeBtn").addEventListener("click", () => {
    const rows = document.getElementById("rowsInput").value;
    const cols = document.getElementById("colsInput").value;

    localStorage.setItem("rows", rows);
    localStorage.setItem("cols", cols);

    createGrid(rows, cols);
});

// ----------------------------
// Save dark mode
// ----------------------------
document.getElementById("themeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("themeMode", "dark");
    } else {
        localStorage.setItem("themeMode", "light");
    }
});

// ----------------------------
// Save To-Do items
// ----------------------------
document.getElementById("addTodoBtn").addEventListener("click", () => {
    const input = document.getElementById("todoInput");
    const taskText = "💡" + input.value.trim();
    if (!taskText) return;

    const todoList = JSON.parse(localStorage.getItem("todoList")) || [];
    todoList.push(taskText);
    localStorage.setItem("todoList", JSON.stringify(todoList));

    // Create <li> for the task
    const li = document.createElement("li");
    li.textContent = taskText;
    li.className = "list";

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "btn-remove";

    // Delete the task when clicking "X"
    deleteBtn.addEventListener("click", () => {
        // Remove from DOM
        li.remove();

        // Remove from localStorage
        const updatedList = JSON.parse(localStorage.getItem("todoList")) || [];
        const index = updatedList.indexOf(taskText);
        if (index > -1) {
            updatedList.splice(index, 1);
            localStorage.setItem("todoList", JSON.stringify(updatedList));
        }
    });

    li.appendChild(deleteBtn);
    document.getElementById("todo-list").appendChild(li);

    input.value = "";
});

// ----------------------------
// Clear To-Do items
// ----------------------------
document.getElementById("clearTodoBtn").addEventListener("click", () => {
    // Remove all items from localStorage
    localStorage.removeItem("todoList");

    // Clear all <li> elements from the list
    const todoListElement = document.getElementById("todo-list");
    todoListElement.innerHTML = "";

    // Optionally, clear the input field
    document.getElementById("todoInput").value = "";
});

// ----------------------------
// Create Grid
// ----------------------------
function createGrid(rows, cols) {
    const grid = document.getElementById("grid-container");
    grid.innerHTML = "";

    grid.style.display = "grid";
    grid.style.gridTemplateRows = `repeat(${rows}, 25px)`;
    grid.style.gridTemplateColumns = `repeat(${cols}, 25px)`;

    // Load saved grid values
    const savedGrid = JSON.parse(localStorage.getItem("gridData")) || {};

    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");

        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;

        // Optional: allow only letters A-Z
        input.addEventListener("input", () => {
            input.value = input.value.toUpperCase().replace(/[^A-Z]/g, '');
            savedGrid[i] = input.value; // save to object
            localStorage.setItem("gridData", JSON.stringify(savedGrid)); // save to localStorage
        });

        // Restore saved value if exists
        if (savedGrid[i]) {
            input.value = savedGrid[i];
        }

        cell.appendChild(input);
        grid.appendChild(cell);
    }
}