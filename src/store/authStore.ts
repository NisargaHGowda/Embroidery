import { create } from "zustand";
import { supabase } from "../lib/supabase";

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  is_admin?: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  // 🔹 Fetch logged-in user (on refresh)
  fetchUser: async () => {
    set({ loading: true });

    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      set({
        user: {
          id: data.user.id,
          email: data.user.email ?? "",
          full_name: data.user.user_metadata?.full_name,
          phone_number: data.user.user_metadata?.phone_number,
        },
      });
    } else {
      set({ user: null });
    }

    set({ loading: false });
  },

  // 🔹 SIGN UP (NO CONFIRMATION EMAIL)
  signUp: async (email, password, fullName, phoneNumber) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
        },
      },
    });

    if (error) {
      set({ loading: false });
      throw error;
    }

    // 🚨 SAFETY CHECK
    if (!data.user) {
      set({ loading: false });
      throw new Error("Signup failed. Try again.");
    }

    const user = data.user;

    // ✅ CREATE PROFILE ROW
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        is_admin: false, // default user
      });

    if (profileError) {
      set({ loading: false });
      throw profileError;
    }

    set({ loading: false });
  },

  // 🔹 SIGN IN
  signIn: async (email, password) => {
    set({ loading: true, error: null });

    const { data, error } =
      await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      set({ loading: false });
      throw error;
    }

    set({
      user: {
        id: data.user.id,
        email: data.user.email ?? "",
      },
      loading: false,
    });
  },

  // 🔹 RESET PASSWORD (optional)
  resetPassword: async (email) => {
    set({ loading: true, error: null });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) {
      set({ loading: false });
      throw error;
    }

    set({ loading: false });
  },

  // 🔹 SIGN OUT
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));

// import { create } from "zustand";
// import { supabase } from "../lib/supabase";

// interface User {
//   id: string;
//   email: string;
//   full_name?: string;
//   phone_number?: string;
// }

// interface AuthState {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
//   fetchUser: () => Promise<void>;
//   signUp: (
//     email: string,
//     password: string,
//     fullName: string,
//     phoneNumber: string
//   ) => Promise<void>;
//   signIn: (email: string, password: string) => Promise<void>;
//   resetPassword: (email: string) => Promise<void>;
//   signOut: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   loading: false,
//   error: null,

//   // 🔹 Fetch session user (used on refresh)
//   fetchUser: async () => {
//     set({ loading: true });
//     const { data } = await supabase.auth.getUser();

//     if (data?.user) {
//       set({
//         user: {
//           id: data.user.id,
//           email: data.user.email ?? "",
//           full_name: data.user.user_metadata?.full_name,
//           phone_number: data.user.user_metadata?.phone_number,
//         },
//       });
//     } else {
//       set({ user: null });
//     }

//     set({ loading: false });
//   },

//   // 🔹 SIGN UP (NO AUTO LOGIN)
//   signUp: async (email, password, fullName, phoneNumber) => {
//     set({ loading: true, error: null });

//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name: fullName,
//           phone_number: phoneNumber,
//         },
//       },
//     });

//     // 🚨 EMAIL ALREADY EXISTS CASE
//     if (!data?.user && !error) {
//       set({ loading: false });
//       throw new Error("User already registered");
//     }

//     if (error) {
//       set({ loading: false });
//       throw error;
//     }

//       const user = data.user;

//   // ✅ CREATE PROFILE ROW (IMPORTANT)
//   const { error: profileError } = await supabase
//     .from("profiles")
//     .insert({
//       id: user.id,
//       is_admin: false, // default user
//     });

//   if (profileError) {
//     set({ loading: false });
//     throw profileError;
//   }

//     set({ loading: false });
//   },

//   // 🔹 SIGN IN
//   signIn: async (email, password) => {
//     set({ loading: true, error: null });

//     const { data, error } =
//       await supabase.auth.signInWithPassword({ email, password });

//     if (error) {
//       set({ loading: false });
//       throw error;
//     }

//     set({
//       user: {
//         id: data.user.id,
//         email: data.user.email ?? "",
//       },
//       loading: false,
//     });
//   },

//   resetPassword: async (email: string) => {
//   set({ loading: true, error: null });

//   const { error } = await supabase.auth.resetPasswordForEmail(email, {
//     redirectTo: "http://localhost:5173/reset-password",
//   });

//   if (error) {
//     set({ loading: false });
//     throw error;
//   }

//   set({ loading: false });
// },

//   // 🔹 SIGN OUT
//   signOut: async () => {
//     await supabase.auth.signOut();
//     set({ user: null });
//   },
// }));
