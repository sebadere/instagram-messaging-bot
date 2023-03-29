/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Instagram For Original Coast Clothing
 *
 */

"use strict";

const i18n = require("../i18n.config");
const { Configuration, OpenAIApi } = require("openai");
const config = require("./config");

console.log(process.env.OPEN_API_KEY)

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

module.exports = class Response {
  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: []
    };

    for (let quickReply of quickReplies) {
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"]
      });
    }

    return response;
  }

  static genImage(url) {
    let response = {
      attachment: {
        type: "image",
        payload: {
          url: url
        }
      }
    };

    return response;
  }

  static genText(text) {
    let response = {
      text: text
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload
    };

    return response;
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: buttons
            }
          ]
        }
      }
    };

    return response;
  }

  static async genNuxMessage(user) {
  //   let welcome = this.genText(
  //     i18n.__("get_started.welcome", {
  //       userName: user.name
  //     })
  //   );

  //   let guide = this.genText(i18n.__("get_started.guidance"));

  //   let curation = this.genQuickReply(i18n.__("get_started.help"), [
  //     {
  //       title: i18n.__("menu.suggestion"),
  //       payload: "CURATION"
  //     },
  //     {
  //       title: i18n.__("menu.help"),
  //       payload: "CARE_HELP"
  //     }
  //   ]);


  //   let secret = this.genText(i18n.__("get_started.secret"));
  //   return [secret];
  try {
    const completion = await openai.createChatCompletion({
      model:"gpt-3.5-turbo",
      messages:[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Who won the world series in 2020?"},
            {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
            {"role": "user", "content": "Where was it played?"}
        ]
    }
  )
  console.log(completion.data.choices[0].message.content)
  let responseGPT = this.genText(completion.data.choices[0].message.content);
  return [responseGPT];
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
  }

  static async getChatGPTResponse(message) {
    try {
      const completion = await openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        messages:[
              {"role": "system", "content": "Sos un asistente virtual para una marca de cuadros"},
              {"role": "user", "content": "Cuanto salen todos los cuadros"},
              {"role": "assistant", "content": "Salen 3000 pesos"},
              {"role": "user", "content": message}
          ]
      }
    )
    console.log(completion.data.choices[0].message.content)
    let responseGPT = this.genText(completion.data.choices[0].message.content);
    return [responseGPT];
    } catch(error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        res.status(error.response.status).json(error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
    }
    }
  
};
