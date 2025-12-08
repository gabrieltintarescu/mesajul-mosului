import { InvoicingDetails, OrderRow } from '@/lib/supabase/database.types';

/**
 * Generate an invoice PDF as a base64 string
 * Uses html-pdf-node for server-side PDF generation
 */
export async function generateInvoicePdf(order: OrderRow): Promise<Buffer> {
    // Dynamic import for server-side only
    const htmlPdf = await import('html-pdf-node');

    const invoicing = order.invoicing_details as InvoicingDetails | null;
    const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;
    const invoiceDate = new Date().toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Calculate prices (stored in cents/bani)
    const basePrice = 12900; // 129 RON in bani
    const holidayDiscount = 4000; // 40 RON in bani
    const couponDiscount = order.discount_amount || 0;
    const finalPrice = order.final_price || (basePrice - holidayDiscount - couponDiscount);

    const formatPrice = (bani: number) => `${(bani / 100).toFixed(2)} RON`;

    // Build customer info based on invoice type
    let customerInfo = '';
    if (invoicing) {
        if (invoicing.invoiceType === 'business') {
            customerInfo = `
                <p><strong>${invoicing.companyName || ''}</strong></p>
                <p>Persoană de contact: ${invoicing.name}</p>
                <p>CUI: ${invoicing.cui || 'N/A'}</p>
                ${invoicing.regCom ? `<p>Reg. Com.: ${invoicing.regCom}</p>` : ''}
                <p>${invoicing.address}</p>
                <p>${invoicing.city}, ${invoicing.county} ${invoicing.postalCode}</p>
                <p>Tel: ${invoicing.phone}</p>
            `;
        } else {
            customerInfo = `
                <p><strong>${invoicing.name}</strong></p>
                <p>CNP: ${invoicing.cnp || 'N/A'}</p>
                <p>${invoicing.address}</p>
                <p>${invoicing.city}, ${invoicing.county} ${invoicing.postalCode}</p>
                <p>Tel: ${invoicing.phone}</p>
            `;
        }
    } else {
        customerInfo = `<p><strong>${order.email}</strong></p>`;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #333;
            padding: 40px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            border-bottom: 3px solid #c41e3a;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #c41e3a;
        }
        .logo-subtitle {
            font-size: 12px;
            color: #666;
        }
        .invoice-info {
            text-align: right;
        }
        .invoice-title {
            font-size: 28px;
            color: #c41e3a;
            margin-bottom: 5px;
        }
        .invoice-number {
            font-size: 14px;
            color: #666;
        }
        .parties {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }
        .party {
            width: 45%;
        }
        .party-title {
            font-size: 11px;
            text-transform: uppercase;
            color: #999;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        .party p {
            margin: 3px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th {
            background: #c41e3a;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }
        .text-right {
            text-align: right;
        }
        .totals {
            width: 300px;
            margin-left: auto;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .totals-row.total {
            font-size: 16px;
            font-weight: bold;
            color: #c41e3a;
            border-bottom: none;
            border-top: 2px solid #c41e3a;
            padding-top: 15px;
        }
        .footer {
            margin-top: 60px;
            text-align: center;
            color: #999;
            font-size: 10px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .thank-you {
            text-align: center;
            margin: 40px 0;
            padding: 20px;
            background: #f8f8f8;
            border-radius: 8px;
        }
        .thank-you p {
            font-size: 14px;
            color: #1a472a;
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="logo">🎅 Mesaj de la Moșu</div>
            <div class="logo-subtitle">Videoclipuri personalizate de la Moș Crăciun</div>
        </div>
        <div class="invoice-info">
            <div class="invoice-title">FACTURĂ</div>
            <div class="invoice-number">${invoiceNumber}</div>
            <div class="invoice-number">Data: ${invoiceDate}</div>
        </div>
    </div>

    <div class="parties">
        <div class="party">
            <div class="party-title">Furnizor</div>
            <p><strong>SC Mesaj de la Moșu SRL</strong></p>
            <p>CUI: RO12345678</p>
            <p>Reg. Com.: J40/1234/2024</p>
            <p>Str. Polul Nord nr. 1</p>
            <p>București, România</p>
            <p>contact@mesajdelamosu.ro</p>
        </div>
        <div class="party">
            <div class="party-title">Client</div>
            ${customerInfo}
            <p>Email: ${order.email}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Descriere</th>
                <th class="text-right">Cantitate</th>
                <th class="text-right">Preț unitar</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>Videoclip personalizat de la Moș Crăciun</strong><br>
                    <span style="color: #666; font-size: 11px;">
                        Pentru: ${order.child_details.name}
                    </span>
                </td>
                <td class="text-right">1</td>
                <td class="text-right">${formatPrice(basePrice)}</td>
                <td class="text-right">${formatPrice(basePrice)}</td>
            </tr>
            <tr>
                <td>
                    <span style="color: #1a472a;">Reducere de Sărbători</span>
                </td>
                <td class="text-right">1</td>
                <td class="text-right">-${formatPrice(holidayDiscount)}</td>
                <td class="text-right">-${formatPrice(holidayDiscount)}</td>
            </tr>
            ${couponDiscount > 0 ? `
            <tr>
                <td>
                    <span style="color: #1a472a;">Cod promoțional: ${order.coupon_code}</span>
                </td>
                <td class="text-right">1</td>
                <td class="text-right">-${formatPrice(couponDiscount)}</td>
                <td class="text-right">-${formatPrice(couponDiscount)}</td>
            </tr>
            ` : ''}
        </tbody>
    </table>

    <div class="totals">
        <div class="totals-row">
            <span>Subtotal:</span>
            <span>${formatPrice(basePrice)}</span>
        </div>
        <div class="totals-row">
            <span>Reduceri:</span>
            <span>-${formatPrice(holidayDiscount + couponDiscount)}</span>
        </div>
        <div class="totals-row">
            <span>TVA (inclus):</span>
            <span>${formatPrice(Math.round(finalPrice * 0.19 / 1.19))}</span>
        </div>
        <div class="totals-row total">
            <span>TOTAL:</span>
            <span>${formatPrice(finalPrice)}</span>
        </div>
    </div>

    <div class="thank-you">
        <p>🎄 Mulțumim pentru comandă! 🎄</p>
        <p style="font-size: 12px; color: #666; margin-top: 10px;">
            Videoclipul tău personalizat este în curs de realizare.
        </p>
    </div>

    <div class="footer">
        <p>Această factură a fost generată electronic și este valabilă fără semnătură.</p>
        <p>ID Comandă: ${order.id}</p>
        <p>© ${new Date().getFullYear()} Mesaj de la Moșu - Toate drepturile rezervate</p>
    </div>
</body>
</html>
    `;

    const options = {
        format: 'A4' as const,
        printBackground: true,
    };

    const file = { content: html };
    const pdfBuffer = await htmlPdf.generatePdf(file, options);

    return pdfBuffer;
}
