import { ReactNode } from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="px-margin py-24 max-w-4xl mx-auto flex-1 w-full">
      <h1 className="font-headline-lg font-bold text-primary mb-8">
        Privacy Policy
      </h1>
      <div className="prose prose-on-surface max-w-none">
        <p className="text-on-surface-variant mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="font-headline-sm font-semibold mt-8 mb-4">
          1. Introduction
        </h2>
        <p className="mb-4">
          Welcome to myIhelp. We respect your privacy and are committed to
          protecting your personal data. This privacy policy will inform you as
          to how we look after your personal data when you visit our website and
          tell you about your privacy rights and how the law protects you.
        </p>

        <h2 className="font-headline-sm font-semibold mt-8 mb-4">
          2. The data we collect about you
        </h2>
        <p className="mb-4">
          We may collect, use, store and transfer different kinds of personal
          data about you which we have grouped together as follows:
        </p>
        <ul className="list-disc pl-8 mb-4 space-y-2">
          <li>
            <strong>Identity Data</strong> includes first name, last name,
            username or similar identifier.
          </li>
          <li>
            <strong>Contact Data</strong> includes billing address, delivery
            address, email address and telephone numbers.
          </li>
          <li>
            <strong>Financial Data</strong> includes bank account and payment
            card details.
          </li>
          <li>
            <strong>Transaction Data</strong> includes details about payments to
            and from you and other details of services you have purchased from
            us.
          </li>
          <li>
            <strong>Technical Data</strong> includes internet protocol (IP)
            address, your login data, browser type and version, time zone
            setting and location, browser plug-in types and versions, operating
            system and platform, and other technology on the devices you use to
            access this website.
          </li>
        </ul>

        <h2 className="font-headline-sm font-semibold mt-8 mb-4">
          3. How we use your personal data
        </h2>
        <p className="mb-4">
          We will only use your personal data when the law allows us to. Most
          commonly, we will use your personal data in the following
          circumstances:
        </p>
        <ul className="list-disc pl-8 mb-4 space-y-2">
          <li>
            Where we need to perform the contract we are about to enter into or
            have entered into with you.
          </li>
          <li>
            Where it is necessary for our legitimate interests (or those of a
            third party) and your interests and fundamental rights do not
            override those interests.
          </li>
          <li>Where we need to comply with a legal obligation.</li>
        </ul>

        <h2 className="font-headline-sm font-semibold mt-8 mb-4">
          4. Data security
        </h2>
        <p className="mb-4">
          We have put in place appropriate security measures to prevent your
          personal data from being accidentally lost, used or accessed in an
          unauthorised way, altered or disclosed. In addition, we limit access
          to your personal data to those employees, agents, contractors and
          other third parties who have a business need to know.
        </p>
      </div>
    </main>
  );
}
