import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PackageInfo,
  PackageItem,
  RegionItem,
  UserInfo,
  UserPackageInfo,
} from "@interfaces/api";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { submitPoints } from "./submitPoints";
import { getUserPackagesInfoAsync } from "./getUserPackagesInfo";
import { message } from "@components/MessageProvider";

interface AuthState {
  isAuthenticated: boolean;
  tonAddress?: string;
  userInfo?: UserInfo;
  packageInfo?: (UserPackageInfo & PackageInfo)[];
  userPackageInfo?: (UserPackageInfo & PackageInfo)[];
  token?: string | null;
  tokenTime?: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface InfoState {
  countriesInfo: RegionItem[];
  packagesInfo: PackageItem[];
  selectedPackagesInfo?: PackageItem;
  payOrderId?: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userInfo: undefined,
  token: null,
  tokenTime: null,
  status: "idle",
  error: null,
  packageInfo: [],
};

const initialInfoState: InfoState = {
  countriesInfo: [],
  packagesInfo: [],
  selectedPackagesInfo: undefined,
  payOrderId: undefined,
  status: "idle",
  error: null,
};

// 创建 authSlice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        userInfo: UserInfo;
        token: string;
        tokenTime: string;
      }>
    ) {
      state.isAuthenticated = true;
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      state.tokenTime = action.payload.tokenTime;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.tonAddress = undefined;
      state.userInfo = undefined;
      state.token = null;
      state.tokenTime = null;
    },
    updateUserInfo(state, action: PayloadAction<UserInfo>) {
      state.userInfo = action.payload;
    },
    updateTonAddress(state, action: PayloadAction<string | undefined>) {
      state.tonAddress = action.payload;
    },
    updatePackageInfo(
      state,
      action: PayloadAction<(UserPackageInfo & PackageInfo)[]>
    ) {
      state.packageInfo = action.payload;
    },
    updateUserPackageInfo(
      state,
      action: PayloadAction<(UserPackageInfo & PackageInfo)[]>
    ) {
      state.userPackageInfo = action.payload;
    },
    updateStatus(
      state,
      action: PayloadAction<"idle" | "loading" | "succeeded" | "failed">
    ) {
      state.status = action.payload;
    },
    updateFollowTask(state, action: PayloadAction<boolean>) {
      state.userInfo = {
        ...state.userInfo!,
        twitterFollowed: action.payload,
      };
    },
    updateDailyTask(state, action: PayloadAction<string>) {
      state.userInfo = {
        ...state.userInfo!,
        lastCheckInDate: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPoints.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitPoints.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.userInfo = state.userInfo
          ? { ...state.userInfo, userId: action.payload.userId }
          : undefined;
      })
      .addCase(submitPoints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(getUserPackagesInfoAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.packageInfo = action.payload;
      })
      .addCase(getUserPackagesInfoAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(getUserPackagesInfoAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      });
  },
});

export const selectIsTokenValid = (state: RootState): boolean => {
  const tokenTime = state.auth.tokenTime;
  if (!tokenTime) return false;

  const currentTime = new Date().getTime();
  return currentTime < Number(tokenTime);
};

// 创建 infoSlice
const infoSlice = createSlice({
  name: "info",
  initialState: initialInfoState,
  reducers: {
    updateCountriesInfo(state, action: PayloadAction<RegionItem[]>) {
      state.countriesInfo = action.payload;
    },
    updatePackagesInfo(state, action: PayloadAction<PackageItem[]>) {
      state.packagesInfo = action.payload;
    },
    updateSelectedPackagesInfo(state, action: PayloadAction<PackageItem>) {
      state.selectedPackagesInfo = action.payload;
    },
    updatePayOrderId(state, action: PayloadAction<string>) {
      state.payOrderId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserPackagesInfoAsync.pending, (state) => {
        state.packagesInfo = [];
        state.status = "loading";
      })
      .addCase(getUserPackagesInfoAsync.fulfilled, (state, action) => {
        state.packagesInfo = action.payload as unknown as PackageItem[];
        state.status = "succeeded";
      })
      .addCase(getUserPackagesInfoAsync.rejected, (state, action) => {
        message.error(`Failed to fetch packages: ${action.payload}`);
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  login,
  logout,
  updateUserInfo,
  updateTonAddress,
  updatePackageInfo,
  updateUserPackageInfo,
  updateStatus,
  updateFollowTask,
  updateDailyTask,
} = authSlice.actions;

export const {
  updateCountriesInfo,
  updatePackagesInfo,
  updateSelectedPackagesInfo,
  updatePayOrderId,
} = infoSlice.actions;

// 持久化配置
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "isAuthenticated",
    "userInfo",
    "token",
    "tokenTime",
    "tonAddress",
  ],
};

const infoPersistConfig = {
  key: "info",
  storage,
  whitelist: ["countriesInfo"],
};

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);
const persistedInfoReducer = persistReducer(
  infoPersistConfig,
  infoSlice.reducer
);

// 配置store
const store = configureStore({
  reducer: {
    auth: persistedReducer,
    info: persistedInfoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
