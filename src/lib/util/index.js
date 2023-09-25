import { computed } from "vue";

export const truncateText = (text, limit) => text.length > 100 ? text.substring(0, limit) + "..." : text;

// Calculate the minimum date and time as the current date and time
export const getMinDateTime = computed(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
});