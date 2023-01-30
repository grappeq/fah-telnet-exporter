function normalizePort(val: string) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

export default {
    fahAuthPassword: process.env.FAH_AUTH_PASSWORD || undefined,
    metricPrefix: process.env.METRIC_PREFIX || 'fah_',
    httpServerPort: normalizePort(process.env.PORT || '3003'),
};