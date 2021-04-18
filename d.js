const {google} = require('googleapis');
const Discord = require('discord.js');

require('dotenv').config();

API_KEY = 'AIzaSyCRIg8avN4S80bGeWIhmNqqgWFCBZ6WYCc';
DISCOVERY_URL =
    'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

const attributeThresholds = {
        'INSULT': 0.5,
        'IDENTITY_ATTACK': 0.4,
        'TOXICITY': 0.5,
        'SPAM': 0.6,
        'INCOHERENT': 0.6,
        'FLIRTATION': 0.50,
      };
const requestedAttributes = {};
      for (const key in attributeThresholds) {
        requestedAttributes[key] = {};
      };
      /**
      * Analyze attributes in a block of text
      * @param {string} text - text to analyze
      * @return {json} res - analyzed atttributes
      */
     async function analyzeText(text) {
       google.discoverAPI(DISCOVERY_URL)
         .then(client => {
           const analyzeRequest = {
             comment: {
               text: text,
             },
             requestedAttributes: requestedAttributes,
           };
           
     
     
           client.comments.analyze(
             {
               key: API_KEY,
               resource: analyzeRequest,
             },
             (err, response) => {
               if (err) throw err;
               const res = response.data.attributeScores;
               //console.log(res);
              var data ={};
               for (const k in attributeThresholds){
                  //console.log(res[k]['summaryScore']['value']>attributeThresholds[k]);
                  data[k] = res[k]['summaryScore']['value']>attributeThresholds[k];
               };
              //console.log(data);

               return JSON.stringify(data);
             });
       
         
         })
         .catch(err => {
             throw err;
           });
       //return data;
     }
     

// Set your emoji "awards" here
const emojiMap = {
  'FLIRTATION': '💋',
  'TOXICITY': '🧨',
  'INSULT': '👊',
  'INCOHERENT': '🤪',
  'SPAM': '🐟',
};

// Store some state about user karma.
// TODO: Migrate to a DB, like Firebase
const users = {};

/**
 * Analyzes a user's message for attribues
 * and reacts to it.
 * @param {string} message - message the user sent
 * @return {bool} shouldKick - whether or not we should
 * kick the users
 */
async function evaluateMessage(message) {

  try {
      console.log(message.content);
    scores = await analyzeText(message.content);
    console.log(scores);
  } catch (err) {
    console.log(err);
    return false;
  }
    }



// Create an instance of a Discord client
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', async (message) => {
  // Ignore messages that aren't from a guild
  // or are from a bot
  if (!message.guild || message.author.bot) return;

  // If we've never seen a user before, add them to memory
  const userid = message.author.id;
  if (!users[userid]) {
    users[userid] = [];
  }

  await evaluateMessage(message);

});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.DISCORD_TOKEN);
