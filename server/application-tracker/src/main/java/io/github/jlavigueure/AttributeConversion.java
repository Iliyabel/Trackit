package io.github.jlavigueure;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import software.amazon.awssdk.services.dynamodb.model.*;


public class AttributeConversion {
    /**
     * Converts a Map<String, Object> to a Map<String, AttributeValue> for DynamoDB.
     * @param input the Map to convert.
     * @return Map<String, AttributeValue> representation of the input.
     */
    public static Map<String, AttributeValue> convertObjectMapToAttributeMap(Map<String, Object> input) {
        Map<String, AttributeValue> output = new HashMap<>();
        for (Map.Entry<String, Object> entry : input.entrySet()) 
            output.put(entry.getKey(), objectToAttribute(entry.getValue()));
        return output;
    }

    /**
     * Recursive helper method to convert an Object to a DynamoDB AttributeValue.
     * Called by convertObjectMapToAttributeMap.
     * @param value the Object value to convert.
     * @return AttributeValue representation of the Object.
     */
    public static AttributeValue objectToAttribute(Object obj) {
        // Check the type of the object and convert accordingly
        if (obj == null) return AttributeValue.builder().nul(true).build();
        if (obj instanceof String) return AttributeValue.builder().s((String) obj).build();
        if (obj instanceof Number) return AttributeValue.builder().n(obj.toString()).build();
        if (obj instanceof Boolean) return AttributeValue.builder().bool((Boolean) obj).build();
        if (obj instanceof Map<?, ?>) {
            Map<String, AttributeValue> map = new HashMap<>();
            for (var key : ((Map<?, ?>) obj).keySet())
                map.put(key.toString(), objectToAttribute(((Map<?, ?>) obj).get(key)));
            return AttributeValue.builder().m(map).build();
        }
        if (obj instanceof List<?>) {
            List<AttributeValue> list = new ArrayList<>();
            for (Object item : (List<?>) obj)
                list.add(objectToAttribute(item));
            return AttributeValue.builder().l(list).build();
        }

        return AttributeValue.builder().s(obj.toString()).build(); 
    }

    /**
     * Converts a Map<String, AttributeValue> to a Map<String, Object>
     * @param item the DynamoDB item
     * @return a Map representation of the item
     */
    public static Map<String, Object> convertAttributeMapToObjectMap(Map<String, AttributeValue> item) {
        // For each key in the item, convert the AttributeValue to a Java Object and put in a map
        Map<String, Object> map = new HashMap<>();
        for (String key : item.keySet()) 
            map.put(key, attributeToObject(item.get(key)));
        return map;
    }

    /**
     * Recursive helper method to convert an AttributeValue to a Java Object.
     * Called by convertAttributeMapToObjectMap.
     * @param value the DynamoDB AttributeValue
     * @return a Java Object representation of the AttributeValue
     */
    public static Object attributeToObject(AttributeValue value){
        // Check the type of the AttributeValue and convert accordingly    
        if (value.s() != null) return value.s(); 
        if (value.n() != null) return Double.parseDouble(value.n());
        if (value.bool() != null) return value.bool();
        if (value.hasM()) {
            Map<String, AttributeValue> m = value.m();
            Map<String, Object> map = new HashMap<>();
            for (String key : m.keySet()) 
                map.put(key, attributeToObject(m.get(key)));
            return map;
        }
        if (value.hasL()) {
            List<Object> list = new ArrayList<>();
            for (AttributeValue item : value.l()) 
                list.add(attributeToObject(item));
            return list;
        }
        if (value.nul()) return null;

        return value.toString();
    }
}
