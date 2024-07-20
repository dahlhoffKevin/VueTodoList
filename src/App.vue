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
.border-with-title {
  position: relative;
  border: 1px solid #495057;
  border-radius: 5px;
  padding: 1rem;
  margin-top: 2rem;
}
.border-with-title .title {
  position: absolute;
  top: -0.75em;
  left: 0.5rem;
  background: #21252A;
  padding: 0 0.5rem;
  font-size: 1.00rem;
  color: #B4B7BB;
}
</style>
