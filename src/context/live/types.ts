import { IncomingMessage } from "../../types/socket";

export type LiveState = {
	song: Song;
};

export type Song = {
	is_playing: number;
	record_mode: number;
};

export interface LiveActions {
	update: IncomingMessage;
	reset: null;
}
