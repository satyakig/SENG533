package seng533.server.restservice;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.sun.net.httpserver.Authenticator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.Null;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
public class SqlRequestsController {

    @PostMapping("/nosql")
    public Map<String, Object> nosql(@RequestBody Map<String, Object> request) throws ExecutionException, InterruptedException {

        final String id = (String) request.get("id");
        final String frequency = (String) request.get("frequency");
        final String requestSize = (String) request.get("requestSize");
        final Object data = request.get("data");

        final long requestStartTime = System.currentTimeMillis();
        Firestore db = FirebaseDbHelper.getDbInstance();

        // Writing the data
        final long writeStartTime = System.currentTimeMillis();
        DocumentReference addedDocRef = db.collection("data").add(data).get();
        final long writeEndTime = System.currentTimeMillis();


        // Reading the data
        final long readStartTime = System.currentTimeMillis();
        db.collection("data").document(addedDocRef.getId()).get().get();
        final long readEndTime = System.currentTimeMillis();


        // Deleting the data
        final long deleteStartTime = System.currentTimeMillis();
        FirebaseDbHelper.getDbInstance().collection("data").document(addedDocRef.getId()).delete().get();
        final long deleteEndTime = System.currentTimeMillis();

        final Map<String, Object> log = new HashMap<>();
        log.put("id", id);
        log.put("frequency", frequency);
        log.put("timestamp", System.currentTimeMillis());
        log.put("serverType", "java");
        log.put("databaseType", "nosql");
        log.put("requestSize", requestSize);
        log.put("timeWrite", writeEndTime - writeStartTime);
        log.put("timeRead", readEndTime - readStartTime);
        log.put("timeDelete", deleteEndTime - deleteStartTime);

        // Writing log to the database
        db.collection("logs").document(id).set(log).get();

        // End time for the request
        final long requestEndTime = System.currentTimeMillis();

        // Creating a new response with total time
        final Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("totalTime", requestEndTime - requestStartTime);

        return response;
    }
}
