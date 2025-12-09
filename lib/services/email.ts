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
<html lang="ro">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Finalizează comanda</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #1a472a; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
    <!-- Outer wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1a472a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main container -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #c41e3a; padding: 50px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; font-size: 50px; line-height: 1;">🎄</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 20px;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Ho Ho Ho!</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 10px;">
                                        <p style="margin: 0; color: #ffd700; font-size: 18px;">Comanda ta a fost înregistrată!</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <h2 style="margin: 0 0 25px 0; color: #1a472a; font-size: 24px; font-weight: bold;">
                                            Un pas până la magia Crăciunului! 🎁
                                        </h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Dragă părinte,
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Mulțumim că ai ales să oferi un cadou magic pentru <strong>${childName}</strong>!<br>
                                            Comanda ta a fost înregistrată cu succes.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 35px;">
                                        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Pentru a primi videoclipul personalizat de la Moș Crăciun,<br>
                                            te rugăm să finalizezi plata folosind butonul de mai jos:
                                        </p>
                                    </td>
                                </tr>
                                <!-- Button -->
                                <tr>
                                    <td align="center" style="padding-bottom: 35px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" bgcolor="#c41e3a" style="border-radius: 50px;">
                                                    <a href="${paymentUrl}" target="_blank" style="display: inline-block; padding: 18px 45px; font-size: 18px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 50px;">
                                                        💳 Finalizează Plata
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Divider -->
                                <tr>
                                    <td style="padding: 20px 0;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="border-top: 1px solid #eeeeee;"></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Footer text -->
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.6;">
                                            Dacă ai întâmpinat probleme sau ai întrebări,<br>
                                            răspunde la acest email și te vom ajuta.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #1a472a; padding: 35px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; color: #ffffff; font-size: 16px;">❄️ Crăciun Fericit! ❄️</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 10px;">
                                        <p style="margin: 0; color: #ffd700; font-size: 13px;">Cu drag, Moș Crăciun și Spiridușii</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
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

    const invoiceSection = invoicePdf ? `
                                <!-- Invoice notice -->
                                <tr>
                                    <td align="center" style="padding-top: 30px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0f9ff; border-radius: 12px; width: 100%;">
                                            <tr>
                                                <td align="center" style="padding: 20px;">
                                                    <p style="margin: 0; color: #0369a1; font-size: 14px;">
                                                        📄 Factura ta (<strong>${invoiceNumber}</strong>) este atașată la acest email.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
    ` : '';

    await getResend().emails.send({
        from: process.env.EMAIL_FROM || 'Moș Crăciun <mos@yourdomain.com>',
        to,
        subject: `🎅 Plata confirmată - Videoclipul pentru ${childName} este în lucru!`,
        attachments,
        html: `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Plată confirmată</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #1a472a; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
    <!-- Outer wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1a472a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main container -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #c41e3a; padding: 50px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; font-size: 50px; line-height: 1;">✅</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 20px;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Plată Confirmată!</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 10px;">
                                        <p style="margin: 0; color: #ffd700; font-size: 18px;">Mulțumim pentru comanda ta!</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <!-- Success checkmark -->
                                <tr>
                                    <td align="center" style="padding-bottom: 25px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" style="background-color: #dcfce7; border-radius: 50%; width: 80px; height: 80px; text-align: center; vertical-align: middle;">
                                                    <span style="font-size: 40px; line-height: 80px;">🎉</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <h2 style="margin: 0 0 25px 0; color: #1a472a; font-size: 24px; font-weight: bold;">
                                            Plata a fost procesată cu succes!
                                        </h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Dragă părinte,
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Mulțumim pentru comandă! Spiridușii lui Moș Crăciun au început deja<br>
                                            să lucreze la videoclipul personalizat pentru <strong>${childName}</strong>.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Vei primi un email când videoclipul este gata.<br>
                                            De obicei durează doar câteva minute!
                                        </p>
                                    </td>
                                </tr>
                                <!-- Status badge -->
                                <tr>
                                    <td align="center" style="padding-bottom: 35px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef3c7; border-radius: 12px; width: 100%;">
                                            <tr>
                                                <td align="center" style="padding: 20px;">
                                                    <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px;">Statusul comenzii tale:</p>
                                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td align="center" bgcolor="#c41e3a" style="border-radius: 25px; padding: 8px 20px;">
                                                                <span style="color: #ffffff; font-size: 14px; font-weight: bold;">🎬 În lucru</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Button -->
                                <tr>
                                    <td align="center" style="padding-bottom: 35px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" bgcolor="#c41e3a" style="border-radius: 50px;">
                                                    <a href="${orderUrl}" target="_blank" style="display: inline-block; padding: 18px 45px; font-size: 18px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 50px;">
                                                        📋 Vezi Statusul Comenzii
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                ${invoiceSection}
                                <!-- Divider -->
                                <tr>
                                    <td style="padding: 25px 0;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="border-top: 1px solid #eeeeee;"></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Order ID and help -->
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0 0 10px 0; color: #999999; font-size: 13px;">
                                            ID Comandă: <strong>${orderId}</strong>
                                        </p>
                                        <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.6;">
                                            Dacă ai întrebări, răspunde la acest email și te vom ajuta.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #1a472a; padding: 35px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; color: #ffffff; font-size: 16px;">❄️ Crăciun Fericit! ❄️</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 10px;">
                                        <p style="margin: 0; color: #ffd700; font-size: 13px;">Cu drag, Moș Crăciun și Spiridușii</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    });
}


interface SendPaymentReminderEmailParams {
    to: string;
    childName: string;
    orderId: string;
    hoursRemaining: number;
}

/**
 * Send payment reminder email in Romanian
 * Sent before order expiration to remind user to complete payment
 */
export async function sendPaymentReminderEmail({
    to,
    childName,
    orderId,
    hoursRemaining,
}: SendPaymentReminderEmailParams): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const paymentUrl = `${appUrl}/wizard/step3?orderId=${orderId}&email=${encodeURIComponent(to)}`;

    await getResend().emails.send({
        from: process.env.EMAIL_FROM || 'Moș Crăciun <mos@yourdomain.com>',
        to,
        subject: `⏰ Comanda ta pentru ${childName} expiră în curând!`,
        html: `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Comanda expiră în curând</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1a472a; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1a472a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #f59e0b; padding: 50px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; font-size: 50px; line-height: 1;">⏰</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 20px;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Nu uita de cadoul lui ${childName}!</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 10px;">
                                        <p style="margin: 0; color: #ffffff; font-size: 18px;">Comanda ta expiră în ${hoursRemaining} ore</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <h2 style="margin: 0 0 25px 0; color: #1a472a; font-size: 24px; font-weight: bold;">
                                            Moș Crăciun așteaptă să-i transmită un mesaj lui ${childName}! 🎅
                                        </h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Dragă părinte,
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Ai început să creezi un videoclip personalizat de la Moș Crăciun pentru <strong>${childName}</strong>, 
                                            dar nu ai finalizat încă plata.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                            ⚠️ <strong>Comanda ta va expira în ${hoursRemaining} ore.</strong><br>
                                            Finalizează plata acum pentru a nu pierde datele introduse!
                                        </p>
                                    </td>
                                </tr>
                                <!-- Urgency badge -->
                                <tr>
                                    <td align="center" style="padding-bottom: 35px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef3c7; border-radius: 12px; width: 100%;">
                                            <tr>
                                                <td align="center" style="padding: 20px;">
                                                    <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px;">Timp rămas pentru finalizare:</p>
                                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td align="center" bgcolor="#f59e0b" style="border-radius: 25px; padding: 8px 20px;">
                                                                <span style="color: #ffffff; font-size: 14px; font-weight: bold;">⏰ ~${hoursRemaining} ore</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Button -->
                                <tr>
                                    <td align="center" style="padding-bottom: 35px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" bgcolor="#c41e3a" style="border-radius: 50px;">
                                                    <a href="${paymentUrl}" target="_blank" style="display: inline-block; padding: 18px 45px; font-size: 18px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 50px;">
                                                        💳 Finalizează Plata Acum
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Divider -->
                                <tr>
                                    <td style="padding: 25px 0;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="border-top: 1px solid #eeeeee;"></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Order ID and help -->
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0 0 10px 0; color: #999999; font-size: 13px;">
                                            ID Comandă: <strong>${orderId}</strong>
                                        </p>
                                        <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.6;">
                                            Dacă ai întrebări sau probleme, răspunde la acest email.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #1a472a; padding: 35px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; color: #ffffff; font-size: 16px;">❄️ Nu rata magia Crăciunului! ❄️</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 10px;">
                                        <p style="margin: 0; color: #ffd700; font-size: 13px;">Cu drag, Moș Crăciun și Spiridușii</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    });
}
