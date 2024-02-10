import { Outlet } from "react-router-dom";
import { DialogManager } from "../../components/dialogs/DialogManager";

export const Layout = () => {
  return (
    <>
      <DialogManager />
      <Outlet />
    </>
  );
};
