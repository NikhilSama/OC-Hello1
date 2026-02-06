import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it('renders "Hello, World!" text', () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Hello, World!");
  });

  it("renders as a main landmark", () => {
    render(<Home />);
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
});
