import LoginForm from "../components/LoginForm";
import { APP_NAME } from "../../../shared/config/appSettings";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-blueGray-800 flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-6">
          <h1 className="text-white text-3xl font-bold">{APP_NAME}</h1>
        </div>
        <div className="flex justify-center">
          <div className="w-full lg:w-4/12 px-4">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}