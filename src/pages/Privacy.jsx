import React from 'react';

export default function Privacy() {
  return (
    <div className="w-full max-w-3xl mx-auto animate-in prose dark:prose-invert">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Do Not Collect</h2>
      <p className="mb-4 text-[hsl(var(--muted-foreground))]">
        We respect your privacy. TikDown does not require you to create an account, log in, or provide any personal information. We do not store, track, or share your download history on our servers. Your download history is saved locally on your device using localStorage and is never transmitted to us.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We May Collect</h2>
      <p className="mb-4 text-[hsl(var(--muted-foreground))]">
        Like many websites, we may automatically collect anonymous, non-identifying information for analytical purposes. This includes:
      </p>
      <ul className="list-disc pl-6 mb-4 text-[hsl(var(--muted-foreground))]">
        <li>Browser type and version</li>
        <li>Operating system</li>
        <li>General geographical location (country level)</li>
        <li>Pages visited and time spent on the site</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">3. External Links</h2>
      <p className="mb-4 text-[hsl(var(--muted-foreground))]">
        Our service processes links to TikTok videos. We are not responsible for the privacy practices or the content of external websites. When you download a video, the request is made to TikTok's servers to retrieve the media.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Cookies</h2>
      <p className="mb-4 text-[hsl(var(--muted-foreground))]">
        We may use minimal cookies or local storage to save your preferences (such as dark/light mode and local history). You can clear this data at any time through your browser settings or our clear history button.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Changes to This Policy</h2>
      <p className="mb-4 text-[hsl(var(--muted-foreground))]">
        We reserve the right to update this Privacy Policy at any time. We encourage you to review this page periodically for any changes.
      </p>
    </div>
  );
}
