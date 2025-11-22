// ----------------------------
// Load saved settings on startup
// ----------------------------
window.onload = function () {
    const savedRows = localStorage.getItem("rows") || 25;
    const savedCols = localStorage.getItem("cols") || 25;
    const savedWidth = localStorage.getItem("cellWidth") || 25;
    const savedHeight = localStorage.getItem("cellHeight") || 25;

    const savedMode = localStorage.getItem("themeMode");
    const savedTodos = JSON.parse(localStorage.getItem("todoList")) || [];

    // Restore grid and witdh height of cell
    document.getElementById("rowsInput").value = savedRows;
    document.getElementById("colsInput").value = savedCols;
    document.getElementById("widthInput").value = savedWidth;
    document.getElementById("heightInput").value = savedHeight;

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
        createGrid(savedRows, savedCols, savedWidth, savedHeight); // default
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
// Save width height of cell
// ----------------------------
document.getElementById("resizeCell").addEventListener("click", () => {
    const rows = document.getElementById("rowsInput").value;
    const cols = document.getElementById("colsInput").value;

    const width = document.getElementById("widthInput").value;
    const height = document.getElementById("heightInput").value;

    // Save width and height if you want persistence
    localStorage.setItem("cellWidth", width);
    localStorage.setItem("cellHeight", height);

    createGrid(rows, cols, width, height);
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
function createGrid(rows, cols, cellWidth = 25, cellHeight = 25) {
    const grid = document.getElementById("grid-container");
    grid.innerHTML = "";
    
    grid.style.display = "grid";
    grid.style.gridTemplateRows = `repeat(${rows}, ${cellHeight}px)`;
    grid.style.gridTemplateColumns = `repeat(${cols}, ${cellWidth}px)`;
    
    // Load saved grid values
    const savedGrid = JSON.parse(localStorage.getItem("gridData")) || {};
    
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.style.width = `${cellWidth}px`;
        input.style.height = `${cellHeight}px`;
        
        // Only letters A-Z
        input.addEventListener("input", () => {
            input.value = input.value.toUpperCase().replace(/[^A-Z]/g, '');
            savedGrid[i] = input.value;
            localStorage.setItem("gridData", JSON.stringify(savedGrid));
        });
        
        // Restore saved value if exists
        if (savedGrid[i]) {
            input.value = savedGrid[i];
        }
        
        cell.appendChild(input);
        grid.appendChild(cell);
    }
}

// ----------------------------
// Auto Generate
// ----------------------------
document.getElementById("autoGenerate").addEventListener("click", () => {
    const gridCells = document.querySelectorAll(".grid-cell input");

    // Load existing saved grid
    const savedGrid = JSON.parse(localStorage.getItem("gridData")) || {};

    gridCells.forEach((cellInput, index) => {
        // Generate random uppercase letter A-Z
        const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));

        // Set value
        cellInput.value = randomLetter;

        // Save to grid object
        savedGrid[index] = randomLetter;
    });

    // Save updated grid to localStorage
    localStorage.setItem("gridData", JSON.stringify(savedGrid));
});

// ----------------------------
// Clear Generate
// ----------------------------
document.getElementById("clearGenerate").addEventListener("click", () => {
    const gridCells = document.querySelectorAll(".grid-cell input");

    // Load saved grid
    const savedGrid = JSON.parse(localStorage.getItem("gridData")) || {};

    gridCells.forEach((cellInput, index) => {
        cellInput.value = "";      // Clear the input
        savedGrid[index] = "";     // Clear from saved grid
    });

    // Save the cleared grid to localStorage
    localStorage.setItem("gridData", JSON.stringify(savedGrid));
});

// ----------------------------
// Toggle the settings panel on mobile/tablet
// ----------------------------
function toggleSettings() {
    const settingsPanel = document.querySelector('.custom');
    settingsPanel.classList.toggle('show');
}

// ----------------------------
// Select Mode
// ----------------------------
let selectMode = false;

const selectBtn = document.getElementById("select");
const gridContainer = document.getElementById("grid-container");

// Toggle Select Mode
selectBtn.addEventListener("click", () => {
    selectMode = !selectMode;

    if (selectMode) {
        selectBtn.textContent = "Select Mode: ON";
        // Disable typing in inputs
        document.querySelectorAll(".grid-cell input").forEach(input => {
            input.readOnly = true;
            input.style.cursor = "pointer";
        });
    } else {
        selectBtn.textContent = "Select Mode: OFF";
        gridContainer.style.cursor = "default";
        // Enable typing in inputs
        document.querySelectorAll(".grid-cell input").forEach(input => {
            input.readOnly = false;
            input.style.cursor = "default";
        });
    }
});

// Click on cells to toggle purple color in Select Mode
gridContainer.addEventListener("click", (e) => {
    if (!selectMode) return; // Only active in Select Mode
    if (e.target.tagName.toLowerCase() === "input") {
        const input = e.target;
        // Toggle purple background
        if (input.style.backgroundColor === "crimson") {
            input.style.backgroundColor = "";
        } else {
            input.style.backgroundColor = "crimson";
        }
    }
});

// ----------------------------
// Clear Select Mode
// ----------------------------
document.getElementById("clearSelect").addEventListener("click", () => {
    const gridInputs = document.querySelectorAll(".grid-cell input");

    gridInputs.forEach(input => {
        input.style.backgroundColor = ""; // Remove purple background
    });

    // Optionally, also exit Select Mode
    selectMode = false;
    const selectBtn = document.getElementById("select");
    selectBtn.textContent = "Select Mode: OFF";
    document.getElementById("grid-container").style.cursor = "default";

    // Enable typing again
    gridInputs.forEach(input => {
        input.readOnly = false;
    });
});