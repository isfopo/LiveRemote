import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
