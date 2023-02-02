export class Local {
	constructor(private readonly _code: string, private readonly _name: LocalName) {}

	get code(): string {
		return this._code;
	}

	get name(): LocalName {
		return this._name;
	}
}

type LocalName = { en: string; kz: string; ru: string };
