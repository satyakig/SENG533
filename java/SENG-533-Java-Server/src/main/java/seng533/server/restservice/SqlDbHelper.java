package seng533.server.restservice;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;


public class SqlDbHelper {
    private static HikariConfig config = new HikariConfig("/hikari.properties");
    private static HikariDataSource ds = new HikariDataSource(config);

    public static Connection getDbConnection(){
        try {
            return ds.getConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
