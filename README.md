# Secure Membership Portal (MERN Stack)

A production-ready, passwordless membership management system featuring OTP-based authentication via SMS (Fast2SMS) and Email, secure session management with HttpOnly JWT cookies, and an enterprise-grade security architecture.

## 🚀 Key Features

- **Passwordless Authentication**: Users log in using 6-digit OTPs sent via SMS or Email.
- **Multi-Channel Verification**: Toggle between Mobile (SMS) and Email verification methods.
- **Secure Sessions**: JWTs are stored exclusively in `HttpOnly`, `Secure`, and `SameSite: Lax` cookies to prevent XSS and CSRF attacks.
- **Profile Management**: Authenticated users can manage their name, email, and mobile identifiers.
- **Advanced Security**:
    - OTPs are never stored in plain text; they are hashed using **HMAC-SHA256**.
    - **Rate Limiting** on all API endpoints (IP + Mobile/Email based).
    - **Security Headers** implemented via Helmet.
    - **Sparse Indexing** in MongoDB to support flexible identity (Mobile or Email).
- **Modern UI/UX**: Built with React and Tailwind CSS, featuring a responsive split-screen layout and accessible OTP inputs.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons (conceptual).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose ODM.
- **Authentication**: JWT (JsonWebToken), Cookie-Parser.
- **SMS Provider**: Fast2SMS (Production route).
- **Security**: Crypto (Node.js native), Express-Rate-Limit, Helmet.

## 📂 Project Structure

```text
membership-portal/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (OTPInput, etc.)
│   │   ├── pages/          # Login & Dashboard views
│   │   ├── services/       # API Integration logic
│   │   └── types.ts        # Global TypeScript definitions
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # DB & Environment config
│   │   ├── controllers/    # Business logic (Auth, Profile)
│   │   ├── models/         # Mongoose Schemas (Member)
│   │   ├── middleware/     # JWT Protection & Validation
│   │   └── routes/         # Express API Endpoints
└── .env                    # Environment Variables (Secrets)
```

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account or Local MongoDB instance.
- Fast2SMS API Key (for production SMS).

### 2. Backend Setup
1. Navigate to the `server/` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on the template below.
4. Start the server: `npm run dev`.

### 3. Frontend Setup
1. Navigate to the `client/` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

## 🔑 Environment Variables (`.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/membership

# Security
JWT_SECRET=your_ultra_secure_jwt_secret_key
OTP_SECRET=your_hmac_sha256_secret_key

# SMS Provider (Fast2SMS)
FAST2SMS_API_KEY=your_fast2sms_api_key
```

## 🔐 Security Protocols

### OTP Flow
1. **Request**: Backend generates a random 6-digit string.
2. **Hashing**: The string is combined with the user identifier and hashed using `HMAC-SHA256`.
3. **Storage**: Only the hash, expiry (5 mins), and attempt count are stored in the DB.
4. **Verification**: User provides the OTP; Backend re-hashes it. If hashes match and the window is valid, the user is authenticated.
5. **Invalidation**: OTP hash is cleared immediately after success or after 5 failed attempts.

### Session Management
The system utilizes a stateless JWT approach. Upon successful verification, a JWT is signed and sent to the client via a `Set-Cookie` header. This prevents the frontend JavaScript from accessing the token, effectively neutralizing XSS token theft.

## 🧪 Testing Guidelines

- **OTP Demo**: Use code `123456` for the simulated environment.
- **Expiry**: Set `.env` to a short window to test the 5-minute timeout.
- **Rate Limit**: Attempt more than 5 OTP requests within an hour to trigger the security block.

---
*Built with ❤️ by a Senior MERN Architect.*
