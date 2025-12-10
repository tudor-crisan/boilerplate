
import ButtonLogin from "@/components/ButtonLogin";

export default function Home() {
  const isLoggedIn = true;
  const name = "Tudor";

  return (
    <main>
      <section className="text-center py-32 px-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold leading-none capitalize mb-6">
          Collect customer feedback to build better products
        </h1>
        <p className="opacity-90 mb-10">
          Create a feedback board in minutes, prioritize features, and build produts your customers will love.
        </p>
        <ButtonLogin isLoggedIn={isLoggedIn} name={name} />
      </section>
    </main>
  );
}
