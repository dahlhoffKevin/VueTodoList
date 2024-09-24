import { arraysAreEqual } from '../helpercode/CommonMethods.js';
import { alertType, displayGlobalAlert } from '../helpercode/AlertHelper.js';
import { returnCurrentDateTimeArray, formateDateAndTimeForApi } from "../helpercode/CommonMethods.js";

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

export function returnNewTodoObject(todoElementId, todoTitleValue, todoDescriptionValue) {
  const [date, time] = returnCurrentDateTimeArray();

  return [
    {
      id: todoElementId.toString(),
      user: { id: '0079691b-b6ae-4bca-a817-ce84dd0cc550' },
      title: todoTitleValue,
      description: todoDescriptionValue,
      isChecked: 0,
      todoIndex: 0,
      created: formateDateAndTimeForApi([date, time])
    },
    {
      todoElementId: todoElementId,
      Version: 1,
      date: date,
      time: time,
      title: todoTitleValue,
      description: todoDescriptionValue,
      subtasks: [],
      isChecked: false,
      timeAtUpdate: null,
      dateAtUpdate: null,
      index: 0
    }
  ]
}

export function checkValidInput() {
  let todoInput = document.getElementById("todoInput")?.value;
  if (!todoInput) {
    displayGlobalAlert("You need to provide a title for the todo", alertType.error);
    return false;
  }
  return true;
}