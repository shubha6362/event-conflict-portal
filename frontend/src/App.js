// import React, { useState, useEffect } from 'react';
// import './App.css';

// const API_URL = 'http://localhost:5000/api/events';

// function App() {
//   const [events, setEvents] = useState([]);
//   const [formData, setFormData] = useState({
//     title: '', organizer: '', venue: 'Auditorium 1', date: '', startTime: '', endTime: '', facultyInCharge: '', type: 'Seminar'
//   });
//   const [conflictStatus, setConflictStatus] = useState({ conflict: false, reasons: [], checked: false });

//   const fetchEvents = async () => {
//     try {
//       const response = await fetch(API_URL);
//       const resData = await response.json();
//       if (resData.success) setEvents(resData.data);
//     } catch (err) {
//       console.error("Error fetching events:", err);
//     }
//   };

//   useEffect(() => { fetchEvents(); }, []);

//   // Debounced live interval overlap analysis hook
//   useEffect(() => {
//     const checkLiveConflicts = async () => {
//       if (!formData.date || !formData.startTime || !formData.endTime || !formData.venue || !formData.facultyInCharge) {
//         setConflictStatus({ conflict: false, reasons: [], checked: false });
//         return;
//       }
//       try {
//         const response = await fetch(`${API_URL}/check-conflict`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData)
//         });
//         const checkResult = await response.json();
//         setConflictStatus({
//           conflict: checkResult.conflict,
//           reasons: checkResult.reasons || [checkResult.reason],
//           checked: true
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     const timer = setTimeout(() => { checkLiveConflicts(); }, 350);
//     return () => clearTimeout(timer);
//   }, [formData]);

//   const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (conflictStatus.conflict) return alert("Error: Resolve schedule intersection before saving!");
//     try {
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
//       const data = await response.json();
//       if (data.success) {
//         alert("🎉 Resource assigned cleanly with no conflicts!");
//         setFormData({ title: '', organizer: '', venue: 'Auditorium 1', date: '', startTime: '', endTime: '', facultyInCharge: '', type: 'Seminar' });
//         fetchEvents();
//       }
//     } catch (err) {
//       alert("Error contacting service");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Free this room assignment slot?")) return;
//     await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
//     fetchEvents();
//   };

//   return (
//     <div>
//       <header className="institute-header">
//         <h1>DAYANANDA SAGAR COLLEGE OF ENGINEERING</h1>
//         <h2>Autonomous Institution Approved by AICTE, Affiliated to VTU, Belagavi, Karnataka</h2>
//         <div className="dept-tag">Department of Computer Science & Engineering</div>
//       </header>

//       <div className="dashboard-container">
//         <div className="glass-card">
//           <h3 className="card-title">Event Scheduling Engine</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group"><label>Event / Lecture Title</label>
//               <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
//             </div>
//             <div className="form-group"><label>Event Category</label>
//               <select name="type" className="form-control" value={formData.type} onChange={handleInputChange}>
//                 <option value="Lecture">Lecture Class</option><option value="Workshop">Workshop</option>
//                 <option value="Seminar">Seminar</option><option value="Exam">Exam</option><option value="Cultural">Cultural</option>
//               </select>
//             </div>
//             <div className="form-group"><label>Organizing Body</label>
//               <input type="text" name="organizer" className="form-control" value={formData.organizer} onChange={handleInputChange} required />
//             </div>
//             <div className="form-group"><label>Target Venue</label>
//               <select name="venue" className="form-control" value={formData.venue} onChange={handleInputChange}>
//                 <option value="Auditorium 1">Dr. Premachandra Sagar Auditorium 1</option>
//                 <option value="Seminar Hall 2">C.D. Sagar Seminar Hall 2</option>
//                 <option value="CSE Lab 3">Turing Computing Lab 3 (CSE)</option>
//                 <option value="Classroom 401">CSE Block Room 401</option>
//               </select>
//             </div>
//             <div className="form-group"><label>Faculty Coordinator In-Charge</label>
//               <input type="text" name="facultyInCharge" className="form-control" value={formData.facultyInCharge} onChange={handleInputChange} required />
//             </div>
//             <div className="form-group"><label>Date</label>
//               <input type="date" name="date" className="form-control" value={formData.date} onChange={handleInputChange} required />
//             </div>
//             <div className="row-grid">
//               <div className="form-group"><label>Start (24h)</label>
//                 <input type="time" name="startTime" className="form-control" value={formData.startTime} onChange={handleInputChange} required />
//               </div>
//               <div className="form-group"><label>End (24h)</label>
//                 <input type="time" name="endTime" className="form-control" value={formData.endTime} onChange={handleInputChange} required />
//               </div>
//             </div>

