function Login() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <h1>Login</h1>

        <input
          placeholder="Email"
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
        />

        <br />
        <br />

        <button>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;