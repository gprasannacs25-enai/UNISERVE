# UniServe · BMSCE

One platform. Every campus service. Frontend prototype for BMS College of Engineering (React + Vite).

## Run

```
npm install
npm run dev
```

Open http://localhost:5173/

## Demo accounts (password: `demo123`)

| Role    | Login                    |
|---------|--------------------------|
| Student | `1BM24CS001`             |
| Staff   | `kavitha@bmsce.ac.in`    |
| Admin   | `admin@bmsce.ac.in`      |

## Status

Done (frontend only, dummy data stored in browser localStorage):
- Login, registration (USN + @bmsce.ac.in validation), role-based routing
- Student: home, services (document / service / complaint / maintenance), My requests with timeline, UniHelp, availability (notify + book), notifications, profile
- Staff: overview, request list with search and status filter, status updates and comments, availability management, UniHelp
- Admin: overview with overdue requests, all requests with reassignment, users, departments, reports

Not done yet:
- Backend (Node, Express, MongoDB, JWT). Route guards here are UX only; the backend must enforce real authorization.
- Real file upload, real notifications, real appointment booking
- Admin role/permission editing, user create/disable, system settings
- Staff-specific screens beyond the shared request view

## Customising for BMSCE

All college-specific data (offices, services, branches, sample users) is in `src/data/bmsce.js`. Replace the sample offices and services with the real ones. The single accent colour is `--accent` in `src/index.css`.

## Structure

```
src/
  context/   AppContext.jsx   (state + localStorage; swap for API calls later)
  data/      bmsce.js         (campus data)
  components/ layouts/ pages/{auth,student,staff,admin}
```
