<template>
  <v-container fluid>
    <Progressbar />
    <!-- Top right header icons - refresh task list, search task and add task -->
    <v-row>
      <v-col cols="12" class="text-right">
        <v-btn
          fab
          color="primary"
          @click="resetSearchResult"
          :disabled="!isResetEnabled"
        >
          <v-icon>mdi-restart</v-icon>
        </v-btn>
        <v-btn class="ma-5" fab color="primary" @click="openSearchTaskDialog">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn fab color="primary" @click="openCreateTaskDialog">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <!-- Pending Column -->
      <v-col cols="4">
        <v-card>
          <v-card-title class="text-center">
            Pending ({{ getPendingTasksLength() }}/{{ getTotalTasksLength() }})
            ({{ getPendingTasksPercentage }}%)
          </v-card-title>
          <div
            class="column"
            @dragover.prevent="null"
            @drop="onDrop('pending')"
          >
            <div v-if="getPendingTasksLength() === 0" class="text-center">
              No task here
            </div>
            <v-card
              v-else
              v-for="task in filteredPendingTasks"
              :key="task.id"
              class="task"
              draggable="true"
              @dragstart="onDragStart(task.id)"
            >
              <v-row style="background: pink">
                <v-col cols="12" sm="6" md="8">{{ task.title }}</v-col>
                <v-col cols="6" md="4" class="text-right">
                  <v-icon @click="openEditTaskDialog(task)">mdi-pencil</v-icon>
                  <v-icon @click="onDeleteTaskDialog(task.id)">
                    mdi-delete-forever
                  </v-icon>
                </v-col>
              </v-row>
              <SingleTaskBody :task="task" />
            </v-card>
          </div>
        </v-card>
      </v-col>

      <!-- Processing Column -->
      <v-col cols="4">
        <v-card>
          <v-card-title class="text-center">
            Processing ({{ getProcessingTasksLength() }}/{{
              getTotalTasksLength()
            }}) ({{ getProcessingTasksPercentage }}%)
          </v-card-title>
          <div
            class="column"
            @dragover.prevent="null"
            @drop="onDrop('processing')"
          >
            <div v-if="getProcessingTasksLength() === 0" class="text-center">
              No task here
            </div>
            <v-card
              v-else
              v-for="task in filteredProcessingTasks"
              :key="task.id"
              class="task"
              draggable="true"
              @dragstart="onDragStart(task.id)"
            >
              <v-row style="background: yellow">
                <v-col cols="12" sm="6" md="8">{{ task.title }}</v-col>
                <v-col cols="6" md="4" class="text-right">
                  <v-icon @click="openEditTaskDialog(task)">mdi-pencil</v-icon>
                  <v-icon @click="onDeleteTaskDialog(task.id)">
                    mdi-delete-forever
                  </v-icon>
                </v-col>
              </v-row>
              <SingleTaskBody :task="task" />
            </v-card>
          </div>
        </v-card>
      </v-col>

      <!-- Done Column -->
      <v-col cols="4">
        <v-card>
          <v-card-title class="text-center">
            Done ({{ getDoneTasksLength() }}/{{ getTotalTasksLength() }}) ({{
              getDoneTasksPercentage
            }}%)
          </v-card-title>
          <div class="column" @dragover.prevent="null" @drop="onDrop('done')">
            <div v-if="getDoneTasksLength() === 0" class="text-center">
              No task here
            </div>
            <v-card
              v-else
              v-for="task in filteredDoneTasks"
              :key="task.id"
              class="task"
              draggable="true"
              @dragstart="onDragStart(task.id)"
            >
              <v-row style="background-color: green">
                <v-col cols="12" sm="6" md="8">{{ task.title }}</v-col>
                <v-col cols="6" md="4" class="text-right">
                  <v-icon @click="openEditTaskDialog(task)">mdi-pencil</v-icon>
                  <v-icon @click="onDeleteTaskDialog(task.id)">
                    mdi-delete-forever
                  </v-icon>
                </v-col>
              </v-row>
              <SingleTaskBody :task="task" />
            </v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Use the Task Create Dialog component -->
  <TaskCreateDialog
    :dialog-visible="isTaskCreateDialogOpen"
    @close-dialog="closeCreateTaskDialog"
  />

  <!-- Use the Task Edit Dialog component -->
  <TaskEditDialog
    :dialog-visible="isTaskEditDialogOpen"
    :selected-task="selectedTask"
    @close-dialog="closeEditTaskDialog"
  />

  <!-- Use the Task Search Dialog component -->
  <TaskSearchDialog
    :dialog-visible="isTaskSearchDialogOpen"
    @close-dialog="closeSearchTaskDialog"
  />
</template>

<script>
import { computed, ref } from "vue";

import { useTaskStore } from "../store/taskStore"; // Import your Pinia store
import TaskCreateDialog from "./TaskCreateDialog.vue";
import TaskEditDialog from "./TaskEditDialog.vue";
import Progressbar from "./Progressbar.vue";
import TaskSearchDialog from "./TaskSearchDialog.vue";
import SingleTaskBody from "./SingleTaskBody.vue";

