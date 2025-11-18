import type { FC } from "react"
import { Nav } from "./Nav";

export const Header: FC = () =>{
     return (
        <header>
          <div className="header row">
            <div className="logo col-4">
              <img src="\images\infinix.png" alt="logo" width={120}/>
            </div>
            <div className="right col-8">
              <Nav/>
            </div>
          </div>
        </header>
  );
}