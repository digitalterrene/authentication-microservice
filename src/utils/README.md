# API Security Documentation

## Overview

This API employs robust security practices to ensure the integrity and confidentiality of user data. It utilizes JWT (JSON Web Tokens) for user authentication, along with middleware to enforce access controls on sensitive routes. This documentation outlines the authentication mechanism and the protection of specific routes against unauthorized access.

## Authentication Mechanism

### JWT (JSON Web Tokens)

JWTs are used to verify the identity of users and to protect routes from unauthorized access. The process involves:

1.  **Token Creation**: Upon successful user registration or sign-in, a token is created using the `createToken` function:

```bash
const createToken = (_id) => {
 return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};
```

The token contains the user ID and is signed with a secret key defined in environment variables. It has an expiration time of 3 days.

2.  **Token Verification**: The `verifyToken` function checks the validity of the provided token:

```bash
const verifyToken = (token) => {
   try {
      const decoded = jwt.verify(token, process.env.SECRET);
      return decoded;
   } catch (error) {
      throw new Error("Invalid token");
   }
};
```

### Middleware: `authenticate`

The `authenticate` middleware enforces security by validating tokens and checking user permissions before granting access to protected routes. The key functionalities include:

#### Protected Routes

The following routes are protected and require proper authentication:
PUT requests (e.g., `/update-single-data/:key/:value`)
GET requests (e.g., `/fetch-single-data/:key/:value`)

#### Access Control Logic

1.  **Admin Access** : If the user has an admin role, they are granted access to all methods without additional checks.
    ```bash
    if (authentication_microservice_ecosystem_admin === "dashboards") {
    next(); // Grant access
    }
    ```
2.  **Token Presence and Validity**: If the request method is either `GET`, `PUT`, or `DELETE`, the middleware checks for the presence of an authorization token:
    ```bash
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
       return res.status(401).json({ error: "Unauthorized - Token missing" });
    }
    ```
3.  **User ID Verification**: The middleware ensures the `authentication_microservice_account_user_id` matches the decoded user ID from the token:
    ```bash
    if (authentication_microservice_account_user_id !== decoded?._id) {
    return res.status(401).json({ error: "Unauthorized Access - Token does not belong to you" });
    }
    ```
4.  **Resource Ownership Check**: It verifies that the user can only access their data, preventing unauthorized data access:
    ```bash
    if (value !== decoded?._id) {
    return res.status(401).json({ error: "Unauthorized Access - Accessing someone else's information" });
    }
    ```
5.  **Invalid Token Handling**: If the token is invalid or expired, the middleware returns a 401 Unauthorized response:
    ```bash
    catch (error) {
       return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
    ```

### Data Validation

The API includes data validation to ensure the integrity of user input:

1.  **Email Validation**: The `validateEmail` function checks for required fields and valid email formats:

    ```bash
    const validateEmail = (email) => {
    if (!email) {
       return { error: "Email is required!" };
    } else if (!validator.isEmail(email)) {
       return { error: "Email is invalid" };
    } else {
       return { message: "Success" };
    }
    };
    ```

2.  **Password Validation**: The `validatePassword` function ensures strong passwords:
    ```bash
    const validatePassword = (password) => {
    if (!password) {
       return { error: "Password is required!" };
    } else if (!validator.isStrongPassword(password)) {
       return { error: "Password is invalid" };
    } else {
       return { message: "Success" };
    }
    };
    ```

### Conclusion

This API's architecture incorporates a secure authentication mechanism that utilizes JWTs, alongside comprehensive middleware to enforce access controls and ensure that users can only interact with their own data. By implementing these security measures, the API safeguards sensitive user information and maintains a robust defense against unauthorized access.
