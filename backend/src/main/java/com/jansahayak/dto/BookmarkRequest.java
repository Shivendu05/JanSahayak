package com.jansahayak.dto;

import jakarta.validation.constraints.NotNull;

public record BookmarkRequest(
        @NotNull(message = "User ID is required") Long userId,

        @NotNull(message = "Scheme ID is required") Long schemeId) {
}
