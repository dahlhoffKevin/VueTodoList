import { alertType, displayGlobalAlert } from "../helpercode/AlertHelper.js";

export async function uploadDataObject(dataCollection, data, pb) {
  try {
    await pb
      .collection("users")
      .authWithPassword(
        process.env.VUE_APP_API_USER,
        process.env.VUE_APP_API_USER_SECRET
      );
  } catch (error) {
    console.log(error);
    displayGlobalAlert(
      "We are currently experiencing server issues. Please try again later",
      alertType.error
    );
    return false;
  }

  try {
    await pb.collection(dataCollection).create(data);
  } catch (error) {
    console.log(error);
    displayGlobalAlert(
      "Something went wrong while uploading your todo!",
      alertType.error
    );
    return false;
  }

  return true;
}

export async function deleteDataObject(dataCollection, data, pb) {
  console.log(
    `[ApiHelper] -> Starting deletion of data object with id '${data.todoId}'`
  );
  try {
    await pb
      .collection("users")
      .authWithPassword(
        process.env.VUE_APP_API_USER,
        process.env.VUE_APP_API_USER_SECRET
      );
  } catch (error) {
    console.log(error);
    displayGlobalAlert(
      "We are currently experiencing server issues. Please try again later",
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
      .getFirstListItem(`todoId="${data.todoId}"`);
    todoRecordId = record.id;
  } catch (error) {
    console.log(error);
    displayGlobalAlert(
      "Something went wrong while communicating with the api server!",
      alertType.error
    );
    return false;
  }

  //delete todo with backend id
  try {
    await pb.collection(dataCollection).delete(todoRecordId);
  } catch (error) {
    displayGlobalAlert("Your todo could not be deleted!", alertType.error);
    console.log(error);
    return false;
  }
  console.log(
    `[ApiHelper] -> Finished deletion of data object with id '${data.todoId}'`
  );
  return true;
}
