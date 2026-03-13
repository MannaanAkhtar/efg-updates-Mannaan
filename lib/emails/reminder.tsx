import * as React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// BOARDROOM REMINDER EMAIL - 24h and 1h before
// ═══════════════════════════════════════════════════════════════════════════

interface ReminderEmailProps {
  fullName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  joinUrl: string;
  hoursUntil: number; // 24 or 1
  sponsorLogo?: string;
  sponsorName?: string;
  agenda?: Array<{ time: string; title: string }>;
}

export const ReminderEmail: React.FC<ReminderEmailProps> = ({
  fullName,
  eventTitle,
  eventDate,
  eventTime,
  joinUrl,
  hoursUntil,
  sponsorLogo = "",
  sponsorName = "",
  agenda = [
    { time: "10:00 AM", title: "Welcome & Introductions" },
    { time: "10:15 AM", title: "Keynote: The AI Success Formula" },
    { time: "10:45 AM", title: "Panel: Governance at Scale" },
    { time: "11:15 AM", title: "Interactive Roundtable Discussion" },
    { time: "11:45 AM", title: "Key Takeaways & Close" },
  ],
}) => {
  const isUrgent = hoursUntil <= 1;
  const timeText = hoursUntil === 1 ? "1 hour" : `${hoursUntil} hours`;

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

                    {/* Urgency Banner */}
                    {isUrgent && (
                      <tr>
                        <td style={{ padding: '16px 40px', background: 'rgba(201,147,90,0.15)', textAlign: 'center' }}>
                          <p style={{ color: '#C9935A', fontSize: 14, fontWeight: 600, margin: 0 }}>
                            ⏰ Starting in {timeText}!
                          </p>
                        </td>
                      </tr>
                    )}

                    {/* Main Content */}
                    <tr>
                      <td style={{ padding: '48px 40px' }}>
                        {/* Timer Icon */}
                        <div style={{ textAlign: 'center', marginBottom: 32 }}>
                          <div style={{ display: 'inline-block', width: 80, height: 80, borderRadius: '50%', background: isUrgent ? 'linear-gradient(135deg, rgba(201,147,90,0.3), rgba(201,147,90,0.1))' : 'linear-gradient(135deg, rgba(201,147,90,0.2), transparent)', border: '1px solid rgba(201,147,90,0.3)', lineHeight: '80px', textAlign: 'center' }}>
                            <span style={{ color: '#C9935A', fontSize: 36 }}>⏰</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h1 style={{ color: '#ffffff', fontSize: 28, fontWeight: 300, textAlign: 'center', margin: '0 0 16px', letterSpacing: -0.5 }}>
                          {isUrgent ? "Almost Time!" : "Your Boardroom Starts Soon"}
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, textAlign: 'center', margin: '0 0 40px', lineHeight: 1.6 }}>
                          {fullName}, your session begins in <strong style={{ color: '#C9935A' }}>{timeText}</strong>
                        </p>

                        {/* Event Details */}
                        <table role="presentation" width="100%" cellSpacing={0} cellPadding={0} style={{ background: 'rgba(201,147,90,0.05)', border: '1px solid rgba(201,147,90,0.2)', borderRadius: 8, marginBottom: 32 }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: 24 }}>
                                <h2 style={{ color: '#ffffff', fontSize: 18, fontWeight: 500, margin: '0 0 12px' }}>{eventTitle}</h2>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 4px' }}>📅 {eventDate}</p>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 4px' }}>🕐 {eventTime} GST (Dubai)</p>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>💻 Virtual Roundtable</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Join Button */}
                        <table role="presentation" width="100%" cellSpacing={0} cellPadding={0} style={{ marginBottom: 40 }}>
                          <tbody>
                            <tr>
                              <td style={{ textAlign: 'center' }}>
                                <a href={joinUrl} style={{ display: 'inline-block', background: '#C9935A', color: '#000000', fontSize: 16, fontWeight: 600, textDecoration: 'none', padding: '18px 56px', letterSpacing: 0.5 }}>
                                  Join Now →
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Agenda Preview */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32 }}>
                          <h3 style={{ color: '#C9935A', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 20px' }}>
                            Agenda Preview
                          </h3>
                          <table role="presentation" width="100%" cellSpacing={0} cellPadding={0}>
                            <tbody>
                              {agenda.map((item, i) => (
                                <tr key={i}>
                                  <td style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <table role="presentation" width="100%" cellSpacing={0} cellPadding={0}>
                                      <tbody>
                                        <tr>
                                          <td width={80}>
                                            <span style={{ color: '#C9935A', fontSize: 13 }}>{item.time}</span>
                                          </td>
                                          <td>
                                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{item.title}</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Preparation Tips */}
                        <div style={{ marginTop: 32, padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                          <h4 style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 12px' }}>
                            Quick Checklist
                          </h4>
                          <ul style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
                            <li>Test your camera and microphone</li>
                            <li>Find a quiet location</li>
                            <li>Have your questions ready</li>
                            <li>Join 5 minutes early</li>
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

export default ReminderEmail;
