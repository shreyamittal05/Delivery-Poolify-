import { createContext, useState } from 'react';

// Initial Mock Data - Delivery Boys
const initialDeliveryBoys = [
  { db_id: 1, name: "Rajesh Kumar", current_society: "Green Valley", is_available: true, assigned_request_id: null },
  { db_id: 2, name: "Amit Sharma", current_society: "Palm Heights", is_available: true, assigned_request_id: null },
  { db_id: 3, name: "Vikram Singh", current_society: "Sunrise Apartments", is_available: false, assigned_request_id: 105 },
  { db_id: 4, name: "Priya Desai", current_society: "Green Valley", is_available: true, assigned_request_id: null },
  { db_id: 5, name: "Ravi Patel", current_society: "Palm Heights", is_available: true, assigned_request_id: null }
];

// Initial Mock Data - Tasks (Requests)
const initialTasks = [
  { request_id: 101, client_name: "Blinkit", pickup_society: "Green Valley", dropoff_society: "Palm Heights", status: "PENDING", assigned_to: null, customer_name: "Rohit Sharma", order_value: 450 },
  { request_id: 102, client_name: "Swiggy", pickup_society: "Sunrise Apartments", dropoff_society: "Green Valley", status: "PENDING", assigned_to: null, customer_name: "Anjali Mehta", order_value: 320 },
  { request_id: 103, client_name: "Zomato", pickup_society: "Palm Heights", dropoff_society: "Green Valley", status: "PENDING", assigned_to: null, customer_name: "Karan Singh", order_value: 550 },
  { request_id: 104, client_name: "Dunzo", pickup_society: "Green Valley", dropoff_society: "Sunrise Apartments", status: "PENDING", assigned_to: null, customer_name: "Neha Kapoor", order_value: 280 },
  { request_id: 105, client_name: "Blinkit", pickup_society: "Sunrise Apartments", dropoff_society: "Palm Heights", status: "ASSIGNED", assigned_to: 3, customer_name: "Sanjay Gupta", order_value: 620 }
];

// Create context
const DataContext = createContext();

