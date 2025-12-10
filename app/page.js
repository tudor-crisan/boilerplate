
import SectionHero from "@/components/section/SectionHero";
import ButtonLogin from "@/components/button/ButtonLogin";

export default function Home() {
  return (
    <main>
      <SectionHero>
        <ButtonLogin
          isLoggedIn={true}
          name={"Tudor"}
        />
      </SectionHero>
    </main>
  );
}
