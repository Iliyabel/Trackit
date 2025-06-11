/**
 * GetApplications.java
 * 
 * This file is part of the Application Tracker project. 
 * It is a Lambda function that retrieves all applications for a user from DynamoDB.
 * This function is triggered by an API Gateway request and expects a User-Id and optional applicationId as query parameters.
 * It queries the DynamoDB table "application-tracker-main" using the User-Id and optionally the applicationId.
 * 
 * Author: Jordan Lavigueure
 * Date: 2025-05-30
 */

package io.github.jlavigueure;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;

import com.fasterxml.jackson.databind.ObjectMapper;

import static io.github.jlavigueure.DependencyFactory.*;
import static io.github.jlavigueure.AttributeConversion.*;


/**
 * Lambda function entry point. You can change to use other pojo type or implement
 * a different RequestHandler.
 *
 * @see <a href=https://docs.aws.amazon.com/lambda/latest/dg/java-handler.html>Lambda Java Handler</a> for more information
 *
 * This class handles the retrieval of all applications for a user from DynamoDB.
 */
public class GetApplications implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final DynamoDbClient dynamoDbClient = dynamoDbClient();
    private static final ObjectMapper objectMapper = objectMapper();

    // Default constructor
    public GetApplications() {}

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
        String applicationId = (input.getQueryStringParameters() != null) ? input.getQueryStringParameters().get(HEADER_APPLICATION_ID) : null;

        if (applicationId != null && applicationId.toLowerCase().equals("profile")){
            return new APIGatewayProxyResponseEvent().withHeaders(corsHeaders())
                    .withStatusCode(ERROR_CODE_BAD_REQUEST)
                    .withBody("Cannot query for profile applications using this endpoint. Use the /profiles endpoint instead.");
        }

        // Call method to get applications for the user from DynamoDB
        return getApplicationsForUser(userId, applicationId);
    }

    /**
     * Retrieves applications for a given user from DynamoDB.
     * @param userId
     * @return APIGatewayProxyResponseEvent containing the applications or an error message
     */
    private APIGatewayProxyResponseEvent getApplicationsForUser(String userId, String applicationId) {
        QueryRequest.Builder requestBuilder = QueryRequest.builder()
            .tableName(TABLE_NAME);

        if (applicationId == null || applicationId.isEmpty()) {
            // Query only by userId (partition key)
            requestBuilder.keyConditionExpression(TABLE_KEY + " = :userId AND begins_with(" + TABLE_SORT_KEY + ", :prefix)")
                .expressionAttributeValues(Map.of(
                    ":userId", AttributeValue.builder().s(userId).build(),
                    ":prefix", AttributeValue.builder().s(TABLE_SORT_KEY_APP_PREFIX).build()
                ));
        } else {
            // Query by userId (partition key) AND applicationId (sort key)
            requestBuilder.keyConditionExpression(TABLE_KEY + " = :userId AND " + TABLE_SORT_KEY + " = :applicationId")
                .expressionAttributeValues(Map.of(
                    ":userId", AttributeValue.builder().s(userId).build(),
                    ":applicationId", AttributeValue.builder().s(applicationId).build()
                ));
        }
        QueryRequest request = requestBuilder.build();
        
        // Execute the query against DynamoDB
        QueryResponse response;
        try {
            response = dynamoDbClient.query(request);
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent()
                    .withHeaders(corsHeaders())
                    .withStatusCode(ERROR_CODE_INTERNAL_SERVER_ERROR)
                    .withBody("Error querying DynamoDB: " + e.getMessage());
        }


        // If no items are found, return 404
        if(response.items().isEmpty()) {
            return new APIGatewayProxyResponseEvent()
                    .withHeaders(corsHeaders())
                    .withStatusCode(ERROR_CODE_NOT_FOUND)
                    .withBody("No applications found for user: " + userId);
        }

        // Convert the DynamoDB item to a Map<String, Object>
        List<Map<String, AttributeValue>> items = response.items();
        // Convert list of items from AttributeValue to Object
        List<Map<String, Object>> convertedItems = new ArrayList<>();
        for (Map<String, AttributeValue> item : items) {
            convertedItems.add(convertAttributeMapToObjectMap(item));
        }
        // Convert the list of items to JSON and return in the response
        try {
            String jsonResponse = objectMapper.writeValueAsString(convertedItems);
            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(OK)
                    .withHeaders(corsHeaders())
                    .withBody(jsonResponse);
        } catch (Exception e) {
            // If there's an error converting to JSON, return 500
            return new APIGatewayProxyResponseEvent()
                    .withHeaders(corsHeaders())
                    .withStatusCode(ERROR_CODE_INTERNAL_SERVER_ERROR)
                    .withBody("Error processing request: " + e.getMessage());
        }
    }
}