// Provider component
export const DataProvider = ({ children }) => {
  const [deliveryBoys, setDeliveryBoys] = useState(initialDeliveryBoys);
  const [tasks, setTasks] = useState(initialTasks);

  /**
   * Core Assignment Function
   * Assigns the best available delivery boy to a task based on priority logic
   * Priority 1: Delivery boy at dropoff location (OPTIMAL - no fuel needed for delivery)
   * Priority 2: Delivery boy at pickup location (closest to start point)
   */
  const assignBestDeliveryBoy = (task) => {
    console.log(`\n=== Assignment Logic for Request #${task.request_id} ===`);
    console.log(`Task: ${task.client_name} | Pickup: ${task.pickup_society} | Dropoff: ${task.dropoff_society}`);

    // Filter available delivery boys
    const availableDeliveryBoys = deliveryBoys.filter(db => db.is_available);
    console.log(`Available Delivery Boys: ${availableDeliveryBoys.map(db => db.name).join(', ') || 'None'}`);

    if (availableDeliveryBoys.length === 0) {
      console.log('❌ No available delivery boys. Assignment failed.');
      return { success: false, message: 'No available delivery boys at the moment!' };
    }

    let selectedDeliveryBoy = null;
    let matchPriority = null;

    // Priority 1: Find delivery boy at dropoff location (OPTIMAL match)
    const priority1Match = availableDeliveryBoys.find(
      db => db.current_society === task.dropoff_society
    );

    if (priority1Match) {
      selectedDeliveryBoy = priority1Match;
      matchPriority = 1;
      console.log(`✅ Priority 1 Match Found: ${selectedDeliveryBoy.name} is at ${task.dropoff_society} (dropoff location)`);
      console.log('   → OPTIMAL: Delivery boy is already at final destination - Maximum fuel saving!');
    } else {
      console.log(`⚠️ Priority 1: No delivery boy found at dropoff location (${task.dropoff_society})`);
      
      // Priority 2: Find delivery boy at pickup location
      const priority2Match = availableDeliveryBoys.find(
        db => db.current_society === task.pickup_society
      );

      if (priority2Match) {
        selectedDeliveryBoy = priority2Match;
        matchPriority = 2;
        console.log(`✅ Priority 2 Match Found: ${selectedDeliveryBoy.name} is at ${task.pickup_society} (pickup location)`);
        console.log('   → GOOD: Delivery boy is at pickup point - Saves travel to pickup!');
      } else {
        console.log(`⚠️ Priority 2: No delivery boy found at pickup location (${task.pickup_society})`);
      }
    }

    // If no match found based on priorities
    if (!selectedDeliveryBoy) {
      console.log('❌ No matching delivery boy found based on priority rules.');
      return { 
        success: false, 
        message: `No suitable delivery boy found for this task. No one is at ${task.pickup_society} or ${task.dropoff_society}.` 
      };
    }

    // Update state with assignment
    console.log(`\n📋 Assigning Request #${task.request_id} to ${selectedDeliveryBoy.name} (Priority ${matchPriority} match)`);

    // Update delivery boys state
    setDeliveryBoys(prevDeliveryBoys => 
      prevDeliveryBoys.map(db => 
        db.db_id === selectedDeliveryBoy.db_id
          ? { ...db, is_available: false, assigned_request_id: task.request_id }
          : db
      )
    );

    // Update tasks state
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.request_id === task.request_id
          ? { ...t, status: 'ASSIGNED', assigned_to: selectedDeliveryBoy.db_id }
          : t
      )
    );

    console.log(`✅ Assignment Complete! ${selectedDeliveryBoy.name} is now busy with Request #${task.request_id}\n`);
    
    return { 
      success: true, 
      message: `Task #${task.request_id} assigned to ${selectedDeliveryBoy.name} (Priority ${matchPriority} match)`,
      deliveryBoy: selectedDeliveryBoy,
      priority: matchPriority
    };
  };

  // Start delivery - changes task status to IN_PROGRESS
  const startDelivery = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.request_id === taskId
          ? { ...t, status: 'IN_PROGRESS' }
          : t
      )
    );
    console.log(`🚀 Delivery started for Request #${taskId}`);
    return { success: true, message: `Delivery started for Request #${taskId}` };
  };

  // Complete delivery - changes task status to COMPLETED and makes delivery boy available
  const completeDelivery = (taskId, dbId) => {
    // Get the task to update delivery boy location to dropoff
    const task = tasks.find(t => t.request_id === taskId);
    
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.request_id === taskId
          ? { ...t, status: 'COMPLETED' }
          : t
      )
    );

    setDeliveryBoys(prevDeliveryBoys => 
      prevDeliveryBoys.map(db => 
        db.db_id === dbId
          ? { 
              ...db, 
              is_available: true, 
              assigned_request_id: null,
              current_society: task?.dropoff_society || db.current_society
            }
          : db
      )
    );

    console.log(`✅ Delivery completed for Request #${taskId}. Delivery boy is now available.`);
    return { success: true, message: `Delivery completed for Request #${taskId}!` };
  };

  // Get delivery boy by ID
  const getDeliveryBoyById = (dbId) => {
    return deliveryBoys.find(db => db.db_id === parseInt(dbId));
  };

  // Get task by ID
  const getTaskById = (taskId) => {
    return tasks.find(t => t.request_id === parseInt(taskId));
  };

  // Get tasks assigned to a specific delivery boy
  const getTasksForDeliveryBoy = (dbId) => {
    return tasks.filter(t => t.assigned_to === parseInt(dbId));
  };

  const value = {
    deliveryBoys,
    tasks,
    assignBestDeliveryBoy,
    startDelivery,
    completeDelivery,
    getDeliveryBoyById,
    getTaskById,
    getTasksForDeliveryBoy
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
