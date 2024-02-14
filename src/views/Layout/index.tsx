import { Outlet } from "react-router-dom";
import { DialogManager } from "../../components/dialogs/DialogManager";
import styles from "./index.module.scss";

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <DialogManager />
      <Outlet />
    </div>
  );
};
