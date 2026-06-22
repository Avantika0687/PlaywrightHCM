Feature: OrangeHRM User Management

  As an Admin user
  I want to manage system users
  So that I can create, update and remove users

  Scenario: Admin creates updates and deletes a user

    Given Admin is logged into OrangeHRM

    And Admin navigates to the System Users page

    When Admin creates a new user

    Then The user should be displayed with status "Enabled"

    When Admin updates the user status to "Disabled"

    Then The user should be displayed with status "Disabled"

    When Admin deletes the user

    Then The user should not be displayed in the user list