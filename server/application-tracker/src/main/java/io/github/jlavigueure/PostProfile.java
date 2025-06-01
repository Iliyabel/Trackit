/**
 * PostProfile.java
 * 
 * This file is part of the Application Tracker project.
 * It is a Lambda function that posts a profile for a user to DynamoDB.
 * This function is triggered by an API Gateway request and expects a User-Id in the headers.
 * 
 * Author: Jordan Lavigueure
 * Date: 2025-05-30
 */

package io.github.jlavigueure;

import java.util.Map;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import static io.github.jlavigueure.DependencyFactory.*;
import static io.github.jlavigueure.AttributeConversion.*;

/**
 * Lambda function entry point. You can change to use other pojo type or implement
 * a different RequestHandler.
 *
 * @see <a href=https://docs.aws.amazon.com/lambda/latest/dg/java-handler.html>Lambda Java Handler</a> for more information
 *
 * This class handles the retrieval of a profile for a user from DynamoDB.
 */
public class PostProfile implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final DynamoDbClient dynamoDbClient = dynamoDbClient();
    private static final ObjectMapper objectMapper = objectMapper();

    // Default constructor
    public PostProfile() {}

    /**
     * Handles the incoming API Gateway request to get a profile for a user.
     * @param input the API Gateway request event
     * @param context the Lambda execution context
     * @return APIGatewayProxyResponseEvent containing the profile or an error message
     */
    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        // Extract userId from the request context authorizer
        String userId = (String)input.getRequestContext().getAuthorizer().get(HEADER_USER_ID);
        
        try {
            Map<String, Object> newProfile = objectMapper.readValue(
                input.getBody(), new TypeReference<Map<String, Object>>() {}
            );
            if (newProfile == null || newProfile.isEmpty()) {
                return new APIGatewayProxyResponseEvent()
                    .withStatusCode(ERROR_CODE_BAD_REQUEST)
                    .withBody("Request body is required");
            }

            // Add the userId to the item
            newProfile.put(TABLE_KEY, userId);

            // Add the sort key for the profile
            newProfile.put(TABLE_SORT_KEY, TABLE_SORT_KEY_PROFILE);

            // Put the item into DynamoDB
            dynamoDbClient.putItem(PutItemRequest.builder()
                .tableName(TABLE_NAME)
                .item(convertObjectMapToAttributeMap(newProfile))
                .build());

            return new APIGatewayProxyResponseEvent()
                .withStatusCode(OK);

        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            return new APIGatewayProxyResponseEvent()
                .withStatusCode(ERROR_CODE_BAD_REQUEST)
                .withBody("Invalid JSON format: " + e.getMessage());
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent()
                .withStatusCode(ERROR_CODE_INTERNAL_SERVER_ERROR)
                .withBody("An error occurred while processing the request: " + e.getMessage());
        }
    }

}
