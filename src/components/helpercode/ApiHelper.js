import { alertType, displayGlobalAlert } from './AlertHelper.js';
import { formatDate, isTokenExpired, transformToApiObject } from './CommonMethods.js';
import { getAllTodos, uploadTodo, uploadSubtask, deleteTodoObject, deleteSubtaskObject, updateTodo } from './DaTodoBackend.js';
import authStore from '../../authStore.js';

async function signInAtApi() {
  console.log('[ApiHelper] -> Trying login at API...');

  var username = authStore.state.userUsername;
  var password = authStore.state.userPassword;

  if (username === null || password === null) {
    console.log('[ApiHelper] -> User not logged in');
    return false;
  }

  var loginResponse;
  var token = authStore.state.jwtToken;
  if (token == null) {
    console.log('[ApiHelper] -> User not logged in. Logging in...');
    loginResponse = await dispatchLogin(username, password);
    if (!loginResponse) {
      displayGlobalAlert(
        'Something went wrong while communicating with the api server!',
        alertType.error
      );
    }

    console.log(`[ApiHelper] -> User logged in [${authStore.state.userId}]`);
    return true;
  }

  console.log('[ApiHelper] -> Token is present. Validating if token is expired...');
  if (isTokenExpired(token)) {
    console.log('[ApiHelper] -> Token is expired. Requesting new token...');
    authStore.dispatch('clearStore');
    loginResponse = await dispatchLogin(username, password);
    if (!loginResponse) {
      displayGlobalAlert(
        'Something went wrong while communicating with the api server!',
        alertType.error
      );
    }
  }

  console.log(`[ApiHelper] -> User logged in [${authStore.state.userId}] and token is valid. Continuing...`);
  return true;
}

