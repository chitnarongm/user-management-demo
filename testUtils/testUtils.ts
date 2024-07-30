import { UserResponse } from "@/typings/model";

export const mockUsers = (length: number, limit: number, offset: number): UserResponse => {
  return {
    users: Array.from(Array(length)).map((item, index) => {
      return {
        id: index.toString(),
        name: `user${index}`,
        email: `user${index}@mail.com`,
        role: "user",
      };
    }),
    limit,
    offset,
    total: length,
  };
};
