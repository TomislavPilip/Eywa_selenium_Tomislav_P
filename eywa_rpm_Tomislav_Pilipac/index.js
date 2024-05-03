const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
require("dotenv").config();

function getLogMessage(message) {
  return `${new Date().toLocaleTimeString("hr-HR", {
    year: "numeric",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })} ${message}`;
}

//-------LOGIN TO LINKEDIN--------//
async function loginToLinkedIn(driver, email, password) {
  await driver.get("https://www.linkedin.com/");
  await driver.manage().window().maximize();
  await driver
    .wait(until.elementLocated(By.xpath("//input[@id='session_key']"), 2000))
    .sendKeys(email);
  await driver
    .wait(
      until.elementLocated(By.xpath("//input[@id='session_password']"), 2000)
    )
    .sendKeys(password, Key.RETURN);
  await driver.sleep(2000);
}

//-------VIEW PROFILE--------//
async function viewProfile(driver) {
  await driver
    .wait(until.elementLocated(By.xpath("//span[text()='Me']")), 10000)
    .click();

  await driver
    .wait(
      until.elementLocated(
        By.xpath(
          "//div[@class='artdeco-dropdown__content-inner']//a[text()='View Profile']"
        )
      ),
      5000
    )
    .click();
}

//-------OPENING EXPERIENCE PAGE--------//
async function experienceButton(driver) {
  await driver
    .wait(
      until.elementLocated(
        By.xpath("//button[@id='overflow-Add-new-experience']")
      ),
      5000
    )
    .click();

  await driver
    .wait(
      until.elementLocated(
        By.xpath(
          "//div[@class='artdeco-dropdown__content-inner']//*[text()='Add position']"
        )
      ),
      5000
    )
    .click();
}

//-------ADDING TITLE AND COMPANY AND SELECTING MONTH AND YEAR--------//
async function addingExperience(driver, title, companyName) {
  await driver
    .wait(
      until.elementLocated(
        By.xpath("//input[@placeholder='Ex: Retail Sales Manager']")
      ),
      5000
    )
    .sendKeys(title);

  await driver
    .wait(
      until.elementLocated(By.xpath("//input[@placeholder='Ex: Microsoft']")),
      5000
    )
    .sendKeys(companyName);

  await driver
    .wait(until.elementLocated(By.xpath("//select[@name='month']")), 5000)
    .click();
  await driver
    .wait(until.elementLocated(By.xpath("//option[text()='April']")), 5000)
    .click();

  await driver
    .wait(until.elementLocated(By.xpath("//select[@name='year']")), 5000)
    .click();
  await driver
    .wait(until.elementLocated(By.xpath("//option[text()='2024']")), 5000)
    .click();

  await driver
    .wait(
      until.elementLocated(
        By.xpath("//button[@data-view-name='profile-form-save']")
      ),
      5000
    )
    .click();

  await driver
    .wait(
      until.elementLocated(
        By.xpath(
          "//button[@class='artdeco-button artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view']"
        )
      )
    )
    .click();

  await driver
    .wait(
      until.elementLocated(
        By.xpath(
          "//button[@class='align-self-flex-end artdeco-button artdeco-button--2 artdeco-button--primary ember-view']"
        )
      )
    )
    .click();
}

//-------JOB SEARCH--------//
async function searchJobs(driver, job, country) {
  await driver
    .wait(
      until.elementLocated(
        By.xpath("//a[@href='https://www.linkedin.com/jobs/?']")
      ),
      5000
    )
    .click();

  await driver
    .wait(
      until.elementLocated(
        By.xpath("//input[@aria-label='City, state, or zip code']")
      )
    )
    .sendKeys(country);
  await driver
    .wait(
      until.elementLocated(
        By.xpath("//input[@aria-label='Search by title, skill, or company']")
      )
    )
    .sendKeys(job, Key.RETURN);

  await driver.sleep(3000);
}

