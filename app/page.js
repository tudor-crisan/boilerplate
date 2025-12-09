
import ButtonLogin from "@/components/ButtonLogin";

export default function Home() {
  const isLoggedIn = true;
  const name = "Tudor";

  return (
    <main>
      <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1' }}>
        Collect customer feedback to build better products
      </h1>
      <div>
        Create a feedback board in minutes, prioritize features, and build produts your customers will love.
      </div>
      <ButtonLogin isLoggedIn={isLoggedIn} name={name} />
    </main>
  );
}
