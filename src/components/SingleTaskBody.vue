<template>
  <v-row>
    <v-col>
      Task:<br />
      {{ task.title }}
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      Description:<br />
      {{ truncateText(task.description, 100) }}
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      Estimated Time:<br />
      {{ task.dateTime }}
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      Label:<br />
      <v-chip :color="getChipColor(task.label)">
        {{ task.label }}
      </v-chip>
    </v-col>
  </v-row>
  <v-row v-if="task.fileName">
    <v-col>
      Attachment:<br />
      {{ task.fileName }}
    </v-col>
  </v-row>
  <v-row v-if="task.comment">
    <v-col>
      Comment:<br />
      {{ task.comment }}
    </v-col>
  </v-row>
</template>

<script>
import { truncateText } from "../lib/util";

export default {
  props: {
    task: Object,
  },

  setup() {
    const getChipColor = (label) => {
      switch (label) {
        case "Low":
          return "orange";
        case "Medium":
          return "green";
        case "High":
          return "red";
        default:
          break;
      }
    };

    return {
      getChipColor,
      truncateText,
    };
  },
};
</script>