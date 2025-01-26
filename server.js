
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;


const placeArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 100, 200, 300, 400, 500, 1000, 2000, 3000, 4000, 5000, 10000, 20000, 30000, 40000, 50000, 100000];


const browser = await puppeteer.launch();

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Example API endpoint
app.get('/api/data', async (req, res) => {
    try {
        const page = await browser.newPage();
        await page.goto('https://sekai.best/eventtracker');

        await page.setViewport({ width: 1080, height: 1024 });

        await page.waitForSelector('.MuiFormGroup-root > * > * > * :nth-child(1)');

        await page.click('.MuiFormGroup-root > * > * > * :nth-child(1)');

        const tableData = await page.$$eval('.MuiTable-root tbody tr', rows =>
            rows.map(row => {
                return Array.from(row.children).map(cell => cell.innerText);
            })
        );

        const result = []
        tableData.forEach((item, i) => {
            if (i % 2 == 0) {
                item.shift()
                item[0] = placeArray[i / 2];
                result.push(item)
            }
        });

        let final = result.filter((item) => {
            return item[0] === 500 || item[0] === 1000;
        });
        res.json(final);
    } catch (e) {
        console.log(e)
        await browser.close();
        res.status(500).json(e);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});