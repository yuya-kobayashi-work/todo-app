<script setup>
  import { ref } from 'vue';
  import { useTodoStore } from '@/stores/app';
  
  const store = useTodoStore();
  const txtTask = ref('');

  // タスク追加
  const addTask = () => {
    if (txtTask.value.trim() === '') {
      // 空白のみ、未入力タスクは追加しない
      return;
    }
    store.addTask(txtTask.value);
    // 入力エリア初期化
    txtTask.value = '';
  }
  // タスク削除
  const delTask = (id) => {
    if (confirm('削除します。よろしいですか？')) {
      store.deleteTask(id);
    }
  }
  // 作業状況変更
  const proceed = (id) => {
    store.changeStatus(id);
  }
  // 作業状況リセット
  const resetStatus = () => {
    if (store.todoList.length < 1) {
      // ToDo登録がない場合はスルー
      return;
    }
    if (confirm('作業状況をリセットします。よろしいですか？')) {
      store.resetStatus();
    }
  }
</script>

<template>
  <div id="main">
    <h1>ToDoアプリ</h1>
    <div id="inputArea">
      <input type="text" id="txtTask" v-model="txtTask" />
      <input type="button" id="btnAdd" class="btn" @click="addTask()" value="追加" />
      <input type="button" id="btnReset" class="btn" @click="resetStatus()" value="リセット" />
    </div>
    <ul id="statusArea">
      <li class="status-item">
        <input type="radio" id="radio_all" name="status" v-model="store.filter" value="0" checked />
        <label for="radio_all">
            <div class="btn btn-radio">全て</div>
        </label>
      </li>
      <li v-for="status in store.statusList" :key="status.id" class="status-item">
        <input type="radio" :id="'radio_' + status.name" name="status" v-model="store.filter" :value="status.id" />
        <label :for="'radio_' + status.name">
          <div class="btn btn-radio">{{ status.text }}</div>
        </label>
      </li>
    </ul>
    <table id="tblTaskList">
      <thead>
        <tr>
          <th class="th-task">タスク</th>
          <th class="th-timestamp">登録日時</th>
          <th class="th-button">状況</th>
          <th class="th-button"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="todo in store.filterToDoList" :key="todo.id">
          <td>{{ todo.task }}</td>
          <td>{{ todo.created }}</td>
          <td>
            <input type="button" :class="'btn btn-status-' + todo.status" @click="proceed(todo.id)" :value="store.getStatusText(todo.status)" />
          </td>
          <td>
            <input type="button" class="btn btn-delete" @click="delTask(todo.id)" value="削除" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
