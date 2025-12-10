import { siteConfig } from '@/lib/config';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormRequest {
    name: string;
    email: string;
    subject: string;
    message: string;
}

// POST /api/contact - Send contact form email
export async function POST(request: Request) {
    try {
        const body: ContactFormRequest = await request.json();

        // Validate required fields
        if (!body.name || !body.email || !body.subject || !body.message) {
            return NextResponse.json(
                { success: false, error: 'Toate câmpurile sunt obligatorii' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { success: false, error: 'Format email invalid' },
                { status: 400 }
            );
        }

        // Send email to site owner
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Mesajul Moșului <contact@mesajul-mosului.ro>',
            to: siteConfig.contact.email,
            replyTo: body.email,
            subject: `[Contact Site] ${body.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">📬 Mesaj Nou de Contact</h1>
                    </div>
                    
                    <div style="padding: 30px; background: #f9fafb;">
                        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #1f2937; margin-top: 0;">Detalii Contact</h2>
                            
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 120px;">
                                        <strong>Nume:</strong>
                                    </td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                                        ${body.name}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
                                        <strong>Email:</strong>
                                    </td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                                        <a href="mailto:${body.email}" style="color: #dc2626;">${body.email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
                                        <strong>Subiect:</strong>
                                    </td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                                        ${body.subject}
                                    </td>
                                </tr>
                            </table>
                            
                            <h3 style="color: #1f2937; margin-top: 25px;">Mesaj:</h3>
                            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; color: #374151; line-height: 1.6;">
                                ${body.message.replace(/\n/g, '<br>')}
                            </div>
                            
                            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                <a href="mailto:${body.email}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                    📧 Răspunde
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                        <p>Acest email a fost trimis automat de pe site-ul Mesajul Moșului.</p>
                    </div>
                </div>
            `,
        });

        // Send confirmation email to the user
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Mesajul Moșului <contact@mesajul-mosului.ro>',
            to: body.email,
            subject: 'Am primit mesajul tău - Mesajul Moșului',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🎅 Mesajul Moșului</h1>
                    </div>
                    
                    <div style="padding: 30px; background: #f9fafb;">
                        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #1f2937; margin-top: 0;">Bună ${body.name}! 👋</h2>
                            
                            <p style="color: #4b5563; line-height: 1.6;">
                                Mulțumim că ne-ai contactat! Am primit mesajul tău și îți vom răspunde în cel mai scurt timp posibil.
                            </p>
                            
                            <p style="color: #4b5563; line-height: 1.6;">
                                De obicei răspundem în maxim 24 de ore. Dacă ai o urgență, ne poți contacta telefonic la 
                                <a href="tel:${siteConfig.contact.phoneInternational}" style="color: #dc2626;">${siteConfig.contact.phone}</a>.
                            </p>
                            
                            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-top: 20px;">
                                <p style="color: #991b1b; margin: 0; font-size: 14px;">
                                    <strong>📋 Rezumatul mesajului tău:</strong>
                                </p>
                                <p style="color: #7f1d1d; margin: 10px 0 0; font-size: 14px;">
                                    <strong>Subiect:</strong> ${body.subject}
                                </p>
                            </div>
                            
                            <p style="color: #4b5563; line-height: 1.6; margin-top: 20px;">
                                Cu drag,<br>
                                <strong>Echipa Mesajul Moșului</strong> 🎄
                            </p>
                        </div>
                    </div>
                    
                    <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                        <p>© ${new Date().getFullYear()} Mesajul Moșului. Toate drepturile rezervate.</p>
                    </div>
                </div>
            `,
        });

        return NextResponse.json({
            success: true,
            message: 'Mesajul a fost trimis cu succes',
        });
    } catch (error) {
        console.error('Error in POST /api/contact:', error);
        return NextResponse.json(
            { success: false, error: 'Eroare la trimiterea mesajului. Încearcă din nou.' },
            { status: 500 }
        );
    }
}
