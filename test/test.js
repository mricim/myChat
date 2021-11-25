const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'eu-west-3'});

exports.handler = (event, context, callback) => {
    
    const timestampLambdaIn = new Date().toISOString();
    
    // create api ApiGatewayManagementApi to make a POST from lambda to engine by connectionid
    let apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({ 
        
        apiVersion: '2018-11-29',    
        endpoint: 'https://2i6mynw13k.execute-api.eu-west-3.amazonaws.com/v1/',
        region: 'eu-west-3'
      
    }); 
  
    //console.log("time in");
    // as websocket proxy json deliver body as string it forces us to PARSE it and leave a way (dirty code) to make TEST without PARSE
    let idGame=" ";
    let connectionId = " ";
    let connectionIdEngine = " ";
    let game = " ";
    
    if (event.body){
         var gameJSON = JSON.parse(event.body);
         idGame = gameJSON.game.generalData.idGame;
         connectionId = event.requestContext.connectionId;
         game = gameJSON.game;
    } else {
        idGame = event.game.generalData.idGame;
        game = event.game;
        connectionId = " TEST - NO connectionId available";
    }
    
    
    //responses to client
    let response_success = {
            statusCode: 200,
            body: JSON.stringify({message:  idGame + ' sent to engine and DB, by connection ' + connectionId })
        };
        
    let   response_error = {
            statusCode: 400,
            body: JSON.stringify({message: idGame +  ' did NOT sent to engine and DB, connection active, ' + connectionId } )
        };

    //package the game data to send 
    const gameToEngine = {
        "sendgame" : 'eserver', 
        "game" : game,
        "timestampLambdaIn": timestampLambdaIn
    };
    
    //package to string, ApiGatewayManagementApi ONLY send string as Data
    const gameToEngineaAsString = JSON.stringify(gameToEngine);
    //console.log(gameToEngineaAsString);
   
    //const timestampPostIn = new Date().toISOString();
    //console.log("POST in");
    // with all connections from scand-db into an ARRAY connections a random function chooses one connection and sends data to that specific connection-engine 
     getConnections().then((data) => {
        
        //create ARRAY connections and full it with connections from getConnections(data) 
        let connections = [];
        data.Items.forEach((connection) => connections.push(connection));
        //console.log("getconnectonsdone");
        
        //random between zero and the number of engines active it that moment    
        let connectionIndex = Math.floor(Math.random()*Math.floor(connections.length));
        //console.log(connectionIndex);
        connectionIdEngine = connections[connectionIndex].connectionid;
        const params = {
                    ConnectionId: connectionIdEngine,
                    Data: gameToEngineaAsString
                };
        
        //ApiGatewayManagementApi makes a POST
        // post https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayManagementApi.html#postToConnection-property
        apiGatewayManagementApi.postToConnection(params, function(err, data) {
            if (err) 
               { //console.log(err, err.stack); 
                callback(response_error);}
             else  
               { //console.log(data);
                callback(undefined, response_success);}
        });
    });  
    //console.log("POST out");
 
    //make a query https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-query-scan.html
    // get all connections from dynamodb with scan -not query- and -not filter-
    function getConnections(){    
        return ddb.scan({        
            TableName: '_eConnectionsEngine',    
            
        }).promise();
    }

};
