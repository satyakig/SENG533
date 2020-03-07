package seng533.server.restservice;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;


public class SqlDbHelper {
    private Connection connection = null;

    private static SqlDbHelper sqlDbHelper;

    // Constructor
    private SqlDbHelper() {
        this.connection = createNewInstance();
    }

    // Initializes this singleton - called from main
    public static void initializeDb(){
        sqlDbHelper = new SqlDbHelper();
    }

    public static Connection getDbConnection() {
        // If connection wasn't made for some reason, try again
        if (sqlDbHelper.connection == null) {
            sqlDbHelper.connection = createNewInstance();
        }
        return sqlDbHelper.connection;
    }

    private static Connection createNewInstance() {
        try {
            // Reading the sql database properties file
            Properties properties = new Properties();
            properties.load(Thread.currentThread().getContextClassLoader().getResourceAsStream("sqlConfig.properties"));

            // Extracting the url, driver, username and password
            String url = properties.getProperty("jdbc.url");
            String driver = properties.getProperty("jdbc.driver");
            String username = properties.getProperty("jdbc.username");
            String password = properties.getProperty("jdbc.password");

            // Initializing the driver class and creating a connection
            Class.forName(driver);
            Connection connection = DriverManager.getConnection(url,username,password);

            //returning the connection
            return connection;
        }
        catch (SQLException | IOException | ClassNotFoundException e) {
            e.printStackTrace();
            return null;
        }
    }
}