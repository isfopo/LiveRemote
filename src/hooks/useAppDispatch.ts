import { useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export const useAppDispatch = () =>
  useDispatch<ThunkDispatch<RootState, null, Action>>();
