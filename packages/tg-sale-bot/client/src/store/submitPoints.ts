import { submitPointsApi } from "@apis/request_api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, updateUserInfo } from "@store/store";

// 异步提交积分的 thunk
export const submitPoints = createAsyncThunk(
  "auth/submitPoints",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const userId = state.auth.userInfo?.userId;

    try {
      const response = await submitPointsApi({ userId });

      // 更新用户信息
      dispatch(updateUserInfo({ ...response, integral: response?.integral }));

      return response;
    } catch (error) {
      console.error("Failed to submit points:", error);
      rejectWithValue(error);
      throw error;
    }
  }
);
