function App() {

  function enviarMensagem() {
    var AWS = require('aws-sdk');
    AWS.config.update({
      accessKeyId: "",
      secretAccessKey: "",
      region: "us-east-2"
    });

    var sqs = new AWS.SQS({
      apiVersion: '2012-11-05'
    });

    var params = {
      DelaySeconds: 10,
      MessageAttributes: {
        "Mensagem": {
          DataType: "String",
          StringValue: document.getElementById("inputMessage").value
        }
      },
      MessageBody: "Mensagens para a aula de tópicos",
      QueueUrl: "https://sqs.us-east-2.amazonaws.com/971159208643/ReceberMensagens"
    };

    sqs.sendMessage(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data); // successful response
    });
  }

  function lerMensagem() {
    var AWS = require('aws-sdk');
    AWS.config.update({
      accessKeyId: "",
      secretAccessKey: "",
      region: "us-east-2"
    });

    // Create an SQS service object
    var sqs = new AWS.SQS({
      apiVersion: '2012-11-05'
    });

    var queueURL = "https://sqs.us-east-2.amazonaws.com/971159208643/ReceberMensagens";

    var params = {
      AttributeNames: [
        "SentTimestamp"
      ],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: [
        "All"
      ],
      QueueUrl: queueURL,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0
    };

    sqs.receiveMessage(params, function (err, data) {
      if (err) {
        console.log("Receive Error", err);
      } else if (data.Messages) {
        console.log(data)
        var deleteParams = {
          QueueUrl: queueURL,
          ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, function (err, data) {
          if (err) {
            console.log("Delete Error", err);
          } else {
            console.log("Message Deleted", data);
          }
        });
      }
    });
  }

  return (
    <div className="App">
      <input id="inputMessage" placeholder="Digite a mensagem"></input>
      <button onClick={enviarMensagem}>Enviar</button>
      <button onClick={lerMensagem}>Receber</button>
    </div>
  );
}

export default App;