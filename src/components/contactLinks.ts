import type React from 'react';

// Where to reach me, for the Contact section and the colophon. The email
// address isn't written out on the page, and isn't whole anywhere in the
// code: it's put together only when the link is used, which keeps it from
// address-harvesting bots.
const EMAIL_PARTS = ['ryanmedlin2012', 'gmail.com'];

export const openEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  window.location.href = `mailto:${EMAIL_PARTS.join('@')}`;
};

export const CONTACT_LINKS = [
  { label: 'Email', text: 'Send me an email', href: '#contact', onClick: openEmail },
  {
    label: 'LinkedIn',
    text: 'linkedin.com/in/medlinryan',
    href: 'https://www.linkedin.com/in/medlinryan/',
  },
];
