import GoogleLoginComponents from "../components/Google_login.components";
import Button from "../ui/button.ui";

const Login = () => {
  return (
    <div className="justify-center items-center min-h-screen flex bg-emerald-700">
      <Button onClick={() => alert("masuk")}>Klik</Button>
      <GoogleLoginComponents />
    </div>
  );
};

export default Login;
