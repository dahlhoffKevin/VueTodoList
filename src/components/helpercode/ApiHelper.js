import { alertType, displayGlobalAlert } from './AlertHelper.js';
import { formatDate, isTokenExpired } from './CommonMethods.js';
import { getAllTodos, uploadTodo, uploadSubtask, deleteTodoObject, deleteSubtaskObject } from './DaTodoBackend.js';
import store from '../../store.js';

async function signInAtApi() {
  var username = process.env.VUE_APP_API_USER;
  var password = process.env.VUE_APP_API_USER_SECRET;
  var loginResponse;

  console.log('[ApiHelper] -> Trying login at API...');
  var token = store.state.jwtToken;
  if (token == null) {
    console.log('[ApiHelper] -> User not logged in. Logging in...');
    loginResponse = await dispatchLogin(username, password);
    if (!loginResponse) {
      displayGlobalAlert(
        'Something went wrong while communicating with the api server!',
        alertType.error
      );
    }

    return true;
  }

  console.log('[ApiHelper] -> Token is present. Validating if token expired...');
  if (isTokenExpired(token)) {
    console.log('[ApiHelper] -> Token is expired. Requesting new token...');
    store.dispatch('clearToken');
    loginResponse = await dispatchLogin(username, password);
    if (!loginResponse) {
      displayGlobalAlert(
        'Something went wrong while communicating with the api server!',
        alertType.error
      );
    }
  }

  console.log('[ApiHelper] -> User logged in and token is valid. Continuing...');
  return true;
}

async function dispatchLogin(username, password) {
  try {
    await store.dispatch('login', {
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

// async function returnObjectIdFromDatabase(dataCollection, objectIdentifierFieldName, objectId, pb) {
//   //get full list
//   let todoRecordId;
//   try {
//     const record = await pb
//       .collection(dataCollection)
//       .getFirstListItem(`${objectIdentifierFieldName}="${objectId}"`);
//     todoRecordId = record.id;
//   } catch (error) {
//     console.log(error);
//     console.error(`[ApiHelper] -> error while deletion of data object with id '${objectId}'`);
//     displayGlobalAlert(
//       'Something went wrong while communicating with the api server!',
//       alertType.error
//     );
//     return false;
//   }

//   return todoRecordId;
// }

export async function loadTodosFromApi(todoMainArray) {
  console.log('[ApiHelper] -> Starting import of todos');

  // Sign in
  const success = await signInAtApi();
  if (!success) return false;

  let todoRecords;
  try {
    todoRecords = await getAllTodos();
  } catch (error) {
    console.error('[ApiHelper] -> Error while loading todos');
    console.error(error);
    return false; // Falls ein Fehler auftritt, beenden
  }

  if (!todoRecords.length) {
    console.log('[ApiHelper] -> Import stopped! No todos to import');
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

export async function uploadTodoObject(dataCollection, dataObject, pb) {
  dataCollection;
  pb;

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
  let objectType = data.todoId === undefined ? 'SUBTASK' : 'TODO';
  let objectId = data.todoId === undefined ? data.subtaskId : data.todoId;
  let objectIdKey = data.todoId === undefined ? 'subtaskId' : 'todoId';

  // delete id key (todoId/subtaskId) and replace it with key (id)
  if (objectIdKey == 'todoId') delete data.todoId;
  if (objectIdKey == 'subtaskId') delete data.subtaskId;

  data.id = objectId;

  console.log(
    `[ApiHelper] -> Starting deletion of data object with id '${objectId}'`
  );

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
    console.error(error);
    displayGlobalAlert(
      'Something went wrong while deleting your todo!',
      alertType.error
    );
    return false;
  }
  return deletionResponse;
}

async function deleteSubtaskDataObject(subtask) {
  var deletionResponse;
  try {
    deletionResponse = await deleteSubtaskObject(subtask);
  } catch (error) {
    console.error(error);
    displayGlobalAlert(
      'Something went wrong while deleting your subtask!',
      alertType.error
    );
    return false;
  }
  return deletionResponse;
}