export default {
  components: {
    TaskCreateDialog,
    TaskEditDialog,
    Progressbar,
    TaskSearchDialog,
    SingleTaskBody,
  },
  setup() {
    const tasksStore = useTaskStore(); // Create an instance of your Pinia store

    const searchedTasksArr = ref(tasksStore.tasksArr);
    const isTaskSearchDialogOpen = ref(false);

    const isTaskEditDialogOpen = ref(false);
    const selectedTask = ref({});

    const isTaskCreateDialogOpen = ref(false);

    const isResetEnabled = ref(false);

    const isTaskDeleted = ref(false);

    const filteredPendingTasks = computed(() => {
      if (isTaskSearchDialogOpen.value || isTaskDeleted.value) {
        return filteredTasks("pending");
      } else {
        // Dialog is closed, return all tasks (search result)
        return searchedTasksArr.value.filter(
          (task) => task.status === "pending"
        );
      }
    });

    const getPendingTasksPercentage = computed(() => {
      return getTotalTasksLength() > 0
        ? ((getPendingTasksLength() / getTotalTasksLength()) * 100).toFixed(2)
        : 0;
    });

    const filteredProcessingTasks = computed(() => {
      if (isTaskSearchDialogOpen.value || isTaskDeleted.value) {
        return filteredTasks("processing");
      } else {
        // Dialog is closed, return all tasks (search result)
        return searchedTasksArr.value.filter(
          (task) => task.status === "processing"
        );
      }
    });

    const getProcessingTasksPercentage = computed(() => {
      return getTotalTasksLength() > 0
        ? ((getProcessingTasksLength() / getTotalTasksLength()) * 100).toFixed(
            2
          )
        : 0;
    });

    const filteredDoneTasks = computed(() => {
      if (isTaskSearchDialogOpen.value || isTaskDeleted.value) {
        return filteredTasks("done");
      } else {
        // Dialog is closed, return all tasks (search result)
        return searchedTasksArr.value.filter((task) => task.status === "done");
      }
    });

    const getDoneTasksPercentage = computed(() => {
      return getTotalTasksLength() > 0
        ? ((getDoneTasksLength() / getTotalTasksLength()) * 100).toFixed(2)
        : 0;
    });

    const getPendingTasksLength = () =>
      tasksStore.tasksArr.filter((task) => task.status === "pending").length;

    const getProcessingTasksLength = () =>
      tasksStore.tasksArr.filter((task) => task.status === "processing").length;

    const getDoneTasksLength = () =>
      tasksStore.tasksArr.filter((task) => task.status === "done").length;

    const getTotalTasksLength = () => tasksStore.tasksArr.length;

    const onDragStart = (taskId) => {
      tasksStore.draggedTaskId = taskId;
    };

    const onDrop = (targetStatus) => {
      if (tasksStore.draggedTaskId) {
        const task = findTaskById(tasksStore.draggedTaskId);
        if (task && task.status !== targetStatus) {
          task.status = targetStatus; // this will auto update pinia state
        }
        tasksStore.draggedTaskId = null;
      }
    };

    const openSearchTaskDialog = () => {
      isTaskSearchDialogOpen.value = true;
      isTaskDeleted.value = false;
    };

    const closeSearchTaskDialog = (searchResults, isFromSearchSubmit) => {
      isResetEnabled.value = isFromSearchSubmit ? true : false;
      searchedTasksArr.value = isFromSearchSubmit
        ? searchResults
        : tasksStore.tasksArr;
      isTaskSearchDialogOpen.value = false;
    };

    const resetSearchResult = () => {
      searchedTasksArr.value = tasksStore.tasksArr;
      isResetEnabled.value = false;
    };

    const openCreateTaskDialog = () => {
      isTaskCreateDialogOpen.value = true;
    };

    const closeCreateTaskDialog = () => {
      isTaskCreateDialogOpen.value = false;
    };

    const openEditTaskDialog = (task) => {
      isTaskEditDialogOpen.value = true;
      selectedTask.value = task;
    };

    const closeEditTaskDialog = () => {
      isTaskEditDialogOpen.value = false;
    };

    const onDeleteTaskDialog = (taskId) => {
      tasksStore.deleteTask(taskId);
      isTaskDeleted.value = true;
    };

    const filteredTasks = (status) => {
      return tasksStore.tasksArr.filter((task) => task.status === status);
    };

    const findTaskById = (id) => {
      return tasksStore.tasksArr.find((task) => task.id === id);
    };

    return {
      isTaskCreateDialogOpen,
      isTaskEditDialogOpen,
      isTaskSearchDialogOpen,
      isResetEnabled,
      selectedTask,
      filteredPendingTasks,
      filteredProcessingTasks,
      filteredDoneTasks,
      getPendingTasksPercentage,
      getProcessingTasksPercentage,
      getDoneTasksPercentage,
      onDragStart,
      onDrop,
      filteredTasks,
      openCreateTaskDialog,
      closeCreateTaskDialog,
      openEditTaskDialog,
      closeEditTaskDialog,
      onDeleteTaskDialog,
      openSearchTaskDialog,
      closeSearchTaskDialog,
      resetSearchResult,
      getPendingTasksLength,
      getTotalTasksLength,
      getProcessingTasksLength,
      getDoneTasksLength,
    };
  },
};
</script>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 16px;
  margin: 8px;
}

.task {
  background-color: #f0f0f0;
  padding: 8px;
  margin: 4px 0;
  cursor: pointer;
}

.column.v-move {
  transition: transform 0.3s ease;
}

.task.v-move {
  transition: transform 0.3s ease;
}
</style>
