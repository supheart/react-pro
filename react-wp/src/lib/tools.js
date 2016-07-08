class Tool {
	constructor() {}

	getRangeRandom(start, end) {
		return Math.ceil((Math.random() * (end - start) + start));
	}

	get30DegRandom() {
		return (Math.random() > 0.5 ? '+' : '-') + Math.ceil(Math.random() * 30);
	}
}

export default Tool;