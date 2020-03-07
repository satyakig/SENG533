package seng533.server.restservice;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

import java.io.IOException;
import java.io.InputStream;

public class FirebaseDbHelper {
    private Firestore db = null;

    private static FirebaseDbHelper dbHelper;

    // Constructor
    private FirebaseDbHelper() {
        this.db = createNewInstance();
    }

    // Initializes this singleton - called from main
    public static void initializeDb(){
        dbHelper = new FirebaseDbHelper();
    }

    public static Firestore getDbInstance() {
        // If connection wasn't made for some reason, try again
        if (dbHelper.db == null) {
            dbHelper.db = createNewInstance();
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
