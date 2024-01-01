const express = require('express');
const puppeteer = require('puppeteer');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use(express.json()); // Use express.json() for parsing JSON bodies
app.use(cookieParser());

// Function to extract _token and cookies from the HTML response
async function scrapeAttendanceData(username, password, date) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the login page
    await page.goto('http://ips-workspace.itpathsolutions.com:88/login');

    // Enter login credentials and submit the form
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('.btn-primary');

    // Wait for the login to complete
    await page.waitForNavigation();

    // Navigate to the attendance page
    // You may need to add additional waiting logic here if the navigation is not instant

    // Use page.evaluate to make an HTTP request in the context of the page
    const apiUrl = `http://ips-workspace.itpathsolutions.com:88/attendance/get?date=${date}`;
    const attendanceData = await page.evaluate(async (url) => {
      const response = await fetch(url);
      return response.json();
    }, apiUrl);

    // Return the JSON data from the API response
    return attendanceData;
  } catch (error) {
    console.error('An error occurred:', error);
    return null; // Return null in case of an error
  } finally {
    // Close the browser
    await browser.close();
  }
}

app.post('/login', async (req, res) => {
  const { username, password, date } = req.body;
  console.log('username, password: ', username, password);

  try {
    const data = await scrapeAttendanceData(username, password, date);
    res.json(data);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
