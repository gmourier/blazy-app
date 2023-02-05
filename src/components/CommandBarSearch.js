import { Fragment, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  ExclamationTriangleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import CommandBarFooter from "@/components/CommandBarFooter";
import { MeiliSearch } from "meilisearch";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CommandBarSearch() {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [data, setData] = useState({});

  const client = new MeiliSearch({
    host: "https://ms-5894428564fa-173.lon.meilisearch.io/",
    apiKey:
      "06UKvqod16fff6018934c85a4d393534b1b96cd6c3a5ee492bcd4a4e720e26fb24ef1cbb",
  });
  const index = client.index("docs");

  const search = async (query) => {
    let response = await index.search(query, {
      limit: 5,
      attributesToHighlight: ["*"],
    });
    response = response.hits.reduce((groups, hit) => {
      const value = hit.hierarchy_lvl0;
      groups[value] = groups[value] || [];
      groups[value].push(hit);
      return groups;
    }, {});
    console.log({ response });
    setData(response);
    setQuery(query);
  };

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => setQuery("")}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-gray-900 shadow-2xl transition-all">
              <Combobox onChange={(item) => (window.location = item.url)}>
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) => search(event.target.value)}
                  />
                </div>
                {Object.keys(data).length !== 0 && (
                  <Combobox.Options
                    static
                    className="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto"
                  >
                    {Object.entries(data).map((hits) => (
                      <li className="p-2">
                        <h2 className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-200">
                          {hits[0]}
                        </h2>
                        <ul className="text-sm text-gray-400">
                          {hits[1].map((hit) => (
                            <Combobox.Option
                              key={hit.objectID}
                              value={hit}
                              className={({ active }) =>
                                classNames(
                                  "flex cursor-default select-none items-center px-4 py-2",
                                  active && "bg-gray-800 text-white"
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <span className="ml-3 flex-auto truncate">
                                    {[
                                      hit.hierarchy_lvl1,
                                      hit.hierarchy_lvl2,
                                      hit.hierarchy_lvl3,
                                    ]
                                      .filter(Boolean)
                                      .join(" / ")}
                                  </span>
                                  {active && (
                                    <span className="ml-3 flex-none text-gray-400">
                                      Jump to...
                                    </span>
                                  )}
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </Combobox.Options>
                )}
                {query !== "" && Object.keys(data).length === 0 && (
                  <div className="py-14 px-6 text-center text-sm sm:px-14">
                    <ExclamationTriangleIcon
                      className="mx-auto h-6 w-6 text-gray-500"
                      aria-hidden="true"
                    />
                    <p className="mt-4 font-semibold text-gray-200">
                      No results found
                    </p>
                    <p className="mt-2 text-gray-500">
                      We couldn’t find anything with that term. Please try
                      again.
                    </p>
                  </div>
                )}
                {query.length === 0 && Object.keys(data).length === 0 && (
                  <div className="py-14 px-6 text-center text-sm sm:px-14">
                    <BookOpenIcon
                      className="mx-auto h-6 w-6 text-gray-500"
                      aria-hidden="true"
                    />
                    <p className="mt-4 font-semibold text-gray-300">
                      Make your first search!
                    </p>
                    <p className="mt-2 text-gray-500">
                      Get instant results from Meilisearch's documentation.
                    </p>
                  </div>
                )}
                <CommandBarFooter />
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
