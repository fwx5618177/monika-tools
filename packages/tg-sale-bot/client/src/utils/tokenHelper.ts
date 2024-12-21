import store, { RootState } from "@store/store";

export const getTokenFromStore = (): string | null | undefined => {
  const state: RootState = store.getState();
  return state.auth.token;
};
