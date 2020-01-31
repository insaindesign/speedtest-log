const FastSpeedtest = require("fast-speedtest-api");
const fetch = require('isomorphic-fetch');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: './logs.csv',
    header: [
        {id: 'date', title: 'DATE'},
        {id: 'download', title: 'DOWNLOAD'},
        {id: 'error', title: 'ERROR'}
    ],
    append: true
});

const speedtest = new FastSpeedtest({
    token: 'YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm',
    unit: FastSpeedtest.UNITS.Mbps
});

const pingPromise = host => {
    console.log('Pinging:', host);
    return fetch('http://'+host).then(response => response.status === 200).catch(() => false);
};

const hosts = ['google.com', 'fast.com'];
const pingAllHosts = () => Promise.all(hosts.map(pingPromise)).then(responses => {
    if (!responses[0]) {
        throw new Error('Could not connect to google.com');
    }
    if (!responses[1]) {
        throw new Error('Could not connect to fast.com');
    }
});

const date = new Date().toISOString();
console.log('Speedtest-log', date)
pingAllHosts().then(() => {
    console.log(`Checking speed at fast.com`);
    return speedtest.getSpeed();
}).catch(e => {
    console.log("Terminated with error", e);
    return csvWriter.writeRecords([{ date, download: -1, error: e.message }]).then(() => {
        process.exit(e);
    });
}).then(download => {
    console.log('Speed:', download);
    csvWriter.writeRecords([{ download, date }]).then(() => {
        process.exit();
    });
});