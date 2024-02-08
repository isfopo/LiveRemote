import { Outlet } from "react-router-dom";

export interface RemoteProps {}

export const Remote = ({}: RemoteProps) => {
  // put socket hook here to keep in memory

  return (
    <>
      <Outlet />
    </>
  );
};
