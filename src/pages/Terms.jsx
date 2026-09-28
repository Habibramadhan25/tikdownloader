import React from 'react';

export default function Terms() {
  return (
    <div className="w-full max-w-3xl mx-auto animate-in prose dark:prose-invert">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
      <p className="mb-4 text-[hsl(var(--muted-foreground))]">
        By accessing and using TikDown, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Use License</h2>
      <p className="mb-4 text-[hsl(var(--muted-foreground))]">
        TikDown is a tool designed to allow users to download content they have the right to access. You agree to use this service only for lawful purposes. You are solely responsible for ensuring you have the necessary permissions, copyrights, or licenses to download and use the content you process through our service.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Prohibited Uses</h2>
      <p className="mb-4 text-[hsl(var(--muted-foreground))]">
        You may not use TikDown to:
      </p>
      <ul className="list-disc pl-6 mb-4 text-[hsl(var(--muted-foreground))]">
        <li>Download copyrighted material without permission from the copyright owner.</li>
        <li>Bypass DRM, paywalls, or any other access restrictions.</li>
        <li>Distribute downloaded content commercially without authorization.</li>
        <li>Engage in any activity that violates the rights of TikTok or its content creators.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Disclaimer of Warranties</h2>
      <p className="mb-4 text-[hsl(var(--muted-foreground))]">
        This service is provided "as is" without any representations or warranties, express or implied. TikDown makes no representations or warranties in relation to this website or the information and materials provided on this website. We do not guarantee that the service will be constantly available, or available at all.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Limitation of Liability</h2>
      <p className="mb-4 text-[hsl(var(--muted-foreground))]">
        TikDown, its creators, and affiliates will not be liable for any damages arising out of or in connection with the use of this website. This includes, without limitation, direct loss, loss of business or profits, and damage caused to your computer, computer software, systems and programs and the data thereon.
      </p>
    </div>
  );
}
