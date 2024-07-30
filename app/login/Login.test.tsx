import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInResponse, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { openToast } from "../components/Toast";
import LogIn from "./page";

jest.mock("next-auth/react");
jest.mock("next/navigation");
jest.mock("../components/Toast");

describe("Login", () => {
  const renderLogin = () => {
    return render(<LogIn />);
  };

  it("should render correctly", () => {
    const { asFragment } = renderLogin();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display information correctly", () => {
    renderLogin();

    expect(screen.getByTestId("login-page-title")).toHaveTextContent("Log In");

    expect(screen.getByTestId("login-email-label")).toHaveTextContent("Email");
    expect(screen.getByTestId("login-email-input")).toHaveDisplayValue("");

    expect(screen.getByTestId("login-password-label")).toHaveTextContent("Password");
    expect(screen.getByTestId("login-password-input")).toHaveDisplayValue("");

    expect(screen.getByTestId("login-submit-button")).toHaveTextContent("Log In");
  });

  describe("Email Field", () => {
    it("should validate required error correctly", async () => {
      renderLogin();

      await userEvent.click(screen.getByTestId("login-submit-button"));

      expect(screen.getByTestId("login-email-error")).toHaveTextContent("email is a required field");
    });

    it("should validate email pattern correctly", async () => {
      renderLogin();

      await userEvent.type(screen.getByTestId("login-email-input"), "invalid..email..pattern");

      await userEvent.click(screen.getByTestId("login-submit-button"));

      expect(screen.getByTestId("login-email-error")).toHaveTextContent("Invalid Email Format.");
    });
  });

  describe("Password Field", () => {
    it("should validate required error correctly", async () => {
      renderLogin();

      await userEvent.click(screen.getByTestId("login-submit-button"));

      expect(screen.getByTestId("login-password-error")).toHaveTextContent("password is a required field");
    });

    it("should validate password length correctly", async () => {
      renderLogin();

      await userEvent.type(screen.getByTestId("login-password-input"), "12345");

      await userEvent.click(screen.getByTestId("login-submit-button"));

      expect(screen.getByTestId("login-password-error")).toHaveTextContent("Password length must be more than 6.");
    });

    it("should display password visibility correctly", async () => {
      renderLogin();

      expect(screen.getByTestId("login-password-input")).toHaveAttribute("type", "password");

      await userEvent.click(screen.getByTestId("password-visibility-icon"));

      expect(screen.getByTestId("login-password-input")).toHaveAttribute("type", "text");

      await userEvent.click(screen.getByTestId("password-visibility-icon"));

      expect(screen.getByTestId("login-password-input")).toHaveAttribute("type", "password");
    });
  });

  describe("Login Action", () => {
    const replaceMock = jest.fn();

    beforeEach(() => {
      jest.mocked(useRouter).mockReturnValue({ replace: replaceMock } as any);
      jest.mocked(signIn).mockResolvedValue({ ok: true } as SignInResponse);
    });

    it("should redirect to /user-management page when login success", async () => {
      renderLogin();

      await userEvent.type(screen.getByTestId("login-email-input"), "mail@mail.com");
      await userEvent.type(screen.getByTestId("login-password-input"), "123456");

      await userEvent.click(screen.getByTestId("login-submit-button"));

      expect(replaceMock).toHaveBeenCalledWith("/user-management");
      expect(openToast).not.toHaveBeenCalled();
    });

    it("should still be in login page and display toast error when login failed with status 401", async () => {
      jest.mocked(signIn).mockRejectedValue({ status: 401 } as SignInResponse);

      renderLogin();

      await userEvent.type(screen.getByTestId("login-email-input"), "mail@mail.com");
      await userEvent.type(screen.getByTestId("login-password-input"), "123456");

      await userEvent.click(screen.getByTestId("login-submit-button"));

      expect(replaceMock).not.toHaveBeenCalled();
      expect(openToast).toHaveBeenCalledWith("Log In Failed with Invalid Email or Password.");

      expect(screen.getByTestId("login-email-input")).toHaveDisplayValue("mail@mail.com");
      expect(screen.getByTestId("login-password-input")).toHaveDisplayValue("123456");
    });

    it("should still be in login page and display toast error when login failed with other error", async () => {
      jest.mocked(signIn).mockRejectedValue({ error: "Login Other Error" } as SignInResponse);

      renderLogin();

      await userEvent.type(screen.getByTestId("login-email-input"), "mail@mail.com");
      await userEvent.type(screen.getByTestId("login-password-input"), "123456");

      await userEvent.click(screen.getByTestId("login-submit-button"));

      expect(replaceMock).not.toHaveBeenCalled();
      expect(openToast).toHaveBeenCalledWith(JSON.stringify("Login Other Error"));

      expect(screen.getByTestId("login-email-input")).toHaveDisplayValue("mail@mail.com");
      expect(screen.getByTestId("login-password-input")).toHaveDisplayValue("123456");
    });
  });
});
