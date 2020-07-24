<template>
  <div class="cover-image" @click="$emit('click')">
    <img v-if="isSingleImage" :src="singleImage" :alt="title" :title="title" />
    <div v-else class="mozaic" :title="title">
      <img v-for="image of images" :key="image" :src="image" :alt="title" />
    </div>
    <div>
      <h6 class="title">{{ title }}</h6>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cover-image',
  props: {
    title: { type: String, required: true },
    image: { type: String },
    images: { type: Array },
    subtitle: { type: String, required: true },
  },
  computed: {
    singleImage() {
      return this.image || this.images[0];
    },
    isSingleImage() {
      return this.images === undefined || this.images === null || this.images.length === 1;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/vars.scss';

.cover-image {
  @include flex-box($justify: space-around, $direction: column);

  height: 13.3rem;
  width: 10rem;

  img {
    height: 10rem;
    width: 10rem;
    border-radius: 5%;
    user-select: none;
    cursor: pointer;
  }
  .mozaic {
    height: 10rem;
    width: 10rem;
    border-radius: 5%;
    display: grid;
    grid-template: 1fr 1fr / 1fr 1fr;
    overflow: hidden;

    img {
      height: 5rem;
      width: 5rem;
    }
  }

  div {
    @include flex-box($direction: column);
  }
}

.title {
  font-size: 1rem;
  white-space: nowrap;
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subtitle {
  color: $subtext;
  font-size: $subtext-size;
}
</style>