<script>
import { defineComponent, inject } from "vue";
import { returnCurrentDateTimeArray } from "../helpercode/CommonMethods.js";
import { displayGlobalAlert, alertType } from "../helpercode/AlertHelper.js";
import { deleteDataObject } from "../helpercode/ApiHelper.js";

export default defineComponent({
  name: "SubtaskElement",
  props: {
    subtaskId: {
      type: String,
      required: true,
    },
    parentTodoId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isChecked: {
      type: Boolean,
      required: true,
    }
  },
  setup(props) {
    const SUBTASKS = inject('SUBTASKS');
    const updateSubtaskArray = inject('updateSubtaskArray');
    const updateTodoInMainArray = inject('updateTodoInMainArray');

    const btnFinishSubtask = () => {
      const [date, time] = returnCurrentDateTimeArray();
      
      const subtaskIndex = SUBTASKS.value.findIndex(
        (subtask) => subtask.subtaskId === props.subtaskId
      );

      try {
        console.log(props);
        SUBTASKS.value[subtaskIndex].isChecked = !props.isChecked;
      } catch (error) {
        console.log(error);
        displayGlobalAlert(`Subtask could not be updated: ${error}`, alertType.error);
        return;
      }
      updateSubtaskArray(SUBTASKS.value);

      var updatedTodo = { todoElementId: props.parentTodoId, timeAtUpdate: time, dateAtUpdate: date };
      updateTodoInMainArray(updatedTodo);
    };

    const btnDeleteSubtask = async () => {
      const response = await deleteDataObject({ subtaskId: props.subtaskId });
      if (!response) return;

      const newTodoArray = SUBTASKS.value.filter(subtask => subtask.subtaskId !== props.subtaskId);
      updateSubtaskArray(newTodoArray);
    };

    return {
      btnFinishSubtask,
      btnDeleteSubtask
    };
  },
});
</script>

<template>
  <div class="input-group mb-3">
    <div class="input-group-text">
      <input
        class="form-check-input mt-0"
        type="checkbox"
        :checked="isChecked"
        @click="btnFinishSubtask"
      />
    </div>
    <input
      :id="`subtask_input_${subtaskId}`"
      type="text"
      class="form-control"
      aria-label="Text input with checkbox"
      :value="`${title}`"
      :style="{ textDecoration: isChecked ? 'line-through' : 'none' }"
      :disabled="isChecked"
    />
    <button
      type="button"
      class="btn btn-outline-danger"
      style="border-color: #495057!important;"
      @click="btnDeleteSubtask"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
      </svg>
    </button>
  </div>
</template>
