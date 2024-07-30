import { deleteUserDelete, patchUserUpdate, putUserCreate } from "@/lib/features/users/userApis";
import { makeStore } from "@/lib/store";
import { renderWithProviders } from "@/testUtils/mockReduxStore";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserActionDialog, { UserActionDialogProps } from ".";
import { openToast } from "../../Toast";

jest.mock("../../../../lib/features/users/userApis");
jest.mock("../../Toast");

describe("UserActionDialog", () => {
  let props: UserActionDialogProps;
  let store = makeStore();

  beforeEach(() => {
    props = {
      isOpen: true,
      onClose: jest.fn(),
      dialogTitle: "Dialog Title",
      confirmButtonText: "Confirm;",
    };
  });

  const renderUserActionDialog = () => {
    return renderWithProviders(<UserActionDialog {...props} />, { store });
  };

  it("should render correctly", () => {
    const { baseElement } = renderUserActionDialog();

    expect(baseElement).toMatchSnapshot();
  });

  describe("Create User", () => {
    beforeEach(() => {
      props.dialogTitle = "Create User";
      props.confirmButtonText = "Create";
    });

    it("should display information correctly", async () => {
      renderUserActionDialog();

      expect(screen.getByTestId("user-create-dialog")).toBeVisible();
      expect(screen.getByTestId("user-create-title")).toHaveTextContent("Create User");
      expect(screen.getByTestId("user-create-close-button")).toBeVisible();

      expect(screen.getByTestId("user-create-name-label")).toHaveTextContent("Name");
      expect(screen.getByTestId("user-create-name-input")).toHaveDisplayValue("");
      expect(screen.getByTestId("user-create-name-error")).toBeEmptyDOMElement();

      expect(screen.getByTestId("user-create-email-label")).toHaveTextContent("Email");
      expect(screen.getByTestId("user-create-email-input")).toHaveDisplayValue("");
      expect(screen.getByTestId("user-create-email-error")).toBeEmptyDOMElement();

      expect(screen.getByTestId("user-create-role-label")).toHaveTextContent("Role");
      expect(screen.getByTestId("user-create-role-input")).toHaveDisplayValue("");
      expect(screen.getByTestId("user-create-role-error")).toBeEmptyDOMElement();

      await userEvent.click(screen.getByTestId("user-create-role-select"));

      expect(screen.getByTestId("user-create-role-select-item-0")).toHaveTextContent("User");
      expect(screen.getByTestId("user-create-role-select-item-1")).toHaveTextContent("Moderator");
      expect(screen.getByTestId("user-create-role-select-item-2")).toHaveTextContent("Admin");

      expect(screen.queryByTestId("user-create-delete-button")).not.toBeInTheDocument();
      expect(screen.getByTestId("user-create-confirm-button")).toHaveTextContent("Create");
    });

    it("should create user successfully when click create button", async () => {
      renderUserActionDialog();

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

      expect(props.onClose).toHaveBeenCalled();
      expect(openToast).not.toHaveBeenCalled();
    });

    it("should not close dialog when create user failed", async () => {
      jest.mocked(putUserCreate).mockRejectedValue({ message: "Create User Error" });

      renderUserActionDialog();

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

      expect(props.onClose).not.toHaveBeenCalled();
      expect(openToast).toHaveBeenCalledWith("Create User Failed.");
    });

    it("should call onClose prop when click close button", async () => {
      renderUserActionDialog();

      await userEvent.click(screen.getByTestId("user-create-close-button"));

      expect(props.onClose).toHaveBeenCalled();
    });
  });

  describe("Update and Delete User", () => {
    beforeEach(() => {
      props.mode = "edit";
      props.dialogTitle = "Update User";
      props.confirmButtonText = "Update";
      props.userData = {
        id: "mockprefilleduserid",
        name: "prefilledusername",
        email: "prefilled@email.com",
        role: "moderator",
      };
    });

    it("should display prefilled information correctly", async () => {
      renderUserActionDialog();

      expect(screen.getByTestId("user-edit-dialog")).toBeVisible();
      expect(screen.getByTestId("user-edit-title")).toHaveTextContent("Update User");
      expect(screen.getByTestId("user-edit-close-button")).toBeVisible();

      expect(screen.getByTestId("user-edit-name-label")).toHaveTextContent("Name");
      expect(screen.getByTestId("user-edit-name-input")).toHaveDisplayValue("prefilledusername");
      expect(screen.getByTestId("user-edit-name-error")).toBeEmptyDOMElement();

      expect(screen.getByTestId("user-edit-email-label")).toHaveTextContent("Email");
      expect(screen.getByTestId("user-edit-email-input")).toHaveDisplayValue("prefilled@email.com");
      expect(screen.getByTestId("user-edit-email-error")).toBeEmptyDOMElement();

      expect(screen.getByTestId("user-edit-role-label")).toHaveTextContent("Role");
      expect(screen.getByTestId("user-edit-role-select")).toHaveTextContent("Moderator");
      expect(screen.getByTestId("user-edit-role-error")).toBeEmptyDOMElement();

      await userEvent.click(screen.getByTestId("user-edit-role-select"));

      expect(screen.getByTestId("user-edit-role-select-item-0")).toHaveTextContent("User");
      expect(screen.getByTestId("user-edit-role-select-item-1")).toHaveTextContent("Moderator");
      expect(screen.getByTestId("user-edit-role-select-item-2")).toHaveTextContent("Admin");

      expect(screen.queryByTestId("user-edit-delete-button")).not.toBeInTheDocument();
      expect(screen.getByTestId("user-edit-confirm-button")).toHaveTextContent("Update");
    });

    it("should update user successfully when click update button", async () => {
      renderUserActionDialog();

      await userEvent.click(screen.getByTestId("user-edit-confirm-button"));

      expect(patchUserUpdate).toHaveBeenCalledWith({
        email: "prefilled@email.com",
        id: "mockprefilleduserid",
        name: "prefilledusername",
        role: "moderator",
      });

      expect(props.onClose).toHaveBeenCalled();
      expect(openToast).not.toHaveBeenCalled();
    });

    it("should not close dialog when update user failed", async () => {
      jest.mocked(patchUserUpdate).mockRejectedValue({ message: "Update User Error" });

      renderUserActionDialog();

      await userEvent.click(screen.getByTestId("user-edit-confirm-button"));

      expect(patchUserUpdate).toHaveBeenCalledWith({
        email: "prefilled@email.com",
        id: "mockprefilleduserid",
        name: "prefilledusername",
        role: "moderator",
      });

      expect(props.onClose).not.toHaveBeenCalled();
      expect(openToast).toHaveBeenCalledWith("Edit User Failed.");
    });

    it("should display delete button when isDeleteAllowed prop is true and delete user successfully when click delete button", async () => {
      props.isDeleteAllowed = true;

      renderUserActionDialog();

      expect(screen.getByTestId("user-edit-delete-button")).toHaveTextContent("Delete");

      await userEvent.click(screen.getByTestId("user-edit-delete-button"));

      expect(deleteUserDelete).toHaveBeenCalledWith("mockprefilleduserid");
      expect(props.onClose).toHaveBeenCalled();
      expect(openToast).not.toHaveBeenCalled();
    });

    it("should not close dialog when delete user failed", async () => {
      jest.mocked(deleteUserDelete).mockRejectedValue({ message: "Delete User Error" });
      props.isDeleteAllowed = true;

      renderUserActionDialog();

      expect(screen.getByTestId("user-edit-delete-button")).toHaveTextContent("Delete");

      await userEvent.click(screen.getByTestId("user-edit-delete-button"));

      expect(deleteUserDelete).toHaveBeenCalledWith("mockprefilleduserid");
      expect(props.onClose).not.toHaveBeenCalled();
      expect(openToast).toHaveBeenCalledWith("Delete User Failed.");
    });
  });

  describe("Validation", () => {
    it("should validate required fields correctly", async () => {
      renderUserActionDialog();

      await userEvent.click(screen.getByTestId("user-create-confirm-button"));

      expect(screen.getByTestId("user-create-name-error")).toHaveTextContent("name is a required field");
      expect(screen.getByTestId("user-create-email-error")).toHaveTextContent("email is a required field");
      expect(screen.getByTestId("user-create-role-error")).toHaveTextContent("role is a required field");
    });

    it("should validate email pattern correctly", async () => {
      renderUserActionDialog();

      await userEvent.type(screen.getByTestId("user-create-email-input"), "invalid..email..pattern");

      await userEvent.click(screen.getByTestId("user-create-confirm-button"));

      expect(screen.getByTestId("user-create-email-error")).toHaveTextContent("Invalid Email Format.");
    });
  });
});
