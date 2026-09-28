import { FlightSearch } from "../../components/flight/FlightSearch";

const offers = [
  [
    "QATAR AIRWAYS",
    "Fly Economy",
    "Up to 30% Off",
    "from-[#4a2e12] to-[#9b6a32]",
  ],
  [
    "IndiGo",
    "Fly to Dar Es Salaam",
    "From 20th Nov onwards",
    "from-sky-300 to-blue-600",
  ],
  [
    "AIR INDIA",
    "Travel to Manila",
    "Up to 15% Off*",
    "from-cyan-200 to-blue-100",
  ],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 pb-14">
      <div className="h-24 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-blue-700" />
      <div className="relative mx-auto -mt-14 max-w-5xl px-4">
        <nav className="mx-auto flex w-fit items-center gap-6 rounded-full bg-white px-6 py-3 text-sm shadow-md">
          <b className="rounded-full bg-blue-50 px-3 py-2 text-blue-700">
            ✈ Flights
          </b>
          {/* <span className="text-slate-500">▦ Hotels</span>
          <span className="text-slate-500">🚌 Buses</span> */}
        </nav>
        <div className="mt-[-2px]">
          <FlightSearch />
        </div>
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map(([brand, title, caption, colors]) => (
            <article
              key={brand}
              className={`h-48 rounded-xl bg-gradient-to-br p-5 text-white shadow-sm ${colors}`}
            >
              <p className="text-sm font-semibold">{brand}</p>
              <h2 className="mt-5 text-2xl font-bold leading-tight">
                {title}
                <br />
                {caption}
              </h2>
              <p className="mt-3 text-sm">Book Flights now</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
