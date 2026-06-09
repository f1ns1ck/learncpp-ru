<script setup>
defineProps({
  ru: {
    type: String,
    required: true,
  },
  original: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <span class="localized" tabindex="0" :data-original="original">{{ ru }}</span>
</template>
