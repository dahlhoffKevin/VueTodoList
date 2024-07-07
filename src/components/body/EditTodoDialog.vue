<template>
    <div
      class="modal fade"
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
              <h5 id="todoDialogDate">23.03.2024</h5>
              <small id="todoDialogTime">18:58 Uhr</small>
            </div>
            <label class="form-label is-invalid">Title</label>
            <input
              type="text"
              class="form-control"
              id="todoDialogTodoTitle"
              placeholder="Title"
              style="margin-bottom: 10px"
            />
            <label class="form-label is-invalid">Description</label>
            <input
              type="text"
              class="form-control"
              id="todoDialogTodoDescription"
              placeholder="Description"
            />
            <ul id="subtasks"></ul>
            <div style="padding-top: 10px !important">
              <div
                class="d-flex justify-content-between align-items-center"
                style="padding-bottom: 10px">
                <input type="text" class="form-control" id="inputSubtaskTodo" placeholder="Subtask"/>
                <button :id="`btnAddSubtaskTodo_{todoId}`" type="button" class="btn btn-outline-success" style="margin-left: 5px;">
                    Add
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button id="btnTodoDialogClose" type="button" class="btn btn-outline-secondary" data-bs-target="#todoDialog"></button>
            <button id="btnTodoDialogSave" type="button" class="btn btn-outline-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    name: "EditTodoDialog",
    props: {
        todoId: String
    }
}
</script>