//             {conflictStatus.checked && (
//               <div className={`conflict-checker-box ${conflictStatus.conflict ? 'has-conflict' : ''}`}>
//                 {conflictStatus.conflict ? (
//                   <div>
//                     <strong style={{ color: 'var(--danger)' }}>🚨 Scheduling Overlap Intercepted:</strong>
//                     <ul style={{ marginTop: '5px', paddingLeft: '15px' }}>
//                       {conflictStatus.reasons.map((r, i) => <li key={i}>{r}</li>)}
//                     </ul>
//                   </div>
//                 ) : (
//                   <span style={{ color: '#065f46' }}>✅ <strong>Interval Secure:</strong> Selected metrics do not collide with any current assets.</span>
//                 )}
//               </div>
//             )}
//             <button type="submit" className="btn btn-primary" disabled={conflictStatus.conflict}>Commit Allocation Slot</button>
//           </form>
//         </div>

//         <div className="glass-card">
//           <div className="timeline-header">
//             <h3 className="card-title">Live Institute Timeline Engine</h3>
//             <div className="stat-pill">Active Bookings: {events.length}</div>
//           </div>
//           <div className="events-list-wrapper">
//             {events.map(evt => (
//               <div className="event-strip" key={evt._id}>
//                 <div className="event-time-block">
//                   <div className="time-badge">{evt.startTime}-{evt.endTime}</div>
//                   <div className="date-badge">{evt.date}</div>
//                 </div>
//                 <div>
//                   <h4>{evt.title}</h4>
//                   <span className={`event-type-badge type-${evt.type}`}>{evt.type}</span>
//                 </div>
//                 <div className="meta-info-block"><strong>📍 {evt.venue}</strong><div>by {evt.organizer}</div></div>
//                 <div className="faculty-block">👤 Prof. {evt.facultyInCharge}</div>
//                 <div className="action-block"><button onClick={() => handleDelete(evt._id)}>Deallocate</button></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;





import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/events';

