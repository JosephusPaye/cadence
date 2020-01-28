<template>
  <button
    :class="
      `cursor-pointer px-4 py-1 ${
        color === 'primary'
          ? 'bg-pink-500 active:bg-pink-700'
          : 'bg-gray-500 active:bg-gray-700'
      }`
    "
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    color: String,
  },
};
</script>
