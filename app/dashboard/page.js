import ButtonLogout from "@/components/button/ButtonLogout";
import ProfileTitle from "@/components/profile/ProfileTitle";

export default function Dashboard() {
  return (
    <main>
      <div className="flex flex-col space-y-6 px-4 sm:px-0 sm:max-w-xl mx-auto mt-8">
        <h1 className="font-extrabold text-2xl">
          Dashboard
        </h1>
        <ProfileTitle />
        <ButtonLogout />
      </div>
    </main>
  );
}
