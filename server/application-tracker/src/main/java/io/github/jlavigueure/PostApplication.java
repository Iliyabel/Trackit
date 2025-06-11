/**
 * PostApplication.java
 * 
 * This file is part of the Application Tracker project.
 * It is a file that defines a Lambda function to handle POST requests for adding applications to a user's application list in DynamoDB.
 * The function expects a JSON body containing a list of applications and a User-Id in the request headers.
 * It appends the new applications to the existing list of applications for the user in the DynamoDB table "application-tracker-main".
 * 
 * Author: Jordan Lavigueure
 * Date: 2025-05-30
 */

package io.github.jlavigueure;

import java.util.Map;
import java.util.UUID;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import static io.github.jlavigueure.DependencyFactory.*;
import static io.github.jlavigueure.AttributeConversion.*;


/**
 * Lambda function entry point. You can change to use other pojo type or implement
 * a different RequestHandler.
 *
 * @see <a href=https://docs.aws.amazon.com/lambda/latest/dg/java-handler.html>Lambda Java Handler</a> for more information
 *
 * This class handles the appending of new applications to a user's application list in DynamoDB.
 */
public class PostApplication implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final DynamoDbClient dynamoDbClient = dynamoDbClient();
    private static final ObjectMapper objectMapper = objectMapper();

    // Default constructor
    public PostApplication() {}

    /**
     * Handles the incoming API Gateway request to add applications for a user.
     * @param input the API Gateway request event
     * @param context the Lambda execution context
     * @return APIGatewayProxyResponseEvent containing success or error message
     */
    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        // Extract userId from the request context authorizer
        String userId = (String)input.getRequestContext().getAuthorizer().get(HEADER_USER_ID);
        // Extract the application id from the headers
        String applicationId = input.getHeaders().get(HEADER_APPLICATION_ID);
        if (userId == null || userId.isEmpty()) {
            return new APIGatewayProxyResponseEvent()
                .withHeaders(corsHeaders())
                .withStatusCode(ERROR_CODE_BAD_REQUEST)
                .withBody(HEADER_USER_ID + " header is required");
        }

        try {
            // Parse the request body to get the application data
            Map<String, Object> newApplication = objectMapper.readValue(
                input.getBody(), new TypeReference<Map<String, Object>>() {}
            );

            // Add the userID to the new application
            newApplication.put(TABLE_KEY, userId);

            // Add applicationID if provided, otherwise generate a new one
            if(applicationId == null || applicationId.isEmpty()) 
                newApplication.put(TABLE_SORT_KEY, TABLE_SORT_KEY_APP_PREFIX + UUID.randomUUID().toString());
            else 
                newApplication.put(TABLE_SORT_KEY, applicationId);

            // Put the new application into DynamoDB
            PutItemRequest putItemRequest = PutItemRequest.builder()
                    .tableName(TABLE_NAME)
                    .item(convertObjectMapToAttributeMap(newApplication))
                    .build();
            dynamoDbClient.putItem(putItemRequest);
            
            // Return a success response
            return new APIGatewayProxyResponseEvent()
                .withHeaders(corsHeaders())
                .withStatusCode(OK)
                .withBody(objectMapper.writeValueAsString(newApplication));

        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            return new APIGatewayProxyResponseEvent()
                .withHeaders(corsHeaders())
                .withStatusCode(ERROR_CODE_BAD_REQUEST)
                .withBody("Invalid JSON format: " + e.getMessage());
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent()
                .withHeaders(corsHeaders()) 
                .withStatusCode(ERROR_CODE_INTERNAL_SERVER_ERROR)
                .withBody("An error occurred while processing the request: " + e.getMessage());
        }
    }
}
