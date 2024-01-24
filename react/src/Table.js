import { useContext, useEffect, useState } from "react";
import { listDocs } from "@junobuild/core";
import { AuthContext } from "./Auth";

export const Table = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    window.addEventListener("reload", list);

    return () => {
      window.removeEventListener("reload", list);
    };
  }, []);

  const list = async () => {
    // TODO: STEP_6_LIST_DOCS
    const { items } = await listDocs({
      collection: "location_info",
    });

    setItems(items);
  };

  useEffect(() => {
    if ([undefined, null].includes(user)) {
      setItems([]);
      return;
    }

    (async () => await list())();
  }, [user]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200 mt-8">
      <header className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Entries</h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          {items.map((item) => {
            const {
              key,
              data: { text },
            } = item;

            // Split the key to get latitude and longitude
            const [latitude, longitude] = key.split(',');

            return (
              <div key={key} className="flex items-center gap-6 px-2.5 py-1.5">
                <div className="flex flex-col">
                  <span className="text-gray-600 font-semibold">Latitude: {latitude}</span>
                  <span className="text-gray-600 font-semibold">Longitude: {longitude}</span>
                </div>
                <div className="line-clamp-3 text-left grow">{text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
