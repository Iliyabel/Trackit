
package io.github.jlavigueure;


import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

/**
 * The module containing all dependencies required by the lambda.
 */
public class DependencyFactory {

    // Macros for DynamoDB table
    public static final String TABLE_NAME = "application-tracker-main";
    public static final String TABLE_KEY = "userId";
    public static final String TABLE_SORT_KEY = "applicationId";
    public static final String TABLE_SORT_KEY_APP_PREFIX = "app#";
    public static final String HEADER_USER_ID = "User-Id";
    public static final String HEADER_APPLICATION_ID = "Application-Id";
    public static final String TABLE_SORT_KEY_PROFILE = "profile";
    // Macros for HTTP status codes
    public static final int OK = 200;
    public static final int ERROR_CODE_BAD_REQUEST = 400;
    public static final int ERROR_CODE_UNAUTHORIZED = 401;
    public static final int ERROR_CODE_NOT_FOUND = 404;
    public static final int ERROR_CODE_INTERNAL_SERVER_ERROR = 500;

    // Objects are declared statically to allow reuse across multiple lambda calls
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final DynamoDbClient dynamoDbClient = DynamoDbClient.builder()
        .region(Region.US_WEST_2)
        .build();

    // Private constructor to prevent instantiation
    private DependencyFactory() {}

    // Getters for the dependencies

    public static ObjectMapper objectMapper() {
        return objectMapper;
    }

    public static DynamoDbClient dynamoDbClient() {
        return dynamoDbClient;
    }
}
