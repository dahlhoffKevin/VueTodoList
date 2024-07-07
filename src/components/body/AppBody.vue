<script setup>
import { ref, computed, onMounted } from 'vue';
import EditTodoDialog from './EditTodoDialog.vue';

let todoList = ref([]);
var newTodoDescription = ref(0);

const totalTodosAdded = computed(() => {
  return todoList.value.length;
});

const todoDescriptionLength = computed(() => {
  return newTodoDescription.value;
});

onMounted(() => {
  var todoDescriptionTextArea = document.getElementById("todoDescription");
  todoDescriptionTextArea.addEventListener("input", function() {
    newTodoDescription.value = todoDescriptionTextArea.value.length;
  });
});

// function checkValidInput() {
//     var todoInput = document.getElementById('todoInput')?.value;
//     if (!todoInput) {
//         alert('Todo Input is empty');
//         return false;
//     }
//     return true;
// }

var count = 0;
function createNewTodo() {
    count++;
    const testElement = document.createElement('div');
    testElement.id = 'testElement_' + count;
    document.getElementById('todoList-list-group').appendChild(testElement);
    todoList.value.push(testElement);
}

function synchronizeTodos() {
    var element = document.getElementById('testElement_' + count);
    count = count-1;
    const index = todoList.value.indexOf(element);
    todoList.value.splice(index, 1);
    element.remove();
}
</script>

<template>
  <div>
    <EditTodoDialog/>
    <div class="container text-center">
      <h1 class="headline">Todo List</h1>
    </div>
    <div id="globalAlertPlaceholder" style="padding-right: 15%; padding-left: 15%;"></div>
    <div class="container text-left">
      <div class="row">
        <div class="col">
          <div class="innerBody-body">
            <div class="inputTodo">
              <div id="liveAlertPlaceholder"></div>
              <label for="todoInput" class="form-label">Title</label>
              <input type="text" class="form-control" id="todoInput" placeholder="Input Todo"/>
            </div>
            <div class="mb-3" style="margin-top: 10px;">
              <label for="todoDescription" class="form-label">Description</label>
              <textarea id="todoDescription" class="form-control" rows="3" placeholder="Input Todo Description"></textarea>
              <p>{{ todoDescriptionLength }} / 200</p>
            </div>
            <button type="button" class="btn btn-outline-primary" style="margin-right: 10px;" @click="createNewTodo">Add Todo</button>
            <button type="button" class="btn btn-outline-success" style="margin-right: 10px;" @click="synchronizeTodos">Synchronize</button>
          </div>
        </div>
        <div class="col">
          <div class="container text-left">
            <div class="row">
              <div id="todoList" class="col">
                <div id="initialTodoHeadline">
                  <h4 style="text-align: center;" v-show="totalTodosAdded === 0">
                    Add Todos to be displayed!
                  </h4>
                </div>
                <ul id="todoList-list-group" class="list-group">
                  <!-- Todo items will be displayed here -->
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
