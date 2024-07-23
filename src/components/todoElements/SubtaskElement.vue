<script>
import { defineComponent, inject } from "vue";
import { returnCurrentDateTimeArray } from "../helpercode/CommonMethods.js";

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
    const updateSubtaskArrayFn = inject('updateSubtaskArray');
    const updateTodoInMainArrayFn = inject('updateTodoInMainArray');

    const btnFinishSubtask = () => {
      const [date, time] = returnCurrentDateTimeArray();
      
      const subtaskIndex = SUBTASKS.value.findIndex(
        (subtask) => subtask.subtaskId === props.subtaskId
      );

      SUBTASKS.value[subtaskIndex].isChecked = !props.isChecked;
      updateSubtaskArrayFn(SUBTASKS.value);
      updateTodoInMainArrayFn({ todoElementId: props.parentTodoId, metadata: { timeAtUpdate: time, dateAtUpdate: date} });
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
