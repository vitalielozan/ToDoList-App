const btnAddTask = document.querySelector('#btnAdd');
const taskInput = document.querySelector('#taskInput');
const taskInputDate = document.querySelector('#inputDate');
const taskList = document.querySelector('#taskList');
const container = document.querySelector('#container');

window.addEventListener('load', loadData);
async function loadData() {
  try {
    const res = await fetch('http://localhost:4000/tasks');
    const result = await res.json();
    console.log(result);
    taskList.innerHTML = '';
    result.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<input type='checkbox' id='task-${item.id}' name='task-${item.id}' value='task-${item.id}'>
                            <label for='task-${item.id}'>${item.task} - ${item.data}</label>
                            <i class="bi bi-trash3-fill"></i>`;
      taskList.appendChild(listItem);
      listItem.setAttribute('class', 'my-3 bg-success text-white');
      listItem.setAttribute('id', `${item.id}`);

      const checkbox = listItem.querySelector('input[type="checkbox"]');
      checkbox.checked = item.isComplete;
      const label = listItem.querySelector('label');
      if (item.isComplete) {
        label.classList.add('comleted');
      }
      checkbox.addEventListener('change', async () => {
        const newStatus = checkbox.checked;
        await fetch(`http://localhost:4000/tasks/${item.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isComplete: newStatus }),
        });
        if (newStatus) {
          label.classList.add('completed');
        } else {
          label.classList.remove('completed');
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
    alert('Va rog adaugati o sarcina si o data!');
    return;
  }

  const newTask = await addDataToJson(taskText, taskDate);
  if (!newTask || !newTask.id) {
    console.error('Task-ul nu a fost salvat în server.');
    return;
  }

  let li = document.createElement('li');
  li.innerHTML = `<input type='checkbox' id='task-${newTask.id}' name='task-${newTask.id}' value='task-${newTask.id}'>
                    <label for='task-${newTask.id}'>${taskText} - ${taskDate}</label>`;
  li.setAttribute('class', 'my-3 bg-success text-white');
  li.setAttribute('id', newTask.id);

  const checkbox = li.querySelector('input[type="checkbox"]');
  let label = li.querySelector('label');
  checkbox.checked = false;
  checkbox.addEventListener('change', async () => {
    const newStatus = checkbox.checked;
    await fetch(`http://localhost:4000/tasks/${newTask.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isComplete: newStatus }),
    });
    if (newStatus) {
      label.classList.add('completed');
    } else {
      label.classList.remove('completed');
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
      isComlete: false,
    };
    const response = await fetch('http://localhost:4000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    const newTask = await response.json();
    alert('Date salvate');
    return newTask;
  } catch (error) {
    console.error('Error', error);
  }
}

async function deleteTasks(taskId) {
  try {
    await fetch(`http://localhost:4000/tasks/${taskId}`, { method: 'DELETE' });
    alert(`Task ${taskId} deleted from server`);
  } catch (error) {
    console.error('Error deleting task from server', error);
  }
}
