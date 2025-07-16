import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { setToken } from "@/api/auth/helper";

import { AuthState } from "@/interface/store/auth";
import { LoginParams } from "@/interface/user/login";
import UserService from "@/keycloak/userService";

export const loginAction = createAsyncThunk(
  "auth/login",
  async ({}, { dispatch, rejectWithValue }) => {
    try {
      // Use Keycloak login instead of API
      await UserService.doLogin();

      // After successful login, get user info
      dispatch(getInfoAction());

      return { success: true };
    } catch (err: any) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);
export const logoutAction = createAsyncThunk("auth/logout", async () => {
  // Use Keycloak logout instead of API
  await UserService.doLogout();
  return { success: true };
});
export const getInfoAction = createAsyncThunk("auth/me", async () => {
  // Use Keycloak to get user info instead of API
  const isLoggedIn = UserService.isLoggedIn();

  if (!isLoggedIn) {
    throw new Error("User is not authenticated");
  }

  // Extract user info from Keycloak token
  const userInfo = await UserService.getUserInfo();

  // Return user info in the expected format
  return userInfo;
});
export const getInitData = createAsyncThunk(
  "auth/init",
  async (_, { dispatch }) => {
    // Use Keycloak to check if user is logged in
    if (UserService.isLoggedIn()) {
      dispatch(getInfoAction());
    } else {
      dispatch(loginAction());
    }
  }
);

export const loginReduces = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(loginAction.pending, (state) => {
      state.loading = true;
      state.errorMessage = "";
    })
    .addCase(loginAction.fulfilled, (state) => {
      state.loading = false;
      state.logged = true;
    })
    .addCase(loginAction.rejected, (state, action: any) => {
      state.loading = false;
      state.logged = false;
    });
};
export const getInfoReduces = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(getInfoAction.pending, (state) => {
      state.loadingInfo = true;
    })
    .addCase(getInfoAction.fulfilled, (state, action) => {
      state.loadingInfo = false;
      state.currentUser = action.payload;
    })
    .addCase(getInfoAction.rejected, (state) => {
      state.loadingInfo = false;
      state.logged = false;
      state.currentUser = undefined;
      setToken("");
    });
};
export const logoutReduces = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(logoutAction.rejected, (state) => {
      logoutState(state);
    })
    .addCase(logoutAction.fulfilled, (state) => {
      logoutState(state);
    });
};

export function logoutState(state: AuthState) {
  state.currentUser = undefined;
  state.errorMessage = "";
  state.logged = false;
  state.loading = false;
  // Clear token using Keycloak instead of setToken
  setToken("");
}
