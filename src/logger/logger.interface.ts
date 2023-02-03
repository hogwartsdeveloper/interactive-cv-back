export interface ILogger {
	logger: unknown;
	log: (...arg: unknown[]) => void;
	error: (...arg: unknown[]) => void;
	warn: (...arg: unknown[]) => void;
}
