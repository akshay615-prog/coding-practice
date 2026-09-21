
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Task counter elements
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

// Search and filter elements
const searchTask = document.getElementById("searchTask");
const filterPriority = document.getElementById("filterPriority");


// =================================
// TASK COUNTER
// =================================

function updateTaskCounter() {
    const allRows = taskList.querySelectorAll("tr");

    let completedCount = 0;

    allRows.forEach(function (row) {
        const checkbox = row.querySelector('input[type="checkbox"]');

        if (checkbox && checkbox.checked) {
            completedCount++;
        }
    });

    const totalCount = allRows.length;
    const pendingCount = totalCount - completedCount;

    totalTasks.textContent = totalCount;
    completedTasks.textContent = completedCount;
    pendingTasks.textContent = pendingCount;
}


// =================================
// SEARCH + PRIORITY FILTER
// =================================

function filterTasks() {
    const searchText = searchTask.value.toLowerCase().trim();
    const selectedPriority = filterPriority.value;

    const allRows = taskList.querySelectorAll("tr");

    allRows.forEach(function (row) {
        const taskName = row.cells[0].textContent.toLowerCase();
        const taskPriority = row.cells[2].textContent.toLowerCase();

        const matchesSearch = taskName.includes(searchText);

        const matchesPriority =
            selectedPriority === "all" ||
            taskPriority === selectedPriority;

        if (matchesSearch && matchesPriority) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}


// Search when typing
searchTask.addEventListener("input", filterTasks);

// Filter when priority changes
filterPriority.addEventListener("change", filterTasks);


// =================================
// ADD TASK
// =================================

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    const taskName = document.getElementById("taskName").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    // Prevent empty task names
    if (taskName === "") {
        alert("Please enter a task name.");
        return;
    }

    // Create a new table row
    const newRow = document.createElement("tr");

    // Task name cell
    const taskCell = document.createElement("td");
    taskCell.textContent = taskName;

    // Due date cell
    const dateCell = document.createElement("td");
    dateCell.textContent = dueDate;

    // Priority cell
    const priorityCell = document.createElement("td");

    const priorityBadge = document.createElement("span");
    priorityBadge.textContent = priority;
    priorityBadge.classList.add("priority-badge", `priority-${priority}`);

priorityCell.appendChild(priorityBadge);

    // Completed cell
    const completedCell = document.createElement("td");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    completedCell.appendChild(checkbox);

    // Update counter when checkbox changes
    checkbox.addEventListener("change", function () {
    newRow.classList.toggle("completed-task", checkbox.checked);

    updateTaskCounter();
});

    // Actions cell
    const actionCell = document.createElement("td");

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    // Delete task
    deleteButton.addEventListener("click", function () {
        newRow.remove();

        updateTaskCounter();
        filterTasks();
    });

    actionCell.appendChild(deleteButton);

    // Add all cells to the row
    newRow.appendChild(taskCell);
    newRow.appendChild(dateCell);
    newRow.appendChild(priorityCell);
    newRow.appendChild(completedCell);
    newRow.appendChild(actionCell);

    // Add row to the table
    taskList.appendChild(newRow);

    // Reset form
    taskForm.reset();

    // Update counter
    updateTaskCounter();

    // Apply current search and priority filter
    filterTasks();
});