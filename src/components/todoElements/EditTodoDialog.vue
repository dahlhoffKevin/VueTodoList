<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue';

const props = defineProps({ todo: Object });
const emit = defineEmits(['close-dialog']);
const visible = ref(false);
const editedTodo = ref({ ...props.todo });

watch(() => props.todo, (newTodo) => {
  editedTodo.value = { ...newTodo };
  visible.value = true;
});

function closeDialog() {
  visible.value = false;
  emit('close-dialog');
}

function saveTodo() {
  // Implement save logic here, e.g., update the todo in the list
  console.log('Saving todo:', editedTodo.value);
  closeDialog();
}

function addSubtask() {
  alert("test");
}
</script>

<template>
  <div
    id="todoDialog"
    tabindex="-1"
    role="dialog"
    aria-labelledby="todoDialogTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="todoDialogTitle">Edit Todo</h5>
        </div>
        <div class="modal-body">
          <div class="d-flex w-100 justify-content-between">
            <h5 id="todoDialogDate">{{ todo.date }}</h5>
            <small id="todoDialogTime">{{ todo.time }}</small>
          </div>
          <label class="form-label is-invalid">Title</label>
          <input
            type="text"
            class="form-control"
            id="todoDialogTodoTitle"
            placeholder="Title"
            style="margin-bottom: 10px"
            :value="`${todo.title}`"
          />
          <label class="form-label is-invalid">Description</label>
          <input
            type="text"
            class="form-control"
            id="todoDialogTodoDescription"
            placeholder="Description"
            :value="`${todo.description}`"
          />
          <ul id="subtasks"></ul>
          <div style="padding-top: 10px !important">
            <div
              class="d-flex justify-content-between align-items-center"
              style="padding-bottom: 10px">
              <input type="text" class="form-control" id="inputSubtaskTodo" placeholder="Subtask"/>
              <button id="btnEditTodoDialogAddSubtask" type="button" class="btn btn-outline-success" style="margin-left: 5px;" @click="addSubtask">
                  Add
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button id="btnTodoDialogClose" type="button" class="btn btn-outline-secondary" @click="closeDialog" style="margin-right: 10px!important;">Close</button>
          <button id="btnTodoDialogSave" type="button" class="btn btn-outline-primary" @click="saveTodo">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>