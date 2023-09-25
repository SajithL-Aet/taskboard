<template>
  <v-dialog v-model="internalDialogVisible" max-width="700" persistent>
    <v-card>
      <v-card-title>Create Task</v-card-title>
      <v-card-text>
        <!-- Task creation form goes here -->
        <v-text-field v-model="newTask.title" label="Task Name"></v-text-field>
        <v-textarea
          v-model="newTask.description"
          label="Enter task description"
          outlined
          rows="5"
        ></v-textarea>
        <v-select
          v-model="newTask.status"
          label="Status"
          :items="statusOptions"
        ></v-select>
        <v-text-field
          v-model="newTask.dateTime"
          label="Date and Time"
          outlined
          type="datetime-local"
          :min="getMinDateTime"
        ></v-text-field>
        <v-autocomplete
          v-model="newTask.label"
          :items="items"
          label="Select an item"
        ></v-autocomplete>
        <!-- Display uploaded attachment if available -->
        <v-card v-if="newTask.fileName" class="mb-4">
          <v-card-title>Uploaded Attachment:</v-card-title>
          <v-card-text>
            <p>{{ newTask.fileName }}</p>
          </v-card-text>
        </v-card>
        <!-- File input -->
        <v-file-input
          label="Select a file"
          outlined
          @change="handleFileChange"
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="addTask" :disabled="!isValid()"
          >Add</v-btn
        >
        <v-btn color="error" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useTaskStore } from "@/store/taskStore";
import { getMinDateTime } from "../lib/util";

export default {
  props: {
    dialogVisible: Boolean,
  },

  setup(props, { emit }) {
    const taskStore = useTaskStore();

    const newTask = ref({
      title: "",
      description: "",
      status: "",
      dateTime: "",
      label: "",
    });

    const internalDialogVisible = ref(false);

    const statusOptions = ["pending", "processing", "done"];

    const items = ["Low", "Medium", "High"];

    // When the dialogVisible prop changes, update the internal state
    watch(
      () => props.dialogVisible,
      (newValue) => {
        internalDialogVisible.value = newValue;
      }
    );

    const isValid = () =>
      newTask.value.title &&
      newTask.value.description &&
      newTask.value.status &&
      newTask.value.dateTime &&
      newTask.value.label;

    // Function to handle file change
    const handleFileChange = (event) => {
      const file = event.target.files[0]; // Extract the selected file from the event

      if (file) {
        newTask.value = {
          ...newTask.value,
          fileName: file.name,
        };
      }
    };

    const addTask = () => {
      // Validate and add the task
      if (isValid()) {
        newTask.value.id = uuidv4();
        taskStore.addTask(newTask.value);
        newTask.value = {};
        closeDialog();
      }
    };

    const closeDialog = () => {
      newTask.value = {};
      // Emit the close-dialog event
      emit("close-dialog");
    };

    return {
      internalDialogVisible,
      newTask,
      statusOptions,
      items,
      getMinDateTime,
      addTask,
      closeDialog,
      handleFileChange,
      isValid,
    };
  },
};
</script>
