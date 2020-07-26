import { remote } from 'electron';
import path from 'path';
import fs from 'fs';

const state = {
  folderStored: remote.app.getPath('music'),
  jumpAhead: 15,
  seekAhead: 5,
  seekBack: 5,
  jumpBack: 15,
  controlWindow: false,
  animations: true,
  hasChanges: false,
};

const configPath = path.join(remote.app.getPath('userData'), 'config.json');

const updateFile = settings => fs.promises.writeFile(configPath, JSON.stringify(settings));

const mutations = {
  load(state, settings) {
    state.animations = settings.animations;
    state.controlWindow = settings.controlWindow;
    state.folderStored = settings.folderStored;
    state.jumpAhead = settings.jumpAhead;
    state.jumpBack = settings.jumpBack;
    state.seekAhead = settings.seekAhead;
    state.seekBack = settings.seekBack;
  },
  toggleAnimations(state) {
    state.animations = !state.animations;
    updateFile(state);
  },
  toggleControlWindow(state) {
    state.controlWindow = !state.controlWindow;
    updateFile(state);
  },
  changeJumpBack(state, delta) {
    state.jumpBack += delta;
    state.hasChanges = true;
  },
  changeSeekBack(state, delta) {
    state.seekBack += delta;
    state.hasChanges = true;
  },
  changeSeekAhead(state, delta) {
    state.seekAhead += delta;
    state.hasChanges = true;
  },
  changeJumpAhead(state, delta) {
    state.jumpAhead += delta;
    state.hasChanges = true;
  },
  finishChanges(state) {
    state.hasChanges = false;
  },
  setFolderStored(state, folderStored) {
    state.folderStored = folderStored;
    updateFile();
  },
};

const actions = {
  async load({ commit }) {
    const buffer = await fs.promises.readFile(configPath);
    const settings = JSON.parse(buffer.toString());
    commit('load', settings);
  },
  async updateChanges({ commit, state }) {
    await updateFile(state);
    commit('finishChanges');
  },
};

export default {
  state,
  mutations,
  actions,
  namespaced: true,
};
