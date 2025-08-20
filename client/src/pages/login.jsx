import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import AuthForm from "../components/AuthForm";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    await login(email, password);
    navigate("/");
  };

  return <AuthForm onSubmit={handleLogin} title="Log In" buttonText="Log In" />;
}
