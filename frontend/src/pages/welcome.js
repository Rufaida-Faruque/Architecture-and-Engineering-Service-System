// import { useEffect, useState } from "react";

// export default function WelcomePage() {
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//   let r = localStorage.getItem("role");

//   if (r === "cl") r = "client";
//   if (r === "sp") r = "serviceProvider";
//   if (r === "ad") r = "admin";

//   setRole(r);
// }, []);


//   if (!role) return <p>Loading...</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Welcome!</h1>
//       <p>Select what you want to do:</p>

//       {role === "client" && (
//         <div>
//           <button onClick={() => (window.location.href = "/repositories")}>
//             View Repositories
//           </button>

//           <button onClick={() => (window.location.href = "/posts")}>
//             View Posts
//           </button>

//           <button onClick={() => (window.location.href = "/posts/new")}>
//             Create Post
//           </button>

//           <button onClick={() => (window.location.href = "/bidSessions")}>
//             View Bid Sessions
//           </button>

//           <button onClick={() => (window.location.href = "/bidSessions/new")}>
//             Create Bid Session
//           </button>
//         </div>
//       )}

//       {role === "serviceProvider" && (
//         <div>
//           <button onClick={() => (window.location.href = "/repositories")}>
//             View Repositories
//           </button>

//           <button onClick={() => (window.location.href = "/repositories/new")}>
//             Create Repository
//           </button>

//           <button onClick={() => (window.location.href = "/bidSessions")}>
//             View Bid Sessions
//           </button>
//         </div>
//       )}

//       {role === "admin" && (
//         <div>
//           <button onClick={() => (window.location.href = "/admin/verification")}>
//             Verification Requests
//           </button>

//           <button onClick={() => (window.location.href = "/admin/reports")}>
//             Reports
//           </button>

//           <button onClick={() => (window.location.href = "/admin/repositories")}>
//             Repository Approvals
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }











import { useEffect, useState } from "react";

export default function WelcomePage() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    let r = localStorage.getItem("role");

    if (r === "cl") r = "client";
    if (r === "sp") r = "serviceProvider";
    if (r === "adm") r = "admin";

    setRole(r);
  }, []);

  if (!role) return <p>Loading...</p>;

  const goToDashboard = () => {
    if (role === "client") window.location.href = "/dashboard/client";
    if (role === "serviceProvider") window.location.href = "/dashboard/sp";
    if (role === "admin") window.location.href = "/dashboard/admin";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome!</h1>
      <p>Select what you want to do:</p>

      {/* ⭐ NEW: Dashboard button for all roles */}
      <button onClick={goToDashboard} style={{ marginBottom: "20px" }}>
        View Dashboard
      </button>

      {/* CLIENT */}
      {role === "client" && (
        <div>
          <button onClick={() => (window.location.href = "/repositories")}>
            View Repositories
          </button>

          <button onClick={() => (window.location.href = "/posts")}>
            View Posts
          </button>

          <button onClick={() => (window.location.href = "/posts/new")}>
            Create Post
          </button>

          <button onClick={() => (window.location.href = "/bidSessions")}>
            View Bid Sessions
          </button>

          <button onClick={() => (window.location.href = "/bidSessions/new")}>
            Create Bid Session
          </button>
        </div>
      )}

      {/* SERVICE PROVIDER */}
      {role === "serviceProvider" && (
        <div>
          <button onClick={() => (window.location.href = "/repositories")}>
            View Repositories
          </button>

          <button onClick={() => (window.location.href = "/repositories/new")}>
            Create Repository
          </button>

          <button onClick={() => (window.location.href = "/bidSessions")}>
            View Bid Sessions
          </button>
        </div>
      )}

      {/* ADMIN */}
      {role === "admin" && (
        <div>
          <button onClick={() => (window.location.href = "/admin/verification")}>
            Verification Requests
          </button>

          <button onClick={() => (window.location.href = "/admin/reports")}>
            Reports
          </button>

          <button onClick={() => (window.location.href = "/admin/repositories")}>
            Repository Approvals
          </button>
        </div>
      )}
    </div>
  );
}








// import { useEffect, useState } from "react";

// export default function WelcomePage() {
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     let r = localStorage.getItem("role");

//     if (r === "cl") r = "client";
//     if (r === "sp") r = "serviceProvider";
//     if (r === "adm") r = "admin";

//     setRole(r);
//   }, []);

//   if (!role) return <p>Loading...</p>;

//   const goToDashboard = () => {
//     if (role === "client") window.location.href = "/dashboard/client";
//     if (role === "serviceProvider") window.location.href = "/dashboard/sp";
//     if (role === "admin") window.location.href = "/dashboard/admin";
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Welcome!</h1>
//       <p>Select what you want to do:</p>

//       {/* ⭐ NEW: Dashboard button for all roles */}
//       <button onClick={goToDashboard} style={{ marginBottom: "20px" }}>
//         View Dashboard
//       </button>

//       {/* CLIENT */}
//       {role === "client" && (
//         <div>
//           <button onClick={() => (window.location.href = "/repositories")}>
//             View Repositories
//           </button>

//           <button onClick={() => (window.location.href = "/posts")}>
//             View Posts
//           </button>

//           <button onClick={() => (window.location.href = "/posts/new")}>
//             Create Post
//           </button>

//           <button onClick={() => (window.location.href = "/bidSessions")}>
//             View Bid Sessions
//           </button>

//           <button onClick={() => (window.location.href = "/bidSessions/new")}>
//             Create Bid Session
//           </button>
//         </div>
//       )}

//       {/* SERVICE PROVIDER */}
//       {role === "serviceProvider" && (
//         <div>
//           <button onClick={() => (window.location.href = "/repositories")}>
//             View Repositories
//           </button>

//           <button onClick={() => (window.location.href = "/repositories/new")}>
//             Create Repository
//           </button>

//           <button onClick={() => (window.location.href = "/bidSessions")}>
//             View Bid Sessions
//           </button>
//         </div>
//       )}

//       {/* ADMIN */}
//       {role === "admin" && (
//         <div>
//           <button onClick={() => (window.location.href = "/admin/verification")}>
//             Verification Requests
//           </button>

//           <button onClick={() => (window.location.href = "/admin/reports")}>
//             Reports
//           </button>

//           <button onClick={() => (window.location.href = "/admin/repositories")}>
//             Repository Approvals
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
