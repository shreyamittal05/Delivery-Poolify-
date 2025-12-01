# Poolify - Intelligent Delivery Assignment System

A Proof-of-Concept (PoC) full-stack React application that intelligently assigns delivery tasks to available delivery personnel based on simplified location matching (Society names).

## 🚀 Features

- **Smart Assignment Logic**: Automatically assigns delivery boys based on location proximity
- **Priority-Based Matching**:
  - Priority 1: Delivery boy at dropoff location (OPTIMAL - maximum fuel saving)
  - Priority 2: Delivery boy at pickup location (closest to start point)
- **Real-time UI Updates**: Instant visual feedback when assignments are made
- **Multi-View Application**:
  - Landing Page with role selection
  - Admin Dashboard for managing all tasks and delivery personnel
  - Delivery Partner View for individual delivery boy management
- **Task Lifecycle Management**: Track tasks from PENDING → ASSIGNED → IN_PROGRESS → COMPLETED

## 📋 Requirements

- Node.js (v16 or higher)
- npm (v7 or higher)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/mittalkartikey11/poolify.git
cd poolify
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
poolify/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx           # Role selection page
│   │   ├── LandingPage.css           # Landing page styles
│   │   ├── PoolifyDashboard.jsx      # Admin dashboard component
│   │   ├── PoolifyDashboard.css      # Dashboard styles
│   │   ├── DeliveryPartnerView.jsx   # Partner view component
│   │   └── DeliveryPartnerView.css   # Partner view styles
│   ├── context/
│   │   └── DataContext.jsx           # Shared state context
│   ├── hooks/
│   │   └── useData.js                # Custom hook for data access
│   ├── App.jsx                       # Root component with routing
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles
├── index.html
├── package.json
└── README.md
```

## 🗺️ Routing

The application uses React Router for navigation:

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Role selection (Admin or Delivery Partner) |
| `/admin` | PoolifyDashboard | Admin dashboard to manage tasks |
| `/partner/:db_id` | DeliveryPartnerView | Individual delivery partner view |

## 🎯 How It Works

### Mock Data

The application uses in-memory mock data for:
- **Delivery Boys**: Each has an ID, name, current location (society), and availability status
- **Tasks**: Each has a request ID, client name, pickup/dropoff locations, customer info, order value, and status

### Assignment Algorithm

When you click "Run Assignment" on a pending task:

1. **Filter**: Only available delivery boys are considered
2. **Priority 1 (Optimal)**: Find a delivery boy already at the dropoff location
3. **Priority 2 (Good)**: If no Priority 1 match, find one at the pickup location
4. **Assignment**: Update task status to "ASSIGNED" and delivery boy to "Busy"

### Delivery Workflow

1. **Admin assigns task** → Task status changes to "ASSIGNED"
2. **Partner starts delivery** → Task status changes to "IN_PROGRESS"
3. **Partner completes delivery** → Task status changes to "COMPLETED", partner becomes available

### Console Logging

Open your browser's developer console (F12) to see detailed assignment logic:
- Which delivery boys are available
- Which priority match was found
- Final assignment details

## 🎨 UI Components

### Landing Page
- Modern welcome screen with Poolify branding
- Role selection cards (Admin or Delivery Partner)
- Delivery partner dropdown for login

### Admin Dashboard (Pending Tasks Panel)
- Lists all tasks with status "PENDING"
- Shows request ID, client name, customer, pickup and dropoff locations, order value
- "Run Assignment" button for each task
- Active tasks section for assigned/in-progress tasks

### Admin Dashboard (Delivery Boy Status Panel)
- Shows all delivery personnel as cards
- Color-coded availability (green = Available, red = Busy)
- Displays current location and assigned task (if any)
- Clickable cards to view partner details

### Delivery Partner View
- Welcome header with partner info and status
- Active task card with full details (customer, locations, order value)
- Action buttons: "Start Delivery" and "Complete Delivery"
- Completed deliveries history section

## 🔧 Built With

- [React](https://react.dev/) - Frontend library
- [React Router](https://reactrouter.com/) - Client-side routing
- [Vite](https://vitejs.dev/) - Build tool
- CSS3 - Modern styling with cards, animations, and responsive design

## 📝 Notes

- This is a PoC application - all data is stored in memory
- No backend server or external APIs are used
- Refreshing the page resets all data to initial state

## 📄 License

This project is open source and available under the MIT License.
