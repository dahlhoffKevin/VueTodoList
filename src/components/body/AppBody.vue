<script setup>
import { ref, computed, onMounted, provide } from "vue";
import EditTodoDialog from "../todoElements/EditTodoDialog.vue";
import TodoElement from "../todoElements/TodoElement.vue";
import { v7 as uuidv7 } from "uuid";
import { displayGlobalAlert, alertType } from "../helpercode/AlertHelper.js";
import { returnCurrentDateTimeArray } from "../helpercode/CommonMethods.js";

// SETUP SECTION -- START
let TODOS = ref([]);
let showEditDialog = ref(false);
let currentTodo = ref();
var newTodoDescription = ref(0);

provide('TODOS', TODOS);
provide('updateTodoArray', (newTodoArray) => {
  TODOS.value = newTodoArray;
});
provide('updateTodoInMainArray', (todoElement) => {
  console.log(todoElement);
  if (!Array.isArray(TODOS.value)) {
    return;
  }
  
  // Find the index of the item with the matching todoElementId
  const todoIndex = TODOS.value.findIndex(
    (todo) => todo.todoElementId === todoElement.todoElementId
  );

  if (todoIndex === -1) {
    displayGlobalAlert('We are sorry, but we could not update your todo! Please try again later.', alertType.error);
    return;
  }
  
  // Find the current todo object
  const currentTodoObject = TODOS.value[todoIndex];
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
    TODOS.value[todoIndex] = updatedTodoObject;
    displayGlobalAlert("Todo updated successfully", alertType.success);
  } else displayGlobalAlert("A todo update request was detected, but there were no changes on the requested todo element found!", alertType.error);
});

// Helper function to compare two arrays
function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

const totalTodosAdded = computed(() => {
  return TODOS.value.length;
});

const todoDescriptionLength = computed(() => {
  return newTodoDescription.value;
});

function openEditDialog(todo) {
  currentTodo.value = todo;
  showEditDialog.value = true;
}

onMounted(() => {
  var todoDescriptionTextArea = document.getElementById("todoDescription");
  todoDescriptionTextArea.addEventListener("input", function () {
    newTodoDescription.value = todoDescriptionTextArea.value.length;
  });
});
// SETUP SECTION -- END

// MAIN LOGIC SECTION -- START
function updateDescriptionLengthValue() {
  newTodoDescription.value =
    document.getElementById("todoDescription").value.length;
}

function createNewTodoElement(todoTitleElement, todoDescriptionElement) {
  const todoElementId = uuidv7();
  const metadataId = uuidv7();
  const todoTitleValue = todoTitleElement?.value ?? "";
  const todoDescriptionValue = todoDescriptionElement?.value ?? "";
  const [date, time] = returnCurrentDateTimeArray();

  var todoObject = {
    todoElementId: todoElementId,
    Version: 1,
    date: date,
    time: time,
    title: todoTitleValue,
    description: todoDescriptionValue,
    subtasks: [],
    metadata: {
      metadataId: metadataId,
      parentObjectId: todoElementId,
      isChecked: false,
      timeAtUpdate: null,
      dateAtUpdate: null
    },
  };

  TODOS.value.push(todoObject);
}

function checkValidInput() {
  var todoInput = document.getElementById("todoInput")?.value;
  if (!todoInput) {
    displayGlobalAlert("You need to provide a title for the todo", alertType.error);
    return false;
  }
  return true;
}

function createNewTodo() {
  if (!checkValidInput()) return;

  var todoTitleElement = document.getElementById("todoInput");
  var todoDescriptionElement = document.getElementById("todoDescription");

  try {
    createNewTodoElement(todoTitleElement, todoDescriptionElement);
  } catch (error) {
    console.error(error);
    displayGlobalAlert("Todo could not be added!", alertType.error);
  }

  document.getElementById('todoInput').value = "";
  document.getElementById("todoDescription").value = "";

  //reset reactive description length value manuelly
  updateDescriptionLengthValue();
}

function synchronizeTodos() {
  displayGlobalAlert("Not yet implemented", alertType.warning);
}
// MAIN LOGIC SECTION -- END
</script>

<template>
  <div>
    <div class="container text-center">
      <h1 class="headline">Todo List</h1>
    </div>
    <div
      id="globalAlertPlaceholder"
      style="padding-right: 15%; padding-left: 15%"
    ></div>
    <div class="container text-left">
      <div class="row">
        <div class="col">
          <div class="innerBody-body">
            <div class="inputTodo">
              <div id="liveAlertPlaceholder"></div>
              <label for="todoInput" class="form-label">Title</label>
              <input
                type="text"
                class="form-control"
                id="todoInput"
                placeholder="Input Todo"
              />
            </div>
            <div class="mb-3" style="margin-top: 10px">
              <label for="todoDescription" class="form-label"
                >Description</label
              >
              <textarea
                id="todoDescription"
                class="form-control"
                rows="3"
                placeholder="Input Todo Description"
              ></textarea>
              <p>{{ todoDescriptionLength }} / 200</p>
            </div>
            <button
              type="button"
              class="btn btn-outline-primary"
              style="margin-right: 10px"
              @click="createNewTodo"
            >
              Add Todo
            </button>
            <button
              type="button"
              class="btn btn-outline-success"
              style="margin-right: 10px"
              @click="synchronizeTodos"
            >
              Synchronize
            </button>
          </div>
        </div>
        <div class="col">
          <div class="container text-left">
            <div class="row">
              <div id="todoList" class="col">
                <div id="initialTodoHeadline">
                  <h4 style="text-align: center" v-show="totalTodosAdded === 0">
                    Add Todos to be displayed!
                  </h4>
                </div>
                <EditTodoDialog
                  v-if="showEditDialog"
                  :todo="currentTodo"
                  @close-dialog="showEditDialog = false"
                />
                <ul
                  v-else
                  id="todoList-list-group"
                  class="list-group"
                  v-for="todo in TODOS"
                  :key="todo.Id"
                >
                  <TodoElement
                    :todoElementId="todo.todoElementId"
                    :date="todo.date"
                    :time="todo.time"
                    :title="todo.title"
                    :description="todo.description"
                    :subtasks="todo.subtasks"
                    :metadata="todo.metadata"
                    @edit-todo="openEditDialog"
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
