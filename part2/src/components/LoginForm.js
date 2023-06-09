const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={(event) => handleUsernameChange(event.target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={(event) => handlePasswordChange(event.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
