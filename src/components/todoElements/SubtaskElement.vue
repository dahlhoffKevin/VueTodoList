<script>
import { defineComponent, inject } from "vue";
import { returnCurrentDateTimeArray } from "../helpercode/CommonMethods.js";
import { displayGlobalAlert, alertType } from "../helpercode/AlertHelper.js";

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

    return {
      btnFinishSubtask,
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
  </div>
</template>
