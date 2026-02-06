import { metadata } from "./layout";

describe("RootLayout metadata", () => {
  it('has title "Hello World"', () => {
    expect(metadata.title).toBe("Hello World");
  });

  it("has a description", () => {
    expect(metadata.description).toBe(
      "A minimal Next.js Hello World application"
    );
  });
});
