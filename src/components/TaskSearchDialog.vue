<template>
  <v-dialog v-model="internalDialogVisible" max-width="700" persistent>
    <v-card>
      <v-card-title>Search Task</v-card-title>
      <v-card-text>
        <!-- Task search form goes here -->
        <v-text-field
          v-model="searchObj.searchText"
          label="Search by Task Title, Description & Label"
        ></v-text-field>
        <v-text-field
          v-model="searchObj.dateTime"
          label="Date and Time"
          outlined
          type="datetime-local"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="searchTask">Search</v-btn>
        <v-btn color="error" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from "vue";
import { useTaskStore } from "@/store/taskStore";

export default {
  props: {
    dialogVisible: Boolean,
  },
  emits: ["close-dialog"],

  setup(props, { emit }) {

    const taskStore = useTaskStore();
   
    const searchObj = ref({
      searchText: "",
      dateTime: "",
      description: "",
      label: ""
    });
    const searchResult = ref([]);

    const internalDialogVisible = ref(false);

    // When the dialogVisible prop changes, update the internal state
    watch(
      () => props.dialogVisible,
      (newValue) => {
        internalDialogVisible.value = newValue;
      }
    );

    const searchTask = () => {
      // Validate and search the task
      if (
        searchObj.value.searchText ||
        searchObj.value.description ||
        searchObj.value.dateTime ||
        searchObj.value.label
      ) {
        searchResult.value = taskStore.tasksArr.filter(
          (task) =>
            (searchObj.value.searchText &&
              (task.title.includes(searchObj.value.searchText) ||
                task.label.includes(searchObj.value.searchText) ||
                task.description.includes(searchObj.value.searchText))) ||
            (searchObj.value.dateTime &&
              task.dateTime === searchObj.value.dateTime)
        );

        closeDialog(null, true);
      }
    };

    const closeDialog = (_event, isFromSearchSubmit = false) => {
      searchObj.value = {};
      // Emit the close-dialog event
      emit("close-dialog", searchResult.value, isFromSearchSubmit);
    };

    return {
      internalDialogVisible,
      searchObj,
      searchTask,
      closeDialog,
    };
  },
};
</script>
