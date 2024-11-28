<script setup>
import { ref, computed, onMounted, provide } from "vue";
import EditTodoDialog from "../todoElements/EditTodoDialog.vue";
import TodoElement from "../todoElements/TodoElement.vue";
import { displayGlobalAlert, alertType } from "../helpercode/AlertHelper.js";
import { updateTodoInMainArray, returnNewTodoObject, checkValidInput } from './AppBody.js'
import { uploadTodoObject, loadTodosFromApi } from '../helpercode/ApiHelper.js' //deleteDataObject,
import { v7 as uuidv7 } from "uuid";
import authStore from '../../authStore.js';
import { useRouter } from 'vue-router';

// check if user logged in, when not then redirect to login page
if (authStore.state.userId == null) {
  const router = useRouter();
  router.push({ name: 'login' });
}

// SETUP SECTION -- START
let TODOS = ref([]);
let showEditDialog = ref(false);
let showLoadingCircle = ref(false);
let currentTodo = ref();
let newTodoDescription = ref(0);

provide('TODOS', TODOS);
provide('updateTodoArray', (newTodoArray) => {
  TODOS.value = newTodoArray;
});
provide('updateTodoInMainArray', (todoElement) => {
  updateTodoInMainArray(TODOS, todoElement)
});

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

//load todos from api
async function loadTodos() {
  if (authStore.state.userId == null) return;

  showLoadingCircle.value = true; // Ladekringel anzeigen
  try {
    let success = await loadTodosFromApi(TODOS); // Warten, bis die Todos geladen sind
    if (!success) {
      displayGlobalAlert("Something went wrong while loading your todos!", alertType.error);
    }
  } catch (error) {
    console.error(error);
    displayGlobalAlert("An error occurred while loading your todos!", alertType.error);
  } finally {
    showLoadingCircle.value = false; // Ladekringel ausblenden
  }
}

onMounted(() => {
  loadTodos();
  let todoDescriptionTextArea = document.getElementById("todoDescription");
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

async function createNewTodo() {
  if (!checkValidInput()) return;

  const todoTitleValue = document.getElementById("todoInput")?.value ?? "";
  const todoDescriptionValue = document.getElementById("todoDescription")?.value ?? "";
  const todoElementId = uuidv7();
  const [data, todoObject] = returnNewTodoObject(todoElementId, todoTitleValue, todoDescriptionValue);

  let success = await uploadTodoObject(data);
  if (!success) return;

  try {
    TODOS.value.unshift(todoObject);
  } catch (error) {
    console.log(error);
    displayGlobalAlert("Something went wrong while adding your todo to the list", alertType.error);
    return;
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
    <div class="container text-left" v-if="authStore.state.userId">
      <h3 class="headline">Welcome, {{ authStore.state.userUsername }}</h3>
    </div>
    <div class="container text-left">
      <div class="row">
        <div class="col">
          <div class="innerBody-body">
            <div class="inputTodo">
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
              type="submit"
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
              <div class="d-flex justify-content-center" v-if="showLoadingCircle">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div id="todoList" class="col" v-else>
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
                  :key="todo.todoElementId"
                >
                  <TodoElement
                    :todoElementId="todo.todoElementId"
                    :date="todo.date"
                    :time="todo.time"
                    :title="todo.title"
                    :description="todo.description"
                    :subtasks="todo.subtasks"
                    :timeAtUpdate="todo.timeAtUpdate"
                    :dateAtUpdate="todo.dateAtUpdate"
                    :isChecked="todo.isChecked"
                    :index="todo.index"
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
