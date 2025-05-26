const btnAddTask = document.querySelector('#btnAdd');
const taskInput = document.querySelector('#taskInput');
const taskInputDate = document.querySelector('#inputDate');
const taskList = document.querySelector('#taskList');

window.addEventListener('load', loadData);
async function loadData() {
  try {
    const res = await fetch('http://localhost:3001/tasks');
    const result = await res.json();
    taskList.innerHTML = '';
    result.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<input type='checkbox' id='task-${item.id}' name='task-${item.id}' value='task-${item.id}'>
                            <label for='task-${item.id}'><span class="task-text">${item.task} - ${item.data}</span></label>
                            <i class="bi bi-trash3-fill"></i>`;
      taskList.appendChild(listItem);
      listItem.setAttribute('class', 'my-3 bg-success text-white');
      listItem.setAttribute('id', `${item.id}`);

      const checkbox = listItem.querySelector('input[type="checkbox"]');
      let textSpan = listItem.querySelector('.task-text');
      checkbox.checked = item.isComplete || false;
      if (checkbox.checked) {
        textSpan.classList.add('completed');
      }
      checkbox.addEventListener('change', async () => {
        const newStatus = checkbox.checked;
        await fetch(`http://localhost:3001/tasks/${item.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isComplete: newStatus }),
        });
        if (newStatus) {
          textSpan.classList.add('completed');
        } else {
          textSpan.classList.remove('completed');
        }
      });
      const deleteButton = listItem.querySelector('i');
      deleteButton.addEventListener('click', async () => {
        await deleteTasks(item.id);
        if (listItem && taskList.contains(listItem)) {
          taskList.removeChild(listItem);
        }
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
    alert('Please add a task and a date!');
    return;
  }

  const newTask = await addDataToJson(taskText, taskDate);
  if (!newTask || !newTask.id) {
    console.error('The task was not saved to the server.');
    return;
  }

  let li = document.createElement('li');
  li.innerHTML = `<input type='checkbox' id='task-${newTask.id}' name='task-${newTask.id}' value='task-${newTask.id}'>
                    <label for='task-${newTask.id}'><span class="task-text">${taskText} - ${taskDate}</span></label>`;
  li.setAttribute('class', 'my-3 bg-success text-white');
  li.setAttribute('id', newTask.id);

  const checkbox = li.querySelector('input[type="checkbox"]');
  let textSpan = li.querySelector('.task-text');
  checkbox.checked = newTask.isComplete || false;

  if (checkbox.checked) {
    textSpan.classList.add('completed');
  }

  checkbox.addEventListener('change', async () => {
    const newStatus = checkbox.checked;
    await fetch(`http://localhost:3001/tasks/${newTask.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isComplete: newStatus }),
    });
    if (newStatus) {
      textSpan.classList.add('completed');
    } else {
      textSpan.classList.remove('completed');
    }
  });

  let deleteButton = document.createElement('i');
  li.appendChild(deleteButton);
  deleteButton.setAttribute('class', 'bi bi-trash3-fill');
  deleteButton.addEventListener('click', async () => {
    await deleteTasks(newTask.id);
    if (li && taskList.contains(li)) {
      taskList.removeChild(li);
    }
  });

  taskList.appendChild(li);
  taskInput.value = '';
  taskInputDate.value = '';
}

async function addDataToJson(task, taskDate) {
  try {
    const taskData = {
      task: task,
      data: taskDate,
      isComplete: false,
    };
    const response = await fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    const newTask = await response.json();
    alert('Data is saved!');
    return newTask;
  } catch (error) {
    console.error('Error', error);
  }
}

async function deleteTasks(taskId) {
  try {
    await fetch(`http://localhost:3001/tasks/${taskId}`, { method: 'DELETE' });
    alert(`Task ${taskId} deleted from server`);
  } catch (error) {
    console.error('Error deleting task from server', error);
  }
}
