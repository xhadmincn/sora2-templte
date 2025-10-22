import { defineStore, storeToRefs } from 'pinia'

import UserStore from "./user";
export const useUserStore = defineStore('user', UserStore)

import WebConfigStore from "./webconfig";
export const useWebConfigStore = defineStore('webconfig', WebConfigStore)

export const useRefs = (store) => {
    return storeToRefs(store);
}