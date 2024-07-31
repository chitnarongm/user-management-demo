const fs = require("fs");
import { PrivateUser, UserData } from "@/typings/model";
import { genSaltSync, hashSync } from "bcrypt";
import { v4 as uuidv4 } from "uuid";

let users: PrivateUser[] = require("../../../data/users.json");

const saveData = () => {
  fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 4));
};

const hashPasswordByName = (name: string) => {
  const salt = genSaltSync(10);
  return hashSync(`${name}pass`, salt);
};

const getAll = (limit: number, offset: number) => {
  const total = users.length;
  const start = Math.min(total - 1, offset);
  const end = Math.min(total, offset + limit);

  return {
    users: users.slice(start, end) as UserData[],
    total,
    limit,
    offset,
  };
};

const create = (user: UserData) => {
  const newUser: PrivateUser = {
    ...user,
    id: uuidv4(),
    password: hashPasswordByName(user.name),
  };

  users.unshift(newUser);

  saveData();
};

const find = (email: string): PrivateUser | undefined => {
  const tagetUser = users.find((item) => item.email === email);
  return tagetUser;
};

const update = (updatedUser: UserData) => {
  const tagetUser = users.find((item) => item.id === updatedUser.id);

  const newUser: PrivateUser = {
    ...updatedUser,
    password: hashPasswordByName(updatedUser.name),
  };

  if (tagetUser) {
    Object.assign(tagetUser, newUser);
    saveData();
  }
};

const remove = (id: string) => {
  users = users.filter((user) => user.id !== id);
  saveData();
};

export const userService = {
  getAll,
  create,
  update,
  remove,
  find,
};
