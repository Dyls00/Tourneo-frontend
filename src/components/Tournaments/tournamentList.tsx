import { type FC } from "react";
import { useUser } from "../../user";

export const TournamentList: FC = () => {
    const { user } = useUser();

    return (
        <div className="main-tournois">
            <div className="col-1">
                <p className="t-footer t-size">Liste des tournois</p>

            </div>
            {user?.role === "organizer" &&
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-right"
            ><a href="/TournamentForm">Créer</a>
            </button>}
            <div className="col-2 mt-8">
                <div
                    className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max">
                        <thead>
                            <tr>
                                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        Nom
                                    </p>
                                </th>
                                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        Description
                                    </p>
                                </th>
                                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        Date de début
                                    </p>
                                </th>
                                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        Organisateur
                                    </p>
                                </th>
                                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        Status
                                    </p>
                                </th>
                                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"></p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                        John Michael
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                        Manager
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                        23/04/18
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                        Johane
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                        Matches
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <a href="#" className="block font-sans text-sm antialiased font-medium leading-normal text-blue-gray-900">
                                        Edit
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}
