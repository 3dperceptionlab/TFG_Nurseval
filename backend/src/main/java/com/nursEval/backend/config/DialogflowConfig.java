package com.nursEval.backend.config;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.dialogflow.v2.SessionsClient;
import com.google.cloud.dialogflow.v2.SessionsSettings;

@Configuration
public class DialogflowConfig {

  @Value("${google.cloud.credentials.path}")
  private Resource credentialsResource;

  @Bean
  public SessionsSettings sessionsSettings() throws IOException {
    try (InputStream credentialsStream = credentialsResource.getInputStream()) {
      GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);
      return SessionsSettings.newBuilder()
        .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
        .build();
    }
  }

  @Bean(destroyMethod = "close")
  public SessionsClient sessionsClient(SessionsSettings sessionsSettings) throws IOException {
    return SessionsClient.create(sessionsSettings);
  }
}
