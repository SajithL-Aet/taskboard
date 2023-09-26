<template>
  <v-dialog v-model="internalDialogVisible" max-width="700" persistent>
    <v-card>
      <v-card-title>Edit Task</v-card-title>
      <v-card-text>
        <!-- Task edit form goes here -->
        <v-text-field v-model="formData.title" label="Task Name"></v-text-field>
        <v-textarea
          v-model="formData.description"
          label="Enter task description"
          outlined
          rows="5"
        ></v-textarea>
        <v-select
          v-model="formData.status"
          label="Status"
          :items="statusOptions"
        ></v-select>
        <v-text-field
          v-model="formData.dateTime"
          label="Date and Time"
          outlined
          type="datetime-local"
          :min="getMinDateTime"
        ></v-text-field>
        <v-autocomplete
          v-model="formData.label"
          :items="items"
          label="Select an item"
        ></v-autocomplete>
        <!-- Display uploaded attachment if available -->
        <v-card v-if="formData.fileName" class="mb-4">
          <v-card-title>Uploaded Attachment:</v-card-title>
          <v-card-text>
            <p>{{ formData.fileName }}</p>
          </v-card-text>
        </v-card>
        <!-- File input -->
        <v-file-input
          label="Select a file"
          outlined
          @change="handleFileChange"
        ></v-file-input>
        <v-textarea
          v-model="formData.comment"
          label="Enter your comment"
          outlined
          rows="5"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="editTask" :disabled="!isValid()"
          >Edit</v-btn
        >
        <v-btn color="error" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useTaskStore } from "@/store/taskStore";
import { useRouter } from "vue-router";
import { getMinDateTime } from "../lib/util";

export default {
  props: {
    dialogVisible: Boolean,
    selectedTask: Object,
  },
  emits: ["close-dialog"],

  setup(props, { emit }) {
    const taskStore = useTaskStore();
    const router = useRouter();

    // Define a data property to hold the form data
    const formData = ref({
      title: "",
      description: "",
      status: "",
      dateTime: "",
      label: "",
      fileName: "",
      comment: "",
    });

    const statusOptions = ["pending", "processing", "done"];
    const items = ["Low", "Medium", "High"];

    const isEditUrlContainsTask = window.location.pathname.indexOf("/task/");

    // Extract the substring after the /task/ from url
    const taskId = window.location.pathname.substring("/task/".length);

    // Define a computed property isShowPopupComputed based on the conditions (check whether existing task or edit dialog should appear)
    const isShowPopupComputed = computed(() => {
      return isExistingTask() || props.dialogVisible; // if it's existing task only edit popup should appear.
    });

    // Use isShowPopupComputed to initialize the model variable of popup
    const internalDialogVisible = computed({
      get: () => isShowPopupComputed.value,
      set: (value) => {
        isShowPopupComputed.value = value;
      },
    });

    // task data retrieval can happen either from prop via popup or the directly visiting the task edit page using url
    const getTaskData = () => {
      return (
        props.selectedTask ||
        taskStore.tasksArr.find((task) => task.id === taskId)
      );
    };
    const selectedTaskComputed = computed(() => getTaskData());

    watch(
      [() => selectedTaskComputed.value, () => props.dialogVisible],
      ([newSelectedTaskComputedValue]) => {
        // Update formData based on the changes
        formData.value = {
          ...newSelectedTaskComputedValue,
        };
      },
      { immediate: true }
    );

    const isExistingTask = () => {
      if (isEditUrlContainsTask !== -1) {
        // if edit url is contains /task/
        if (taskId && taskStore.tasksArr.find((task) => task.id === taskId)) {
          return true;
        } else {
          //console.log("Search string not found in the main string."); // page not found
          return false;
        }
      } else {
        //console.log("Search string not found in the main string."); // page not found
        return false;
      }
    };

    const isValid = () =>
      formData.value.title &&
      formData.value.description &&
      formData.value.status &&
      formData.value.dateTime &&
      formData.value.label;

    const editTask = () => {
      // Validate and edit the task
      if (
        formData.value.title &&
        formData.value.description &&
        formData.value.status &&
        formData.value.dateTime &&
        formData.value.label
      ) {
        taskStore.editTask(formData.value);
        closeDialog();
      }
    };

    const closeDialog = () => {
      window.location.pathname.includes("/task")
        ? router.push("/")
        : emit("close-dialog");
    };

    // Function to handle file change
    const handleFileChange = (event) => {
      const file = event.target.files[0]; // Extract the selected file from the event

      if (file) {
        formData.value = {
          ...formData.value,
          fileName: file.name,
        };
      }
    };

    return {
      internalDialogVisible,
      formData,
      statusOptions,
      items,
      getMinDateTime,
      editTask,
      closeDialog,
      handleFileChange,
      isValid,
    };
  },
};
</script>
