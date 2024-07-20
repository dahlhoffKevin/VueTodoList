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
        <div class="modal-header" style="margin-bottom: 10px!important;">
          <h5 class="modal-title" id="todoDialogTitle">Edit Todo</h5>
        </div>
        <div class="modal-body">
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
        </div>
        <div class="modal-footer">
          <button id="btnTodoDialogClose" type="button" class="btn btn-outline-secondary" @click="closeDialog" style="margin-right: 10px!important;">Close</button>
          <button id="btnTodoDialogSave" type="button" class="btn btn-outline-primary" @click="saveTodo">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>