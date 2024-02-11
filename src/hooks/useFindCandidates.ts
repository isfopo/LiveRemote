import { useEffect, useState } from "react";
import {
	Candidate,
	IncomingMessage,
	Method,
	SocketHost,
	Status,
} from "../context/socket/types";
import { useSocketContext } from "../context/socket/useSocketContext";
import { range } from "../helpers/arrays";

export interface UseFindCandidatesOptions {
	port?: number;
	base?: string;
	low?: number;
	high?: number;
}

export const useFindCandidates = ({
	port = 8000,
	base = "192.168.1",
	low = 0,
	high = 255,
}: UseFindCandidatesOptions) => {
	const [candidates, setCandidates] = useState<SocketHost[]>([]);
	const { dispatch } = useSocketContext();

	useEffect(() => {
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

		find();
	}, []);
};
