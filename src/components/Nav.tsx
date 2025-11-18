import { type FC } from "react";
import "./Nav.css"
import { useUser } from "../user";

export const Nav: FC = () => {

    const {user,logout,login} = useUser();

    function handleLogin(){
        login({
                name: "Rémy",
                avatar: "https://picsum.photos/seed/remy/200"
            })
    }
    return (
        <nav>
            <ul className="d-flex m-2 p-2 justify-content-between">
                <li><a href="#">Home</a></li>
                <li><a href="#">Products</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
            <div className="row justify-end">

            {user && <p className="col-10">Welcome, {user.name}!</p>}
            {user && <img className="col-2 img-fluid rounded avatar" src={user.avatar} alt={user.name} />}
            {user && <button className="btn btn-primary col-2" onClick={() => logout()}>Logout</button>}
            {!user && <button className="btn btn-primary col-2" onClick={() => handleLogin()}>Login</button>}
            </div>
        </nav>
    );
}
