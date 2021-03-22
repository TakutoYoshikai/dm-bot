
const twitter = require("twit");
const config = require("./config.json");
const client = new twitter(config);


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

function sendDM(userId, messageTemplate) {
  const text = messageTemplate.replace("{user}", userId);
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
}
