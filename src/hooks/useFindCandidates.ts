import { useCallback, useEffect } from "react";
import {
	Candidate,
	IncomingMessage,
	Method,
	Status,
} from "../context/socket/types";
import { useSocketContext } from "../context/socket/useSocketContext";
import { range } from "../helpers/arrays";

export interface UseFindCandidatesOptions {
	/** If set to true, it will automatically find sockets */
	auto?: boolean;
	port?: number;
	base?: string;
	low?: number;
	high?: number;
}

export const useFindCandidates = ({
	auto = false,
	port = 8000,
	base = "192.168.1",
	low = 0,
	high = 255,
}: UseFindCandidatesOptions = {}) => {
	const { dispatch } = useSocketContext();

	const find = async () => {
		const promises: Promise<Candidate>[] = [];

		for (const ip in range(high - low, low)) {
			promises.push(
				new Promise((resolve, reject) => {
					try {
						const socket = new WebSocket(`ws://${base}.${ip}:${port}`);

						socket.onopen = () => {
							// onConnect?.();
						};

						socket.onmessage = (e) => {
							const message = JSON.parse(e.data) as IncomingMessage;

							if (
								message.method === Method.AUTH &&
								message.address === "/socket" &&
								message.prop === "info" &&
								message.status === Status.SUCCESS &&
								socket
							) {
								resolve({
									url: socket.url,
									name: message.result as string,
								});
								socket.close();
							} else {
								reject();
							}
						};
						socket.onerror = () => {
							reject();
						};
					} catch {
						reject();
					}
				}),
			);
		}

		const candidate = await Promise.any(promises); // Only handles first socket found

		dispatch({
			type: "found",
			payload: [candidate],
		});
	};

	useEffect(() => {
		if (auto) {
			find();
		}
	}, []);

	const connect = useCallback((candidate: Candidate) => {
		// open socket connection here
		const socket = new WebSocket(candidate.url);

		// add event listeners
		socket.onopen = () => {
			console.log("opened");
		};
		socket.onmessage = (e) => {
			console.log("message", e.data);
		};
		socket.onclose = () => {
			console.log("closed");
		};
		socket.onerror = () => {
			console.log("error");
		};

		dispatch({
			type: "connect",
			payload: {
				...candidate,
				socket,
			},
		});
	}, []);

	return { find, connect };
};
