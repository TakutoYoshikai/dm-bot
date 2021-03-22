const twitter = require("twit");
const config = require("./config.json");
const client = new twitter(config);

async function run(keyword, messageTemplate) {
  const today = new Date();
  const since = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + (today.getDate() - 1);
  const tweets = await getTweets(keyword, since);
  for (const tweet of tweets) {
    const message = makeMessageFromTemplate(messageTemplate, tweet);
    sendDMToSenderOf(tweet, message);
  }
}

function getTweets(keyword, since) {
  return new Promise((resolve, reject) => {
    client.get("search/tweets", { q: keyword + " since:" + since, count: 100 }, (err, data, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.statuses);
    });
  });
}

function makeMessageFromTemplate(template, tweet) {
  return template.replace("{user}", tweet.user.name);
}
function sendDMToSenderOf(tweet, text) {
  sendDM(tweet.user.id_str, text);
}
function sendDM(userId, text) {
  const params = {
    event: {
      type: "message_create",
      message_create: {
        target: {
          recipient_id: userId
        },
        message_data: {
          text: text,
        }
      }
    }
  }
  return new Promise((resolve, reject) => {
    client.post("direct_messages/events/new", params, (err, data, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

module.export = {
  getTweets,
  sendDM,
  run,
}
