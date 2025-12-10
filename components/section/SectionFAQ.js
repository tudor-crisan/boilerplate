import copywriting from "@/config/copywriting.json";
import styling from "@/config/styling.json";

export default function SectionFAQ() {
  return (
    <section className={`${styling.section.wrapper} ${styling.section.spacing}`} id="faq">
      <p className={`${styling.section.label} mb-2`}>
        {copywriting.SectionFAQ.label}
      </p>
      <h2 className={`${styling.section.headline} mb-12 text-center`}>
        {copywriting.SectionFAQ.headline}
      </h2>

      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="collapse-title font-semibold">How do I create an account?</div>
        <div className="collapse-content text-sm">Click the "Sign Up" button in the top right corner and follow the registration process.</div>
      </div>
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">I forgot my password. What should I do?</div>
        <div className="collapse-content text-sm">Click on "Forgot Password" on the login page and follow the instructions sent to your email.</div>
      </div>
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">How do I update my profile information?</div>
        <div className="collapse-content text-sm">Go to "My Account" settings and select "Edit Profile" to make changes.</div>
      </div>
    </section>
  );
}