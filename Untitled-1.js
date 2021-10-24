const AWS = require('aws-sdk')

const dynamo = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event, context) => {
  let body
  let statusCode = 200
  const headers = {
    'Content-Type': 'application/json',
  }

  try {
    switch (event.routeKey) {
      case 'DELETE /items/{id}':
        await dynamo
          .delete({
            TableName: 'http-crud-tutorial-items',
            Key: {
              id: event.pathParameters.id,
            },
          })
          .promise()
        body = `Imóvel deletado!`
        break
      case 'GET /items/{id}':
        body = await dynamo
          .get({
            TableName: 'http-crud-tutorial-items',
            Key: {
              id: event.pathParameters.id,
            },
          })
          .promise()
        break
      case 'GET /items':
        body = await dynamo
          .scan({ TableName: 'http-crud-tutorial-items' })
          .promise()
        break
      case 'POST /items':
        await dynamo
          .put({
            TableName: 'http-crud-tutorial-items',
            data: {
              id: context.awsRequestId,
              price: requestJSON.price,
              name: requestJSON.name,
            },
          })
          .promise()
        body = `Imóvel criado com sucesso!`
      case 'PUT /items':
        let requestJSON = JSON.parse(event.body)
        await dynamo
          .put({
            TableName: 'http-crud-tutorial-items',
            data: {
              id: requestJSON.id,
              price: requestJSON.price,
              name: requestJSON.name,
            },
          })
          .promise()
        body = `Imóvel atualizado com sucesso!`
        break
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`)
    }
  } catch (err) {
    statusCode = 400
    body = err.message
  } finally {
    body = JSON.stringify(body)
  }

  return {
    statusCode,
    body,
    headers,
  }
}

// name -> string
// description -> string
// keywords -> array of string
// active -> boolean
// path_images -> array of objects files
// table_pricing -> object file
// availability -> object file
let requestBody = JSON.parse(event.body)
await dynamo
  .put({
    TableName: 'raise-talk-users',
    Item: {
      id: context.awsRequestId,
      auth_id: requestBody.auth_id,
      stripe_id: requestBody.costumer_stripe_id,
      stripe_session: requestBody.stripe_session,
      payment_made: requestBody.payment_made,
    },
  })
  .promise()
body = {
  data: {
    id: context.awsRequestId,
    auth_id: requestBody.auth_id,
    stripe_id: requestBody.costumer_stripe_id,
    stripe_session: requestBody.stripe_session,
    payment_made: requestBody.payment_made,
  },
}



SELECT "public"."cdrs".callid,"public"."cdrs".user_id,"public"."interactions".status_humanized FROM "public"."cdrs" RIGHT JOIN "public"."interactions" ON "public"."cdrs".callid = "public"."interactions".callid LIMIT 1000 

SELECT * FROM "public"."cdrs" WHERE (user_id='9382' OR user_id='9276') AND selected_options LIKE '%802%'  LIMIT 1000 

SELECT "public"."interactions".callid, "public"."interactions".digits, "public"."interactions".option_selected, "public"."interactions".status_humanized, "public"."interactions".user_id, "public"."cdrs".callid, "public"."interactions" FROM "public"."interactions" WHERE (user_id='9382' OR user_id='9276') AND option_selected LIKE '%802%' AND (status_humanized='Respondida' OR status_humanized='Respondida sem atendimento')