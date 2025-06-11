/**
 * DeleteApplications.java
 * 
 * This file is part of the Application Tracker project. 
 * It is a Lambda function that deletes an application for a user from DynamoDB.
 *
 * Author: Jordan Lavigueure
 * Date: 2025-06-10
 */

package io.github.jlavigueure;

import java.util.Map;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.ReturnValue;

import static io.github.jlavigueure.AttributeConversion.*;
import static io.github.jlavigueure.DependencyFactory.*;


/**
 * Lambda function entry point. You can change to use other pojo type or implement
 * a different RequestHandler.
 *
 * @see <a href=https://docs.aws.amazon.com/lambda/latest/dg/java-handler.html>Lambda Java Handler</a> for more information
 *
 * This class handles the deletion of an application for a user from DynamoDB.
 */
public class DeleteApplication implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final DynamoDbClient dynamoDbClient = dynamoDbClient();
        private static final ObjectMapper objectMapper = objectMapper();

    // Default constructor
    public DeleteApplication() {}

    /**
     * Handles the incoming API Gateway request to get applications for a user.
     * @param input the API Gateway request event
     * @param context the Lambda execution context
     * @return APIGatewayProxyResponseEvent containing the applications or an error message
     */
    @Override
    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {
        // Extract userId from the request context authorizer
        String userId = (String)input.getRequestContext().getAuthorizer().get(HEADER_USER_ID);
        // Extract the application id from the query string parameters
        String applicationId = input.getQueryStringParameters().get(HEADER_APPLICATION_ID);
        if (applicationId == null) applicationId = input.getQueryStringParameters().get(HEADER_APPLICATION_ID.toLowerCase()); // check for lowercase header as well
        

        if (userId == null || userId.isEmpty() || applicationId == null || applicationId.isEmpty()) {
            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(ERROR_CODE_BAD_REQUEST)
                    .withHeaders(corsHeaders())
                    .withBody("User ID and Application ID must be provided.");
        }

        try {
            // Build the key for the item to delete
            var key = new java.util.HashMap<String, software.amazon.awssdk.services.dynamodb.model.AttributeValue>();
            key.put("userId", software.amazon.awssdk.services.dynamodb.model.AttributeValue.builder().s(userId).build());
            key.put("applicationId", software.amazon.awssdk.services.dynamodb.model.AttributeValue.builder().s(applicationId).build());

            // Delete the item from DynamoDB
            Map<String, software.amazon.awssdk.services.dynamodb.model.AttributeValue> deletedItem 
                = dynamoDbClient.deleteItem(builder -> builder
                .tableName(TABLE_NAME)
                .key(key)
                .returnValues(ReturnValue.ALL_OLD)
            ).attributes();

            // Check if the item was deleted. If not, return a 404 error
            if (deletedItem == null || deletedItem.isEmpty()) {
                return new APIGatewayProxyResponseEvent()
                    .withStatusCode(ERROR_CODE_NOT_FOUND)
                    .withHeaders(corsHeaders())
                    .withBody("Application not found.");
            }

            // Convert the deleted item to an object map and return it in the response
            try{
                var ObjMap = convertAttributeMapToObjectMap(deletedItem);
                return new APIGatewayProxyResponseEvent()
                    .withStatusCode(OK)
                    .withHeaders(corsHeaders())
                    .withBody(objectMapper.writeValueAsString(ObjMap));
            } catch (Exception e) {
                return new APIGatewayProxyResponseEvent()
                    .withStatusCode(ERROR_CODE_INTERNAL_SERVER_ERROR)
                    .withHeaders(corsHeaders())
                    .withBody("Failed to convert deleted item to object map: " + e.getMessage());
            }

        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent()
                .withStatusCode(ERROR_CODE_INTERNAL_SERVER_ERROR)
                .withHeaders(corsHeaders())
                .withBody("Failed to delete application: " + e.getMessage());
        }
    }
}
