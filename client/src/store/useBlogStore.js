import { create } from "zustand";

const useBlogStore = create((set) => ({
  blogListPage: 1,
  setBlogListPage: (page) => set({ blogListPage: page }),
}));

export default useBlogStore;
