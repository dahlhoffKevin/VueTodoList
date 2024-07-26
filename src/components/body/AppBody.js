import { arraysAreEqual } from '../helpercode/CommonMethods.js';
import { alertType, displayGlobalAlert } from '../helpercode/AlertHelper.js';
import { returnCurrentDateTimeArray } from "../helpercode/CommonMethods.js";
import { v7 as uuidv7 } from "uuid";

export function updateTodoInMainArray(mainTodoArray, todoElement) {
  if (!Array.isArray(mainTodoArray.value)) {
    return;
  }
  
  // Find the index of the item with the matching newTodoArrayId
  const todoIndex = mainTodoArray.value.findIndex(
    (todo) => todo.todoElementId === todoElement.todoElementId
  );

  if (todoIndex === -1) {
    displayGlobalAlert('We are sorry, but we could not update your todo! Please try again later.', alertType.error);
    return;
  }
  
  // Find the current todo object
  const currentTodoObject = mainTodoArray.value[todoIndex];
  let updated = false; // Flag to check if we have any updates
  
  // Create a new object that will store the updated values
  const updatedTodoObject = { ...currentTodoObject };

  // Loop through the properties of the new todo element and only update properties in TODO array that has changed
  for (const [key, value] of Object.entries(todoElement)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      if (JSON.stringify(currentTodoObject[key]) !== JSON.stringify(value)) {
        updatedTodoObject[key] = value;
        updated = true;
      }
    } else if (Array.isArray(value)) {
      if (!arraysAreEqual(currentTodoObject[key], value)) {
        updatedTodoObject[key] = value;
        updated = true;
      }
    } else {
      if (currentTodoObject[key] !== value) {
        updatedTodoObject[key] = value;
        updated = true;
      }
    }
  }

  // If there are updates, assign the updated object to the array
  if (updated) {
    mainTodoArray.value[todoIndex] = updatedTodoObject;

  } else displayGlobalAlert("A todo update request was detected, but there were no changes on the requested todo element found!", alertType.error);
}

export function returnNewTodoObject(todoTitleValue, todoDescriptionValue, apiObject = false) {
  const todoElementId = uuidv7();
  const [date, time] = returnCurrentDateTimeArray();
  
  if (apiObject) {
    return {
      'todoId': todoElementId.toString(),
      'title': todoTitleValue,
      'description': todoDescriptionValue,
      'isChecked': true,
      'version': 1
    };
  }

  return {
    todoElementId: todoElementId,
    Version: 1,
    date: date,
    time: time,
    title: todoTitleValue,
    description: todoDescriptionValue,
    subtasks: [],
    isChecked: false,
    timeAtUpdate: null,
    dateAtUpdate: null
  };
}

export async function uploadDataObject(dataCollection, data, pb) {
  try {
    await pb.collection('users').authWithPassword(process.env.VUE_APP_API_USER, 
      process.env.VUE_APP_API_USER_SECRET);
  } catch (error) {
    console.log(error);
    displayGlobalAlert("We are currently experiencing server issues. Please try again later", alertType.error);
    return false;
  }
  
  try {
    await pb.collection(dataCollection).create(data);
  } catch (error) {
    console.log(error);
    displayGlobalAlert("Something went wrong while uploading your todo!", alertType.error);
    return false;
  }

  return true;
}

export function checkValidInput() {
  let todoInput = document.getElementById("todoInput")?.value;
  if (!todoInput) {
    displayGlobalAlert("You need to provide a title for the todo", alertType.error);
    return false;
  }
  return true;
}