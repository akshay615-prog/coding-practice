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

// Load tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


// ===============================
// GET TODAY'S DATE
// ===============================

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// =================================
// GET TASK STATUS
// =================================

function getTaskStatus(task) {

    // Completed checkbox has priority
    if (task.completed) {
        return "Completed";
    }

    // No due date
    if (!task.dueDate) {
        return "Pending";
    }

    const today = getTodayDate();

    // Due date has passed
    if (task.dueDate < today) {
        return "Overdue";
    }

    return "Pending";
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
    const selectedPriority = filterPriority.value.toLowerCase();

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

        // =================================
        // TASK NAME CELL
        // =================================

        const taskCell = document.createElement("td");
        taskCell.textContent = task.name;


        // =================================
        // DUE DATE CELL
        // =================================

        const dateCell = document.createElement("td");
        dateCell.textContent = task.dueDate || "No date";


        // =================================
        // PRIORITY CELL
        // =================================

        const priorityCell = document.createElement("td");

        const priorityBadge = document.createElement("span");

        priorityBadge.textContent = task.priority;

        priorityBadge.classList.add(
            "priority-badge",
            `priority-${task.priority}`
        );

        priorityCell.appendChild(priorityBadge);


        // =================================
        // STATUS CELL
        // =================================

        const statusCell = document.createElement("td");

        const statusBadge = document.createElement("span");

        const status = getTaskStatus(task);

        statusBadge.textContent = status;

        statusBadge.classList.add("status-badge");

        if (status === "Completed") {

            statusBadge.classList.add("status-completed");

        } else if (status === "Overdue") {

            statusBadge.classList.add("status-overdue");

        } else {

            statusBadge.classList.add("status-pending");

        }

        statusCell.appendChild(statusBadge);


        // =================================
        // COMPLETED CELL
        // =================================

        const completedCell = document.createElement("td");

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {

            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();

        });

        completedCell.appendChild(checkbox);


        // =================================
        // ACTIONS CELL
        // =================================

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


        // =================================
        // ADD CELLS TO ROW
        // =================================

        newRow.appendChild(taskCell);
        newRow.appendChild(dateCell);
        newRow.appendChild(priorityCell);
        newRow.appendChild(statusCell);
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

    const dueDate = document
        .getElementById("dueDate")
        .value;

    const priority = document
        .getElementById("priority")
        .value
        .toLowerCase();


    // Prevent empty task names
    if (taskName === "") {

        alert("Please enter a task name.");

        return;

    }


    // Create new task object
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


    // Render updated tasks
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
