import { alertType, displayGlobalAlert } from './AlertHelper.js';

async function signInAtApi(pb) {
  try {
    await pb
      .collection('users')
      .authWithPassword(
        process.env.VUE_APP_API_USER,
        process.env.VUE_APP_API_USER_SECRET
      );
  } catch (error) {
    console.error('[ApiHelper] -> error trieng to authenticate at api server');
    displayGlobalAlert(
      'We are currently experiencing server issues. Please try again later',
      alertType.error
    );
    return false;
  }
  return true;
}

async function returnObjectIdFromDatabase(dataCollection, objectIdentifierFieldName, objectId, pb) {
  //get full list
  let todoRecordId;
  try {
    const record = await pb
      .collection(dataCollection)
      .getFirstListItem(`${objectIdentifierFieldName}="${objectId}"`);
    todoRecordId = record.id;
  } catch (error) {
    console.log(error);
    console.error(`[ApiHelper] -> error while deletion of data object with id '${objectId}'`);
    displayGlobalAlert(
      'Something went wrong while communicating with the api server!',
      alertType.error
    );
    return false;
  }

  return todoRecordId;
}

export async function loadTodosFromApi(todoMainArray, pb) {
  console.log('[ApiHelper] -> Starting import of todos');
  //sign in
  const success = await signInAtApi(pb);
  if (!success) return;
  
  //load all todos
  const todoRecords = await pb.collection('todos').getFullList({
    sort: '-created',
  });

  console.log('[ApiHelper] -> Check for existing todos to import');
  if (todoRecords.length == 0) {
    console.log('[ApiHelper] -> Import of todos stopped! No todos to import');
    return;
  }
  console.log('[ApiHelper] -> Todos found: continuing import');

  //load all subtasks
  const subtaskRecords = await pb.collection('subtasks').getFullList({
    sort: 'created',
  });

  let newTodoMainArray = [];

  //translate to todoApp Object { created, description, isChecked, title, todoId, updated (version) }
  for (const todoObject of todoRecords) {
    let newTodoObject = { 'subtasks': [] };

    //add todos
    for (const [key, value] of Object.entries(todoObject)) {
      if (key == 'collectionId' || key == 'collectionName' || key == 'id' || key == 'version') continue;
      if (key == 'created') {
        let parts = value.split(' ');
        newTodoObject['date'] = parts[0];
        newTodoObject['time'] = parts[1].substring(0, 8);
      }
      if (key == 'description') newTodoObject['description'] = value;
      if (key == 'isChecked') newTodoObject['isChecked'] = value;
      if (key == 'title') newTodoObject['title'] = value;
      if (key == 'todoId') newTodoObject['todoElementId'] = value;
      if (key == 'updated') {
        let parts = value.split(' ');
        newTodoObject['dateAtUpdate'] = parts[0];
        newTodoObject['timeAtUpdate'] = parts[1].substring(0, 8);
      }
    }

    newTodoMainArray.push(newTodoObject);
  }

  console.log('[ApiHelper] -> Starting import of subtasks');
  //filter and push subtasks
  for (const subtask of subtaskRecords) {
    let parentTodoId;

    //extract parentTodoId
    for (const [key, value] of Object.entries(subtask)) {
      if (key === 'parentTodoId') {
        parentTodoId = value;
        break;
      }
    }

    //find index in main array
    let todoIndex = newTodoMainArray.findIndex(todo => todo.todoElementId === parentTodoId);
    //check for existing todo
    if (todoIndex !== -1) {
      //add subtask to existing todo
      if (!newTodoMainArray[todoIndex].subtasks) {
          newTodoMainArray[todoIndex].subtasks = [];
      }
      newTodoMainArray[todoIndex].subtasks.push(subtask);
    } else {
      console.log('[ApiHelper] -> Error while importing subtasks: no corresponding todo found');
    }
  }
  console.log('[ApiHelper] -> Finished import of subtasks');

  todoMainArray.value = newTodoMainArray;
  console.log('[ApiHelper] -> Finished import of existing todos');
}

export async function uploadDataObject(dataCollection, data, pb) {
  let objectId = data.todoId === undefined ? data.subtaskId : data.todoId;
  console.log(
    `[ApiHelper] -> Starting creation of data object with id '${objectId}'`
  );
  
  const success = await signInAtApi(pb);
  if (!success) return false;

  try {
    await pb.collection(dataCollection).create(data);
  } catch (error) {
    console.error(`[ApiHelper] -> error while creation of data object with id '${objectId}'`);
    displayGlobalAlert(
      'Something went wrong while uploading your todo!',
      alertType.error
    );
    return false;
  }
  console.log(
    `[ApiHelper] -> Finished creation of data object with id '${objectId}'`
  );

  // "logout" the last authenticated account
  pb.authStore.clear();
  return true;
}

export async function deleteDataObject(data, pb) {
  let objectId = data.todoId === undefined ? data.subtaskId : data.todoId;
  let dataCollection = data.todoId === undefined ? 'subtasks' : 'todos';

  console.log(
    `[ApiHelper] -> Starting deletion of data object with id '${objectId}'`
  );

  let objectIdentifierFieldName = data.todoId === undefined ? 'subtaskId' : 'todoId';

  const success = await signInAtApi(pb);
  if (!success) return false;

  //delete subtasks if dataCollection == todo
  if (dataCollection == 'todos' && data.subtasks.length !== 0) {
    let subtasks = data.subtasks;
    for (let subtask of subtasks) {
      let subtaskObjectId = await returnObjectIdFromDatabase('subtasks', 'subtaskId', subtask.subtaskId, pb);
      try {
        console.log(`[ApiHelper] -> Starting deletion of data object with id '${subtask.subtaskId}'`);
        await pb.collection('subtasks').delete(subtaskObjectId);
        console.log(`[ApiHelper] -> Finished deletion of data object with id '${subtask.subtaskId}'`);
      } catch (error) {
        console.error(`[ApiHelper] -> error while deletion of data object with id '${subtask.subtaskId}'`);
        displayGlobalAlert('Error while trieng to delete a subtask. Please reload the app!', alertType.error);
        return false;
      }
    }
  }

  const objectRecordId = await returnObjectIdFromDatabase(dataCollection, objectIdentifierFieldName, objectId, pb)
  if (objectRecordId === false) return false;

  //delete todo with backend id
  try {
    await pb.collection(dataCollection).delete(objectRecordId);
  } catch (error) {
    console.error(`[ApiHelper] -> error while deletion of data object with id '${objectId}'`);
    displayGlobalAlert('Your todo could not be deleted!', alertType.error);
    return false;
  }
  console.log(
    `[ApiHelper] -> Finished deletion of data object with id '${objectId}'`
  );

  // "logout" the last authenticated account
  pb.authStore.clear();
  return true;
}
