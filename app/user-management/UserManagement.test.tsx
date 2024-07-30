import { makeStore } from "@/lib/store";
import { renderWithProviders } from "@/testUtils/mockReduxStore";
import { mockUsers } from "@/testUtils/testUtils";
import { RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { deleteUserDelete, getUsersList, patchUserUpdate, putUserCreate } from "../../lib/features/users/userApis";
import UserManagement from "./page";

jest.mock("../../lib/features/users/userApis");

describe("UserManagement", () => {
  const mockStore = makeStore();
  let dom: RenderResult;

  beforeEach(() => {
    jest.mocked(getUsersList).mockResolvedValue({ data: mockUsers(21, 10, 0) } as any);
  });

  const renderUserManagement = () => {
    dom = renderWithProviders(<UserManagement />, { store: mockStore });
    return dom;
  };

  const triggerSearchTable = async () => {
    dom.rerender(<UserManagement />);
    await waitFor(() => {
      expect(screen.getByTestId("user-data-table")).toBeVisible();
      expect(screen.getAllByRole("user-data-table-row")).toHaveLength(21);
    });
  };

  it("should render correctly", async () => {
    const { asFragment } = renderUserManagement();
    await triggerSearchTable();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display information correctly", async () => {
    renderUserManagement();
    await triggerSearchTable();

    expect(screen.getByTestId("create-user-button")).toBeVisible();
    expect(screen.getByTestId("user-data-table-pagination")).toHaveTextContent("1–10 of 21");
  });

  it("should render empty table when user list is empty", async () => {
    jest.mocked(getUsersList).mockResolvedValue({ data: mockUsers(0, 0, 0) } as any);

    renderUserManagement();
    await triggerSearchTable();

    expect(screen.getByTestId("no-user-data")).toHaveTextContent("No rows");
    expect(screen.getByTestId("user-data-table-pagination")).toHaveTextContent("0–0 of 0");
  });

  it("should reload table when create user success", async () => {
    jest.mocked(putUserCreate).mockResolvedValue({ message: "Create User Success" } as any);

    renderUserManagement();
    await triggerSearchTable();

    await userEvent.click(screen.getByTestId("create-user-button"));

    await waitFor(() => {
      expect(screen.getByTestId("user-create-dialog")).toBeVisible();
    });

    await userEvent.type(screen.getByTestId("user-create-name-input"), "username");
    await userEvent.type(screen.getByTestId("user-create-email-input"), "mock@email.com");
    await userEvent.click(screen.getByTestId("user-create-role-select"));
    await userEvent.click(screen.getByTestId("user-create-role-select-item-0"));

    await userEvent.click(screen.getByTestId("user-create-confirm-button"));

    expect(putUserCreate).toHaveBeenCalledWith({
      email: "mock@email.com",
      id: "mockuuidv4",
      name: "username",
      role: "user",
    });

    await waitFor(() => {
      expect(screen.queryByTestId("user-create-dialog")).not.toBeInTheDocument();
    });

    expect(getUsersList).toHaveBeenCalled();
    expect(getUsersList).toHaveBeenCalledTimes(2);
  });

  it("should reload table when update user success", async () => {
    jest.mocked(patchUserUpdate).mockResolvedValue({ message: "Update User Success" } as any);

    renderUserManagement();
    await triggerSearchTable();

    await userEvent.click(screen.getByTestId("edit-icon-action-0"));

    await waitFor(() => {
      expect(screen.getByTestId("user-edit-dialog")).toBeVisible();
    });

    expect(screen.getByTestId("user-edit-name-input")).toHaveDisplayValue("user0");
    expect(screen.getByTestId("user-edit-email-input")).toHaveDisplayValue("user0@mail.com");
    expect(screen.getByTestId("user-edit-role-select")).toHaveTextContent("User");

    await userEvent.click(screen.getByTestId("user-edit-confirm-button"));

    expect(patchUserUpdate).toHaveBeenCalledWith({
      email: "user0@mail.com",
      id: "0",
      name: "user0",
      role: "user",
    });

    await waitFor(() => {
      expect(screen.queryByTestId("user-edit-dialog")).not.toBeInTheDocument();
    });

    expect(getUsersList).toHaveBeenCalled();
    expect(getUsersList).toHaveBeenCalledTimes(2);
  });

  it("should reload table when delete user success", async () => {
    jest.mocked(deleteUserDelete).mockResolvedValue({ message: "Delete User Success" } as any);

    renderUserManagement();
    await triggerSearchTable();

    await userEvent.click(screen.getByTestId("edit-icon-action-0"));

    await waitFor(() => {
      expect(screen.getByTestId("user-edit-dialog")).toBeVisible();
    });

    await userEvent.click(screen.getByTestId("user-edit-delete-button"));

    expect(deleteUserDelete).toHaveBeenCalledWith("0");

    await waitFor(() => {
      expect(screen.queryByTestId("user-edit-dialog")).not.toBeInTheDocument();
    });

    expect(getUsersList).toHaveBeenCalled();
    expect(getUsersList).toHaveBeenCalledTimes(2);
  });
});
