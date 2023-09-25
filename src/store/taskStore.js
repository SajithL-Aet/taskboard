// Utilities
import { defineStore } from 'pinia';

export const useTaskStore = defineStore({
  id: 'taskStore',
  state: () => ({
    tasksArr: []
  }),
  actions: {
    addTask(task) {
      this.tasksArr.push(task);
    },
    editTask(updatedTask) {
      //update editTask
      const taskIndex = this.tasksArr.findIndex((task) => task.id === updatedTask.id);
      if (taskIndex !== -1) {
        // Update the task with the new data
        this.tasksArr[taskIndex].title = updatedTask?.title;
        this.tasksArr[taskIndex].description = updatedTask?.description;
        this.tasksArr[taskIndex].status = updatedTask?.status;
        this.tasksArr[taskIndex].dateTime = updatedTask?.dateTime;
        this.tasksArr[taskIndex].label = updatedTask?.label;
        this.tasksArr[taskIndex].comment = updatedTask?.comment;
        this.tasksArr[taskIndex].fileName = updatedTask?.fileName;
      }
    },
    deleteTask(taskId) {
      this.tasksArr = this.tasksArr.filter(task => task.id !== taskId);
    },
  },
  persist: true
});
