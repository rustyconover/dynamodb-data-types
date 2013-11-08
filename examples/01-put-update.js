/* This example demonstrates use of AttributeValue and AttributeValueUpdate.
 * Run this example on the command line as follows:
 * $ node 01-put-updates.js
 * Observe the output dump shows the data structures as required by DynamoDb.
 * When running this example, you may choose to use a live DynamoDb instance
 * (optinal) by setting `USE_LIVE_DB'. If you choose to use a live DynamoDb
 * instance, you will to setup a DynamoDb table with name and key mentioned
 * below. */

var attr = require('dynamodb-data-types').AttributeValue;
var attrUpdate = require('dynamodb-data-types').AttributeValueUpdate;

var USE_LIVE_DB = false;
var TABLE_NAME = "TestTableForDynamoDbDataTypes"; // Hash key: `id' (Number).
var dynamo = dynamoDb(USE_LIVE_DB);

function putPerson(person) {
  var opts = {
    TableName: TABLE_NAME,
    Item: attr.wrap(person)
  };

  console.log("Put person:\n", JSON.stringify(opts, undefined, 2));
  dynamo.putItem(opts, function(err){ 
    if (err)
      console.log("put error:", err); 
  });
}

function updatePerson(id, updates) {
  var opts = {
    TableName: TABLE_NAME,
    Key: attr.wrap({id: id}),
    AttributeUpdates: updates
  };

  console.log("Update Person:\n", JSON.stringify(opts, undefined, 2));
  dynamo.updateItem(opts, function(err){ 
    if (err)
      console.log("update error:", err); 
  });
}

function dynamoDb(useLiveDb) {
  // If not using a live db, just return dummy functions.
  if (!useLiveDb) {
    return {
      putItem: function dummyPut(){},
      updateItem: function dummyUpdate(){}
    };
  }

  /* If using a live db, you need to create the necessary with the key.
   * Note: As per Amazon's recommended configuration, `accessKeyId' and
   * `secretAccessKey' are read from environment variables
   * `AWS_SECRET_ACCESS_KEY' and `AWS_ACCESS_KEY_ID'. 
   */
  
  var AWS = require('aws-sdk');
  AWS.config.update({region: 'us-east-1'});
  var dynamo = new AWS.DynamoDB({apiVersion: '2013-10-16'});

  return dynamo;
}

var personInfo = {
  id: 1,
  name: "name-1",
  nickname: "nick",
  age: 20,
  weight: 50, // Kg
  height: 5,  // Feet
  favColors: ["red", "green", "blue"],
  favNumbers: [1, 3, 8],
  languages: ["js", "c", "ruby"]
};

var personUpdates = attrUpdate
      .put({name: "name-2"})
      .add({age: 1})
      .delete("height, weight  , nickname, languages")
      .delete({favColors: ["blue"]})
      .add({favColors: ["orange"]})
      .delete({favNumbers: [3]});

// Note: The action to delete favColor blue does not appear in the because it
// gets overwritten by the next action to add favColor orange.


// When using a live DynamoDb instance for this example, call either putPerson
//  or updatePerson and observe the effect using the AWS web console.
putPerson(personInfo);
updatePerson(1, personUpdates);
