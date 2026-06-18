package com.nursEval.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.nursEval.backend.repository.StudentRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

  @Bean
  CommandLineRunner testMongo(StudentRepository repository) {
      return args -> {
          try {
              System.out.println("--- Probando MongoDB ---");
              long count = repository.count();
              System.out.println("Conexión exitosa:" + count + " documentos.");
          } catch (Exception e) {
              System.err.println("Error conectando a MongoDB: " + e.getMessage());
          }
      };
  }

}
