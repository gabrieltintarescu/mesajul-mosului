import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend {
    if (!_resend) {
        _resend = new Resend(process.env.RESEND_API_KEY);
    }
    return _resend;
}

interface SendVideoEmailParams {
    to: string;
    childName: string;
    videoUrl: string;
    orderId: string;
}

export async function sendVideoReadyEmail({
    to,
    childName,
    videoUrl,
    orderId,
}: SendVideoEmailParams): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    await getResend().emails.send({
        from: process.env.EMAIL_FROM || 'Santa Claus <santa@yourdomain.com>',
        to,
        subject: `🎅 Santa's Special Video for ${childName} is Ready!`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #1a472a; font-family: 'Georgia', serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); padding: 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    🎄 Ho Ho Ho! 🎄
                </h1>
                <p style="color: #ffd700; margin-top: 10px; font-size: 18px;">
                    A Special Message from Santa Claus
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px; text-align: center;">
                <h2 style="color: #1a472a; margin: 0 0 20px 0; font-size: 24px;">
                    ${childName}'s Video is Ready! 🎁
                </h2>
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Santa has recorded a very special, personalized video message just for ${childName}! 
                    Click the button below to watch this magical moment.
                </p>
                <a href="${appUrl}/order/${orderId}" 
                   style="display: inline-block; background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); 
                          color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; 
                          font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(196, 30, 58, 0.4);">
                    🎬 Watch Santa's Video
                </a>
                <p style="color: #666666; font-size: 14px; margin-top: 30px;">
                    This video was created with love from the North Pole specially for your family.
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #1a472a; padding: 30px; text-align: center;">
                <p style="color: #ffffff; margin: 0; font-size: 14px;">
                    ❄️ Merry Christmas! ❄️
                </p>
                <p style="color: #ffd700; margin: 10px 0 0 0; font-size: 12px;">
                    With love from Santa Claus & the Elves
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    });
}

interface SendOrderConfirmationParams {
    to: string;
    childName: string;
    orderId: string;
}

