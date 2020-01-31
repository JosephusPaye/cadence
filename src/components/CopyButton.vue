<template>
  <FeedbackButton
    ref="button"
    :color="color"
    :toggled="toggled"
    :label="label"
    :data-clipboard-text="content"
  />
</template>

<script>
import Clipboard from 'clipboard';
import FeedbackButton from './FeedbackButton.vue';

export default {
  name: 'copy-button',

  components: {
    FeedbackButton,
  },

  props: {
    color: String,
    toggled: Boolean,
    label: String,
    content: String,
  },

  mounted() {
    this.clipboard = new Clipboard(this.$refs.button.$el);
    this.clipboard.on('success', () => {
      this.$refs.button.setLabel('Copied!');
    });
    this.clipboard.on('error', () => {
      this.$refs.button.setLabel('Copy failed');
    });
  },

  beforeDestroy() {
    if (this.clipboard) {
      this.clipboard.destroy();
    }
  },
};
</script>
