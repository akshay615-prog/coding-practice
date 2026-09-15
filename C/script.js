const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Task counter elements
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

// Function to update the task counter
function updateTaskCounter() {
    const allRows = taskList.querySelectorAll("tr");

    let completedCount = 0;

    allRows.forEach(function (row) {
        const checkbox = row.querySelector("input[type='checkbox']");

        if (checkbox.checked) {
            completedCount++;
        }
    });

    const totalCount = allRows.length;
    const pendingCount = totalCount - completedCount;

    totalTasks.textContent = totalCount;
    completedTasks.textContent = completedCount;
    pendingTasks.textContent = pendingCount;
}

// Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get values from the form
    const taskName = document.getElementById("taskName").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

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
    priorityCell.textContent = priority;

    // Completed checkbox cell
    const completedCell = document.createElement("td");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Update counter when checkbox changes
    checkbox.addEventListener("change", function () {
        updateTaskCounter();
    });

    completedCell.appendChild(checkbox);

    // Action cell
    const actionCell = document.createElement("td");

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    // Delete task when clicked
    deleteButton.addEventListener("click", function () {
        newRow.remove();
        updateTaskCounter();
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

    // Update counter after adding task
    updateTaskCounter();

    // Clear the form
    taskForm.reset();
});