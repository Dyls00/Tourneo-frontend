import { useState, type FC, useEffect } from "react"
import { useUser } from "../user";
import { NavLink } from "react-router";

export const Nav: FC = () =>{

    const [timeToDisplay, setTimeToDisplay] = useState(new Date().toLocaleTimeString());
    const {user,logout} = useUser();

        useEffect(() => {
            const id = setInterval(() => {
                setTimeToDisplay(new Date().toLocaleTimeString())
            },1000)

            return () => {
                clearInterval(id)
            }
        },[])

     return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="nav-f">
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <a className="navbar-brand" href="#">Home</a>
                <a className="nav-item nav-link" href="#">Produits</a>
                <a className="nav-item nav-link" href="#">Services</a>
                <a className="nav-item nav-link" href="#">About</a>
                <a className="nav-item nav-link" href="#">Contact</a>
            </div>
              {!user &&
                <NavLink
                to="/login"
                className=""
              >
                Login
              </NavLink>
              }
               <div className="user-k">
                {user && <p className="col-10">Welcome, {user.name}
                {user && <img className="col-2 img-fluid rounded avatar" src={user.avatar} alt={user.name} />}
                {user && <button className="btn btn-primary mov" onClick={() => logout()}>Logout</button>}
              </p>}
          </div>
            </div>
          </div>
          <p className="time">{timeToDisplay}</p>
        </nav>
  );
}