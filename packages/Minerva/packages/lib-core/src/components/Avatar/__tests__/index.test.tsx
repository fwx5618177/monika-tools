import React from "react";
import { mount, render, shallow } from "enzyme";
import { Avatar, AvatarGroup } from "@components/index";

describe("Avatar", () => {
  it("should support square and circle", () => {
    const circle = shallow(<Avatar />);
    expect(() => circle.unmount()).not.toThrow();
    const square = shallow(<Avatar isSquare />);
    expect(() => square.unmount()).not.toThrow();
  });

  it("should render text element", () => {
    const imageAvatar = render(<Avatar />);
    expect(imageAvatar).toMatchSnapshot();
    const textAvatar = render(<Avatar text="text" />);
    expect(textAvatar).toMatchSnapshot();
  });

  it("should omit long chars automatically", () => {
    const avatar = mount(<Avatar text="texttexttexttext" />);
    const text = avatar.find(".avatarText").text();
    expect(text.length).toBeLessThan(4);
  });

  it("stacked should be work", () => {
    const avatar = shallow(<Avatar src="/images/avatar.png" stacked />);
    expect(() => avatar.unmount()).not.toThrow();
  });
});

describe("AvatarGroup", () => {
  it("group component should render all children", () => {
    const group = mount(
      <AvatarGroup>
        <Avatar />
        <Avatar />
      </AvatarGroup>,
    );
    expect(group.find(".avatar")).toHaveLength(2);
  });

  it("should stacked when avatars are in a group", () => {
    const group = render(
      <AvatarGroup>
        <Avatar />
        <Avatar />
      </AvatarGroup>,
    );
    expect(group).toMatchSnapshot();
  });

  it("should show count in group", () => {
    const count = 20;
    const group = render(<AvatarGroup count={count} />);
    const text = group.find(".count").text();
    expect(text).toMatch(`${count}`);
  });
});
