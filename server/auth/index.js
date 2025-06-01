const admin = require('firebase-admin');
const serviceAccount = require('./firebase_config.json'); 

if (!admin.apps.length) {
    // Initialize Firebase Admin SDK with default credentials or service account
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

async function handler(event) {
    const token = extractToken(event);

    if (!token) 
        return generatePolicy('unauthorized', 'Deny', event.methodArn);
    

    try {
        // Verify the token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);

        const uid = decodedToken.uid;
        return generatePolicy(uid, 'Allow', event.methodArn, { "User-Id": uid });

    } catch (error) {
        console.error('Token verification failed:', error);
        return generatePolicy('unauthorized', 'Deny', event.methodArn);
    }
}

exports.handler = handler;

function extractToken(event) {
    let authHeader = event.authorizationToken;
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1];
    }
    return null;
}

function generatePolicy(principalId, effect, resource, context = null) {
    return {
        principalId: principalId,
        policyDocument: {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
        }],
        },
        context: context || {},
    };
}
