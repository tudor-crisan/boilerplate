import ButtonLogout from "@/components/button/ButtonLogout";
import FormNewBoard from "@/components/form/FormNewBoard";
import ProfileTitle from "@/components/profile/ProfileTitle";

export default function Dashboard() {
  return (
    <main className="bg-base-200 min-h-screen">
      <section className="max-w-5xl mx-auto bg-base-100 px-5 py-3 flex justify-end">
        <ButtonLogout />
      </section>
      <section className="max-w-5xl mx-auto px-5 py-12">
        <ProfileTitle />
        <div className="my-1">&nbsp;</div>
        <FormNewBoard />
      </section>
    </main>
  );
}
