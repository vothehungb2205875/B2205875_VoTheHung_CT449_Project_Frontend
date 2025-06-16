import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    reader: null,
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
      this.reader = null;
    },
    async fetchUser() {
      try {
        const AuthService = (await import("@/services/auth.service")).default;
        this.user = await AuthService.getCurrentUser();
      } catch (err) {
        this.user = null;
      }
    },
    async fetchReader() {
      try {
        const ReaderService = (await import("@/services/reader.service"))
          .default;
        if (this.user?._id) {
          const result = await ReaderService.getReaderById(this.user._id);
          this.reader = result;
        }
      } catch (err) {
        this.reader = null;
      }
    },
    async logout() {
      const AuthService = (await import("@/services/auth.service")).default;
      await AuthService.logout();
      this.clearUser();
      localStorage.removeItem("user");
    },
  },
});
