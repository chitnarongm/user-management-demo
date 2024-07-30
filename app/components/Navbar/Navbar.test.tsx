import { render, screen } from "@testing-library/react";
import * as nextAuth from "next-auth/react";
import Navbar from ".";

describe("Navbar", () => {
  beforeEach(() => {
    jest
      .spyOn(nextAuth, "useSession")
      .mockReturnValue({ data: { user: { email: "mockuser@email.com" } }, status: "authenticated" } as any);
  });
  const renderNavbar = () => {
    return render(<Navbar />);
  };

  it("should render correctly", () => {
    const { asFragment } = renderNavbar();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should display information correctly when user session is existed", () => {
    renderNavbar();

    expect(screen.getByTestId("navbar")).toBeVisible();
    expect(screen.getByTestId("navbar-title")).toHaveTextContent("User Management");
    expect(screen.getByTestId("user-info")).toHaveTextContent("mockuser@email.com");
    expect(screen.getByTestId("logout-button")).toBeVisible();
  });

  it("should not display user info section and logout button when user session is not existed", () => {
    jest.spyOn(nextAuth, "useSession").mockReturnValue({ data: null, status: "unauthenticated" } as any);

    renderNavbar();

    expect(screen.getByTestId("navbar")).toBeVisible();
    expect(screen.getByTestId("navbar-title")).toHaveTextContent("User Management");
    expect(screen.queryByTestId("user-info")).not.toBeInTheDocument();
    expect(screen.queryByTestId("logout-button")).not.toBeInTheDocument();
  });
});
