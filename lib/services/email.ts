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

interface SendAbandonedCartEmailParams {
    to: string;
    childName: string;
    orderId: string;
}

/**
 * Send abandoned cart reminder email in Romanian
 * Includes a link to complete the payment
 */
export async function sendAbandonedCartEmail({
    to,
    childName,
    orderId,
}: SendAbandonedCartEmailParams): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    // Include email in URL for secure order lookup
    const paymentUrl = `${appUrl}/wizard/step3?orderId=${orderId}&email=${encodeURIComponent(to)}`;

    await getResend().emails.send({
        from: process.env.EMAIL_FROM || 'Moș Crăciun <mos@yourdomain.com>',
        to,
        subject: `🎅 Moș Crăciun așteaptă să trimită un mesaj pentru ${childName}!`,
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
                    Moș Crăciun te așteaptă!
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px; text-align: center;">
                <h2 style="color: #1a472a; margin: 0 0 20px 0; font-size: 24px;">
                    Comanda ta nu a fost finalizată 🎁
                </h2>
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Dragă părinte,
                </p>
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Am observat că ai început să comanzi un mesaj video personalizat de la Moș Crăciun pentru <strong>${childName}</strong>, dar nu ai finalizat plata.
                </p>
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Moșul și spiridușii sunt pregătiți să creeze un mesaj magic special pentru ${childName}! 
                    Finalizează comanda acum și surprinde-ți copilul cu cel mai frumos cadou de Crăciun.
                </p>
                <a href="${paymentUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); 
                          color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; 
                          font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(196, 30, 58, 0.4);">
                    🎬 Finalizează Comanda
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
