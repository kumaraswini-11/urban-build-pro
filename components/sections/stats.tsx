import { CountUp } from "@/components/count-up";
import { statistics } from "@/lib/constants";

export const Stats = () => {
  return (
    <section className="bg-inverse py-12" aria-label="Company statistics">
      <div className="container mx-auto px-4">
        <ul className="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((stat) => (
            <li
              key={stat.label}
              className="flex flex-col items-center text-center xl:items-start xl:text-left"
            >
              <p className="flex items-baseline gap-1 font-extrabold text-5xl text-on-inverse tabular-nums md:text-6xl">
                <CountUp to={stat.value} />
                <span>{stat.suffix}</span>
              </p>
              <p className="mt-2 max-w-45 font-medium text-on-inverse/70 text-sm uppercase tracking-wide">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
