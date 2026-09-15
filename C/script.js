const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get values from the form
    const taskName = document.getElementById("taskName").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    // Create a new table row
    const newRow = document.createElement("tr");

    // Create task name cell
    const taskCell = document.createElement("td");
    taskCell.textContent = taskName;

    // Create due date cell
    const dateCell = document.createElement("td");
    dateCell.textContent = dueDate;

    // Create priority cell
    const priorityCell = document.createElement("td");
    priorityCell.textContent = priority;

    // Create completed checkbox cell
    const completedCell = document.createElement("td");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    completedCell.appendChild(checkbox);

    // Create action cell
    const actionCell = document.createElement("td");

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    // Delete task when button is clicked
    deleteButton.addEventListener("click", function () {
        newRow.remove();
    });

    // Add delete button to action cell
    actionCell.appendChild(deleteButton);

    // Add all cells to the row
    newRow.appendChild(taskCell);
    newRow.appendChild(dateCell);
    newRow.appendChild(priorityCell);
    newRow.appendChild(completedCell);
    newRow.appendChild(actionCell);

    // Add the row to the table
    taskList.appendChild(newRow);

    // Clear the form
    taskForm.reset();
});