const {google} = require('googleapis');

API_KEY = 'AIzaSyCRIg8avN4S80bGeWIhmNqqgWFCBZ6WYCc';
DISCOVERY_URL =
    'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

const attributeThresholds = {
        'INSULT': 0.7,
        'IDENTITY_ATTACK': 0.7,
        'TOXICITY': 0.5,
        'SPAM': 0.6,
        'INCOHERENT': 0.6,
        'FLIRTATION': 0.45,
      };
const requestedAttributes = {};
      for (const key in attributeThresholds) {
        requestedAttributes[key] = {};
      };
google.discoverAPI(DISCOVERY_URL)
    .then(client => {
      const analyzeRequest = {
        comment: {
          text: 'I hate you',
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
        data ={};
          for (const k in attributeThresholds){
             //console.log(res[k]['summaryScore']['value']>attributeThresholds[k]);
             data[k] = res[k]['summaryScore']['value']>attributeThresholds[k];
          };
        
          console.log(data);
        });
  
    
    })
    .catch(err => {
        throw err;
      });