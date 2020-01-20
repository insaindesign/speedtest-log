const FastSpeedtest = require("fast-speedtest-api");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: './logs.csv',
    header: [
        {id: 'date', title: 'DATE'},
        {id: 'download', title: 'DOWNLOAD'}
    ],
    append: true
});
 
const speedtest = new FastSpeedtest({
    token: 'YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm',
    unit: FastSpeedtest.UNITS.Mbps
});

const date = new Date().toISOString();
console.log(`Checking speed`, date);
speedtest.getSpeed().catch(e => {
    console.log('Error:', e.message);
    return -1;
}).then(download => {
    console.log(`Speed: `, download);
    csvWriter.writeRecords([{ download, date }]).then(() => {
        process.exit();
    });
});