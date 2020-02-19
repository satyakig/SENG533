package com.example.SENG3.Java.Server.restservice;

public class HelloWorld {

    private final long id;
    private final String content;

    public HelloWorld(long id, String content) {
        this.id = id;
        this.content = content;
    }

    public long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }
}
