export const flip = (value: boolean | number) => {
	if (typeof value === "number") {
		return value === 0 ? 1 : 0;
	}
	return !value;
};
