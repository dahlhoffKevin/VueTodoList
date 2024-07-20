<script setup>
import { ref, computed, onMounted, provide } from "vue";
import EditTodoDialog from "../todoElements/EditTodoDialog.vue";
import TodoElement from "../todoElements/TodoElement.vue";
import { v7 as uuidv7 } from "uuid";
import { displayGlobalAlert, alertType } from "../helpercode/AlertHelper.js";
import { returnCurrentDateTimeArray } from "../helpercode/CommonMethods.js";

// SETUP SECTION -- START
let TODOS = ref([]);
var newTodoDescription = ref(0);
provide('updateTodosArrayLength', (newTodoArray) => {
  TODOS.value = newTodoArray;
})

//-------------------------------------------------------------------------------------------
/**
 * handles count of all added todos
 */
const totalTodosAdded = computed(() => {
  return TODOS.value.length;
});
//-------------------------------------------------------------------------------------------
/**
 * handles description length of a yet to be added todo
 */
const todoDescriptionLength = computed(() => {
  return newTodoDescription.value;
});
//-------------------------------------------------------------------------------------------
/**
 * mounts to todoDescription and parses length to @newTodoDescription
 */
onMounted(() => {
  var todoDescriptionTextArea = document.getElementById("todoDescription");
  todoDescriptionTextArea.addEventListener("input", function () {
    newTodoDescription.value = todoDescriptionTextArea.value.length;
  });
});
// SETUP SECTION -- END

// MAIN LOGIC SECTION -- START
//-------------------------------------------------------------------------------------------
/**
 * returns a new created todo html element
 */
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

  var subtasks = [{}];

  var todoObject = {
    Id: todoElementId,
    Version: 1,
    CreatedAtDate: date,
    CreatedAtTime: time,
    Title: todoTitleValue,
    Description: todoDescriptionValue,
    Subtasks: subtasks,
    Metadata: {
      MetadataId: metadataId,
      ParentObject: todoElementId,
      IsChecked: false,
    },
  };

  TODOS.value.push(todoObject);
}
//-------------------------------------------------------------------------------------------
/**
 * validates todot title input to not be empty
 */
function checkValidInput() {
  var todoInput = document.getElementById("todoInput")?.value;
  if (!todoInput) {
    alert("Todo Input is empty");
    return false;
  }
  return true;
}
//-------------------------------------------------------------------------------------------
/**
 * returns a new created todo html element
 */
function createNewTodo() {
  if (!checkValidInput()) return;

  var todoTitleElement = document.getElementById("todoInput");
  var todoDescriptionElement = document.getElementById("todoDescription");

  try {
    createNewTodoElement(todoTitleElement, todoDescriptionElement);
  } catch (error) {
    console.error(error);
    displayGlobalAlert("Todo could not be added!", alertType.danger);
  }

  // document.getElementById('todoInput').value = "";
  document.getElementById("todoDescription").value = "";

  //reset reactive description length value manuelly
  updateDescriptionLengthValue();

  displayGlobalAlert("Successfully added todo!", alertType.success);
}
//-------------------------------------------------------------------------------------------
/**
 * synchronizes frontend todo list with backend
 */
function synchronizeTodos() {
  displayGlobalAlert("Not yet implemented", alertType.warning);
}
// MAIN LOGIC SECTION -- END
</script>

<template>
  <div>
    <EditTodoDialog />
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
                value="Dies ist eine Test Todo"
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
                <ul
                  id="todoList-list-group"
                  class="list-group"
                  v-for="todo in TODOS"
                  :key="todo.Id"
                >
                  <TodoElement
                    :todoElementId="todo.Id"
                    :date="todo.CreatedAtDate"
                    :time="todo.CreatedAtTime"
                    :title="todo.Title"
                    :description="todo.Description"
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
