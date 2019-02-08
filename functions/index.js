'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.sendProximityNotification = functions.firestore.document(`/sighting/{sightingId}`)
  .onCreate(event => {

    const payload = {
      notification: {
        title: 'New sighting in your area.',
        body: 'There has just been a new sighting reported in your area.',
        sound: 'default',
        // icon: follower.photoURL
      }
    };

    //Map over the users to check check proximity, then map over their tokens and return an array of tokens to notify
    return admin.firestore().collection('/users').get()
      .then(users => {
      
      // Send notifications to these tokens - takes in tokens[] the payload
      let tokens = [];  
      users.forEach(u => tokens.push(u.data().deviceToken));
      return admin.messaging().sendToDevice(tokens, payload);
    });
  });
