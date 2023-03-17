import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  user: null, // userId, age
  loading: false,
  hasErrors: false,
  test: 'a',
  abortContoller: null,
  // abort
  loginUser: async () => {
    if (get().loading) return;
    set(() => ({ hasErrors: false, loading: true })); // , user: null
    try {
      const userId = 'user123';
      const age = 11;
      await fetch('https://httpbin.org/get');
      await new Promise((r) => setTimeout(r, 1500));
      set({
        loading: false,
        user: { userId, age },
      });
      set({ test: 'b' });
    } catch (e) {
      set(() => ({ hasErrors: true, loading: false, user: null }));
    }
  },
  updateUser: async (newAge) => {
    if (get().loading) return; // TBD if state still loading, abort?

    // if (get().abortController) {
    //   get().abortController.abort();
    //   set(() => ({ abortController: null }));
    // }

    const controller = new AbortController();
    const TimeoutMs = 2000; // set to very small to cause timeout abort
    setTimeout(() => controller.abort(), TimeoutMs);

    console.log('updateUser', newAge);
    set(() => ({ hasErrors: false, loading: true }));
    try {
      await fetch('https://httpbin.org/get', {
        signal: controller.signal,
      });
      await new Promise((r) => setTimeout(r, 1500));
      set((state) => ({
        loading: false,
        user: {
          ...state.user,
          age: newAge,
        },
        test: 'cc',
      }));
      set({ test: 'c' });

      console.log('done');
    } catch (e) {
      if (e.name == 'AbortError') {
        // handle abort()
        alert('Aborted!');
      } else {
      }
      console.log(e.toString());
      set(() => ({ hasErrors: true, loading: false }));
    }
  },
  logoutUser: () => set({ user: null }),
}));

export default useUserStore;
