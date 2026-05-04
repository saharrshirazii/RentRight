import { useState } from "react";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";

interface RegisterProps {
  onToggle: () => void;
}

function Register({ onToggle }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // 1. State för roll (standardval: Guest)
  const [role, setRole] = useState<"Guest" | "Host" | "Admin">("Guest");

  return (
    <div className="w-full max-w-[400px] mx-auto antialiased h-fit">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <Card>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter mb-2">Skapa konto</h1>
            <p className="text-base text-gray-600 font-medium tracking-tight">Bli medlem på RentRight idag</p>
          </div>

          <div className="flex flex-col gap-8">
            
            {/* ROLL-VÄLJARE (Selection Pills) */}
            <div className="flex flex-col gap-3">
              <label className="text-sm text-gray-600 font-semibold ml-1">Jag är en...</label>
              <div className="flex p-1 bg-gray-100 rounded-full w-full">
                {(["Guest", "Host", "Admin"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ${
                      role === r 
                        ? "bg-white text-indigo-600 shadow-sm" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {r === "Guest" ? "Hyresgäst" : r === "Host" ? "Värd" : "Admin"}
                  </button>
                ))}
              </div>
            </div>

            {/* Namn */}
            <div className="relative group">
              <input type="text" id="name" value={name} placeholder=" " onChange={(e) => setName(e.target.value)} className="peer w-full px-0 py-3 text-lg text-gray-950 bg-transparent border-b-2 border-gray-200 placeholder-transparent focus:border-indigo-600 focus:outline-none transition-all duration-300 ease-out" />
              <label htmlFor="name" className="absolute left-0 -top-1 text-sm text-gray-600 font-medium transition-all duration-300 ease-out pointer-events-none peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-1 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:font-semibold">Namn</label>
            </div>

            {/* E-post */}
            <div className="relative group">
              <input type="email" id="email" value={email} placeholder=" " onChange={(e) => setEmail(e.target.value)} className="peer w-full px-0 py-3 text-lg text-gray-950 bg-transparent border-b-2 border-gray-200 placeholder-transparent focus:border-indigo-600 focus:outline-none transition-all duration-300 ease-out" />
              <label htmlFor="email" className="absolute left-0 -top-1 text-sm text-gray-600 font-medium transition-all duration-300 ease-out pointer-events-none peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-1 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:font-semibold">E-post</label>
            </div>

            {/* Lösenord */}
            <div className="relative group">
              <input type="password" id="password" value={password} placeholder=" " onChange={(e) => setPassword(e.target.value)} className="peer w-full px-0 py-3 text-lg text-gray-950 bg-transparent border-b-2 border-gray-200 placeholder-transparent focus:border-indigo-600 focus:outline-none transition-all duration-300 ease-out" />
              <label htmlFor="password" className="absolute left-0 -top-1 text-sm text-gray-600 font-medium transition-all duration-300 ease-out pointer-events-none peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-1 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:font-semibold">Lösenord</label>
            </div>

            {/* Bekräfta lösenord */}
            <div className="relative group">
              <input type="password" id="confirmPassword" value={confirmPassword} placeholder=" " onChange={(e) => setConfirmPassword(e.target.value)} className="peer w-full px-0 py-3 text-lg text-gray-950 bg-transparent border-b-2 border-gray-200 placeholder-transparent focus:border-indigo-600 focus:outline-none transition-all duration-300 ease-out" />
              <label htmlFor="confirmPassword" className="absolute left-0 -top-1 text-sm text-gray-600 font-medium transition-all duration-300 ease-out pointer-events-none peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-1 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:font-semibold">Bekräfta lösenord</label>
            </div>

            <div className="mt-4">
              <Button onClick={() => console.log("Registrerar som:", role)} className="w-full py-4 text-base font-semibold text-white bg-gray-950 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.15)] active:scale-[0.98]">
                Skapa konto
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-2 font-medium">
              Har du redan ett konto? {" "}
              <span onClick={onToggle} className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800 transition-colors">
                Logga in
              </span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Register;