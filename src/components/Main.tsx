import type { FC } from "react"
import { Aside } from "./Aside";
import { Content } from "./Content";

export const Main: FC = () =>{
     return (
        <main className="contain row">
          <div className="col-left col-2">
            <Aside/>
          </div>
          <div className="col-right col-10">
            <Content/>
          </div>
        </main>
  );
}