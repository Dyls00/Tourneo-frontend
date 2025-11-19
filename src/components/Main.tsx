import type { FC } from "react";
import "./Main.css"
import { useUser } from "../user";
import image1 from "../assets/1.png";

export const Main: FC = () => {

    const {user} = useUser();
    return (
        <main>
            <div className="main-content">
        {!user && 
        
        <div className="main-unlogged">
            <div><img src={image1} alt="" width={600} /></div>
            <div className="main-text"><p >Tourneo est une application conçue pour faciliter 
                l’organisation et la gestion de tournois de tennis et de padel amateur. 
                Elle offre aux organisateurs la possibilité de créer des tournois auto-organisés, 
                dans lesquels les participants gèrent eux-mêmes leurs matchs.</p></div>
        </div>
        }
            </div>
        </main>
    );
}
