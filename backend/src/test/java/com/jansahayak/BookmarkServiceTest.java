package com.jansahayak;

import com.jansahayak.entity.Bookmark;
import com.jansahayak.entity.Scheme;
import com.jansahayak.entity.User;
import com.jansahayak.repository.BookmarkRepository;
import com.jansahayak.repository.SchemeRepository;
import com.jansahayak.repository.UserRepository;
import com.jansahayak.service.BookmarkService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookmarkServiceTest {

    @Mock
    private BookmarkRepository bookmarkRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SchemeRepository schemeRepository;

    @InjectMocks
    private BookmarkService bookmarkService;

    @Test
    void removeBookmarkByUserAndScheme_should_delete_matching_bookmark() {
        User user = new User();
        user.setId(1L);
        Scheme scheme = new Scheme();
        scheme.setId(2L);

        Bookmark bookmark = new Bookmark(user, scheme);
        bookmark.setId(10L);

        when(bookmarkRepository.findByUserIdAndSchemeId(1L, 2L)).thenReturn(Optional.of(bookmark));

        bookmarkService.removeBookmarkByUserAndScheme(1L, 2L);

        verify(bookmarkRepository).delete(bookmark);
    }
}
