package seng533.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import seng533.server.restservice.FirebaseDbHelper;
import seng533.server.restservice.SqlDbHelper;

@SpringBootApplication
public class Seng533JavaServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(Seng533JavaServerApplication.class, args);
	}

}
