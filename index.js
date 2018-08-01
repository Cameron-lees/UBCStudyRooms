const puppeteer = require('puppeteer');
const prompt = require('prompt');

var credentials = {
    properties: {
      username: {
        description: 'CWL Username',
        hidden: false
      },
      password: {
        description: 'CWL Password',
        hidden: false
      },
      WebSiteSelection: {
        description: 'Booking Faculty: \nSauder: 1, ICIS: 2',
        hidden: false
      },
      RoomTitleSauder: {
        hidden: false,
        description: 'Booking Title',
        ask: function() {
        return prompt.history('WebSiteSelection').value == 1;
      }
      },
      RoomDescription: {
        hidden: false,
        description: 'Booking Description',
        ask: function() {
        return prompt.history('WebSiteSelection').value == 1;
      }
      },
      WebSiteDate: {
        hidden: false,
        description: 'Booking Date (DD/MM/YYYY)',
        ask: function() {
        return prompt.history('WebSiteSelection').value == 1;
      }
      },
      StartTime: {
        hidden: false,
        description: 'Booking Time (Every 30 mins. Example: 9,930,10,14,1430)',
        ask: function() {
        return prompt.history('WebSiteSelection').value == 1;
      }
      },
      RoomTitleICIS: {
        hidden: false,
        description: 'Booking Title',
        ask: function() {
        return prompt.history('WebSiteSelection').value == 2;
      }
    },
      RoomNumICIS: {
        hidden: false,
        description: 'Booking Room (ICCSX###)',
        ask: function() {
        return prompt.history('WebSiteSelection').value == 2;
      }
    },
      RoomDateICIS: {
        hidden: false,
        description: 'Booking Date (YYYY/MM/DD)',
        ask: function() {
        return prompt.history('WebSiteSelection').value == 2;
        }
      },
      RoomTimeICIS: {
        hidden: false,
        description: 'Booking Time Hour',
        ask: function() {
        return prompt.history('WebSiteSelection').value == 2;
      }
    },
      RoomTimeMinICIS: {
        hidden: false,
        description: 'Booking Time Minutes',
        ask: function() {
          return prompt.history('WebSiteSelection').value == 2;
        }
      },
      RoomTimeAMPMICIS: {
        hidden: false,
        description: 'Booking Time (AM/PM)',
        ask: function() {
        return prompt.history('WebSiteSelection').value == 2;
      }
    }
  }
};



prompt.start();

