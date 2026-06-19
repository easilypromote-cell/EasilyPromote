import { Container } from '@/components/ui';

const footerLinks = {
  product: ['Features', 'Pricing', 'How It Works', 'FAQ'],
  company: ['About', 'Blog', 'Careers', 'Contact'],
  legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

export default function Footer() {
  return (
    <footer className="py-16 tablet:py-20 desktop:py-24 bg-darkSurface text-white border-t border-white/10">
      <Container>
        <div className="grid tablet:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-h4 mb-4">
              Easily<span className="text-primary">Promote</span>
            </h3>
            <p className="text-text-secondary">
              The premium platform connecting creators and brands.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-medium mb-4 capitalize">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col tablet:flex-row justify-between items-center gap-4">
          <p className="text-caption text-text-secondary">
            © {new Date().getFullYear()} EasilyPromote. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-text-secondary hover:text-primary" aria-label="Twitter">Twitter</a>
            <a href="#" className="text-text-secondary hover:text-primary" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" className="text-text-secondary hover:text-primary" aria-label="Instagram">Instagram</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
