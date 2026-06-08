import { useState } from "react";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onToggle?: () => void;
}

function LogIn({ onToggle }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Ändrat från alert till state

  const handleLogin = async () => {
    setError(""); // Rensa tidigare fel
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
        window.location.reload();
      } else {
        // Hantera både specifika Zod-fel och generella felmeddelanden
        const msg = data.errorList ? data.errorList[0] : (data.message || "Inloggningen misslyckades");
        setError(msg);
      }
    } catch (error) {
      setError("Kunde inte ansluta till servern");
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto antialiased h-fit">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <Card>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter mb-2">Välkommen tillbaka</h1>
            <p className="text-base text-gray-600 font-medium tracking-tight">Logga in på ditt RentRight-konto</p>
          </div>

          {/* Felmeddelande-box */}
          {error && (
            <div className="p-3 mb-6 text-sm font-semibold text-red-600 bg-red-50 rounded-xl border border-red-100 text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-8">
            {/* Input-fälten förblir samma som du hade */}
            <div className="relative group">
              <input type="email" id="email" value={email} placeholder=" " onChange={(e) => setEmail(e.target.value)} className="peer w-full px-0 py-3 text-lg text-gray-950 bg-transparent border-b-2 border-gray-200 placeholder-transparent focus:border-indigo-600 focus:outline-none transition-all duration-300 ease-out" />
              <label htmlFor="email" className="absolute left-0 -top-1 text-sm text-gray-600 font-medium transition-all duration-300 ease-out pointer-events-none peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-1 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:font-semibold">E-post</label>
            </div>

            <div className="relative group">
              <input type="password" id="password" value={password} placeholder=" " onChange={(e) => setPassword(e.target.value)} className="peer w-full px-0 py-3 text-lg text-gray-950 bg-transparent border-b-2 border-gray-200 placeholder-transparent focus:border-indigo-600 focus:outline-none transition-all duration-300 ease-out" />
              <label htmlFor="password" className="absolute left-0 -top-1 text-sm text-gray-600 font-medium transition-all duration-300 ease-out pointer-events-none peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-1 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:font-semibold">Lösenord</label>
            </div>

            <Button onClick={handleLogin} className="w-full py-4 text-base font-semibold text-white bg-gray-950 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.15)] active:scale-[0.98]">
              Logga in
            </Button>

            <p className="text-center text-sm text-gray-600 mt-2 font-medium">
              Är du ny här? {" "}
              <span onClick={onToggle} className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800 transition-colors">
                Skapa ett konto
              </span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LogIn;