import { Button } from "../button"

export default {
  title: "UI/Button",
  component: Button,
}

export const Primary = {
  render: () => <Button>Button</Button>,
}
export const Outline = {
  render: () => <Button variant="outline">Outline</Button>,
}