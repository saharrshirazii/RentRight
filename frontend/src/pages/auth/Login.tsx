import {useState} from "react";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";

function LogIn () {

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    const handleLogIn = () =>{
        console.log("Logga in");
    }

    return(
        <div>
            <Card
            title="Logga in"
            description="Fyll i formuläret"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>

                    <input type="email" value={email} placeholder="E-post" onChange={(e)=>setEmail(e.target.value)}/>

                    <input type="password" value={password} placeholder="Lösenord" onChange={(e)=>setPassword(e.target.value)} />

                    <Button
                    onClick={handleLogIn}>
                    Logga in
                    </Button>

                    <p>Saknar du konto? <span style={{color: "blue", marginLeft: "5px", cursor: "pointer"}}>Skapa ett här!</span></p>

                </div>
            </Card>
        </div>
    )

}

export default LogIn;