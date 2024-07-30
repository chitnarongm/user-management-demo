import { renderWithProviders } from "@/testUtils/mockReduxStore";
import { UserData } from "@/typings/model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserActionIconRenderer from ".";

describe("UserActionIconRenderer", () => {
  let props: GridRenderCellParams<UserData>;

  beforeEach(() => {
    props = {
      id: "mockid",
      row: { name: "mockusername", email: "mockemail@mail.com", id: "mockid", role: "user" },
      field: "fieldName",
    } as GridRenderCellParams<UserData>;
  });

  const renderUserActionIconRenderer = () => {
    return renderWithProviders(<UserActionIconRenderer {...props} />);
  };

  it("should render correctly", () => {
    const { asFragment } = renderUserActionIconRenderer();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display icon correctly", () => {
    renderUserActionIconRenderer();

    expect(screen.getByTestId("edit-icon-fieldName-mockid")).toBeVisible();
  });

  it("should open user edit dialog and display prefilled user value when click edit icon", async () => {
    renderUserActionIconRenderer();

    await userEvent.click(screen.getByTestId("edit-icon-fieldName-mockid"));

    expect(screen.getByTestId("user-edit-dialog")).toBeVisible();

    expect(screen.getByTestId("user-edit-name-input")).toHaveDisplayValue("mockusername");
    expect(screen.getByTestId("user-edit-email-input")).toHaveDisplayValue("mockemail@mail.com");
    expect(screen.getByTestId("user-edit-role-select")).toHaveTextContent("User");
  });
});
