<template>
  <AppHeader/>
  <AppBody/>
</template>

<script>
//import AppHeader from './components/header/AppHeader.vue';
import AppBody from './components/body/AppBody.vue';

export default {
  name: 'App',
  components: {
    AppBody
  }
}
</script>

<style>
.headline {
    padding-top: 20px;
    padding-bottom: 10px;
}
#addTodoBtn {
  margin-top: 10px;
}
.innerBody-body + * {
  padding-bottom: 10px;
}
.list-group-item-action:hover,
.list-group-item-action:focus {
  background-color: #212529!important;
  color: #DEE2E6!important;
}
#todoList {
  align-items: center!important;
}
</style>
