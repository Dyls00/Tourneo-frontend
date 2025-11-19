import { type FC } from "react";
import { useNavigate } from "react-router";
import "./Nav.css";
import { useUser } from "../user";

export const Nav: FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  function handleLogin() {
    navigate({
      pathname: "/login",
    });
  }
  return (
    <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-30 bg-gradient-to-r from-indigo-700 to-violet-500 transition-all">
      <a href="https://prebuiltui.com">
        <svg
          width="157"
          height="40"
          viewBox="0 0 157 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="40"
            y="32"
            font-family="'Poppins', sans-serif"
            font-size="25"
            fill="#ffffff"
          >
            TOURNEO
          </text>
          <path
            d="m8.75 11.3 6.75 3.884 6.75-3.885M8.75 34.58v-7.755L2 22.939m27 0-6.75 3.885v7.754M2.405 15.408 15.5 22.954l13.095-7.546M15.5 38V22.939M29 28.915V16.962a2.98 2.98 0 0 0-1.5-2.585L17 8.4a3.01 3.01 0 0 0-3 0L3.5 14.377A3 3 0 0 0 2 16.962v11.953A2.98 2.98 0 0 0 3.5 31.5L14 37.477a3.01 3.01 0 0 0 3 0L27.5 31.5a3 3 0 0 0 1.5-2.585"
            stroke="#F5F5F5"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
    {user && (
      <ul className="text-white md:flex hidden items-center gap-10">
        <li>
          <a className="hover:text-white/70 transition" href="#">
            Tournois
          </a>
        </li>
        <li>
          <a className="hover:text-white/70 transition" href="#">
            Joueurs
          </a>
        </li>
        <li>
          <a className="hover:text-white/70 transition" href="#">
            Matches
          </a>
        </li>
        <li>
          <a className="hover:text-white/70 transition" href="#">
            Poules
          </a>
        </li>
      </ul>
      )}
      <div className="btn-log">
        {!user && (
          <button
            type="button"
            className="bg-white text-gray-700 md:inline hidden text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full"
            onClick={handleLogin}
          >
            Se connecter
          </button>
        )}
        {user && (
          <button
            type="button"
            className="bg-white text-gray-700 md:inline hidden text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full"
          >
            Profil
          </button>
        )}
      </div>

      <button
        aria-label="menu-btn"
        type="button"
        className="menu-btn inline-block md:hidden active:scale-90 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="#fff"
        >
          <path d="M3 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2z" />
        </svg>
      </button>

      <div className="mobile-menu absolute top-[70px] left-0 w-full bg-gradient-to-r from-indigo-700 to-violet-500 p-6 hidden md:hidden">
        <ul className="flex flex-col space-y-4 text-white text-lg">
          <li>
            <a href="#" className="text-sm">
              Tournois
            </a>
          </li>
          <li>
            <a href="#" className="text-sm">
              Joueurs
            </a>
          </li>
          <li>
            <a href="#" className="text-sm">
              Matches
            </a>
          </li>
          <li>
            <a href="#" className="text-sm">
              Poules
            </a>
          </li>
        </ul>
        <button
          type="button"
          className="bg-white text-gray-700 mt-6 inline md:hidden text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full"
        >
          Se connecter
        </button>
      </div>
    </nav>
  );
};
