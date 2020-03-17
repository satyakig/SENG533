package seng533.server.restservice;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

import java.io.IOException;
import java.io.InputStream;

public class FirebaseDbHelper {
    private static FirebaseDbHelper dbHelper = null;
    private Firestore db = null;

    // Constructor
    private FirebaseDbHelper() {
        db = createNewInstance();
    }

    public static Firestore getDbInstance() {
        if (dbHelper == null) {
            dbHelper = new FirebaseDbHelper();
        }
        return dbHelper.db;
    }

    private static Firestore createNewInstance() {
        try {
            InputStream serviceAccount = FirebaseDbHelper.class.getResourceAsStream("/firestore-cred.json");
            GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(credentials)
                    .build();
            FirebaseApp.initializeApp(options);

            return FirestoreClient.getFirestore();
        } catch (IOException e) {
            System.out.println(e);
            return null;
        }
    }
}
