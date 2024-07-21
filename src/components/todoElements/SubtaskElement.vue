<script>
import { defineComponent, inject } from "vue";
import { returnCurrentDateTimeArray } from "../helpercode/CommonMethods.js";

export default defineComponent({
  name: "SubtaskElement",
  props: {
    subtaskElementId: {
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
    metadata: {
      type: Object,
      required: true,
      validator(value) {
        return (
          typeof value.metadataId === 'string' &&
          typeof value.parentObjectId === 'string' &&
          typeof value.isChecked === 'boolean'
        );
      }
    },
  },
  setup(props) {
    const SUBTASKS = inject('SUBTASKS');
    const updateSubtaskArrayFn = inject('updateSubtaskArray');
    const updateTodoInMainArrayFn = inject('updateTodoInMainArray');

    const btnFinishSubtask = () => {
      const [date, time] = returnCurrentDateTimeArray();
      
      const subtaskIndex = SUBTASKS.value.findIndex(
        (subtask) => subtask.subtaskElementId === props.subtaskElementId
      );

      SUBTASKS.value[subtaskIndex].metadata.isChecked = !props.metadata.isChecked;
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
        :checked="metadata.isChecked"
        @click="btnFinishSubtask"
      />
    </div>
    <input
      :id="`subtask_input_${subtaskElementId}`"
      type="text"
      class="form-control"
      aria-label="Text input with checkbox"
      :value="`${title}`"
      :style="{ textDecoration: metadata.isChecked ? 'line-through' : 'none' }"
      :disabled="metadata.isChecked"
    />
  </div>
</template>
