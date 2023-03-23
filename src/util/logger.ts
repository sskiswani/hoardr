const colors = {
  log: '#03A9F4',
  info: '#00E5FF',
  error: '#E91E63'
};

const TAG = '📡:ssk';

function getStyle(color: string) {
  return [`%c[${TAG}]`, `color: #000; font-size: 13px; font-weight: bold; background:${color}`];
}

function createLogger() {
  const info: typeof console.log = globalThis.console.info.bind(globalThis.console, ...getStyle(colors.info));
  const error: typeof console.log = globalThis.console.error.bind(globalThis.console, ...getStyle(colors.error));
  const log: typeof console.log = globalThis.console.log.bind(globalThis.console, ...getStyle(colors.log));

  return Object.assign(log, { error, info });
}

const logger = createLogger();
export default logger;
