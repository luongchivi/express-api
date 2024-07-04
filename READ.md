### Auth endpoint

URL: /api/v1/auth/signup

Method: POST

Description: 
- Create new user, everyone can access 
- after create user have role is 'User'
- Everyone can access

URL: /api/v1/auth/login

Method: POST

Description: 
- Login with account (email, password), return accessToken and refreshToken
- Everyone can access

URL: /api/v1/auth/refresh-token

Method: POST

Description: 
- Send refreshToken and get back new accessToken with new expires
- Everyone can access

### User endpoint

URL: /api/v1/users

Method: GET

Description: 
- Get all users
- Only Admin role can access

URL: /api/v1/users/{id}

Method: GET

Description: 
- Get user details by id
- Admin and User role can access 

URL: /api/v1/users/{id}

Method: PATCH

Description: 
- User can only update first_name, last_name, email, password
- Admin and User role can access

### Role endpoint (only Admin has privilege)

URL: /api/v1/roles

Method: POST

Description:
- Create new role
- Only Admin role can access

URL: /api/v1/roles

Method: GET

Description:
- Get all roles
- Only Admin role can access

URL: /api/v1/roles/{id}

Method: GET

Description:
- Get role by id
- Only Admin role can access

URL: /api/v1/roles/{id}

Method: PUT

Description:
- Update all field role by id
- Only Admin role can access

URL: /api/v1/roles/{id}

Method: DELETE

Description:
- Delete role by id
- Only Admin role can access

### UserRole endpoint (add role for user, only Admin has privilege)

URL: /api/v1/users/{userId}/roles

Method: GET

Description:
- Get list roles of User
- Only Admin role can access

URL: /api/v1/users/{userId}/roles

Method: POST

Description:
- Assign role for user 
- Input userId param get user and add body request roleName = "role_name"
- Only Admin role can access

URL: /api/v1/users/{userId}/roles

Method: DELETE

Description:
- Delete role of user
- Input userId param get user and add body request roleName = "role_name"
- Only Admin role can access

### Permission endpoint (only Admin has privilege)

URL: /api/v1/permissions

Method: POST

Description:
- Add new permission
- Only Admin role can access

URL: /api/v1/permissions

Method: GET

Description:
- Get all permissions
- Only Admin role can access

URL: /api/v1/permissions/{id}

Method: GET

Description:
- Get permission details by id
- Only Admin role can access

URL: /api/v1/permissions/{id}

Method: DELETE

Description:
- Delete permission by id
- Only Admin role can access

### RolePermission endpoint (add permission for role, only Admin has privilege)

URL: /api/v1/roles/{rolesId}/permissions

Method: GET

Description:
- Get all permissions of role
- Only Admin role can access

URL: /api/v1/roles/{rolesId}/permissions

Method: POST

Description:
- Assign permission for role
- Input roleId param get role and add body request permissionName = "permission_name"
- Only Admin role can access

URL: /api/v1/roles/{rolesId}/permissions

Method: DELETE

Description:
- Delete permission of role
- Input roleId param get role and add body request permissionName = "permission_name"
- Only Admin role can access

### Address endpoint (Address and User have relational One to One)

URL: /api/v1/user/address

Method: POST

Description: 
- Create address for user
- Admin and User role can access

URL: /api/v1/user/address

Method: GET

Description:
- Get address information details
- Admin and User role can access

URL: /api/v1/user/address

Method: PUT

Description:
- Update all field in address
- Admin and User role can access

URL: /api/v1/address/{id}

Method: DELETE

Description:
- Delete address by addressId
- Admin and User role can access
