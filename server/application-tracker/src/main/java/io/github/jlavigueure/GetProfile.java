/**
 * GetProfile.java
 * 
 * This file is part of the Application Tracker project. 
 * It is a Lambda function that retrieves a profile for a user from DynamoDB.
 * This function is triggered by an API Gateway request and expects a User-Id in the query parameters.
 * 
 * Author: Jordan Lavigueure
 * Date: 2025-05-30
 */

package io.github.jlavigueure;

import java.util.HashMap;
import java.util.Map;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;

import com.fasterxml.jackson.databind.ObjectMapper;

import static io.github.jlavigueure.AttributeConversion.convertAttributeMapToObjectMap;
import static io.github.jlavigueure.DependencyFactory.*;

/**
 * Lambda function entry point. You can change to use other pojo type or implement
 * a different RequestHandler.
 *
 * @see <a href=https://docs.aws.amazon.com/lambda/latest/dg/java-handler.html>Lambda Java Handler</a> for more information
 *
 * This class handles the retrieval of a profile for a user from DynamoDB.
 */
public class GetProfile implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final DynamoDbClient dynamoDbClient = dynamoDbClient();
    private static final ObjectMapper objectMapper = objectMapper();

    // Default constructor
    public GetProfile() {}

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
            // Query DynamoDB for the user's profile
            Map<String, AttributeValue> key = new HashMap<>();
            key.put(TABLE_KEY, AttributeValue.builder().s(userId).build());
            key.put(TABLE_SORT_KEY, AttributeValue.builder().s(TABLE_SORT_KEY_PROFILE).build());

            GetItemRequest getItemRequest = GetItemRequest.builder()
                .tableName(TABLE_NAME)
                .key(key)
                .build();

            Map<String, Object> item = convertAttributeMapToObjectMap(dynamoDbClient.getItem(getItemRequest).item());

            if (item == null || item.isEmpty()) {
                return new APIGatewayProxyResponseEvent()
                    .withStatusCode(ERROR_CODE_NOT_FOUND)
                    .withBody("Profile not found for user: " + userId);
            }

            // Return the profile as a JSON response
            return new APIGatewayProxyResponseEvent()
                .withStatusCode(OK)
                .withBody(objectMapper.writeValueAsString(item));

        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            return new APIGatewayProxyResponseEvent()
                .withStatusCode(ERROR_CODE_INTERNAL_SERVER_ERROR)
                .withBody("JSON parsing error: " + e.getMessage());
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent()
                .withStatusCode(ERROR_CODE_INTERNAL_SERVER_ERROR)
                .withBody("An error occurred while processing the request: " + e.getMessage());
        }
    }

}
