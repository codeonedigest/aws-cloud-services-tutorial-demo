import {
  SQSClient,
  SendMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

//Queues
//https://sqs.us-east-1.amazonaws.com/903419531485/TestQueue1
//https://sqs.us-east-1.amazonaws.com/903419531485/TestQueue2

export const handler = async (event) => {
  console.log(`Starting processing event: ${JSON.stringify(event)}`);

  const sourceQueueUrl =
    "https://sqs.us-east-1.amazonaws.com/903419531485/TestQueue1";
  const destinationQueueUrl =
    "https://sqs.us-east-1.amazonaws.com/903419531485/TestQueue2";

  const sqs = new SQSClient({ region: "us-east-1" });

  console.log(
    `>>>> Received event with records count - ${event.Records.length} <<<<`
  );

  for (const record of event.Records) {
    
    console.log(
      `####### Start processing record ${JSON.stringify(record)} #########`
    );
    console.log(
      `sending this record to destination queue ${destinationQueueUrl}`
    );
    await sendMessage(record, destinationQueueUrl, sqs);

    console.log(
      `### Finished processing record`
    );


    // console.log(`Throwing Error to avoid deleting message from source queue`);
    // throw new Error(
    //   "Intentional Error to avoid deleting message from source queue"
    // );


  }

  console.log(
    `>>>> Finished processing ${event.Records.length} records from event <<<<`
  );

     const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };

    return response;
  
};

const sendMessage = async (record, destinationQueueUrl, sqs) => {
  const command = new SendMessageCommand({
    QueueUrl: destinationQueueUrl,
    MessageBody: record.body,
    MessageAttributes: record.messageAttributes,
  });
  console.log(`sending message to destination SQS - ${destinationQueueUrl}`);
  const data = await sqs.send(command);
  console.log(`Message sent to SQS - ${destinationQueueUrl}`);
};



const deleteMessage = async (record, sourceQueueUrl, sqs) => {
  const deleteCommand = new DeleteMessageCommand({
    QueueUrl: sourceQueueUrl,
    ReceiptHandle: record.receiptHandle,
  });
  console.log(`deleting message from source SQS - ${sourceQueueUrl}`);
  const data = await sqs.send(deleteCommand);
  console.log(`Message deleted from source SQS - ${sourceQueueUrl}`);
};