function App() {
  // Authentication States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // 'admin' or 'user'
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Scheduling and App States
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [venueFilter, setVenueFilter] = useState('All');
  const [formData, setFormData] = useState({
    title: '', organizer: '', venue: 'Auditorium 1', date: '', startTime: '', endTime: '', facultyInCharge: '', type: 'Seminar'
  });
  const [conflictStatus, setConflictStatus] = useState({ conflict: false, reasons: [], checked: false });

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      const resData = await response.json();
      if (resData.success) setEvents(resData.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]);

  // Debounced live conflict detector (only checked if Admin)
  useEffect(() => {
    if (role !== 'admin') return;
    
    const checkLiveConflicts = async () => {
      if (!formData.date || !formData.startTime || !formData.endTime || !formData.venue || !formData.facultyInCharge) {
        setConflictStatus({ conflict: false, reasons: [], checked: false });
        return;
      }
      try {
        const response = await fetch(`${API_URL}/check-conflict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const checkResult = await response.json();
        setConflictStatus({
          conflict: checkResult.conflict,
          reasons: checkResult.reasons || [checkResult.reason],
          checked: true
        });
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(() => { checkLiveConflicts(); }, 350);
    return () => clearTimeout(timer);
  }, [formData, role]);

  // Authentication Handlers
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const { username, password } = loginForm;

    if (password === 'dsce123') {
      if (username.toLowerCase() === 'admin') {
        setRole('admin');
        setIsLoggedIn(true);
        setLoginError('');
      } else if (username.toLowerCase() === 'student' || username.toLowerCase() === 'user') {
        setRole('user');
        setIsLoggedIn(true);
        setLoginError('');
      } else {
        setLoginError('Invalid username. Use "admin" or "student".');
      }
    } else {
      setLoginError('Incorrect password! Try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setLoginForm({ username: '', password: '' });
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== 'admin') return;
    if (conflictStatus.conflict) return alert("Error: Resolve schedule intersection before saving!");
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        alert("🎉 Resource assigned cleanly with no conflicts!");
        setFormData({ title: '', organizer: '', venue: 'Auditorium 1', date: '', startTime: '', endTime: '', facultyInCharge: '', type: 'Seminar' });
        fetchEvents();
      }
    } catch (err) {
      alert("Error contacting backend service.");
    }
  };

  const handleDelete = async (id) => {
    if (role !== 'admin') return;
    if (!window.confirm("Free this room assignment slot?")) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  // Filter schedules logic for the student interface
  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          evt.facultyInCharge.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVenue = venueFilter === 'All' || evt.venue === venueFilter;
    return matchesSearch && matchesVenue;
  });

  // RENDER LOGIN OVERLAY IF NOT AUTHENTICATED
  if (!isLoggedIn) {
    return (
      <div className="login-overlay">
        <div className="login-card">
          <div className="login-branding">
            <h2>DSCE</h2>
            <p>Department of Computer Science & Engineering</p>
          </div>
          <h3>Event Conflict Portal</h3>
          <p className="login-sub">Please authenticate to manage or view schedules</p>
          
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Username (admin / student)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g., admin"
                value={loginForm.username} 
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                value={loginForm.password} 
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} 
                required 
              />
            </div>
            {loginError && <p className="error-text">{loginError}</p>}
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Sign In</button>
          </form>
          <div className="credentials-tip">
            <p><strong>💡 Quick Access Tip:</strong></p>
            <p>Admin: <code>admin</code> | pass: <code>dsce123</code></p>
            <p>Student: <code>student</code> | pass: <code>dsce123</code></p>
          </div>
        </div>
      </div>
    );
  }

  // CORE RENDER (AFTER SUCCESSFUL LOGIN)
  return (
    <div>
      <header className="institute-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>DAYANANDA SAGAR COLLEGE OF ENGINEERING</h1>
            <h2>Autonomous Institution Approved by AICTE, Affiliated to VTU, Belagavi, Karnataka</h2>
            <div className="dept-tag">Department of Computer Science & Engineering</div>
          </div>
          <div className="user-profile-badge">
            <span className={`role-pill ${role}`}>Role: {role.toUpperCase()}</span>
            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </header>

      {/* Conditionally shift dashboard grid depending on who logged in */}
      <div className={`dashboard-container ${role === 'user' ? 'student-view' : ''}`}>
        
        {/* SECTION 1: SCHEDULING ENGINE (ONLY ADMIN SEES THIS) */}
        {role === 'admin' && (
          <div className="glass-card">
            <h3 className="card-title">Event Scheduling Engine (Admin Control)</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Event / Lecture Title</label>
                <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group"><label>Event Category</label>
                <select name="type" className="form-control" value={formData.type} onChange={handleInputChange}>
                  <option value="Lecture">Lecture Class</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Exam">Exam</option>
                  <option value="Cultural">Cultural</option>
                </select>
              </div>
              <div className="form-group"><label>Organizing Body</label>
                <input type="text" name="organizer" className="form-control" value={formData.organizer} onChange={handleInputChange} required />
              </div>
              <div className="form-group"><label>Target Venue</label>
                <select name="venue" className="form-control" value={formData.venue} onChange={handleInputChange}>
                  <option value="Auditorium 1">Dr. Premachandra Sagar Auditorium 1</option>
                  <option value="Seminar Hall 2">C.D. Sagar Seminar Hall 2</option>
                  <option value="CSE Lab 3">Turing Computing Lab 3 (CSE)</option>
                  <option value="Classroom 401">CSE Block Room 401</option>
                </select>
              </div>
              <div className="form-group"><label>Faculty Coordinator In-Charge</label>
                <input type="text" name="facultyInCharge" className="form-control" value={formData.facultyInCharge} onChange={handleInputChange} required />
              </div>
              <div className="form-group"><label>Date</label>
                <input type="date" name="date" className="form-control" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="row-grid">
                <div className="form-group"><label>Start (24h)</label>
                  <input type="time" name="startTime" className="form-control" value={formData.startTime} onChange={handleInputChange} required />
                </div>
                <div className="form-group"><label>End (24h)</label>
                  <input type="time" name="endTime" className="form-control" value={formData.endTime} onChange={handleInputChange} required />
                </div>
              </div>

              {conflictStatus.checked && (
                <div className={`conflict-checker-box ${conflictStatus.conflict ? 'has-conflict' : ''}`}>
                  {conflictStatus.conflict ? (
                    <div>
                      <strong style={{ color: 'var(--danger)' }}>🚨 Scheduling Overlap Intercepted:</strong>
                      <ul style={{ marginTop: '5px', paddingLeft: '15px' }}>
                        {conflictStatus.reasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  ) : (
                    <span style={{ color: '#065f46' }}>✅ <strong>Interval Secure:</strong> Selected metrics do not collide with any current assets.</span>
                  )}
                </div>
              )}
              <button type="submit" className="btn btn-primary" disabled={conflictStatus.conflict}>Commit Allocation Slot</button>
            </form>
          </div>
        )}

        {/* SECTION 2: TIMELINE VIEW (BOTH ROLES SEE, BUT FILTER/SEARCH ADDED FOR EASIER USER TRACKING) */}
        <div className="glass-card">
          <div className="timeline-header">
            <div>
              <h3 className="card-title">Live Institute Timeline Engine</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '-15px', marginBottom: '15px' }}>
                {role === 'user' ? 'Student View Mode - Read Only Mode' : 'Admin Control Dashboard'}
              </p>
            </div>
            <div className="stat-pill">Active Bookings: {filteredEvents.length}</div>
          </div>

          {/* Search and Filters Bar */}
          <div className="filter-bar">
            <input 
              type="text" 
              className="form-control search-input" 
              placeholder="🔍 Search by Event Name or Faculty Coordinator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="form-control venue-filter"
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
            >
              <option value="All">All Venues</option>
              <option value="Auditorium 1">Auditorium 1</option>
              <option value="Seminar Hall 2">Seminar Hall 2</option>
              <option value="CSE Lab 3">CSE Lab 3</option>
              <option value="Classroom 401">Room 401</option>
            </select>
          </div>

          <div className="events-list-wrapper">
            {filteredEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No records match your query filters.
              </div>
            ) : (
              filteredEvents.map(evt => (
                <div className="event-strip" key={evt._id}>
                  <div className="event-time-block">
                    <div className="time-badge">{evt.startTime}-{evt.endTime}</div>
                    <div className="date-badge">{evt.date}</div>
                  </div>
                  <div>
                    <h4>{evt.title}</h4>
                    <span className={`event-type-badge type-${evt.type}`}>{evt.type}</span>
                  </div>
                  <div className="meta-info-block">
                    <strong>📍 {evt.venue}</strong>
                    <div>by {evt.organizer}</div>
                  </div>
                  <div className="faculty-block">👤 Prof. {evt.facultyInCharge}</div>
                  
                  {/* ONLY RENDER THE DELETE BUTTON IF ROLE IS ADMIN */}
                  <div className="action-block">
                    {role === 'admin' ? (
                      <button onClick={() => handleDelete(evt._id)}>Deallocate</button>
                    ) : (
                      <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: 'bold' }}>🔒 Confirmed</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;