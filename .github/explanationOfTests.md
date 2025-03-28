# ChatHaven Testing Suite Explanation

This document provides an overview of our testing strategy, divided by test type: Unit Tests, Integration Tests, and Acceptance Tests. Each section explains what tests are included and their purpose.

## Test Count Summary

| Test Type | Number of Tests |
|-----------|----------------|
| Unit Tests | 21 |
| Integration Tests | 5 |
| Acceptance Tests | 15 |
| End-to-End Tests | 1 |
| Performance Tests | 7 |
| Accessibility Tests | 3 |
| Visual Regression Tests | 2 |
| **Total** | **54** |

## Unit Tests

Unit tests focus on testing individual components or functions in isolation. These tests verify that each piece of code works correctly on its own.

### Authentication Unit Tests
- **Login Tests**: Verify input validation, form submission handling, and authentication logic for the login component.
- **Sign Up Tests**: Test validation logic, username availability checks, and user registration functionality.
- **Forgot Password Tests**: Test email validation and password reset request handling.

### Security Unit Tests
- **Password Hashing Tests**: Verify that password hashing functions work correctly, including:
  - Proper hashing of passwords (not stored as plaintext)
  - Correct hash verification for valid passwords
  - Failed verification for incorrect passwords
  - Error handling in hash functions
- **XSS Prevention Tests**: Check that user-generated content is properly sanitized to prevent cross-site scripting attacks.

### Messaging Component Unit Tests
- **Direct Messaging Tests**: Verify the functionality of message input, message display, and user selection.
- **Server Messaging Tests**: Test server list display, channel list display, and settings popup functionality.

### UI Component Unit Tests
- **Homepage Tests**: Verify tab switching between DM and Server sections, and test profile popup toggle functionality.
- **Profile Page Tests**: Test profile information display and the ability to update profile pictures.

## Integration Tests

Integration tests verify how different components work together, ensuring that the interfaces between components function correctly.

### Authentication Flow Tests
- Test the entire flow from sign-up to login to password reset, verifying that all components work together correctly.
- Test error handling across authentication components.

### Messaging Flow Tests
- Test the flow from selecting a conversation to sending and receiving messages.
- Verify message persistence between page reloads.
- Test real-time message updates across clients.

### Server Management Flow Tests
- Test creating servers, channels, and managing members.
- Verify permission checks and role-based access.
- Test server-wide notifications and updates.

## Acceptance Tests

Acceptance tests verify that the application meets the user requirements and works correctly from an end-user perspective.

### Authentication Acceptance Tests
- **Login Page**: Verify that the login page renders correctly, shows validation messages for empty fields, and has links to Sign Up and Forgot Password pages.
- **Sign Up Page**: Test that the sign-up page renders correctly, username validation works, and the form links back to the Login page.
- **Forgot Password Page**: Confirm the page renders correctly, validates email input, and provides a way to return to the Login page.

### Messaging Acceptance Tests
- **Direct Messages UI**: Verify that the direct messaging interface renders correctly with all required elements (chat container, sidebar, messages area, input field).
- **Server Interface**: Test that the server interface correctly displays all components (server list, channel view, message area).

### Navigation Acceptance Tests
- **Homepage Navigation**: Test switching between DM and Server tabs, profile popup functionality, and overall layout.

### User Profile Acceptance Tests
- **Profile Management**: Verify the profile page shows correct user information and allows changing profile pictures.

## End-to-End Tests

End-to-end tests verify the complete user journey through the application.

### Full User Journey Tests
- Test the entire application flow from registration to sending messages in both direct messages and server channels.
- Verify that a user can:
  1. Register a new account
  2. Log in successfully
  3. Navigate the homepage
  4. Create or join a server
  5. Send messages in different contexts
  6. Update profile information

## Performance Tests

Performance tests evaluate how your application performs under various conditions.

### Load Testing
- Tests how the app handles normal expected traffic (response times, throughput).

### Stress Testing
- Tests how the app handles peak loads beyond normal usage (breaking points, recovery).

### Browser Performance Testing
- Checks metrics like page load times, rendering performance, and memory usage.

### Firebase Database Performance Tests
- Tests the responsiveness of database operations like reads, writes, and queries.

## Accessibility Tests

Accessibility tests verify that your application is usable by people with disabilities.

### Accessibility Compliance Tests
- Check that the application meets standard accessibility guidelines (WCAG).

## Visual Regression Tests

Visual regression tests ensure that UI changes don't break the existing design.

### Visual Appearance Tests
- Compare screenshots of UI components against baseline images to detect visual changes.

# Running Tests

Some tests are skipped by default due to being resource-intensive or costly time-wise. To run these tests, you need to manually trigger them from the GitHub UI:

1. Click on the "Actions" tab
2. Select the appropriate workflow from the list
3. Click on the "Run workflow" button

## Available Workflows
- Acceptance Tests
- Integration Tests
- Unit Tests
- Performance Tests
- Visual Regression Tests (manual trigger only)
