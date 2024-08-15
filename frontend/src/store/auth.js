import { create } from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'

const useAuthStore = create((set, get) => ({
    allUserData: null,
    loading: false,

    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
    }),

    setUser: (email) => set({ allUserData: email }),
    setLoading: (loading) => set({ loading }),
    setLoggedIn: () => get().allUserData !== null
}))

/* -> This is typically used in Vite, a build tool that is commonly used with modern frontend frameworks like React, Vue, etc. */
if (import.meta.env.DEV) {
    mountStoreDevtool('AuthStore', useAuthStore)
}

/*
-> This is a Node.js environment variable, commonly used in tools like Webpack, Parcel, or any Node.js-based environment
if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('AuthStore', useAuthStore);
} */


export default useAuthStore;
