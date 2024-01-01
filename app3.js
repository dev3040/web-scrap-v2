const puppeteer = require('puppeteer');

async function scrapeAttendanceData(headless = true) {
  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();

  try {
    // Navigate to the login page
    await page.goto('http://ips-workspace.itpathsolutions.com:88/login');

    // Enter login credentials and submit the form
    await page.type('#username', 'devangp_itpath');
    await page.type('#password', 'Devang@30');
    await page.click('.btn-primary');

    // Wait for the login to complete
    await page.waitForNavigation();

    // Navigate to the attendance page
    // You may need to add additional waiting logic here if the navigation is not instant

    // Use page.evaluate to make an HTTP request in the context of the page
    const apiUrl = 'http://ips-workspace.itpathsolutions.com:88/attendance/get?date=2024-01-01';
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


// Example usage with headless mode set to true
// const jsonAttendanceData = await scrapeAttendanceData();
// console.log('Attendance Data:', jsonAttendanceData);
scrapeAttendanceData().then(res=>{
    console.log(res.attendanceTable.punchTable);
})

// Example usage with headless mode set to false
// const jsonAttendanceData = await scrapeAttendanceData(false);
// console.log('Attendance Data:', jsonAttendanceData);
