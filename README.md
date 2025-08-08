# Relivault

Relivault is a platform for transparent and secure tracking of disaster relief funds.  
It uses IPFS for tamper-proof document storage, role-based access for secure operations, and real-time dashboards for fund flow monitoring.

---

## 🚀 Features

- **Transparent Fund Tracking** – Real-time view of donations, claims, and disbursements.
- **Immutable Document Storage** – IPFS integration ensures files cannot be altered.
- **Role-Based Access** – Secure access control for Victims, NGOs, Donors, and Admins.
- **Real-Time Dashboards** – Visualize fund flow, transactions, and statistics instantly.
- **NFT-Based Donor Recognition** – Reward donors with digital certificates of appreciation.
- **Secure Authentication** – Firebase Auth with role verification.
- **MetaMask Integration** – Seamless wallet connection for transactions.

---

## 🛠️ Tech Stack

**Frontend**  
- React, Next.js, TypeScript, Tailwind CSS  
- Recharts (data visualization)  
- MetaMask integration  

**Backend**  
- Node.js, Express.js, MongoDB  
- Ethers.js for blockchain interaction  
- Firebase Admin SDK for authentication  

**Storage & Blockchain**  
- IPFS for document storage  
- Firebase Storage for media and real-time sync  
- Polygon (Mumbai Testnet) for transaction logging  

---

## 📂 Project Structure

Relivault/
├── backend/ # Node.js + Express.js API
├── frontend/ # Next.js + React UI
├── contracts/ # Smart contracts (Solidity)
├── docs/ # Documentation & diagrams
└── README.md # Project overview


---

## ⚙️ Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- MetaMask browser extension
- Firebase project configured

### Steps
1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/relivault.git
   cd relivault
Install dependencies

Backend:

bash
Copy
Edit
cd backend
npm install
Frontend:

bash
Copy
Edit
cd ../frontend
npm install
Set up environment variables
Create .env files in backend/ and frontend/ with:

ini
Copy
Edit
MONGO_URI=your_mongodb_connection
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
IPFS_API_URL=your_ipfs_gateway
Run the application

Backend:

bash
Copy
Edit
npm run dev
Frontend:

bash
Copy
Edit
npm run dev
📊 Usage
Connect Wallet – Log in with MetaMask to authenticate.

Submit Claims/Donations – Victims and NGOs can submit fund requests; donors can donate securely.

View Dashboard – Track fund flows, verify documents, and see transaction history.

🔒 Security
End-to-end encryption for sensitive data.

IPFS for immutable file storage.

Role-based access to prevent unauthorized actions.

📜 License
This project is licensed under the MIT License.

🤝 Contributing
Contributions are welcome! Please fork the repo and submit a pull request.

