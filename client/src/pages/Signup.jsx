import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import AuthForm from "../components/AuthForm";

const Signup= () =>  {
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();

  const handleSignup = async (email, password) => {
    await signup(email, password);
    navigate("/");
  };

  return <AuthForm onSubmit={handleSignup} title="Sign Up" buttonText="Create Account" />;
}

export default Signup;
