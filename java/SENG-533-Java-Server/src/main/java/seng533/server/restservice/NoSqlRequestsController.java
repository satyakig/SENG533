package seng533.server.restservice;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.sun.management.OperatingSystemMXBean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;


@RestController
public class NoSqlRequestsController {

    @PostMapping("/nosql")
    public ResponseEntity<Map<String, Object>> nosql(@RequestBody Map<String, Object> request) {
        OperatingSystemMXBean osBean = ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);

        // boolean to keep track of query errors
        boolean queryError = false;
        String writeError = "";
        String readError = "";
        String deleteError = "";

        // parsing the request body
        final String id = (String) request.get("id");
        final String frequency = (String) request.get("frequency");
        final String requestSize = (String) request.get("requestSize");
        final String data = (String) request.get("data");

        // Starting the request time and getting a connection to the db
        final long requestStartTime = System.currentTimeMillis();
        Firestore db = FirebaseDbHelper.getDbInstance();

        // Returning an error in case database connection cannot be established.
        if(db == null){
            final Map<String, Object> connectionErrorRes = new HashMap<>();
            connectionErrorRes.put("message", "Cannot establish connection to database.");
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(connectionErrorRes);
        }

        // Writing the data
        final long writeStartTime = System.currentTimeMillis();
        DocumentReference addedDocRef = null;
        try {
            final Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("data", data);
            addedDocRef = db.collection("data").add(dataMap).get();
        } catch (Exception e) {
            e.printStackTrace();
            queryError = true;
            writeError = e.toString();
        }
        final long writeEndTime = System.currentTimeMillis();

        // Reading the data
        final long readStartTime = System.currentTimeMillis();
        if(addedDocRef != null) {
            try {
                db.collection("data").document(addedDocRef.getId()).get().get();
            } catch (Exception e) {
                e.printStackTrace();
                queryError = true;
                readError = e.toString();
            }
        }
        final long readEndTime = System.currentTimeMillis();

        // Deleting the data
        final long deleteStartTime = System.currentTimeMillis();
        if(addedDocRef != null) {
            try {
                db.collection("data").document(addedDocRef.getId()).delete().get();
            } catch (Exception e) {
                e.printStackTrace();
                queryError = true;
                deleteError = e.toString();
            }
        }
        final long deleteEndTime = System.currentTimeMillis();

        // Sending an error response in case there was a error regarding any queries
        if(queryError){
            final Map<String, Object> queryErrorRes = new HashMap<>();
            queryErrorRes.put("message", "One or more (write, read, or delete) of the sql queries failed.");
            queryErrorRes.put("write error", writeError);
            queryErrorRes.put("read error", readError);
            queryErrorRes.put("delete error", deleteError);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(queryErrorRes);
        }

        // Creating the log to write to logs database
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
        log.put("cpuUsage", osBean.getSystemCpuLoad());
        log.put("freeMem", osBean.getFreePhysicalMemorySize());
        log.put("totalMem", osBean.getTotalPhysicalMemorySize());

        // Writing log to the database
        try {
            db.collection("logs").document(id).set(log).get();
        } catch (InterruptedException | ExecutionException e) {
            final Map<String, Object> logErrorRes = new HashMap<>();
            logErrorRes.put("message", "Writing to log failed.");
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(logErrorRes);
        }

        // End time for the request
        final long requestEndTime = System.currentTimeMillis();

        // Creating a new response with total time
        final Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("totalTime", requestEndTime - requestStartTime);

        return ResponseEntity.ok().body(response);
    }
}
