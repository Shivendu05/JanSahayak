package com.jansahayak.controller;

import com.jansahayak.dto.BookmarkRequest;
import com.jansahayak.entity.Bookmark;
import com.jansahayak.entity.User;
import com.jansahayak.exception.ResourceNotFoundException;
import com.jansahayak.repository.UserRepository;
import com.jansahayak.service.BookmarkService;
import jakarta.validation.Valid;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final UserRepository userRepository;

    public BookmarkController(BookmarkService bookmarkService, UserRepository userRepository) {
        this.bookmarkService = bookmarkService;
        this.userRepository = userRepository;
    }

    @PostMapping("/bookmarks")
    public ResponseEntity<Bookmark> saveBookmark(@Valid @RequestBody BookmarkRequest request,
            Authentication authentication) {
        requireOwnAccount(request.userId(), authentication);
        return ResponseEntity.ok(bookmarkService.saveBookmark(request));
    }

    @GetMapping("/bookmarks/user/{userId}")
    public List<Bookmark> getBookmarksByUser(@PathVariable Long userId, Authentication authentication) {
        requireOwnAccount(userId, authentication);
        return bookmarkService.getBookmarksByUser(userId);
    }

    @DeleteMapping("/bookmarks/{id}")
    public ResponseEntity<Void> deleteBookmark(@PathVariable Long id) {
        bookmarkService.removeBookmark(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/bookmarks/user/{userId}/scheme/{schemeId}")
    public ResponseEntity<Void> deleteBookmarkByUserAndScheme(@PathVariable Long userId,
            @PathVariable Long schemeId, Authentication authentication) {
        requireOwnAccount(userId, authentication);
        bookmarkService.removeBookmarkByUserAndScheme(userId, schemeId);
        return ResponseEntity.noContent().build();
    }

    private void requireOwnAccount(Long userId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
        if (!user.getId().equals(userId)) {
            throw new AccessDeniedException("You may only manage your own saved schemes");
        }
    }
}
