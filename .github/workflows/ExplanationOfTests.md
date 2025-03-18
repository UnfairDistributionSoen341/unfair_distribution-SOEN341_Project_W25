# Description of each tests:
## 1. Authentication Tests
These tests verify that your user authentication system works correctly:

### Login Tests: 
Verify that users can log in with correct credentials, that login fails with incorrect credentials, and that validation prevents submission of empty fields.
### Sign Up Tests: 
Ensure that new user registration works, that username validation prevents duplicate usernames, and that password security requirements are met.
Forgot Password Tests: Test that password reset functionality sends reset emails correctly and validates email inputs.

## 2. Security Tests
These verify that your application's security measures work as expected:

### Password Hashing Tests: 
Confirm that passwords are properly hashed (not stored in plaintext), that the hashing algorithm works correctly, and that password comparison functions work for both correct and incorrect passwords.
### XSS Prevention Tests: 
Check that user-generated content (like messages) is properly sanitized to prevent cross-site scripting attacks.

## 3. Messaging Tests
These verify the core functionality of your chat application:

### Direct Messaging Tests: 
Test sending and receiving direct messages, message display formatting, and handling empty messages.
### Server Messaging Tests: 
Check server/channel creation, displaying channels, and sending messages within channels.

## 4. UI Component Tests
These verify that the interface works as expected:

### Homepage Tests: 
Verify tab switching between DM and Server sections, and test that the profile popup opens and closes correctly.
### Profile Page Tests: 
Test the profile information display and ability to update profile pictures.

## 5. Integration Tests
These test how different components work together:

### Authentication Flow Tests: 
Test the entire flow from sign-up to login to password reset.
### Messaging Flow Tests: 
Test the flow from selecting a conversation to sending and receiving messages.
### Server Management Flow Tests: 
Test creating servers, channels, and managing members.

## 6. End-to-End Tests
These test the complete user experience:

### Full User Journey Tests: 
Test the entire application flow from registration to sending messages in both direct messages and server channels.

## 7. Performance Tests
These evaluate how your application performs under various conditions:

### Load Testing: 
Tests how the app handles normal expected traffic.
### Stress Testing: 
Tests how the app handles peak loads beyond normal usage.
### Browser Performance Testing: 
Checks metrics like page load times, rendering performance, etc.
### Firebase Database Performance Tests: 
Tests the responsiveness of database operations like reads, writes, and queries.

## 8. Accessibility Tests
These verify that your application is usable by people with disabilities:

### Accessibility Compliance Tests: 
Check that the application meets standard accessibility guidelines (WCAG).

## 9. Visual Regression Tests
These ensure that UI changes don't break the existing design:

### Visual Appearance Tests: 
Compare screenshots of UI components against baseline images to detect visual changes.

# To note: 
Some testes are skipped due to them bieng ressource intensive, the slowdown of automatic feedback and being costly time wise. 
Hence if you want to run then you would need to manually trigger them from the GitHub UI:

- Click on the "Actions" tab
- Select the appropriate workflow from the list
- Click on the "Run workflow" button

