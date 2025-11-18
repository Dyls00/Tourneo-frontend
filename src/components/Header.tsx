import type { FC } from "react";
import "./Header.css"
import { Nav } from "./Nav";
import logo from "../assets/logo.jpeg";

export const Header: FC = () => {
    return (
        <header className="row">
            <img className="img-fluid logo col-2" src={logo} alt="my shop" />
            <div className="col-10">
                <Nav/>
            </div>
        </header>
    );
}
