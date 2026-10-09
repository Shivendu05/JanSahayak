package com.jansahayak;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RoleAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void anonymousUser_cannotCreateResource() throws Exception {
        mockMvc.perform(post("/api/resources")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"name\":\"Test\",\"description\":\"Test\",\"category\":\"Test\",\"officialUrl\":\"https://example.gov.in\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void citizenSession_cannotCreateResource() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"name\":\"Citizen\",\"email\":\"citizen-role-test@example.com\",\"password\":\"citizen123\"}"))
                .andExpect(status().isOk());

        MvcResult login = mockMvc.perform(post("/api/auth/login/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"citizen-role-test@example.com\",\"password\":\"citizen123\"}"))
                .andExpect(status().isOk())
                .andReturn();

        var session = login.getRequest().getSession(false);
        assertNotNull(session, "Successful citizen login must persist a session");
        mockMvc.perform(post("/api/resources")
                .session((org.springframework.mock.web.MockHttpSession) session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"name\":\"Test\",\"description\":\"Test\",\"category\":\"Test\",\"officialUrl\":\"https://example.gov.in\"}"))
                .andExpect(status().isForbidden());
    }
}