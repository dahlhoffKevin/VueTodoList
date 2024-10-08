<script>
import { ref, inject, provide, defineComponent } from "vue";
import { v7 as uuidv7 } from "uuid";
import SubtaskElement from "./SubtaskElement.vue";
import { returnCurrentDateTimeArray } from "../helpercode/CommonMethods.js";
import { alertType, displayGlobalAlert } from "../helpercode/AlertHelper.js";
import { getNewTodoIndex } from "../helpercode/CommonMethods.js";
import {
  uploadSubtaskObject,
  deleteDataObject,
} from "../helpercode/ApiHelper.js";

export default defineComponent({
  name: "TodoElement",
  components: {
    SubtaskElement,
  },
  props: {
    todoElementId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subtasks: {
      type: Array,
      required: false,
      default: () => [],
    },
    timeAtUpdate: {
      type: String,
      required: true,
    },
    dateAtUpdate: {
      type: String,
      required: true,
    },
    isChecked: {
      type: Boolean,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    // const deleteDataObject = inject('deleteDataObject');
    const updateTodoArray = inject("updateTodoArray");
    const updateTodoInMainArray = inject("updateTodoInMainArray");
    const TODOS = inject("TODOS");
    let SUBTASKS = ref(props.subtasks);
    let subtaskId = "";
    let subtaskTitle = ref("");
    let newIndex = 0;

    if (props.index == undefined) {
      let index = getNewTodoIndex(TODOS);
      newIndex = index == 0 ? 1 : index;
    }

    provide("SUBTASKS", SUBTASKS);
    provide("updateSubtaskArray", (newSubtaskArray) => {
      SUBTASKS.value = newSubtaskArray;
    });

    const btnFinishTodo = () => {
      const newTodoArray = TODOS.value.filter(
        (todo) => todo.todoElementId !== props.todoElementId
      );
      updateTodoArray(newTodoArray);
    };

    const btnOpenTodoEditDialog = () => {
      emit("edit-todo", props);
    };

    const btnAddSubtaskToTodo = async () => {
      const [date, time] = returnCurrentDateTimeArray();
      subtaskId = uuidv7();

      let newSubtask = {
        parentTodoId: props.todoElementId,
        subtaskId: subtaskId,
        title: subtaskTitle.value,
        isChecked: false,
      };

      let success = await uploadSubtaskObject(newSubtask);
      if (!success) {
        displayGlobalAlert("Your subtask could not be added!", alertType.error);
        return;
      }

      SUBTASKS.value.push(newSubtask);
      let updatedTodo = {
        todoElementId: props.todoElementId,
        timeAtUpdate: time,
        dateAtUpdate: date,
      };
      updateTodoInMainArray(updatedTodo);
      subtaskTitle.value = "";
    };

    const btnDeleteTodo = async () => {
      let response = await deleteDataObject({
        todoElementId: props.todoElementId,
      });

      if (!response) {
        displayGlobalAlert(
          "Im sorry! Something went wrong while communicating with the api server.",
          alertType.error
        );
        return;
      }
      const newTodoArray = TODOS.value.filter(
        (todo) => todo.todoElementId !== props.todoElementId
      );
      updateTodoArray(newTodoArray);
    };

    return {
      SUBTASKS,
      newIndex,
      subtaskTitle,
      btnFinishTodo,
      btnOpenTodoEditDialog,
      btnAddSubtaskToTodo,
      btnDeleteTodo,
    };
  },
});
</script>

<template>
  <a :id="`todoItem_${todoElementId}`" class="list-group-item" data-toggle="modal" data-target="todoDialog"
    aria-current="true" style="margin-bottom: 10px">
    <div class="d-flex w-100 justify-content-between">
      <p>TODO-{{ index === undefined ? newIndex : index }}</p>
      <div>
        <small :id="`todoDate_${todoElementId}`" class="mb-1">{{ date }}</small>
        <small> - </small>
        <small :id="`todoTime_${todoElementId}`">{{ time }}</small>
      </div>
    </div>
    <h4 :id="`todoTitle_${todoElementId}`" class="mb-1">{{ title }}</h4>
    <p :id="`todoDescription_${todoElementId}`" class="mb-1">
      {{ description }}
    </p>
    <div class="border-with-title">
      <span class="title">Subtasks</span>
      <ul class="list-group" :id="`subtasksTodo_${todoElementId}`">
        <li class="d-flex justify-content-between align-items-center" v-for="subtask in SUBTASKS"
          :key="subtask.subtaskId">
          <SubtaskElement :subtaskId="subtask.subtaskId" :parentTodoId="subtask.parentTodoId" :title="subtask.title"
            :isChecked="subtask.isChecked" />
        </li>
      </ul>
    </div>
    <div style="padding-top: 20px !important">
      <div class="d-flex justify-content-between align-items-center" style="padding-bottom: 10px">
        <input type="text" class="form-control" :id="`inputSubtaskTodo_${todoElementId}`" placeholder="Subtask Title"
          v-model="subtaskTitle" />
        <button :id="`btnAddSubtaskTodo_${todoElementId}`" @click="btnAddSubtaskToTodo" type="button"
          class="btn btn-outline-success" style="margin-left: 5px">
          Add
        </button>
      </div>
    </div>
    <div class="d-flex w-100 justify-content-between">
      <div style="padding-top: 10px !important">
        <button :id="`btnFinishTodo_${todoElementId}`" :for="`todoItem_${todoElementId}`" @click="btnFinishTodo"
          type="button" class="btn btn-outline-success" style="margin-right: 5px">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check"
            viewBox="0 0 16 16">
            <path
              d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
          </svg>
        </button>
        <button :id="`btnEditTodo_${todoElementId}`" @click="btnOpenTodoEditDialog" type="button"
          class="btn btn-outline-primary" style="margin-right: 5px">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill"
            viewBox="0 0 16 16">
            <path
              d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
          </svg>
        </button>
        <button :id="`btnDeleteTodo_${todoElementId}`" :for="`todoItem_${todoElementId}`" @click="btnDeleteTodo"
          type="button" class="btn btn-outline-danger">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
            viewBox="0 0 16 16">
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
          </svg>
        </button>
      </div>
      <div style="padding-top: 20px">
        <small :id="`todoUpdatedDate_${todoElementId}`" class="mb-1">Updated: {{ dateAtUpdate }}</small>
        <small> - </small>
        <small :id="`todoUpdatedTime_${todoElementId}`">{{
          timeAtUpdate
          }}</small>
      </div>
    </div>
  </a>
</template>