export async function dispatchLogin(username, password) {
  try {
    await authStore.dispatch('login', {
        username: username,
        password: password,
      }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function loadTodosFromApi(todoMainArray) {
  console.log('[ApiHelper] -> Starting import of todos');

  // Sign in
  const success = await signInAtApi();
  if (!success) return false;

  let todoRecords;
  try {
    todoRecords = await getAllTodos();
    console.log(todoRecords);
  } catch (error) {
    console.error('[ApiHelper] -> Error while loading todos');
    console.error(error);
    return false; // Falls ein Fehler auftritt, beenden
  }

  if (!todoRecords.length) {
    console.log('[ApiHelper] -> Import stopped! No todos to import found!');
    return true;
  }

  console.log('[ApiHelper] -> Todos found: continuing import');
  const newTodoMainArray = todoRecords.map(mapTodoObject);  // Verwende `map` für Effizienz

  // Update das Array
  todoMainArray.value = newTodoMainArray;
  console.log('[ApiHelper] -> Finished import of existing todos');
  return true;
}

// Hilfsfunktion zur Verarbeitung eines einzelnen Todo-Objekts
function mapTodoObject(todoObject) {
  const {
    created, description, isChecked, title, id, updated, todoIndex, subtasks
  } = todoObject;

  let newTodoObject = {
    date: formatDatePart(created, 0),
    time: formatDatePart(created, 1),
    description,
    isChecked: isChecked === 1 ? true : false,
    title,
    todoElementId: id,
    dateAtUpdate: formatDatePart(updated, 0),
    timeAtUpdate: formatDatePart(updated, 1),
    index: todoIndex,
    subtasks: subtasks ? subtasks.map(mapSubtaskObject) : [] // Verwende `map` für Subtasks
  };

  return newTodoObject;
}

// Hilfsfunktion zur Verarbeitung eines Subtask-Objekts
function mapSubtaskObject(subtaskObject) {
  const { id, parentTodoId, title, isChecked } = subtaskObject;

  return {
    subtaskId: id,
    parentTodoId,
    title,
    isChecked: isChecked === 1 ? true : false
  };
}

// Hilfsfunktion zum Formatieren von Datums- und Zeitteilen
function formatDatePart(dateString, partIndex) {
  if (!dateString) return '';

  const parts = dateString.split('T');

  // Prüfen, ob das erwartete Format vorliegt (Datum und Uhrzeit)
  if (parts.length < 2) {
    if (partIndex === 0) {
      console.log(parts[0])
      var formatted = formatDate(parts[0])
      console.log(formatted)
      return formatted; // Falls nur das Datum vorliegt
    }
    return ''; // Wenn kein Uhrzeitteil vorhanden ist
  }

  // Ignoriere die Mikrosekunden (nach dem Punkt)
  const timePart = parts[1].split('.')[0]; // Nimmt nur den Teil bis zu den Sekunden

  // Falls beide Teile vorhanden sind, Datum oder Zeit zurückgeben
  return partIndex === 0 ? formatDate(parts[0]) : timePart;
}

export async function uploadTodoObject(dataObject) {
  const todoObjectId = dataObject.id;
  console.log(
    `[ApiHelper] -> Starting upload of todo object with id '${todoObjectId}'`
  );

  // Sign in
  const success = await signInAtApi();
  if (!success) return false;

  let successUpload;

  try {
    successUpload = await uploadTodo(dataObject);
  } catch (error) {
    console.error(`[ApiHelper] -> error while creation of data object with id '${todoObjectId}'`);
    displayGlobalAlert(
      'Something went wrong while uploading your todo!',
      alertType.error
    );
    return false;
  }

  if (!successUpload) {
    console.log(
      `[ApiHelper] -> Creation of data object with id '${todoObjectId}' failed`
    );
    return false;
  }

  console.log(
    `[ApiHelper] -> Finished creation of data object with id '${todoObjectId}'`
  );

  return true;
}

export async function updateTodoObject(dataObject) {
  console.log(dataObject);
  const todoObjectId = dataObject.todoElementId;
  console.log(
    `[ApiHelper] -> Starting upload of todo object with id '${todoObjectId}'`
  );

  // Sign in
  const success = await signInAtApi();
  if (!success) return false;

  let successUpdate;

  try {
    let translatedTodoObject = transformToApiObject(dataObject);
    console.log(dataObject);
    successUpdate = await updateTodo(translatedTodoObject);
  } catch (error) {
    console.error(`[ApiHelper] -> error while creation of data object with id '${todoObjectId}' :: ${error}`);
    displayGlobalAlert(
      'Something went wrong while uploading your todo!',
      alertType.error
    );
    return false;
  }

  if (!successUpdate) {
    console.log(
      `[ApiHelper] -> Creation of data object with id '${todoObjectId}' failed`
    );
    return false;
  }

  console.log(
    `[ApiHelper] -> Finished creation of data object with id '${todoObjectId}'`
  );

  return true;
}
 
export async function uploadSubtaskObject(newSubtask) {
  const subtaskDataObject = {
    id: newSubtask.subtaskId,
    todo: { id: newSubtask.parentTodoId },
    title: newSubtask.title,
    isChecked: newSubtask.isChecked === true ? 1 : 0
  };
  
  const subtaskId = subtaskDataObject.id;
  console.log(
    `[ApiHelper] -> Starting upload of todo object with id '${subtaskId}'`
  );

  // Sign in
  const success = await signInAtApi();
  if (!success) return false;

  let successUpload;

  try {
    successUpload = await uploadSubtask(subtaskDataObject);
  } catch (error) {
    console.error(`[ApiHelper] -> error while creation of data object with id '${subtaskId}'`);
    displayGlobalAlert(
      'Something went wrong while uploading your todo!',
      alertType.error
    );
    return false;
  }

  if (!successUpload) {
    console.error(
      `[ApiHelper] -> Creation of data object with id '${subtaskId}' failed`
    );
    return false;
  }

  console.log(
    `[ApiHelper] -> Finished creation of data object with id '${subtaskId}'`
  );

  return true;
}

export async function deleteDataObject(data) {
  let objectType = data.todoElementId === undefined ? 'SUBTASK' : 'TODO';
  let objectId = data.todoElementId === undefined ? data.subtaskId : data.todoElementId;

  console.log(
    `[ApiHelper] -> Starting deletion of data object with id '${objectId}'`
  );

  try {
    console.log(data);
    // translate data object to usable api data object
    data = transformToApiObject(data);
    console.log(data);
  } catch (error) {
    console.error(`[ApiHelper] -> Error try deleting data object with id '${objectId}' :: ${error}`);
    displayGlobalAlert(
      'Something went wrong while deleting your todo!',
      alertType.error
    );
  }

  const success = await signInAtApi();
  if (!success) return false;

  let deletionresponse = false;

  if (objectType == 'TODO') {
    let response = await deleteTodoDataObject(data);
    deletionresponse = response;
  }
  if (objectType == 'SUBTASK'){
    let response = await deleteSubtaskDataObject(data);
    deletionresponse = response;
  }

  console.log(
    `[ApiHelper] -> Finished deletion of data object with id '${objectId}'`
  );

  return deletionresponse;
}

async function deleteTodoDataObject(todo) {
  var deletionResponse;
  try {
    deletionResponse = await deleteTodoObject(todo);
  } catch (error) {
    console.error(`[ApiHelper] -> Error try deleting data object :: ${error}`);
    displayGlobalAlert(
      'Something went wrong while deleting your todo!',
      alertType.error
    );
  }
  return deletionResponse;
}

async function deleteSubtaskDataObject(subtask) {
  var deletionResponse;
  try {
    console.log(subtask);
    deletionResponse = await deleteSubtaskObject(subtask);
  } catch (error) {
    console.error(`[ApiHelper] -> Error try deleting data object :: ${error}`);
    displayGlobalAlert(
      'Something went wrong while deleting your subtask!',
      alertType.error
    );
  }
  return deletionResponse;
}