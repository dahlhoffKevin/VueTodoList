import { alertType, displayGlobalAlert } from './AlertHelper.js';

export async function uploadDataObject(dataCollection, data, pb) {
  let objectId = data.todoId === undefined ? data.subtaskId : data.todoId;
  console.log(
    `[ApiHelper] -> Starting creation of data object with id '${objectId}'`
  );
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
  return true;
}

export async function deleteDataObject(dataCollection, data, pb) {
  let objectId = data.todoId === undefined ? data.subtaskId : data.todoId;
  console.log(
    `[ApiHelper] -> Starting deletion of data object with id '${objectId}'`
  );
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

  //get full list
  //get todo in list with todoElementId
  let todoRecordId;
  try {
    const record = await pb
      .collection(dataCollection)
      .getFirstListItem(`todoId="${objectId}"`);
    todoRecordId = record.id;
  } catch (error) {
    console.error(`[ApiHelper] -> error while deletion of data object with id '${objectId}'`);
    displayGlobalAlert(
      'Something went wrong while communicating with the api server!',
      alertType.error
    );
    return false;
  }

  //delete todo with backend id
  try {
    await pb.collection(dataCollection).delete(todoRecordId);
  } catch (error) {
    console.error(`[ApiHelper] -> error while deletion of data object with id '${objectId}'`);
    displayGlobalAlert('Your todo could not be deleted!', alertType.error);
    return false;
  }
  console.log(
    `[ApiHelper] -> Finished deletion of data object with id '${data.todoId}'`
  );
  return true;
}
