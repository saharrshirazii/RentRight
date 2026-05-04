import {useState} from "react";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";

function Register(){

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = () =>{
        console.log("Registera med:", email, password);
    }

    return(
        <div>
            <Card
            title="Skapa konto"
            description="Fyll i formuläret"
            >

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>

                <input type="email"
                placeholder="E-post" value={email}
                onChange={(e)=>setEmail(e.target.value)}/>

                <input type="password"
                placeholder="Lösenord" value={password}
                onChange={(e)=> setPassword(e.target.value)} />

                <input type="password"
                placeholder="Bekräfta lösenord"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)} />

                <Button onClick={handleRegister}>Registrera dig</Button>

            </div>

            </Card>
        </div>
    )

}

export default Register;