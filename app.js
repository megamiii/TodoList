// Select elements from the DOM
const taskForm = document.getElementById('task-form'); // Form for task input
const taskInput = document.getElementById('task-input'); // Input field for new tasks
const taskList = document.getElementById('task-list'); // Container to display tasks
const taskCount = document.getElementById('todoCount'); // Display for task count
const filters = document.querySelectorAll('.filters button'); // Filter buttons (All, Completed, Incomplete)
const deleteAllButton = document.getElementById('deleteButton'); // Button to delete all tasks

// Retrieve saved tasks from localStorage or initialize an empty array if no tasks exist
let tasks = JSON.parse(localStorage.getItem('tasks')) || []; 

// Display tasks based on selected filter
function displayTasks(filter = 'all') {
    taskList.innerHTML = ''; // Clear the current task list before displaying

    let filteredTasks = tasks; // Default to showing all tasks
    let completedTasks = tasks.filter(task => task.completed).length; // Count completed tasks
    let incompleteTasks = tasks.length - completedTasks; // Count incomplete tasks

    // Adjust filtered tasks and task count based on selected filter
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed); // Show only completed tasks
        taskCount.textContent = `${completedTasks}/${tasks.length} completed tasks`; // Show completed/total count
    } else if (filter === 'incomplete') {
        filteredTasks = tasks.filter(task => !task.completed); // Show only incomplete tasks
        taskCount.textContent = `${incompleteTasks}/${tasks.length} incomplete tasks`; // Show incomplete/total count
    } else {
        // Handle singular/plural for "All" filter
        if (tasks.length === 1) {
            taskCount.textContent = `1 task in total`; // Singular when only one task exists
        } else {
            taskCount.textContent = `${tasks.length} tasks in total`; // Plural for multiple tasks
        }
    }

    // Create list items for each task and append them to the task list
    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : ''; // Add 'completed' class if the task is done
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleComplete(${index})"> <!-- Checkbox for marking task as completed -->
            <span contenteditable="true">${task.text}</span> <!-- Task text editable in place -->
            <button class="delete-task" onclick="deleteTask(${index})">&times;</button> <!-- Delete task button -->
        `;
        taskList.appendChild(li); // Append task to task list
    });
}

// Toggle task completion state when checkbox is clicked
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed; // Toggle the completed state
    saveTasks(); // Save the updated task list
    displayTasks(document.querySelector('.filters button.active').id || 'all');
}

// Add task when form is submitted
taskForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form submission (default behavior)
  addTask(); // Add new task
});

// Add task when Enter key is pressed in the input field
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent default Enter key behavior (form submission)
    addTask(); // Add new task
  }
});

// Logic to add a new task
function addTask() {
  const newTaskText = taskInput.value.trim(); // Get and trim the input value
  if (newTaskText === '') return; // Do nothing if input is empty

  const newTask = {
    text: newTaskText, // The task description
    completed: false, // Default to incomplete
  };
  tasks.push(newTask); // Add new task to the task array
  taskInput.value = ''; // Clear the input field
  saveTasks(); // Save tasks to localStorage
  displayTasks(document.querySelector('.filters button.active').id || 'all'); // Ensure "All" filter is used if none is active
}

// Delete a task by its index in the array
function deleteTask(index) {
  tasks.splice(index, 1); // Remove task from the array
  saveTasks(); // Save updated task list
  displayTasks(document.querySelector('.filters button.active').id || 'all'); // Ensure "All" filter is used if none is active
}

// Delete all tasks when "Delete All" button is clicked
deleteAllButton.addEventListener('click', () => {
  tasks = []; // Clear the tasks array
  saveTasks(); // Save the empty task list
  displayTasks(); // Refresh task display (empty list)
});

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks)); // Convert tasks array to JSON and store in localStorage
}

// Filter tasks when filter buttons (All, Completed, Incomplete) are clicked
filters.forEach(button => {
    button.addEventListener('click', () => {
      // Remove the 'active' class from all filter buttons
      filters.forEach(btn => btn.classList.remove('active'));
  
      // Add the 'active' class to the clicked button
      button.classList.add('active');
  
      // Display tasks based on the selected filter
      displayTasks(button.id);
    });
});

// Set the "All" filter as active by default on page load
document.getElementById('all').classList.add('active');

// Display tasks when the page is loaded
displayTasks();