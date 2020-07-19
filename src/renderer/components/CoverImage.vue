<template>
  <div class="cover-image">
    <img :src="image" alt="title" />
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
    image: { type: [String, Array], required: true },
    subtitle: { type: String, required: true },
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
  color: #bbbbbb;
  font-size: 0.8rem;
}
</style>