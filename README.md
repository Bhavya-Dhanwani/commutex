## Setup Instructions

```bash
git clone https://github.com/Bhavya-Dhanwani/commutex
```

### Backend

```bash
cd server
npm install
cp .env.example .env
```

- Setup your own env variables in .env

```bash
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev
```

### Frontend

```bash
cd client
npm install
cp .env.example .env
```

- Setup your own env variables in .env

```bash
npm run dev
```
