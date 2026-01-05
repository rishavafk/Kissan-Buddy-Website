-- STEP 2: Run this after creating tables to insert test user
-- This creates a test user with username: farmer1, password: password123

INSERT INTO users (username, email, password, full_name, role)
VALUES (
  'farmer1',
  'farmer1@example.com',
  '$2b$10$ITOAicsj1lEPrdK0ttJG/.MXbRHaNX47eFT6.zeGDxqe4agAKydUa',
  'Rajesh Kumar',
  'farmer'
);
