import { render, screen } from "@testing-library/react";
import Loading from ".";

describe("Loading", () => {
  const renderLoading = () => {
    return render(<Loading />);
  };

  it("should render correctly", () => {
    const { asFragment } = renderLoading();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should display element correctly", () => {
    renderLoading();

    expect(screen.getByTestId("loading")).toBeVisible();
  });
});
