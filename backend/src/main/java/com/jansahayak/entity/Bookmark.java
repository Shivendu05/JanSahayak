package com.jansahayak.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bookmarks", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "scheme_id" })
})
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    public Bookmark() {
    }

    public Bookmark(User user, Scheme scheme) {
        this.user = user;
        this.scheme = scheme;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Scheme getScheme() {
        return scheme;
    }

    public void setScheme(Scheme scheme) {
        this.scheme = scheme;
    }
}
