import { createAsyncThunk } from "@reduxjs/toolkit";
import { updatePackageInfo } from "./store";
import { getUserPackagesInfo } from "@apis/request_api";

export const getUserPackagesInfoAsync = createAsyncThunk(
  "auth/getUserPackagesInfo",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await getUserPackagesInfo();
      dispatch(updatePackageInfo({ ...response }));
    } catch (error) {
      console.error("Failed to get user packages info:", error);
      return rejectWithValue(error);
    }
  }
);
