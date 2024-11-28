import authStore from '../../authStore.js';

export async function getAllTodos() {
  const token = authStore.state.jwtToken;
  const userId = authStore.state.userId;
  const url = `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_ENDPOINT_TODOS_GET_ALL}?userId=${userId}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    });
  } catch (error) {
    console.error(error);
  }

  return response.json();
}

export async function uploadTodo(todoObject) {
  const todoJsonObject = JSON.stringify(todoObject);
  const url = `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_ENDPOINT_TODOS_CREATE}`;
  const token = authStore.state.jwtToken;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: todoJsonObject
    });
  } catch (error) {
    console.error(error);
  }

  if (response.ok) return true;
  return false;
}

export async function updateTodo(todoObject) {
  const todoJsonObject = JSON.stringify(todoObject);
  const url = `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_ENDPOINT_TODOS_UPDATE}`;
  const token = authStore.state.jwtToken;

  let response;
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: todoJsonObject
    });
  } catch (error) {
    console.error(error);
  }

  if (response.ok) return true;
  return false;
}

export async function uploadSubtask(subtaskObject) {
  const subtaskJsonObject = JSON.stringify(subtaskObject);
  const url = `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_ENDPOINT_SUBTASKS_CREATE}`;
  const token = authStore.state.jwtToken;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: subtaskJsonObject
    });
  } catch (error) {
    console.error(error);
  }

  if (response.ok) return true;
  return false;
}

export async function deleteTodoObject(todo) {
  const todoJsonObject = JSON.stringify(todo);
  const url = `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_ENDPOINT_TODOS_DELETE}`;
  const token = authStore.state.jwtToken;

  console.log(todoJsonObject);

  let response;
  try {
    response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: todoJsonObject
    });
  } catch (error) {
    console.error(error);
  }

  if (response.ok) return true;
  return false;
}

export async function deleteSubtaskObject(subtask) {
  const subtaskJsonObject = JSON.stringify(subtask);
  const url = `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_ENDPOINT_SUBTASKS_DELETE}`;
  const token = authStore.state.jwtToken;

  let response;
  try {
    response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: subtaskJsonObject
    })
  } catch (error) {
    console.error(error);
  }

  if (response.ok) return true;
  return false;
}

export async function createNewUser(user) {
  const userJsonObject = JSON.stringify(user);
  const url = `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_ENDPOINT_USERS_CREATE}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: userJsonObject
    })
  } catch (error) {
    console.error(error);
  }

  if (response.ok) return true;
  return false;
}