<template>
  <button
    @click="$emit('click', $event)"
    :class="
      `cursor-pointer px-4 py-1 ${
        color === 'primary'
          ? toggled
            ? 'bg-pink-600 active:bg-pink-600'
            : 'bg-pink-500 active:bg-pink-700'
          : toggled
          ? 'bg-gray-700 active:bg-gray-700 text-white'
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
    toggled: Boolean,
  },
};
</script>
