import { createAppSlice } from "@/lib/createAppSlice";
import { UserData } from "@/typings/model";
import { SerializedError } from "@reduxjs/toolkit";
import { deleteUserDelete, getUsersList, patchUserUpdate, putUserCreate } from "./userApis";

export interface UserSliceState {
  users: UserData[];
  isLoading: boolean;
  total: number;
  limit: number;
  offset: number;
  error?: SerializedError;
}

const initialState: UserSliceState = {
  users: [],
  isLoading: false,
  total: 0,
  limit: 10,
  offset: 0,
  error: undefined,
};

export const userSlice = createAppSlice({
  name: "user",
  initialState,
  reducers: (create) => ({
    getUsers: create.asyncThunk(
      async (offset: number) => {
        const response = await getUsersList(offset, 10);
        return response.data;
      },
      {
        pending: (state) => {
          state.error = undefined;
          state.isLoading = true;
        },
        fulfilled: (state, action) => {
          state.error = undefined;
          state.isLoading = false;
          state.users = action.payload.users;
          state.total = action.payload.total;
          state.limit = action.payload.limit;
          state.offset = action.payload.offset;
        },
        rejected: (state, action) => {
          state.error = action.error;
          state.isLoading = false;
          state.users = [...state.users];
        },
      },
    ),
    createUser: create.asyncThunk(
      async (newUser: UserData) => {
        await putUserCreate(newUser);
      },
      {
        pending: (state) => {
          state.error = undefined;
          state.isLoading = true;
        },
        fulfilled: (state) => {
          state.error = undefined;
          state.isLoading = false;
        },
        rejected: (state, action) => {
          state.error = action.error;
          state.isLoading = false;
          state.users = [...state.users];
        },
      },
    ),
    editUser: create.asyncThunk(
      async (updatedUser: UserData) => {
        await patchUserUpdate(updatedUser);
      },
      {
        pending: (state) => {
          state.error = undefined;
          state.isLoading = true;
        },
        fulfilled: (state) => {
          state.error = undefined;
          state.isLoading = false;
        },
        rejected: (state, action) => {
          state.error = action.error;
          state.isLoading = false;
          state.users = [...state.users];
        },
      },
    ),
    deleteUser: create.asyncThunk(
      async (id: string) => {
        await deleteUserDelete(id);
      },
      {
        pending: (state) => {
          state.error = undefined;
          state.isLoading = true;
        },
        fulfilled: (state) => {
          state.error = undefined;
          state.isLoading = false;
        },
        rejected: (state, action) => {
          state.error = action.error;
          state.isLoading = false;
          state.users = [...state.users];
        },
      },
    ),
  }),
  selectors: {
    selectUsers: (state) => state.users,
    selectLoading: (state) => state.isLoading,
    selectTotalUsers: (state) => state.total,
    selectUsersOffset: (state) => state.offset,
    selectUserError: (state) => state.error,
  },
});

export const { getUsers, createUser, editUser, deleteUser } = userSlice.actions;

export const { selectUsers, selectTotalUsers, selectUsersOffset, selectUserError, selectLoading } = userSlice.selectors;
