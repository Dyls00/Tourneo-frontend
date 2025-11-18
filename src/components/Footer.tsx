import { type FC } from "react";


export const Footer: FC = () => {
     return (
        <footer>
          <div className="footer">
            <div className="row">
              <p className="col-3">© 2025 My Shop. All rights reserved.</p>
              <p className="col-2">Follow us on</p>
              <ul className="col-7 d-flex">
                  <li className="mx-2"><a href="#">Facebook</a></li>
                  <li className="mx-2"><a href="#">X/Twitter</a></li>
                  <li className="mx-2"><a href="#">Instagram</a></li>
              </ul>
            </div>
          </div>
        </footer>
  );
}