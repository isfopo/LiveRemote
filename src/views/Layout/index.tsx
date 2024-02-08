import { Outlet } from "react-router-dom";
import { YStack } from "tamagui";

export const Layout = () => {
  return (
    <YStack>
      <Outlet />
    </YStack>
  );
};
