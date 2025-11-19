import type { FC } from "react";
import "./Header.css"
import { Nav } from "./Nav";

export const Header: FC = () => {
    return (
        <header>
            <Nav/>
        </header>
    );
}
