import { ReactNode } from "react";

export default function TermsAndConditionsPage() {
  return (
    <main className="px-margin py-24 max-w-4xl mx-auto flex-1 w-full">
      <h1 className="font-headline-lg font-bold text-primary mb-8">Terms of Service</h1>
      <div className="prose prose-on-surface max-w-none">
        <p className="text-on-surface-variant mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="font-headline-sm font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
        <p className="mb-4">By viewing or using this website, which can be accessed at i-help.com, you are agreeing to be bound by these website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.</p>
        
        <h2 className="font-headline-sm font-semibold mt-8 mb-4">2. Use License</h2>
        <p className="mb-4">Permission is granted to temporarily download one copy of the materials on i-help's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul className="list-disc pl-8 mb-4 space-y-2">
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose or for any public display;</li>
          <li>attempt to reverse engineer any software contained on i-help's website;</li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>
        <p className="mb-4">This will let i-help to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format.</p>
        
        <h2 className="font-headline-sm font-semibold mt-8 mb-4">3. Disclaimer</h2>
        <p className="mb-4">All the materials on i-help's website are provided "as is". i-help makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, i-help does not make any representations concerning the accuracy or reliability of the use of the materials on its website or otherwise relating to such materials or any sites linked to this website.</p>
        
        <h2 className="font-headline-sm font-semibold mt-8 mb-4">4. Limitations</h2>
        <p className="mb-4">i-help or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on i-help's website, even if i-help or an authorize representative of this website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.</p>

        <h2 className="font-headline-sm font-semibold mt-8 mb-4">5. Revisions and Errata</h2>
        <p className="mb-4">The materials appearing on i-help's website may include technical, typographical, or photographic errors. i-help will not promise that any of the materials in this website are accurate, complete, or current. i-help may change the materials contained on its website at any time without notice. i-help does not make any commitment to update the materials.</p>
      </div>
    </main>
  );
}
