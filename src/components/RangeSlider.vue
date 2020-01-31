<template>
  <input
    class="range-slider"
    type="range"
    :value="value"
    @input="onInput"
    :min="min"
    :max="max"
    :step="step"
  />
</template>

<script>
export default {
  name: 'RangeSlider',
  props: {
    value: Number,
    min: Number,
    max: Number,
    step: Number,
  },
  methods: {
    onInput(e) {
      this.$emit('input', Number(e.target.value));
    },
  },
};
</script>

<style lang="scss" scoped>
.range-slider {
  @apply appearance-none bg-transparent w-full m-0 cursor-pointer;
  height: 20px;

  &::-webkit-slider-runnable-track {
    @apply w-full rounded-none bg-blue-400;
    height: 5px;
  }

  &::-webkit-slider-thumb {
    @apply rounded-full appearance-none bg-white;
    height: 20px;
    width: 20px;
    margin-top: -8px;
  }

  &::-moz-range-track {
    @apply w-full rounded-none bg-blue-400;
    height: 5px;
  }

  &::-moz-range-thumb {
    @apply rounded-full border-0 bg-white;
    height: 20px;
    width: 20px;
  }

  &::-ms-track {
    @apply w-full rounded-none bg-blue-400;
    height: 5px;
  }

  &::-ms-thumb {
    @apply rounded-full appearance-none bg-white;
    height: 20px;
    width: 20px;
    margin-top: 0;
  }
}
</style>
