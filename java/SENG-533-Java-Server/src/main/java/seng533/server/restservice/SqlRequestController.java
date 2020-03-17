package seng533.server.restservice;

import com.google.cloud.firestore.Firestore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ExecutionException;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;


@RestController
public class SqlRequestController {

    @PostMapping("/sql")
    public ResponseEntity<Map<String, Object>> sql(@RequestBody Map<String, Object> request) {
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
        final Connection connection = SqlDbHelper.getDbConnection();

        // Returning an error in case database connection cannot be established.
        if(connection == null){
            final Map<String, Object> connectionErrorRes = new HashMap<>();
            connectionErrorRes.put("message", "Cannot establish connection to database.");
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(connectionErrorRes);
        }

        // Writing the data
        final long writeStartTime = System.currentTimeMillis();
        PreparedStatement writeStatement = null;
        try {
            final String insertQuery = "INSERT INTO data_table (id, data) VALUES (?, ?);";
            writeStatement = connection.prepareStatement(insertQuery);
            if(writeStatement != null) {
                writeStatement.setString(1, id);
                writeStatement.setString(2, data);
                writeStatement.execute();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            queryError = true;
            writeError = e.toString();
        } finally {
            try {
                if(writeStatement != null) {
                    writeStatement.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        final long writeEndTime = System.currentTimeMillis();

        // Reading the data
        final long readStartTime = System.currentTimeMillis();
        PreparedStatement readStatement = null;
        ResultSet readResult = null;
        try {
            final String selectQuery = "SELECT * from data_table where id=?;";
            readStatement = connection.prepareStatement(selectQuery);
            if(readStatement != null) {
                readStatement.setString(1, id);
                readResult = readStatement.executeQuery();
                if(readResult == null || !readResult.next() ||
                        readResult.getString(1) == null ||
                        readResult.getString(2) == null){
                    throw new SQLException();
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            queryError = true;
            readError = e.toString();
        } finally {
            try {
                if(readStatement != null) {
                    readStatement.close();
                }
                if(readResult != null) {
                    readResult.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        final long readEndTime = System.currentTimeMillis();

        // Deleting the data
        final long deleteStartTime = System.currentTimeMillis();
        PreparedStatement deleteStatement = null;
        try {
            final String deleteQuery = "DELETE FROM data_table where id=?;";
            deleteStatement = connection.prepareStatement(deleteQuery);
            if(deleteStatement != null) {
                deleteStatement.setString(1, id);
                if(deleteStatement.executeUpdate() != 1) {
                    throw new SQLException();
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            queryError = true;
            deleteError = e.toString();
        } finally {
            try {
                if(deleteStatement != null) {
                    deleteStatement.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        final long deleteEndTime = System.currentTimeMillis();


        try {
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Sending an error response in case there was a error regarding any queries
        if(queryError){
            final Map<String, Object> queryErrorRes = new HashMap<>();
            queryErrorRes.put("message", "One or more (write, read, or delete) of the sql queries failed.");
            queryErrorRes.put("write error", writeError);
            queryErrorRes.put("read error", readError);
            queryErrorRes.put("delete error", deleteError);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(queryErrorRes);
        }

        // Creating a log to add to the logs
        final Map<String, Object> log = new HashMap<>();
        log.put("id", id);
        log.put("frequency", frequency);
        log.put("timestamp", System.currentTimeMillis());
        log.put("serverType", "java");
        log.put("databaseType", "sql");
        log.put("requestSize", requestSize);
        log.put("timeWrite", writeEndTime - writeStartTime);
        log.put("timeRead", readEndTime - readStartTime);
        log.put("timeDelete", deleteEndTime - deleteStartTime);

        // Writing log to the database
        try {
            Firestore db = FirebaseDbHelper.getDbInstance();
            if(db == null){
                final Map<String, Object> connectionErrorRes = new HashMap<>();
                connectionErrorRes.put("message", "Cannot establish connection to database for writing logs.");
                return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(connectionErrorRes);
            }
            db.collection("logs").document(id).set(log).get();
        } catch (InterruptedException | ExecutionException e) {
            final Map<String, Object> logErrorRes = new HashMap<>();
            logErrorRes.put("message", "Writing to log database failed.");
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
