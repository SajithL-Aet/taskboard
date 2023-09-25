<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title class="text-center">Progress</v-card-title>
        <v-progress-linear
          :model-value="getTaskDonePercentage"
          height="25"
          color="green"
        >
          <template v-slot:default="{ value }">
            <strong>
              {{ value }}% (Done {{ getDoneTasksLength() }} out of
              {{ getTotalTasksLength() }})
            </strong>
          </template>
        </v-progress-linear>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { useTaskStore } from "@/store/taskStore";
import { computed } from "vue";

export default {
  setup() {
    const tasksStore = useTaskStore(); // Create an instance from the Pinia store

    const getDoneTasksLength = () =>
      tasksStore.tasksArr.filter((task) => task.status === "done").length;

    const getTotalTasksLength = () => tasksStore.tasksArr.length;

    const getTaskDonePercentage = computed(() => {
      return getTotalTasksLength() > 0
        ? ((getDoneTasksLength() / getTotalTasksLength()) * 100).toFixed(2)
        : 0;
    });

    return {
      getDoneTasksLength,
      getTotalTasksLength,
      getTaskDonePercentage,
    };
  },
};
</script>