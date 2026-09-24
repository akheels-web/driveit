import { escapeHtml } from '@/lib/html'

export interface BaseEmailLayoutOptions {
  title: string
  preheader?: string
  contentHtml: string
  actionButton?: {
    label: string
    url: string
  }
  secondaryButton?: {
    label: string
    url: string
  }
}

/**
 * Luxury branded email container.
 * Features an ultra-premium dark obsidian theme (#0d0d11) with champagne gold (#d4af37)
 * accents, optimized for dark & light mode email clients (Gmail, Apple Mail, Outlook).
 */
export function renderBaseEmailLayout(options: BaseEmailLayoutOptions): string {
  const { title, preheader, contentHtml, actionButton, secondaryButton } = options
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://driveitluxury.com'
  const currentYear = new Date().getFullYear()

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <style>
    body,table,td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #08080a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
      -ms-interpolation-mode: bicubic;
      max-width: 100%;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #08080a;
      padding-top: 32px;
      padding-bottom: 48px;
    }
    .main {
      background-color: #121217;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-radius: 12px;
      border: 1px solid #23232b;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .header {
      padding: 36px 32px 24px;
      text-align: center;
      background: linear-gradient(180deg, #181820 0%, #121217 100%);
      border-bottom: 1px solid #23232b;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 3px;
      color: #ffffff;
      margin: 0;
      text-transform: uppercase;
    }
    .brand-subtitle {
      font-size: 10px;
      letter-spacing: 2px;
      color: #d4af37;
      margin: 6px 0 0 0;
      text-transform: uppercase;
      font-weight: 600;
    }
    .body-content {
      padding: 32px 32px 24px;
      color: #cbd5e1;
      font-size: 15px;
      line-height: 1.6;
    }
    .h1-title {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 16px;
      letter-spacing: -0.5px;
    }
    .card-panel {
      background-color: #181820;
      border: 1px solid #282834;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .btn-gold {
      display: inline-block;
      background: linear-gradient(135deg, #d4af37 0%, #aa8420 100%);
      color: #0b0b0e !important;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      text-align: center;
      text-transform: uppercase;
      margin-right: 12px;
      margin-bottom: 12px;
    }
    .btn-secondary {
      display: inline-block;
      background-color: #1e1e28;
      border: 1px solid #373748;
      color: #e2e8f0 !important;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      padding: 13px 26px;
      border-radius: 6px;
      text-align: center;
      margin-bottom: 12px;
    }
    .footer {
      padding: 28px 32px 36px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
      border-top: 1px solid #1e1e28;
      background-color: #0e0e13;
    }
    .footer a {
      color: #d4af37;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .main { width: 94% !important; }
      .header { padding: 24px 20px !important; }
      .body-content { padding: 24px 20px !important; }
      .footer { padding: 24px 20px !important; }
      .btn-gold, .btn-secondary { display: block !important; width: 100% !important; box-sizing: border-box !important; margin-right: 0 !important; }
    }
  </style>
</head>
<body>
  ${preheader ? `<div style="display:none;font-size:1px;color:#08080a;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</div>` : ''}
  <center class="wrapper">
    <table class="main" width="100%">
      <!-- Header -->
      <tr>
        <td class="header">
          <a href="${serverUrl}" target="_blank" style="text-decoration:none;">
            <p class="brand-title">DRIVEIT</p>
            <p class="brand-subtitle">Luxury Concierge & Fleet</p>
          </a>
        </td>
      </tr>

      <!-- Body Content -->
      <tr>
        <td class="body-content">
          ${contentHtml}

          <!-- Call to Action Buttons -->
          ${actionButton || secondaryButton ? `
          <div style="margin-top: 32px; text-align: left;">
            ${actionButton ? `<a href="${escapeHtml(actionButton.url)}" class="btn-gold" target="_blank">${escapeHtml(actionButton.label)}</a>` : ''}
            ${secondaryButton ? `<a href="${escapeHtml(secondaryButton.url)}" class="btn-secondary" target="_blank">${escapeHtml(secondaryButton.label)}</a>` : ''}
          </div>
          ` : ''}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td class="footer">
          <p style="margin: 0 0 8px 0; color: #94a3b8; font-weight: 500;">
            DriveIt Luxury Concierge Desk &bull; 24/7 White-Glove Support
          </p>
          <p style="margin: 0 0 16px 0;">
            Direct Concierge: <a href="tel:+916300041186">+91 63000 41186</a> &bull;
            WhatsApp: <a href="https://wa.me/916300041186" target="_blank">Chat with Concierge</a> &bull;
            Email: <a href="mailto:concierge@driveitluxury.com">concierge@driveitluxury.com</a>
          </p>
          <p style="margin: 0; font-size: 11px; color: #475569;">
            &copy; ${currentYear} DriveIt Luxury. All rights reserved.<br>
            This reservation message was dispatched specifically to your registered account.
          </p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`
}
