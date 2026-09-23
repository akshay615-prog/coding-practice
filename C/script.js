
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Task counter elements
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

// Search and filter elements
const searchTask = document.getElementById("searchTask");
const filterPriority = document.getElementById("filterPriority");

// Local Storage Key
const STORAGE_KEY = "smartTodoTasks";

// Store tasks
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];


// =================================
// SAVE TASKS TO LOCAL STORAGE
// =================================

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


// =================================
// TASK COUNTER
// =================================

function updateTaskCounter() {
    const totalCount = tasks.length;

    const completedCount = tasks.filter(function (task) {
        return task.completed;
    }).length;

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


// =================================
// RENDER ALL TASKS
// =================================

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {

        // Create table row
        const newRow = document.createElement("tr");

        if (task.completed) {
            newRow.classList.add("completed-task");
        }

        // Task name cell
        const taskCell = document.createElement("td");
        taskCell.textContent = task.name;

        // Due date cell
        const dateCell = document.createElement("td");
        dateCell.textContent = task.dueDate;

        // Priority cell
        const priorityCell = document.createElement("td");

        const priorityBadge = document.createElement("span");
        priorityBadge.textContent = task.priority;

        priorityBadge.classList.add(
            "priority-badge",
            `priority-${task.priority}`
        );

        priorityCell.appendChild(priorityBadge);

        // Completed cell
        const completedCell = document.createElement("td");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;

            newRow.classList.toggle(
                "completed-task",
                checkbox.checked
            );

            saveTasks();
            updateTaskCounter();
        });

        completedCell.appendChild(checkbox);

        // Actions cell
        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {

            tasks = tasks.filter(function (currentTask) {
                return currentTask.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        actionCell.appendChild(deleteButton);

        // Add cells to row
        newRow.appendChild(taskCell);
        newRow.appendChild(dateCell);
        newRow.appendChild(priorityCell);
        newRow.appendChild(completedCell);
        newRow.appendChild(actionCell);

        // Add row to table
        taskList.appendChild(newRow);
    });

    updateTaskCounter();
    filterTasks();
}


// =================================
// ADD NEW TASK
// =================================

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    const taskName = document
        .getElementById("taskName")
        .value
        .trim();

    const dueDate = document.getElementById("dueDate").value;

    const priority = document.getElementById("priority").value;

    // Prevent empty task names
    if (taskName === "") {
        alert("Please enter a task name.");
        return;
    }

    // Create task object
    const newTask = {
        id: Date.now(),
        name: taskName,
        dueDate: dueDate,
        priority: priority,
        completed: false
    };

    // Add task to array
    tasks.push(newTask);

    // Save tasks
    saveTasks();

    // Display updated tasks
    renderTasks();

    // Reset form
    taskForm.reset();
});


// =================================
// SEARCH EVENTS
// =================================

searchTask.addEventListener("input", filterTasks);

filterPriority.addEventListener("change", filterTasks);


// =================================
// LOAD TASKS WHEN PAGE OPENS
// =================================

renderTasks();