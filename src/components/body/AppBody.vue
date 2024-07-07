<template>
  <div>
    <EditTodoDialog/>
    <div class="container text-center">
      <h1 class="Todo List">Todo List</h1>
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
              <label for="todoDescription" class="form-label"></label>
              <textarea id="todoDescription" class="form-control" rows="3" placeholder="Input Todo Description"></textarea>
            </div>
            <button type="button" class="btn btn-outline-primary" style="margin-right: 10px;" onclick="createNewTodo">Add Todo</button>
            <button type="button" class="btn btn-outline-success" style="margin-right: 10px;" onclick="synchronizeTodos">Synchronize</button>
          </div>
        </div>
        <div class="col">
          <div class="container text-left">
            <div class="row">
              <div id="todoList" class="col">
                <ul id="list-group" class="list-group">
                  <div id="initialTodoHeadline">
                    <h4 style="text-align: center;">Add Todos</h4>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import EditTodoDialog from './EditTodoDialog.vue'

export default {
  name: "AppBody",
  props: {},
}
</script>
