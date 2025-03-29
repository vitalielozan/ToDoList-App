const btnAddTask = document.querySelector('#btnAdd');
const taskInput = document.querySelector('#taskInput');
const taskInputDate = document.querySelector('#inputDate');
const taskList = document.querySelector('#taskList');
const container = document.querySelector('#container');
const btnLoad = document.querySelector('#btnLoad');

btnLoad.addEventListener('click', loadData);
async function loadData() {
  try {
    const res = await fetch('http://localhost:4000/tasks');
    const result = await res.json();
    console.log(result);
    taskList.innerHTML = '';
    result.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `${item.task} - ${item.data}<i class="bi bi-trash3-fill"></i>`;
      taskList.appendChild(listItem);
      listItem.setAttribute('class', 'my-3 bg-success text-white');
      listItem.setAttribute('id', `${item.id}`);

      const deleteButton = listItem.querySelector('i');
      deleteButton.addEventListener('click', async () => {
        await deleteTasks(item.id);
        taskList.removeChild(listItem);
      });

      listItem.addEventListener('click', () => {
        listItem.classList.toggle('completed');
      });
    });
  } catch (error) {
    console.log('Error', error);
  }
}

btnAddTask.addEventListener('click', addTasks);

async function addTasks() {
  let taskText = taskInput.value.trim();
  let taskDate = taskInputDate.value;

  if (taskText === '' || taskDate === '') {
    alert('Va rog adaugati o sarcina si o data!');
    return;
  }

  let li = document.createElement('li');
  taskList.appendChild(li);
  li.textContent = `${taskText} - ${taskDate}`;
  li.setAttribute('class', 'my-3 bg-success text-white');
  li.addEventListener('click', () => {
    li.classList.toggle('completed');
  });

  let deleteButton = document.createElement('i');
  li.appendChild(deleteButton);
  deleteButton.setAttribute('class', 'bi bi-trash3-fill');
  deleteButton.addEventListener('click', () => {
    taskList.removeChild(li);
  });

  taskInput.value = '';
  taskInputDate.value = '';

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ task: taskText, date: taskDate });
  localStorage.setItem('tasks', JSON.stringify(tasks));

  await addDataToJson(taskText, taskDate);
}

async function addDataToJson(task, taskDate) {
  try {
    const taskData = {
      task: task,
      data: taskDate,
    };
    const response = await fetch('http://localhost:4000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    await response.json();
    alert('Date salvate');
  } catch (error) {
    console.error('Error', error);
  }
}

async function deleteTasks(taskId) {
  try {
    await fetch(`http://localhost:4000/tasks/${taskId}`, { method: 'DELETE' });
    taskList.innerHTML = '';
    localStorage.removeItem('tasks');
    console.log(`Task ${taskId} deleted from server`);
  } catch (error) {
    console.error('Error deleting task from server', error);
  }
}
