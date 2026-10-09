package com.jansahayak.service;

import com.jansahayak.dto.BookmarkRequest;
import com.jansahayak.entity.Bookmark;
import com.jansahayak.entity.Scheme;
import com.jansahayak.entity.User;
import com.jansahayak.exception.ResourceNotFoundException;
import com.jansahayak.repository.BookmarkRepository;
import com.jansahayak.repository.SchemeRepository;
import com.jansahayak.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final SchemeRepository schemeRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository,
            UserRepository userRepository,
            SchemeRepository schemeRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
        this.schemeRepository = schemeRepository;
    }

    public Bookmark saveBookmark(BookmarkRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.userId()));
        Scheme scheme = schemeRepository.findById(request.schemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id: " + request.schemeId()));

        if (bookmarkRepository.findByUserIdAndSchemeId(user.getId(), scheme.getId()).isPresent()) {
            throw new IllegalArgumentException("Scheme already saved by this user");
        }

        return bookmarkRepository.save(new Bookmark(user, scheme));
    }

    public List<Bookmark> getBookmarksByUser(Long userId) {
        return bookmarkRepository.findByUserId(userId);
    }

    public void removeBookmark(Long bookmarkId) {
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found with id: " + bookmarkId));
        bookmarkRepository.delete(bookmark);
    }

    public void removeBookmarkByUserAndScheme(Long userId, Long schemeId) {
        Bookmark bookmark = bookmarkRepository.findByUserIdAndSchemeId(userId, schemeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Bookmark not found for user id: " + userId + " and scheme id: " + schemeId));
        bookmarkRepository.delete(bookmark);
    }
}
