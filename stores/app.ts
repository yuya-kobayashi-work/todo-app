import { ref } from 'vue';
import { defineStore } from 'pinia';

type ToDo = {
    id: number;
    task: string;
    created: string;
    status: number;
};
const optStatus = [
    { id: 1, name: 'yet', text: '未着手' },
    { id: 2, name: 'working', text: '作業中' },
    { id: 3, name: 'complete', text: '完了' }
]

export const useTodoStore = defineStore('todoList', {
    state: () => {
        return {
            filter: 0,
            nextId: 0,
            statusList: optStatus,
            todoList: ref<ToDo[]>([])
        }
    },
    getters: {
        // フィルタリング
        filterToDoList(state): ToDo[] {
            switch (state.filter) {
                case 1:
                case 2:
                case 3:
                    // 該当状況でフィルタリング
                    return state.todoList.filter((e) => e.status === state.filter);
                default:
                    // 全て
                    return this.todoList;
            }
        }
    },
    actions: {
        // タスク追加
        addTask: function(task: string) {
            // 日時取得
            let today :Date = new Date();
            let strTimestamp :string = 
                today.getFullYear()
                + '/' + ('00' + (today.getMonth() + 1)).slice(-2)
                + '/' + ('00' + today.getDate()).slice(-2)
                + ' ' + ('00' + today.getHours()).slice(-2)
                + ':' + ('00' + today.getMinutes()).slice(-2);
            // タスク追加
            this.todoList.push({
                id: ++this.nextId,
                task: task,
                created: strTimestamp,
                status: 1
            });
        },
        // タスク削除
        deleteTask: function(id: number) {
            this.todoList = this.todoList.filter((e) => e.id !== id);
        },
        // 作業状況変化
        changeStatus: function(id: number) {
            for (const todo of this.todoList) {
                if (todo.id !== id) continue;

                if (todo.status < 3) {
                    todo.status++;
                }
                break;
            }
        },
        // 作業状況リセット
        resetStatus: function() {
            for (const todo of this.todoList) {
                todo.status = 1;
            }
        },
        // 状況名称取得
        getStatusText(status: number) {
            let result = optStatus.find((e) => e.id === status);
            return result?.text;
        }
    },
    persist: true
})