<script setup>
import { ref, watch, defineEmits, defineProps, computed, inject } from 'vue';
import { returnCurrentDateTimeArray } from "../helpercode/CommonMethods.js";

const props = defineProps({ todo: Object });
const emit = defineEmits(['close-dialog']);
const visible = ref(false);
const editedTodo = ref({ ...props.todo });
const titleHasChanged = ref(false);
const descriptionHasChanged = ref(false);
const updateTodoInMainArray = inject('updateTodoInMainArray');

watch(() => props.todo, (newTodo) => {
  editedTodo.value = { ...newTodo };
  visible.value = true;
  titleHasChanged.value = false;
  descriptionHasChanged.value = false;
});

watch(editedTodo, (newEditedTodo) => {
  titleHasChanged.value = props.todo.title !== newEditedTodo.title;
  descriptionHasChanged.value = props.todo.description !== newEditedTodo.description;
}, { deep: true });

const isDisabled = computed(() => {
  return !titleHasChanged.value && !descriptionHasChanged.value;
});

function closeDialog() {
  visible.value = false;
  emit('close-dialog');
}

function saveTodo() {
  const [date, time] = returnCurrentDateTimeArray();
  editedTodo.value.dateAtUpdate = date;
  editedTodo.value.timeAtUpdate = time;

  var newtodoArray = editedTodo.value;
  updateTodoInMainArray(newtodoArray);
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
            v-model="editedTodo.title"
          />
          <label class="form-label is-invalid">Description</label>
          <input
            type="text"
            class="form-control"
            id="todoDialogTodoDescription"
            placeholder="Description"
            v-model="editedTodo.description"
          />
          <ul id="subtasks"></ul>
        </div>
        <div class="modal-footer">
          <button id="btnTodoDialogClose" type="button" class="btn btn-outline-secondary" @click="closeDialog" style="margin-right: 10px!important;">Close</button>
          <button id="btnTodoDialogSave" type="button" class="btn btn-outline-primary" @click="saveTodo" :disabled="isDisabled">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>
