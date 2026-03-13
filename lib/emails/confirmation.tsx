import * as React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// BOARDROOM CONFIRMATION EMAIL - Premium EFG Co-Branded
// ═══════════════════════════════════════════════════════════════════════════

interface ConfirmationEmailProps {
  fullName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  joinUrl: string;
  googleCalendarUrl: string;
  outlookCalendarUrl: string;
  sponsorLogo?: string;
  sponsorName?: string;
}

export const ConfirmationEmail: React.FC<ConfirmationEmailProps> = ({
  fullName,
  eventTitle,
  eventDate,
  eventTime,
  joinUrl,
  googleCalendarUrl,
  outlookCalendarUrl,
  sponsorLogo = "",
  sponsorName = "",
}) => {
  const day = eventDate.split(',')[1]?.trim().split(' ')[1] || '27';
  const month = eventDate.split(',')[1]?.trim().split(' ')[0]?.toUpperCase().slice(0,3) || 'MAR';

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#000000', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <table role="presentation" width="100%" cellSpacing={0} cellPadding={0} style={{ backgroundColor: '#000000' }}>
          <tbody>
            <tr>
              <td style={{ padding: '40px 20px' }}>
                <table role="presentation" width={600} cellSpacing={0} cellPadding={0} style={{ maxWidth: 600, margin: '0 auto' }}>
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td style={{ padding: '32px 40px', textAlign: 'center', borderBottom: '1px solid rgba(201, 147, 90, 0.2)' }}>
                        <img src={sponsorLogo} alt={sponsorName} height={32} style={{ height: 32, marginBottom: 20, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>
                          Executive AI Boardroom
                        </p>
                      </td>
                    </tr>

                    {/* Main Content */}
                    <tr>
                      <td style={{ padding: '48px 40px' }}>
                        {/* Confirmation Badge */}
                        <div style={{ textAlign: 'center', marginBottom: 32 }}>
                          <div style={{ display: 'inline-block', width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(201,147,90,0.2), transparent)', border: '1px solid rgba(201,147,90,0.3)', lineHeight: '80px', textAlign: 'center' }}>
                            <span style={{ color: '#C9935A', fontSize: 36 }}>✓</span>
                          </div>
                        </div>

                        {/* Welcome */}
                        <h1 style={{ color: '#ffffff', fontSize: 28, fontWeight: 300, textAlign: 'center', margin: '0 0 16px', letterSpacing: -0.5 }}>
                          You're Confirmed
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, textAlign: 'center', margin: '0 0 40px', lineHeight: 1.6 }}>
                          {fullName}, your seat is reserved for our exclusive executive roundtable.
                        </p>

                        {/* Event Card */}
                        <table role="presentation" width="100%" cellSpacing={0} cellPadding={0} style={{ background: 'rgba(201,147,90,0.05)', border: '1px solid rgba(201,147,90,0.2)', borderRadius: 8, marginBottom: 32 }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: 24 }}>
                                <table role="presentation" width="100%" cellSpacing={0} cellPadding={0}>
                                  <tbody>
                                    <tr>
                                      <td width={70} style={{ verticalAlign: 'top' }}>
                                        <div style={{ background: 'rgba(201,147,90,0.1)', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
                                          <div style={{ color: '#C9935A', fontSize: 24, fontWeight: 300, lineHeight: 1 }}>{day}</div>
                                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 1, marginTop: 4 }}>{month}</div>
                                        </div>
                                      </td>
                                      <td style={{ paddingLeft: 20, verticalAlign: 'top' }}>
                                        <h2 style={{ color: '#ffffff', fontSize: 18, fontWeight: 500, margin: '0 0 8px' }}>{eventTitle}</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 4px' }}>📅 {eventDate}</p>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 4px' }}>🕐 {eventTime} GST (Dubai)</p>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>💻 Virtual Roundtable</p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Join Button */}
                        <table role="presentation" width="100%" cellSpacing={0} cellPadding={0} style={{ marginBottom: 24 }}>
                          <tbody>
                            <tr>
                              <td style={{ textAlign: 'center' }}>
                                <a href={joinUrl} style={{ display: 'inline-block', background: '#C9935A', color: '#000000', fontSize: 14, fontWeight: 600, textDecoration: 'none', padding: '16px 48px', letterSpacing: 0.5 }}>
                                  Join Boardroom
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Calendar Links */}
                        <table role="presentation" width="100%" cellSpacing={0} cellPadding={0} style={{ marginBottom: 40 }}>
                          <tbody>
                            <tr>
                              <td style={{ textAlign: 'center' }}>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 12px' }}>Add to calendar:</p>
                                <a href={googleCalendarUrl} style={{ color: '#C9935A', fontSize: 13, textDecoration: 'none', margin: '0 12px' }}>Google Calendar</a>
                                <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                                <a href={outlookCalendarUrl} style={{ color: '#C9935A', fontSize: 13, textDecoration: 'none', margin: '0 12px' }}>Outlook</a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* What to Expect */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32 }}>
                          <h3 style={{ color: '#C9935A', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 16px' }}>
                            What to Expect
                          </h3>
                          <ul style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
                            <li>Intimate discussion with 15 senior executives</li>
                            <li>AI governance and orchestration strategies</li>
                            <li>Real-world implementation insights</li>
                            <li>Networking with industry peers</li>
                          </ul>
                        </div>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ padding: '32px 40px', borderTop: '1px solid rgba(201, 147, 90, 0.1)', textAlign: 'center' }}>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '0 0 8px' }}>
                          Hosted by Events First Group • Powered by {sponsorName}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, margin: 0 }}>
                          <a href="https://eventsfirstgroup.com" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>eventsfirstgroup.com</a>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
};

export default ConfirmationEmail;