(async() => {
    var result = await new Promise(function (resolve, reject) {
        prompt.get(credentials, function (err, result) {
            resolve(result);
            console.log(result);
        });
    });
    const width = 2000
    const height = 1000

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--window-size=${ width },${ height }`
        ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width, height });
    var WebSite = result.WebSiteSelection
    if (WebSite == 1)
    {
      await page.goto('https://booking.sauder.ubc.ca/ugr/cwl-login');
      try{
      const usernameField = await page.$('input[name=j_username]');
      await usernameField.click();
      await usernameField.type(result.username);
      await usernameField.dispose();
      const passwordField = await page.$('input[name=j_password]');
      await passwordField.click();
      await passwordField.type(result.password);
      await passwordField.dispose();
      const loginButton = await page.$('input[type=submit]');
      await loginButton.focus();
      await loginButton.click();
      await loginButton.dispose();
      const dateSelect = await page.waitForSelector('input[id=datepicker]');
      await dateSelect.focus();
      for (let i = 0; i < 10; i++){
        await page.keyboard.press('Backspace');
    }
    await dateSelect.type(result.WebSiteDate, {delay: 2});
    const goToButton = await page.$('input[type=submit]');
    await goToButton.focus();
    await goToButton.click();
    await goToButton.dispose();
    const booking = await page.waitForSelector('#day_main > tbody > tr:nth-child(1) > td:nth-child(2) > div > a');
    await booking.focus();
    await booking.click();
    await booking.dispose();
    const RoomName = await page.waitForSelector('#name');
    await RoomName.click();
    await RoomName.type(result.RoomTitleSauder);
    const RoomDesc = await page.waitForSelector('#description');
    await RoomDesc.click();
    await RoomDesc.type(result.RoomDescription);
    var startInHours = result.StartTime
    var startInSec = (startInHours * 3600);
    var startInSecString = startInSec.toString();
    const startTime = await page.select('#start_seconds', startInSecString);
    const RoomSelect = await page.select('#rooms', "11");
    const saveBooking = await page.$('input[name=save_button]');
    await saveBooking.focus();
    await saveBooking.click();
    await saveBooking.dispose();
    console.log('ROOM BOOKED');
    console.log('BOOKING INFO:');
    console.log('Date:',result.WebSiteDate);
    console.log('Time:',result.StartTime);
    console.log('Room: HA 194');

    }
    catch(err)
    {
      console.log('Something went wrong. Please try again');
    }
  }
  if (WebSite == 2)
  {
    await page.goto('https://my.cs.ubc.ca/Shibboleth.sso/Login?target=https%3A%2F%2Fmy.cs.ubc.ca%2F%3Fq%3Dshib_login%2Fuser%2Flogin%26destination%3Dhome');
  try{
      const usernameField2 = await page.$('input[name=j_username]');
      await usernameField2.click();
      await usernameField2.type(result.username);
      await usernameField2.dispose();
      const passwordField2 = await page.$('input[name=j_password]');
      await passwordField2.click();
      await passwordField2.type(result.password);
      await passwordField2.dispose();
      const loginButton3 = await page.$('input[type=submit]');
      await loginButton3.focus();
      await loginButton3.click();
      await loginButton3.dispose();
      const bookRoom = await page.waitForSelector('#mini-panel-dashboard_front_undergrads > div.panel-panel.span3 > div.panel-pane.pane-block.pane-block-4 > div > div.dashboard-toolbar > a:nth-child(2)');
      await bookRoom.focus();
      await bookRoom.click();
      await bookRoom.dispose();
      const roomTitle2 = await page.waitForSelector('#edit-title');
      await roomTitle2.focus();
      await roomTitle2.click();
      await roomTitle2.type(result.RoomTitleICIS);
      const roomNum = await page.waitForSelector('#edit_field_space_project_room_und_chosen > div > div > input');
      await roomNum.focus();
      await roomNum.click();
      await roomNum.type(result.RoomNumICIS);
      const roomNum2 = await page.waitForSelector('#edit_field_space_project_room_und_chosen > div > ul > li');
      await roomNum2.focus();
      await roomNum2.click();
      const roomDate = await page.waitForSelector('#edit-field-date-und-0-value-datepicker-popup-0');
      await roomDate.focus();
      await roomDate.click();
      for( let i = 0; i < 10; ++i) {
        page.keyboard.press('ArrowRight');
      }
      await page.waitFor(2000);
      for (let i = 0; i < 10; ++i) {
        page.keyboard.press('Backspace');
      }
      await roomDate.type(result.RoomDateICIS);
      const roomTime = await page.waitForSelector('#edit-field-date-und-0-value-timeEntry-popup-1');
      await roomTime.focus();
      await roomTime.click();
      for( let i = 0; i < 5; ++i) {
        page.keyboard.press('ArrowLeft');
      }
      await page.waitFor(1000);
      await roomTime.type(result.RoomTimeICIS);
      await roomTime.focus();
      await roomTime.click();
      page.keyboard.press('ArrowRight');
      await page.waitFor(1000);
      await roomTime.type(result.RoomTimeMinICIS);
      page.keyboard.press('ArrowRight');
      await page.waitFor(1000);
      await roomTime.type(result.RoomTimeAMPMICIS);

      const roomTimeEnd = await page.waitForSelector('#edit-field-date-und-0-value2-timeEntry-popup-1');
      await roomTimeEnd.focus();
      await roomTimeEnd.click();
      for( let i = 0; i < 5; ++i) {
        page.keyboard.press('ArrowLeft');
      }
      await page.waitFor(1000);
      var RoomTimeEnd = result.RoomTimeICIS;
      var AMorPM = result.RoomTimeAMPMICIS;
      if (RoomTimeEnd == '12'){
        await roomTimeEnd.type('01');
        page.keyboard.press('ArrowRight');
        await page.waitFor(1000);
        await roomTimeEnd.type(result.RoomTimeMinICIS);
        page.keyboard.press('ArrowRight');
        await page.waitFor(1000);
        if(AMorPM == 'pm') await roomTime.type('am');
        else if (AMorPM == 'am') await roomTime.type('pm');
      }
      else
      {
        var RoomTimeEndInt = Number(RoomTimeEnd);
        var RoomTimeEndHours = (RoomTimeEndInt + 1);
        var RoomTimeEndHoursString = RoomTimeEndHours.toString();
        await roomTimeEnd.type(RoomTimeEndHoursString);
        await roomTimeEnd.focus();
        await roomTimeEnd.click();
        page.keyboard.press('ArrowRight');
        await page.waitFor(1000);
        await roomTimeEnd.type(result.RoomTimeMinICIS);
        page.keyboard.press('ArrowRight');
        await page.waitFor(1000);
        await roomTimeEnd.type(result.RoomTimeAMPMICIS);
      }
      const submitButton = await page.waitForSelector('#edit-submit');
      await submitButton.focus();
      await submitButton.click();
      await submitButton.dispose();
      console.log('ROOM BOOKED');
      console.log('BOOKING INFO:');
      console.log('Date:',result.RoomDateICIS);
      console.log('Room:',result.RoomNumICIS);
   }
    catch(err)
    {
      console.log('Something went wrong. Please try again');
    }
  }

})();
