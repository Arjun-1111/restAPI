import logger from 'pino';
import dayjs from 'dayjs';

// config details of pino can be found on npm

const log = logger({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  base: {
    pid: false,
  },
  timestamp: () => `, "time": "${dayjs().format()}"`,
});

export default log;
