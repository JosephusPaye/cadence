<template>
  <Button :color="color" :toggled="toggled" @click="$emit('click', $event)">{{
    currentLabel
  }}</Button>
</template>

<script>
import Button from './Button.vue';

export default {
  name: 'feedback-button',

  components: {
    Button,
  },

  props: {
    color: String,
    toggled: Boolean,
    label: String,
  },

  data() {
    return {
      currentLabel: this.label,
    };
  },

  beforeDestroy() {
    if (this.labelTimeout) {
      clearTimeout(this.labelTimeout);
      this.labelTimeout = undefined;
    }
  },

  methods: {
    setLabel(label) {
      this.currentLabel = label;

      if (this.labelTimeout) {
        clearTimeout(this.labelTimeout);
        this.labelTimeout = undefined;
      }

      this.labelTimeout = setTimeout(() => {
        this.currentLabel = this.label;
        this.labelTimeout = undefined;
      }, 2000);
    },
  },
};
</script>
