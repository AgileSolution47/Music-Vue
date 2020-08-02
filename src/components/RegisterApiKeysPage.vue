<template>
  <div class="scroll-el" id="scroll-el">
    <div class="page">
      <h1 class="header">Register Api Keys</h1>
      <h4>Napster</h4>
      <p class="about">
        This is used to get data, such as title, artist and the album picture,about every Song and
        Album.
      </p>
      <a
        target="_blank"
        href="https://github.com/Lutetium-Vanadium/Music-Flutter/blob/master/docs/apikeys.md#napster"
        class="learn-more"
      >
        Learn More
      </a>
      <span :class="['input', { errored: napsterErrored }]">
        <input
          placeholder="Napster Api Key"
          v-model="napsterApiKey"
          @change="validateNapsterKey"
          @input="napsterErrored = false"
        />
      </span>
      <h4>Firestore (optional)</h4>
      <p class="about">
        This can be used to sync all locally stored metadata about songs up to firebase.
      </p>
      <a
        target="_blank"
        href="https://github.com/Lutetium-Vanadium/Music-Flutter/blob/master/docs/apikeys.md#firebase-optional"
        class="learn-more"
      >
        Learn More
      </a>
      <span class="input">
        <input placeholder="Firestore Project Id" v-model="firestoreProjectId" />
      </span>
      <span class="input">
        <input placeholder="Firestore App Id" v-model="firestoreAppId" />
      </span>
      <span class="input">
        <input placeholder="Firestore Api Key" v-model="firestoreApiKey" />
      </span>

      <p class="disclaimer">
        Make sure the above keys are properly inputed as there is no way to verify. If they are, the
        app will automatically sync to firestore.
      </p>

      <button class="btn" @click="handleClick">
        <component :is="buttonIcon" />
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CheckIcon from 'vue-material-design-icons/Check.vue';

import MaterialLoader from './shared/MaterialLoader.vue';

export default {
  name: 'register-api-keys-page',
  data: () => ({
    state: -1,
    napsterApiKey: '',
    firestoreProjectId: '',
    firestoreAppId: '',
    firestoreApiKey: '',
    napsterErrored: false,
  }),
  computed: {
    buttonText() {
      switch (this.state) {
        case 1:
          return 'Done';
        case 0:
          return 'Verifying';
        default:
          return 'Verify Napster';
      }
    },
    buttonIcon() {
      switch (this.state) {
        case 1:
          return 'check-icon';
        case 0:
          return 'material-loader';
        default:
          return 'span';
      }
    },
  },
  methods: {
    async validateNapsterKey() {
      this.state = 0;

      try {
        const response = await axios.get(
          `https://api.napster.com/v2/?apikey=${this.napsterApiKey.trim()}`
        );

        if (response.status !== 200) {
          throw response.headers.status;
        }

        this.state = 1;
      } catch (e) {
        console.error(e);
        this.napsterErrored = true;
        this.state = -1;
      }
    },
    handleClick() {
      if (this.state === -1) {
        this.validateNapsterKey();
      } else if (this.state === 1) {
        if (
          this.firestoreProjectId.trim().length > 0 &&
          this.firestoreAppId.trim().length > 0 &&
          this.firestoreApiKey.trim().length > 0
        ) {
          this.$store.commit('apiKeys/setKeys', {
            firestoreProjectId: this.firestoreApiKey.trim(),
            firestoreAppId: this.firestoreAppId.trim(),
            firestoreApiKey: this.firestoreApiKey.trim(),
            napster: this.napsterApiKey.trim(),
          });
        } else {
          this.$store.commit('apiKeys/setKeys', {
            napster: this.napsterApiKey.trim(),
          });
        }
        this.$router.go(-1);
      }
    },
  },
  components: {
    CheckIcon,
    MaterialLoader,
  },
};
</script>

<style lang="scss" scoped>
@import '@/vars.scss';

.about {
  font-size: 1.1rem;
  margin: 0.4rem 0;
}

.learn-more {
  color: $accent;
}

.input {
  border-bottom: 3px solid $primary;
  display: block;
  max-width: 500px;
  margin: 0.8rem 0;

  input {
    display: inline-block;
    width: 100%;
    font-size: 0.9rem;
    color: white;

    &::placeholder {
      color: #aaaaaa;
    }
  }

  &::after {
    content: '';
    display: block;
    position: relative;
    left: 50%;
    width: 0%;
    transform: translate(-50%, 3px);
    height: 3px;
    background-color: $accent;
    transition: 0.3s;
  }

  &.errored {
    border-color: red;
  }

  &:focus-within::after,
  &:hover::after {
    width: 100%;
  }
}

h4 {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 0.4rem;
}

.disclaimer {
  border-left: 0.4ch solid $accent;
  color: $subtext;
  padding-left: 1ch;
}

.btn {
  @include flex-box;

  margin: 3rem auto;
  padding: 0;
  width: 16ch;

  .material-design-icon {
    margin-right: 0.5ch;
  }
}
</style>
