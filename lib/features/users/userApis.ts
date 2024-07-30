import { LogInForm, UserData, UserResponse } from "@/typings/model";
import axios from "axios";

export const userAxios = axios.create();

export const getUsersList = (offset: number, limit: number) => {
  return userAxios.get<UserResponse>("/api/users", {
    params: { limit, offset },
  });
};

export const putUserCreate = (userData: UserData) => {
  return userAxios.put("/api/users/create", userData);
};

export const patchUserUpdate = (userData: UserData) => {
  return userAxios.patch("/api/users/update", userData);
};

export const deleteUserDelete = (id: string) => {
  return userAxios.delete(`/api/users/delete/${id}`);
};

export const postLogin = (loginData?: LogInForm) => {
  return userAxios.post("http://localhost:3000/api/login", loginData);
};
