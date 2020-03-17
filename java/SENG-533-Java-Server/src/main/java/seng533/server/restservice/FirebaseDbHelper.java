package seng533.server.restservice;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

import java.io.IOException;
import java.io.InputStream;

public class FirebaseDbHelper {
    static
    {
        try {
            InputStream serviceAccount = FirebaseDbHelper.class.getResourceAsStream("/firestore-cred.json");
            GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(credentials)
                    .build();
            FirebaseApp.initializeApp(options);
        } catch (IOException e) {
            System.out.println(e);
        }
    }
    public static Firestore getDbInstance(){
        return FirestoreClient.getFirestore();
    }
}
