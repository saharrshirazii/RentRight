import { useState } from "react";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";

interface RegisterProps {
  onToggle: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

function Register({ onToggle }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"Guest" | "Host" | "Admin">("Guest");
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  const handleRegister = async () => {
    setErrors({});
    setServerError("");

    if (password !== confirmPassword) {
      setErrors({ password: "Lösenorden matchar inte!" });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: role.toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Konto skapat! Du kan nu logga in.");
        onToggle();
      } else if (data.errorList) {
        const newErrors: FormErrors = {};
        data.errorList.forEach((msg: string) => {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes("namn")) newErrors.name = msg;
          if (lowerMsg.includes("lösenord") || lowerMsg.includes("password")) newErrors.password = msg;
          if (lowerMsg.includes("epost") || lowerMsg.includes("email") || lowerMsg.includes("admin")) {
            newErrors.email = msg;
          }
        });
        setErrors(newErrors);
      } else {
        setServerError(data.message || "Registreringen misslyckades");
      }
    } catch (error) {
      console.error("Fel vid registrering:", error);
      setServerError("Kunde inte ansluta till servern");
    }
  };

  // Helper för label-stilar
  const labelClass = "absolute left-0 top-3 text-gray-400 transition-all peer-focus:-top-1 peer-focus:text-xs peer-focus:text-indigo-600 peer-not-placeholder-shown:-top-1 peer-not-placeholder-shown:text-xs";
  const inputClass = "peer w-full px-0 py-3 border-b-2 border-gray-200 focus:border-indigo-600 outline-none placeholder-transparent";

  return (
    <div className="w-full max-w-[400px] mx-auto antialiased h-fit">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <Card>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter mb-2">Skapa konto</h1>
            <p className="text-base text-gray-600 font-medium tracking-tight">Bli medlem på RentRight idag</p>
          </div>

          {serverError && (
            <div className="p-3 mb-6 text-sm font-semibold text-red-600 bg-red-50 rounded-xl border border-red-100 text-center">
              {serverError}
            </div>
          )}

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-sm text-gray-600 font-semibold ml-1">Jag är en...</label>
              <div className="flex p-1 bg-gray-100 rounded-full w-full">
                {(["Guest", "Host", "Admin"] as const).map((r) => (
                  <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ${role === r ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"}`}>
                    {r === "Guest" ? "Hyresgäst" : r === "Host" ? "Värd" : "Admin"}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <input type="text" id="name" value={name} placeholder="Namn" onChange={(e) => setName(e.target.value)} className={inputClass} />
              <label htmlFor="name" className={labelClass}>Namn</label>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="relative group">
              <input type="email" id="email" value={email} placeholder="E-post" onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              <label htmlFor="email" className={labelClass}>E-post</label>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="relative group">
              <input type="password" id="password" value={password} placeholder="Lösenord" onChange={(e) => setPassword(e.target.value)} className={inputClass} />
              <label htmlFor="password" className={labelClass}>Lösenord</label>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div className="relative group">
              <input type="password" id="confirmPassword" value={confirmPassword} placeholder="Bekräfta lösenord" onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
              <label htmlFor="confirmPassword" className={labelClass}>Bekräfta lösenord</label>
            </div>

            <Button onClick={handleRegister} className="w-full py-4 text-white bg-gray-950 rounded-full">Skapa konto</Button>

<div className="text-center mt-4">
              <p className="text-base text-gray-600 font-medium tracking-tight">
                Har du redan ett konto?{" "}
                <span 
                  onClick={onToggle} 
                  className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800 transition-colors"
                >
                  Logga in
                </span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Register;