export async function sendOrderConfirmationEmail({
    to,
    childName,
    orderId,
}: SendOrderConfirmationParams): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    await getResend().emails.send({
        from: process.env.EMAIL_FROM || 'Santa Claus <santa@yourdomain.com>',
        to,
        subject: `🎅 Order Confirmed - Santa's Video for ${childName}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #1a472a; font-family: 'Georgia', serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); padding: 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    🎄 Order Confirmed! 🎄
                </h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px; text-align: center;">
                <h2 style="color: #1a472a; margin: 0 0 20px 0; font-size: 24px;">
                    Thank You for Your Order! 🎁
                </h2>
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Santa's elves are now working hard to create a personalized video message for <strong>${childName}</strong>!
                </p>
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    You'll receive another email when the video is ready. This usually takes just a few minutes!
                </p>
                <a href="${appUrl}/order/${orderId}" 
                   style="display: inline-block; background: linear-gradient(135deg, #1a472a 0%, #0d2818 100%); 
                          color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; 
                          font-size: 18px; font-weight: bold;">
                    📋 Check Order Status
                </a>
                <p style="color: #666666; font-size: 14px; margin-top: 30px;">
                    Order ID: ${orderId}
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #1a472a; padding: 30px; text-align: center;">
                <p style="color: #ffffff; margin: 0; font-size: 14px;">
                    ❄️ The Magic is Being Created! ❄️
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    });
}

interface SendPaymentLinkEmailParams {
    to: string;
    childName: string;
    orderId: string;
}

/**
 * Send payment link email in Romanian
 * Sent immediately after order creation with link to complete payment
 */
export async function sendPaymentLinkEmail({
    to,
    childName,
    orderId,
}: SendPaymentLinkEmailParams): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    // Include email in URL for secure order lookup
    const paymentUrl = `${appUrl}/wizard/step3?orderId=${orderId}&email=${encodeURIComponent(to)}`;

    await getResend().emails.send({
        from: process.env.EMAIL_FROM || 'Moș Crăciun <mos@yourdomain.com>',
        to,
        subject: `🎅 Finalizează comanda pentru videoclipul lui ${childName}!`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #1a472a; font-family: 'Georgia', serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); padding: 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    🎄 Ho Ho Ho! 🎄
                </h1>
                <p style="color: #ffd700; margin-top: 10px; font-size: 18px;">
                    Comanda ta a fost înregistrată!
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px; text-align: center;">
                <h2 style="color: #1a472a; margin: 0 0 20px 0; font-size: 24px;">
                    Un pas până la magia Crăciunului! 🎁
                </h2>
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Dragă părinte,
                </p>
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Mulțumim că ai ales să oferi un cadou magic pentru <strong>${childName}</strong>! 
                    Comanda ta a fost înregistrată cu succes.
                </p>
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Pentru a primi videoclipul personalizat de la Moș Crăciun, te rugăm să finalizezi plata 
                    folosind butonul de mai jos:
                </p>
                <a href="${paymentUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); 
                          color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; 
                          font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(196, 30, 58, 0.4);">
                    💳 Finalizează Plata
                </a>
                <p style="color: #666666; font-size: 14px; margin-top: 30px;">
                    Sau accesează direct: <a href="${paymentUrl}" style="color: #c41e3a;">${paymentUrl}</a>
                </p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                <p style="color: #999999; font-size: 12px;">
                    Dacă ai întâmpinat probleme sau ai întrebări, răspunde la acest email și te vom ajuta.
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #1a472a; padding: 30px; text-align: center;">
                <p style="color: #ffffff; margin: 0; font-size: 14px;">
                    ❄️ Crăciun Fericit! ❄️
                </p>
                <p style="color: #ffd700; margin: 10px 0 0 0; font-size: 12px;">
                    Cu drag, Moș Crăciun și Spiridușii
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    });
}

// Keep the old function as an alias for backwards compatibility
export const sendAbandonedCartEmail = sendPaymentLinkEmail;

interface SendPaymentConfirmationEmailParams {
    to: string;
    childName: string;
    orderId: string;
    invoicePdf?: Buffer;
}

/**
 * Send payment confirmation email in Romanian with invoice PDF attached
 * Sent after successful payment to confirm order and that video is being created
 */
export async function sendPaymentConfirmationEmail({
    to,
    childName,
    orderId,
    invoicePdf,
}: SendPaymentConfirmationEmailParams): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const orderUrl = `${appUrl}/order/${orderId}?email=${encodeURIComponent(to)}`;
    const invoiceNumber = `INV-${orderId.slice(0, 8).toUpperCase()}`;

    const attachments = invoicePdf
        ? [
            {
                filename: `Factura-${invoiceNumber}.pdf`,
                content: invoicePdf,
            },
        ]
        : undefined;

    await getResend().emails.send({
        from: process.env.EMAIL_FROM || 'Moș Crăciun <mos@yourdomain.com>',
        to,
        subject: `🎅 Plata confirmată - Videoclipul pentru ${childName} este în lucru!`,
        attachments,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #1a472a; font-family: 'Georgia', serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); padding: 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    🎄 Plată Confirmată! 🎄
                </h1>
                <p style="color: #ffd700; margin-top: 10px; font-size: 18px;">
                    Mulțumim pentru comanda ta!
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px; text-align: center;">
                <div style="background: #e8f5e9; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 40px;">✓</span>
                </div>
                <h2 style="color: #1a472a; margin: 0 0 20px 0; font-size: 24px;">
                    Plata a fost procesată cu succes! 🎁
                </h2>
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Dragă părinte,
                </p>
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Mulțumim pentru comandă! Spiridușii lui Moș Crăciun au început deja să lucreze la 
                    videoclipul personalizat pentru <strong>${childName}</strong>.
                </p>
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Vei primi un email când videoclipul este gata. De obicei durează doar câteva minute!
                </p>
                
                <div style="background: #f5f5f5; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">Statusul comenzii tale:</p>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <span style="background: #c41e3a; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px;">
                            🎬 În lucru
                        </span>
                    </div>
                </div>

                <a href="${orderUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); 
                          color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; 
                          font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(196, 30, 58, 0.4);
                          margin-top: 20px;">
                    📋 Vezi Statusul Comenzii
                </a>

                ${invoicePdf ? `
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                <p style="color: #666666; font-size: 14px;">
                    📄 Factura ta (${invoiceNumber}) este atașată la acest email.
                </p>
                ` : ''}
                
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                <p style="color: #999999; font-size: 12px;">
                    ID Comandă: ${orderId}<br>
                    Dacă ai întrebări, răspunde la acest email și te vom ajuta.
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #1a472a; padding: 30px; text-align: center;">
                <p style="color: #ffffff; margin: 0; font-size: 14px;">
                    ❄️ Crăciun Fericit! ❄️
                </p>
                <p style="color: #ffd700; margin: 10px 0 0 0; font-size: 12px;">
                    Cu drag, Moș Crăciun și Spiridușii
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    });
}

