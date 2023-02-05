export default function CommandBarFooter() {
  return (
    <div className="flex flex-wrap items-center bg-gray-900 py-2.5 px-4 text-xs text-gray-300">
      Type{" "}
      <kbd className="mx-1 flex h-5 px-1 items-center justify-center rounded border bg-gray-800 font-semibold border-gray-700 text-gray-300">
        cmd+/
      </kbd>{" "}
      to search,
      <kbd className="mx-1 flex h-5 px-1 items-center justify-center rounded border bg-gray-800 font-semibold border-gray-700 text-gray-300">
        cmd+?
      </kbd>{" "}
      to ask Blazy
    </div>
  );
}
