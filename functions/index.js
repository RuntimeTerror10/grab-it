const functions = require("firebase-functions");
const puppeteer = require("puppeteer");
const cors = require("cors")({ origin: true });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient("supabaseUrl", "anonKey");

const ScrapeFromBrowser = async (userData) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setJavaScriptEnabled(true);
  await page.goto(userData.element.url);
  await page.waitForSelector(userData.element.path);
  const newValue = await page.$eval(
    userData.element.path,
    (el) => el.innerText
  );
  return newValue;
};

const updateItem = async (updatedvalue, userData) => {
  userData.element.data = updatedvalue;

  const { data, error } = await supabase
    .from("grab_db")
    .update({ element: userData.element, updated_at: userData.updated_at })
    .match({ id: userData.id });
};

exports.helloWorld = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    (async () => {
      const temp = JSON.parse(request.body);
      let currentTime = new Date();
      let timeDifference = currentTime - new Date(temp.element.updated_at);

      if (timeDifference > 180000) {
        temp.element.updated_at = temp.updateTime;
        const updatedValue = await ScrapeFromBrowser(temp.element);
        updateItem(updatedValue, temp.element);
        response.send({
          status: "success",
          newValue: updatedValue,
          elementID: temp.element.id,
        });
      } else {
        const { data, error } = await supabase
          .from("grab_db")
          .select("element")
          .eq("id", temp.element.id);

        response.send({
          status: "failure",
          newValue: data[0].element.data,
          elementID: temp.element.id,
        });
      }
    })();
  });
});
