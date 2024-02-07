import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";

export const ModalManager = () => {
    const { activeModal } = useSelector((s: RootState) => s.modals);

    const currentModal = useMemo(() => {
        if (activeModal?.component) {
            return activeModal?.component;
        }
    }, [activeModal]);

    return currentModal;
};