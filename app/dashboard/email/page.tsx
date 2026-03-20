import React from "react";

// ─── Types ───────────────────────────────────────────────────────
interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface SocialLink {
  name: string;
  url: string;
}

interface EmailTemplateProps {
  userName?: string;
  heading?: string;
  subtitle?: string;
  bodyText?: string;
  ctaText?: string;
  ctaUrl?: string;
  logoUrl?: string;
  companyName?: string;
  address?: string;
  features?: Feature[];
  socialLinks?: SocialLink[];
}

// ─── Default Data ────────────────────────────────────────────────
const defaultFeatures: Feature[] = [
  {
    icon: "🚀",
    title: "Get Started",
    description: "Set up your profile and preferences.",
  },
  {
    icon: "📚",
    title: "Explore Resources",
    description: "Browse our documentation and tutorials.",
  },
  {
    icon: "💬",
    title: "Join the Community",
    description: "Connect with other members.",
  },
];

const defaultSocialLinks: SocialLink[] = [
  { name: "Twitter", url: "https://twitter.com" },
  { name: "LinkedIn", url: "https://linkedin.com" },
  { name: "GitHub", url: "https://github.com" },
];

// ─── Styles ──────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  // Wrapper
  wrapper: {
    backgroundColor: "#f4f4f7",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },

  // Header
  header: {
    backgroundColor: "#4F46E5",
    padding: "24px",
    textAlign: "center" as const,
  },
  logo: {
    maxWidth: "150px",
    height: "auto",
  },

  // Hero
  hero: {
    backgroundColor: "#4F46E5",
    padding: "20px 40px 40px",
    textAlign: "center" as const,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: 700,
    margin: "0 0 8px",
  },
  heroSubtitle: {
    color: "#C7D2FE",
    fontSize: "16px",
    margin: "0",
  },

  // Body
  body: {
    padding: "40px",
  },
  contentTitle: {
    fontSize: "22px",
    color: "#1F2937",
    margin: "0 0 16px",
  },
  text: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#4B5563",
    margin: "0 0 16px",
  },

  // Features
  featureRow: {
    padding: "12px 0",
  },
  featureIcon: {
    fontSize: "28px",
    verticalAlign: "top",
    paddingRight: "16px",
    width: "40px",
  },
  featureContent: {
    verticalAlign: "top",
  },
  featureTitle: {
    fontSize: "15px",
    color: "#1F2937",
  },
  featureDesc: {
    fontSize: "14px",
    color: "#6B7280",
    margin: "4px 0 0",
  },

  // CTA Button
  ctaWrapper: {
    padding: "24px 0",
  },
  ctaButton: {
    backgroundColor: "#4F46E5",
    color: "#ffffff",
    padding: "14px 32px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "16px",
    display: "inline-block",
  },

  // Divider
  divider: {
    border: "none",
    borderTop: "1px solid #E5E7EB",
    margin: "24px 0",
  },

  // Link
  link: {
    color: "#4F46E5",
    textDecoration: "underline",
  },

  // Footer
  footer: {
    backgroundColor: "#F9FAFB",
    padding: "32px 40px",
    textAlign: "center" as const,
  },
  socialWrapper: {
    marginBottom: "16px",
  },
  socialLink: {
    color: "#4F46E5",
    textDecoration: "none",
    fontSize: "14px",
    margin: "0 8px",
  },
  footerText: {
    fontSize: "13px",
    color: "#9CA3AF",
    margin: "4px 0",
  },
  legalLinks: {
    marginTop: "12px",
  },
  legalLink: {
    color: "#9CA3AF",
    textDecoration: "underline",
    fontSize: "13px",
  },

  // Preview Bar
  previewBar: {
    backgroundColor: "#1F2937",
    color: "#ffffff",
    padding: "20px 40px",
    textAlign: "center" as const,
  },
  previewTitle: {
    margin: "0 0 4px",
    fontSize: "20px",
    color: "#ffffff",
  },
  previewSubtitle: {
    margin: "0",
    color: "#9CA3AF",
    fontSize: "14px",
  },
};

