export default function Dashboard({ userDetails, handleLogout }) {
  return (
    <div>
      <h1>Welcome {userDetails.name}</h1>
      <p>
        You e-mail id is - <b>{userDetails.email}</b>
      </p>
      <button
        style={{
          background: "red",
          color: "white",
          padding: "15px 32px",
          cursor: "pointer",
        }}
        onClick={handleLogout}
      >
        Sign out
      </button>
    </div>
  );
}