//-------------SET JOB ALERT-------------//
async function setJobAlert(driver) {
  await driver
    .wait(
      until.elementLocated(By.xpath("//a[@aria-label='Frontend Developer']")),
      5000
    )
    .click();

  {
    /*await driver
    .wait(
      until.elementLocated(
        By.xpath("//div[@class='jobs-search-create-alert__artdeco-toggle']")
      ),
      5000
    )
.click();*/
  }

  await driver.sleep(5000);
}

async function sendMessage(driver, message) {
  await driver
    .wait(
      until.elementLocated(
        By.xpath(
          "//div[@class='overflow-hidden pl2 msg-overlay-list-bubble__convo-card-content']"
        )
      ),
      5000
    )
    .click();

  const writeMessage = await driver.wait(
    until.elementLocated(By.xpath("//div[@aria-label='Write a message…']")),
    5000
  );

  await writeMessage.sendKeys(message, Key.RETURN);

  await driver
    .wait(until.elementLocated(By.xpath("//button[text()='Send']")), 5000)
    .click();

  await driver.sleep(20000);
}

//----------MAIN FUNCTION----------//
(async function seleniumWebdriverLinkedIn() {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const appLogs = [];

  //------Variables for adding new experience------//
  const title = "Junior software engineer";
  const companyName = "Neyho Informatika d.o.o";
  const industry = "Internet";

  //------Variables for adding new job------//
  const job = "Software Developer Intern";
  const country = "Croatia";

  //------Variables for message------//
  const message = "My name is Robert Robotić and this is test message.";
  try {
    await loginToLinkedIn(driver, email, password);
    appLogs.push(getLogMessage("User successfully logged in"));
    //--------------------------------------------------------//

    await viewProfile(driver);
    appLogs.push(getLogMessage("Entered view profile"));

    await experienceButton(driver);
    appLogs.push(getLogMessage("Experience page opened"));

    await addingExperience(driver, title, companyName, industry);
    appLogs.push(
      getLogMessage(
        "Successfully added title: Junior software engineer \n Successfully added company: Neyho Informatika d.o.o \n Successfully added start month and year"
      )
    );
    await searchJobs(driver, job, country);
    appLogs.push(
      getLogMessage(
        "You successfully searched for job: Software Developer Intern"
      )
    );

    //---------STORING DATA IN JSON FILE---------//
    const jobsData = [];

    await driver.wait(
      until.elementLocated(
        By.xpath("//li[contains(@class, 'jobs-search-results__list-item')]")
      ),
      10000
    );
    const jobListings = await driver.findElements(
      By.xpath("//li[contains(@class, 'jobs-search-results__list-item')]")
    );

    for (const jobListing of jobListings) {
      const jobTitleElement = await jobListing.findElement(
        By.xpath(
          ".//div[@class='full-width artdeco-entity-lockup__title ember-view']/a/strong"
        )
      );
      const jobTitle = await jobTitleElement.getText();

      const jobLocationElement = await jobListing.findElement(
        By.xpath(
          ".//div[@class='artdeco-entity-lockup__caption ember-view']/ul/li"
        )
      );

      const jobLocation = await jobLocationElement.getText();

      jobsData.push({
        jobTitle,
        jobLocation,
      });
    }

    fs.writeFileSync("jobs.json", JSON.stringify(jobsData));
    appLogs.push(getLogMessage("You successfully stored jobs in json"));

    await driver.sleep(2000);
    //------------------------------------------------------------------------//

    await setJobAlert(driver);
    appLogs.push(
      getLogMessage(
        "You have successfully set alert for job Frontend Developer"
      )
    );

    await sendMessage(driver, message);
    appLogs.push(
      getLogMessage(
        "You have successfully written and sent message: My name is Robert Robotić and this is test message. "
      )
    );

    await driver.sleep(2000);
  } catch (error) {
    appLogs.push(getLogMessage(`Error occurred ${error.message}`));
  } finally {
    await driver.quit();
    appLogs.push(getLogMessage("Session over"));
    fs.writeFileSync("application.log", appLogs.join("\n"));
  }
})();