// ─── Email Template Component ────────────────────────────────────
const EmailTemplate: React.FC<EmailTemplateProps> = ({
  userName = "John Doe",
  heading = "Welcome to Our Platform!",
  subtitle = "We're thrilled to have you on board.",
  bodyText = "Thank you for signing up! We're excited to help you get started. Here's what you can do next:",
  ctaText = "Get Started Now",
  ctaUrl = "https://yourwebsite.com/dashboard",
  logoUrl = "https://via.placeholder.com/150x50/4F46E5/ffffff?text=LOGO",
  companyName = "Your Company",
  address = "123 Street Name, City, State 12345",
  features = defaultFeatures,
  socialLinks = defaultSocialLinks,
}) => {
  return (
    <div style={styles.wrapper}>
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={styles.container}
      >
        {/* ════════ HEADER ════════ */}
        <thead>
          <tr>
            <td>
              {/* Logo */}
              <div style={styles.header}>
                <img src={logoUrl} alt="Company Logo" style={styles.logo} />
              </div>

              {/* Hero */}
              <div style={styles.hero}>
                <h1 style={styles.heroTitle}>{heading}</h1>
                <p style={styles.heroSubtitle}>{subtitle}</p>
              </div>
            </td>
          </tr>
        </thead>

        {/* ════════ BODY ════════ */}
        <tbody>
          <tr>
            <td style={styles.body}>
              {/* Greeting */}
              <h2 style={styles.contentTitle}>Hello, {userName} 👋</h2>
              <p style={styles.text}>{bodyText}</p>

              {/* Features */}
              <table
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                role="presentation"
              >
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index}>
                      <td style={styles.featureRow}>
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          role="presentation"
                        >
                          <tbody>
                            <tr>
                              <td style={styles.featureIcon}>{feature.icon}</td>
                              <td style={styles.featureContent}>
                                <strong style={styles.featureTitle}>
                                  {feature.title}
                                </strong>
                                <p style={styles.featureDesc}>
                                  {feature.description}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* CTA Button */}
              <table
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                role="presentation"
              >
                <tbody>
                  <tr>
                    <td align="center" style={styles.ctaWrapper}>
                      <a
                        href={ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.ctaButton}
                      >
                        {ctaText}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Divider */}
              <hr style={styles.divider} />

              {/* Closing Text */}
              <p style={styles.text}>
                If you have any questions, feel free to reply to this email or
                visit our{" "}
                <a href="https://yourwebsite.com/help" style={styles.link}>
                  Help Center
                </a>
                .
              </p>
              <p style={styles.text}>
                Best regards,
                <br />
                <strong>The Team</strong>
              </p>
            </td>
          </tr>
        </tbody>

        {/* ════════ FOOTER ════════ */}
        <tfoot>
          <tr>
            <td>
              <div style={styles.footer}>
                {/* Social Links */}
                <div style={styles.socialWrapper}>
                  {socialLinks.map((link, index) => (
                    <a key={index} href={link.url} style={styles.socialLink}>
                      {link.name}
                    </a>
                  ))}
                </div>

                <p style={styles.footerText}>
                  © {new Date().getFullYear()} {companyName}. All rights
                  reserved.
                </p>
                <p style={styles.footerText}>{address}</p>

                {/* Legal Links */}
                <div style={styles.legalLinks}>
                  <a href="#" style={styles.legalLink}>
                    Unsubscribe
                  </a>
                  {" · "}
                  <a href="#" style={styles.legalLink}>
                    Privacy Policy
                  </a>
                  {" · "}
                  <a href="#" style={styles.legalLink}>
                    Terms of Service
                  </a>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

// ─── Page Component ──────────────────────────────────────────────
const EmailPage = () => {
  return (
    <div>
      {/* Preview Bar */}
      <div style={styles.previewBar}>
        <h2 style={styles.previewTitle}>📧 Email Template Preview</h2>
        <p style={styles.previewSubtitle}>
          This is how your email will look in the inbox.
        </p>
      </div>

      {/* Email Template */}
      <EmailTemplate
        userName="John Doe"
        heading="Welcome to Our Platform!"
        subtitle="We're thrilled to have you on board."
        bodyText="Thank you for signing up! We're excited to help you get started. Here's what you can do next:"
        ctaText="Get Started Now"
        ctaUrl="https://yourwebsite.com/dashboard"
        companyName="Your Company"
        address="123 Street Name, City, State 12345"
        features={[
          {
            icon: "🚀",
            title: "Get Started",
            description: "Set up your profile and preferences.",
          },
          {
            icon: "📚",
            title: "Explore Resources",
            description: "Browse our documentation and tutorials.",
          },
          {
            icon: "💬",
            title: "Join the Community",
            description: "Connect with other members.",
          },
        ]}
        socialLinks={[
          { name: "Twitter", url: "https://twitter.com" },
          { name: "LinkedIn", url: "https://linkedin.com" },
          { name: "GitHub", url: "https://github.com" },
        ]}
      />
    </div>
  );
};

export default EmailPage;